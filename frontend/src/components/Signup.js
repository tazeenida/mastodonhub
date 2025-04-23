import React, { useState } from 'react';
import axios from 'axios';

const backendUrl = `https://mastodonhub-nizj.onrender.com`;


const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    const user = { username, email, password };

    try {
      const response = await axios.post(`${backendUrl}/signUp/`, user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccessMessage('Signup successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={submit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Signup</h3>

          {/* Username input */}
          <div className="form-group mt-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email input */}
          <div className="form-group mt-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className="form-group mt-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit button */}
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>

          {/* Display success message */}
          {successMessage && (
            <div className="alert alert-success mt-3">{successMessage}</div>
          )}

          {/* Display error message */}
          {errorMessage && (
            <div className="alert alert-danger mt-3">{errorMessage}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Signup;