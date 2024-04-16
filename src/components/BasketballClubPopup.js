import React from 'react';

function BasketballClubPopup({ togglePopup, closePopup }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={togglePopup}>&times;</span>
        <h1>Basketball Club</h1>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Myles Olagbegi</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Autumn Searfoss</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Nick Brand</p>
          <p>Email: <span className="mail">brannj01@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email: <span className="mail">BBclub@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default BasketballClubPopup;