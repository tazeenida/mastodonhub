import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Please enter a password with at least 8 characters.");
      return;
    }

    alert("Login successful!");
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <main id="login-main">
      <h1 id="login-heading">Login</h1>
      <form id="login-form" onSubmit={handleFormSubmit}>
        <label htmlFor="email" className="form-label">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="form-input" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <label htmlFor="password" className="form-label">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          className="form-input" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <p className="signup-link">Don't have an account?<a href="./Signup">Sign up</a></p>
    </main>
  );
}

export default Login;
