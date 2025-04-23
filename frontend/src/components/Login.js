import axios from "axios";
import { useState } from "react";

const backendUrl = `https://mastodonhub-nizj.onrender.com`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const user = { username, password };
    try {
      const { data } = await axios.post(
        `${backendUrl}/token/`,
        user,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (data.access && data.refresh) {
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;

        // Check if user is admin
        try {
          const adminResponse = await axios.get(`${backendUrl}/api/check-admin/`, {
            headers: {
              'Authorization': `Bearer ${data.access}`
            }
          });

          if (adminResponse.data && adminResponse.data.is_admin) {
            localStorage.setItem('user_role', 'admin');
          } else {
            localStorage.setItem('user_role', 'user');
          }
        } catch (adminError) {
          console.error('Error checking admin status:', adminError);
          localStorage.setItem('user_role', 'user'); // Default to regular user if check fails
        }

        window.location.href = '/';
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Login</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Username"
              name='username'
              type='text'
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name='password'
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
          {errorMessage && (
            <div className="alert alert-danger mt-3">{errorMessage}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;