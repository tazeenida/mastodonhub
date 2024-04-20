import React from 'react';
import { Link } from 'react-router-dom';

const UserManual = () => {
  return (
    <div>
      <br/>
      <section class="help-center-body">
        <h1>User Manual</h1>
        <h2>Getting Started</h2>
        <p>
            To get started with MastodonHub, follow these steps:
            <ol>
                <li>Create an account</li>
                <li>Explore events and clubs</li>
                <li>Join or create your own events</li>
            </ol>
        </p>
        <h2>Advanced Features</h2>
        <p>
            Learn about advanced features such as:
            <ul>
                <li>Customizing event pages</li>
                <li>Managing club memberships</li>
                <li>Integration with social media platforms</li>
            </ul>
        </p>
      </section>

      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default UserManual;
