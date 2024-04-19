import React from 'react';

function FrenchClub({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>French Club</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Veronica Johnson</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Nathaniel Paul</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Steven Stevenson</p>
          <p>Email: <span className="mail">stevenss@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">frenchclub@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default FrenchClub;
