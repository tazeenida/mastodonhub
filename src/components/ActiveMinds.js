// ActiveMinds.js
import React from 'react';

function ActiveMinds({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Active Minds</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Gwenna Lehmann</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Scott Shew</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Alice Jordan</p>
          <p>Email: <span className="mail">jordana@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">activeminds@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default ActiveMinds;
