// AccountingSociety.js
import React from 'react';

function AccountingSociety({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Accounting Society</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Nicholas Mills</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Hannah Harris</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Daniel Boylan</p>
          <p>Email: <span className="mail">boyland@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">accountingsociety@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default AccountingSociety;
