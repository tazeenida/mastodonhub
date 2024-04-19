import React from 'react';

function CeramicsClub({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Ceramics Club</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Alexa Ross</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Anna Gottlieb</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Seth Green</p>
          <p>Email: <span className="mail">greens@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">ceramicsclub@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default CeramicsClub;