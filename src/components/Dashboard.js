import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <section>
        <h2>Dashboard Page</h2>
        <p>This is a temporary placeholder for the Dashboard component.</p>
        <p>You can replace this content with your actual Dashboard component implementation.</p>
      </section>

      <section>
        <h2 style={{ backgroundColor: 'yellow', color: 'black' }}>Footer</h2>
        <p>This is a temporary placeholder for the Footer component.</p>
        <p>You can replace this content with your actual Footer component implementation.</p>
        <p>The Footer will be flexible based on the content.</p>
        <p>
          When the footer is in a fixed position it may hide contents of the pages. Make sure to handle this appropriately.
        </p>
      </section>

      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default Dashboard;
