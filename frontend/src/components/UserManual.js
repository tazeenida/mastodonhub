// components/UserManual.js
import React from 'react';

const UserManual = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>User Manual</h1>
      <p>Welcome to the MastodonHub User Manual. Here's how to use the platform:</p>
      <ul>
        <li><strong>Creating an Account:</strong> Sign up using your email address.</li>
        <li><strong>Exploring Events:</strong> Use the search bar to find events.</li>
        <li><strong>Joining Clubs:</strong> Browse clubs and click "Join" to become a member.</li>
        <li><strong>Contacting Support:</strong> Visit the <a href="/contactSupport">Contact Support</a> page for assistance.</li>
      </ul>
    </div>
  );
};

export default UserManual;