import React, { useState } from 'react';
import BasketballClubPopup from './BasketballClubPopup';
import MusicTherapyClubPopup from './MusicTherapyClub';
import CeramicsClubPopup from './CeramicsClub';

function ClubsPage() {
  const [showBasketballPopup, setShowBasketballPopup] = useState(false);
  const [showCeramicsPopup, setShowCeramicsPopup] = useState(false);
  const [showMusicTherapyPopup, setShowMusicTherapyPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false); // State for filter popup

  const openBasketballPopup = () => setShowBasketballPopup(true);
  const closeBasketballPopup = () => setShowBasketballPopup(false);

  const openCeramicsPopup = () => setShowCeramicsPopup(true);
  const closeCeramicsPopup = () => setShowCeramicsPopup(false);

  const openMusicTherapyPopup = () => setShowMusicTherapyPopup(true);
  const closeMusicTherapyPopup = () => setShowMusicTherapyPopup(false);

  // Function to toggle filter popup
  const toggleFilterPopup = () => setShowFilterPopup(!showFilterPopup);

  return (
    <div className="container">
      <header>
        <h1>MastodonClub</h1>
      </header>

      {/* Filter button */}
      <div className="centered-filter-button">
        <button className="filter-button" onClick={toggleFilterPopup}>Filter</button>
      </div>

      {/* Filter popup */}
      {showFilterPopup && (
        <div className="filter-popup">
          {/* Add filter options here */}
          <label><input type="checkbox" name="category" value="Science" /> Science</label>
          <label><input type="checkbox" name="category" value="Art" /> Art</label>
          <label><input type="checkbox" name="category" value="Sports" /> Sports</label>
          {/* Add more categories as needed */}
          <button onClick={toggleFilterPopup}>Apply</button>
          <button onClick={toggleFilterPopup}>Close</button>
        </div>
      )}

      {/* Basketball Club */}
      <div class="club-container" data-categories="Sports" onclick="navigateToClubDetails('club1')">
      <div className="club-item" onClick={openBasketballPopup}>
          <h2>Basketball Club</h2>
          <p>Location: Walb</p>
          <img src="https://horizoneroundtable.com/wp-content/uploads/2022/09/image_2022-10-02_180312764.png" alt="Basketball Club" />
        </div>
        </div>
      

      {/* Ceramics Club */}
      <div class="club-container" data-categories="Art" onclick="navigateToClubDetails('club2')">
      <div className="club-item" onClick={openCeramicsPopup}>
          <h2>Ceramics Club</h2>
          <p>Location: [Location]</p>
          <img src="[Ceramics Club Image URL]" alt="Ceramics Club" />
        </div>
        </div>
      

      {/* Music Therapy Club */}
      <div className="club-container">
        <div className="club-item" onClick={openMusicTherapyPopup}>
          <h2>Music Therapy Club</h2>
          <p>Location: [Location]</p>
          <img src="[Music Therapy Club Image URL]" alt="Music Therapy Club" />
        </div>
      </div>

      {/* Pop-ups */}
      {showBasketballPopup && <BasketballClubPopup closePopup={closeBasketballPopup} />}
      {showCeramicsPopup && <CeramicsClubPopup closePopup={closeCeramicsPopup} />}
      {showMusicTherapyPopup && <MusicTherapyClubPopup closePopup={closeMusicTherapyPopup} />}

      {/* Footer */}
      <footer>
        <div className="left-column">
          <a style={{ fontSize: '15px' }}><strong>MastodonEvents</strong></a>
          <br />
          <a style={{ fontSize: '10px' }}>Your go-to event platform.</a>
        </div>
        <div className="right-column">
          <a href="../MastodonEvents/helpCenter.html" target="_blank" style={{ fontSize: '10px' }}>Help Center</a>
          <a href="../MastodonEvents/faq.html" target="_blank" style={{ fontSize: '10px' }}>FAQs</a>
          <a href="../MastodonEvents/supportTeam.html" target="_blank" style={{ fontSize: '10px' }}>Support Team</a>
          <a href="../MastodonEvents/userManual.html" target="_blank" style={{ fontSize: '10px' }}>User Manual</a>
          <a href="../MastodonEvents/contactSupport.html" target="_blank" style={{ fontSize: '10px' }}>Contact Support</a>
        </div>
      </footer>
    </div>
  );
}

export default ClubsPage;