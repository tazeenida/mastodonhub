import React from 'react';

function DancinDons({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>DancinDons</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Sarina Wright</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Dymond Barbre</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Ronald Friedman</p>
          <p>Email: <span className="mail">friedmar@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">dancindons@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default DancinDons;
