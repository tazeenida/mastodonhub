import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  return (
    <div>
      <br/>
      <section>
        <h2>HelpCenter</h2>
        <p>Welcome to our Help Center. Here, you can find answers to common questions and get assistance with any issues you may encounter.</p>
        <p>If you can't find what you're looking for, feel free to contact our support team for further assistance.</p>
      </section>

      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default HelpCenter;
