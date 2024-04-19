import React from 'react';

function MusicIndustryAssociationClub({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Music Industry Association Club</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Patrick Sizemore</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Stephanie Case</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Jason Lundgren</p>
          <p>Email: <span className="mail">lundgrej@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">mia@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default MusicIndustryAssociationClub;
