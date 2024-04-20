import React from 'react';
import { Link } from 'react-router-dom';

const SupportTeam = () => {
  return (
    <div>
      <br/>
      <section class="help-center-body">
        <h1>Support Team</h1>
        <p>
            Our support team is dedicated to assisting you with any questions or issues you may have.
            Please feel free to contact us through any of the following channels:
        </p>
        <ul>
            <li>Email: support@mastodonhub.com</li>
            <li>Phone: 1-800-123-4567</li>
            <li>Live Chat: Available during business hours</li>
        </ul>
      </section>

      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default SupportTeam;
