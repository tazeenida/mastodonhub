import React from 'react';

function MusicTherapyClub({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Music Therapy Club</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Olivia Edens</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Emma Keeling</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Eileen Garwood</p>
          <p>Email: <span className="mail">garwoode@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">musictherapyclub@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default MusicTherapyClub;