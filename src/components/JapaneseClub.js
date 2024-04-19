import React from 'react';

function JapaneseClub({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Japanese Club</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Bella Ibarra Escobar</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Xining Yao</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Yuriko Ujike</p>
          <p>Email: <span className="mail">ujikey@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">japanclub@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default JapaneseClub;
