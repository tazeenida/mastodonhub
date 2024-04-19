// AfricanStudentsOrganization.js
import React from 'react';

function AfricanStudentsOrganization({ closePopup }) {
  return (
    <div className="popup-container">
      <div className="popup">
        <header>
          <h1>Accounting Society</h1>
        </header>
        <div className="officer">
          <h2>President</h2>
          <p>Name: Ebenezer Amartey</p>
        </div>
        <div className="officer">
          <h2>Treasurer</h2>
          <p>Name: Benedicta Woolley</p>
        </div>
        <div className="officer">
          <h2>Advisor</h2>
          <p>Name: Mary Kiura</p>
          <p>Email: <span className="mail">mkiura@pfw.edu</span></p>
        </div>
        <div className="officer">
          <h2>Contact</h2>
          <p>Email:<span className="mail">aso@pfw.edu</span></p>
        </div>
        <button className="previous-page-button" onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default AfricanStudentsOrganization;
