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
          <p>Name: [President Name]</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: [Treasurer Name]</p>
        </div>
        <div className="officer">
          <h2>Secretary</h2>
          <p>Name: [Secretary Name]</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: [Advisor Name]</p>
          <p>Email: <span className="mail">[Advisor Email]</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">[Contact Email]</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default MusicTherapyClub;