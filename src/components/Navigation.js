import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <nav className="main-nav">
    <div className="mastodon-label">
      <p>MastodonHub</p>
    </div>
    <ul>
      <li><Link to="/Dashboard">Dashboard</Link></li>
      <li><Link to="/Events">Events</Link></li>
      <li><Link to="/Clubs">Clubs</Link></li>
    </ul>
    <div className="login-signup">
      <Link to="/Login">Login</Link>
      <Link to="/Signup">Signup</Link>
    </div>
  </nav>
);

export default Navigation;
