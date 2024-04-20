import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Faq = () => {
  // State to manage visibility of each FAQ answer
  const [isAnswerVisible, setIsAnswerVisible] = useState({
    accountCreation: false,
    freeToUse: false
  });

  // Function to toggle FAQ answer visibility
  const toggleAnswer = (key) => {
    setIsAnswerVisible(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  return (
    <div><br />
      <section className="help-center-body">
        <h1>Frequently Asked Questions</h1>
        <h5>Check out our FAQ section for answers to commonly asked questions.</h5>

        <p>
          <button onClick={() => toggleAnswer('accountCreation')}>
            {isAnswerVisible.accountCreation ? '-' : '+'}
          </button>&emsp;
          <strong>How do I create an account?</strong><br/>
          {isAnswerVisible.accountCreation && (
            <span>A: To create an account, go to the signup page and follow the instructions.</span>
          )}
          
        </p>

        <p>
          <button onClick={() => toggleAnswer('freeToUse')}>
            {isAnswerVisible.freeToUse ? '-' : '+'}
          </button>&emsp;
          <strong>Is MastodonHub free to use?</strong>
          <br/>
          {isAnswerVisible.freeToUse && (
            <span>A: Yes, MastodonHub is free to use for both event organizers and attendees.</span>
          )}
        </p>
      </section>

      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default Faq;
