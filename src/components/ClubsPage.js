import React, { useState } from 'react';
import BasketballClubPopup from './BasketballClubPopup';
import MusicTherapyClubPopup from './MusicTherapyClub';
import CeramicsClubPopup from './CeramicsClub';
import FrenchClubPopup from './FrenchClub';
import JapaneseClubPopup from './JapaneseClub';
import MusicIndustryAssociationClubPopup from './MusicIndustryAssociationClub';
import AccountingSocietyPopup from './AccountingSociety'; // Import AccountingSocietyPopup component
import ActiveMindsPopup from './ActiveMinds'; // Import ActiveMindsPopup component
import AfricanStudentsOrganizationPopup from './AfricanStudentsOrganization'; // Import AfricanStudentsOrganizationPopup component
import BollywoodJhoomPopup from './BollywoodJhoom'; // Import BollywoodJhoomPopup component
import DancinDonsPopup from './DancinDons'; // Import DancinDonsPopup component

import './styles.scss'; // Import styles.scss

function ClubsPage() {
  const [showBasketballPopup, setShowBasketballPopup] = useState(false);
  const [showCeramicsPopup, setShowCeramicsPopup] = useState(false);
  const [showMusicTherapyPopup, setShowMusicTherapyPopup] = useState(false);
  const [showFrenchClubPopup, setShowFrenchClubPopup] = useState(false);
  const [showJapaneseClubPopup, setShowJapaneseClubPopup] = useState(false);
  const [showMusicIndustryAssociationClubPopup, setShowMusicIndustryAssociationClubPopup] = useState(false);
  const [showAccountingSocietyPopup, setShowAccountingSocietyPopup] = useState(false);
  const [showActiveMindsPopup, setShowActiveMindsPopup] = useState(false);
  const [showAfricanStudentsOrganizationPopup, setShowAfricanStudentsOrganizationPopup] = useState(false);
  const [showBollywoodJhoomPopup, setShowBollywoodJhoomPopup] = useState(false);
  const [showDancinDonsPopup, setShowDancinDonsPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false); // State for filter popup
  const [selectedFilters, setSelectedFilters] = useState([]);

  const openBasketballPopup = () => setShowBasketballPopup(true);
  const closeBasketballPopup = () => setShowBasketballPopup(false);

  const openCeramicsPopup = () => setShowCeramicsPopup(true);
  const closeCeramicsPopup = () => setShowCeramicsPopup(false);

  const openMusicTherapyPopup = () => setShowMusicTherapyPopup(true);
  const closeMusicTherapyPopup = () => setShowMusicTherapyPopup(false);

  const openFrenchClubPopup = () => setShowFrenchClubPopup(true);
  const closeFrenchClubPopup = () => setShowFrenchClubPopup(false);

  const openJapaneseClubPopup = () => setShowJapaneseClubPopup(true);
  const closeJapaneseClubPopup = () => setShowJapaneseClubPopup(false);

  const openMusicIndustryAssociationClubPopup = () => setShowMusicIndustryAssociationClubPopup(true);
  const closeMusicIndustryAssociationClubPopup = () => setShowMusicIndustryAssociationClubPopup(false);

  const openAccountingSocietyPopup = () => setShowAccountingSocietyPopup(true);
  const closeAccountingSocietyPopup = () => setShowAccountingSocietyPopup(false);

  const openActiveMindsPopup = () => setShowActiveMindsPopup(true);
  const closeActiveMindsPopup = () => setShowActiveMindsPopup(false);

  const openAfricanStudentsOrganizationPopup = () => setShowAfricanStudentsOrganizationPopup(true);
  const closeAfricanStudentsOrganizationPopup = () => setShowAfricanStudentsOrganizationPopup(false);

  const openBollywoodJhoomPopup = () => setShowBollywoodJhoomPopup(true);
  const closeBollywoodJhoomPopup = () => setShowBollywoodJhoomPopup(false);

  const openDancinDonsPopup = () => setShowDancinDonsPopup(true);
  const closeDancinDonsPopup = () => setShowDancinDonsPopup(false);

  // Function to toggle filter popup
  const toggleFilterPopup = () => setShowFilterPopup(!showFilterPopup);

  // Function to handle filter selection
  const handleFilterSelection = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  // Function to check if a club should be displayed based on selected filters
  const shouldDisplayClub = (categories) => {
    if (selectedFilters.length === 0) {
      return true;
    }
    return selectedFilters.some((filter) => categories.includes(filter));
  };

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
          <label><input type="checkbox" name="category" value="Science" onChange={() => handleFilterSelection("Science")} /> Science</label>
          <label><input type="checkbox" name="category" value="Art" onChange={() => handleFilterSelection("Art")} /> Art</label>
          <label><input type="checkbox" name="category" value="Sports" onChange={() => handleFilterSelection("Sports")} /> Sports</label>
          <label><input type="checkbox" name="category" value="Language" onChange={() => handleFilterSelection("Language")} /> Language</label>
          <label><input type="checkbox" name="category" value="Music" onChange={() => handleFilterSelection("Music")} /> Music</label>
          <label><input type="checkbox" name="category" value="Dance" onChange={() => handleFilterSelection("Dance")} /> Dance</label>
          <label><input type="checkbox" name="category" value="Community" onChange={() => handleFilterSelection("Community")} /> Community</label>
          <label><input type="checkbox" name="category" value="Study" onChange={() => handleFilterSelection("Study")} /> Study</label>
          {/* Add more categories as needed */}
          <button onClick={toggleFilterPopup}>Apply</button>
          <button onClick={toggleFilterPopup}>Close</button>
        </div>
      )}

      {/* Basketball Club */}
      {shouldDisplayClub(["Sports"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openBasketballPopup}>
            <h2>Basketball Club</h2>
            <p>Location: Walb</p>
            <img src="https://horizoneroundtable.com/wp-content/uploads/2022/09/image_2022-10-02_180312764.png" alt="Basketball Club" />
          </div>
        </div>
      )}

      {/* Ceramics Club */}
      {shouldDisplayClub(["Art"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openCeramicsPopup}>
            <h2>Ceramics Club</h2>
            <p>Location: Visual Arts Building</p>
            <img src="https://www.pfw.edu/sites/default/files/styles/50_50_landscape/public/images-2023/06/20191118-Ceramics-Club-JW-002.JPG?h=7797f1ff&itok=kHXD52Dn" alt="Ceramics Club" />
          </div>
        </div>
      )}

      {/* Music Therapy Club */}
      {shouldDisplayClub(["Music"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openMusicTherapyPopup}>
            <h2>Music Therapy Club</h2>
            <p>Location: Music Building </p>
            <img src="https://www.pfw.edu/sites/default/files/styles/50_50_landscape/public/images-2022/01/20211026-Music-Therapy-Shoot-JW-124.jpg?itok=ndnx4lOI" alt="Music Therapy Club" />
          </div>
        </div>
      )}

      {/* French Club */}
      {shouldDisplayClub(["Language"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openFrenchClubPopup}>
            <h2>French Club</h2>
            <p>Location: [Location]</p>
            <img src="https://www.pfw.edu/sites/default/files/styles/50_50_landscape/public/images-2023/05/20200902-Lifestyle-Outdoor-JW-022.jpg?h=18e2b450&itok=iu0SFpNb" alt="French Club" />
          </div>
        </div>
      )}

      {/* Japanese Club */}
      {shouldDisplayClub(["Language"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openJapaneseClubPopup}>
            <h2>Japanese Club</h2>
            <p>Location: Walb </p>
            <img src="https://www.pfw.edu/dotAsset/b609452d-6c7f-49d4-a4d9-b8b6cea6b3e7.jpg" alt="Japanese Club" />
          </div>
        </div>
      )}

      {/* Music Industry Association Club */}
      {shouldDisplayClub(["Music"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openMusicIndustryAssociationClubPopup}>
            <h2>Music Industry Association Club</h2>
            <p>Location: Music Building</p>
            <img src="https://www.pfw.edu/sites/default/files/styles/50_50_landscape/public/images-2022/03/research-music-students.png?h=18786c86&itok=y3gOXNLH" alt="Music Industry Association Club" />
          </div>
        </div>
      )}

      {/* Accounting Society */}
      {shouldDisplayClub(["Study"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openAccountingSocietyPopup}>
            <h2>Accounting Society</h2>
            <p>Location: Neff</p>
            <img src="[Image URL]" alt="Accounting Society" />
          </div>
        </div>
      )}

      {/* Active Minds */}
      {shouldDisplayClub(["Art"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openActiveMindsPopup}>
            <h2>Active Minds</h2>
            <p>Location: Visual Arts Building</p>
            <img src="[Image URL]" alt="Active Minds" />
          </div>
        </div>
      )}

      {/* African Students Organization */}
      {shouldDisplayClub(["Community"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openAfricanStudentsOrganizationPopup}>
            <h2>African Students Organization</h2>
            <p>Location: Walb</p>
            <img src="[Image URL]" alt="African Students Organization" />
          </div>
        </div>
      )}

      {/* Bollywood Jhoom */}
      {shouldDisplayClub(["Dance"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openBollywoodJhoomPopup}>
            <h2>Bollywood Jhoom</h2>
            <p>Location: Walb</p>
            <img src="[Image URL]" alt="Bollywood Jhoom" />
          </div>
        </div>
      )}

      {/* Dancin' Dons */}
      {shouldDisplayClub(["Dance"]) && (
        <div className="club-container">
          <div className="club-item" onClick={openDancinDonsPopup}>
            <h2>Dancin' Dons</h2>
            <p>Location: Walb</p>
            <img src="[Image URL]" alt="Dancin' Dons" />
          </div>
        </div>
      )}

      {/* Pop-ups */}
      {showBasketballPopup && <BasketballClubPopup closePopup={closeBasketballPopup} />}
      {showCeramicsPopup && <CeramicsClubPopup closePopup={closeCeramicsPopup} />}
      {showMusicTherapyPopup && <MusicTherapyClubPopup closePopup={closeMusicTherapyPopup} />}
      {showFrenchClubPopup && <FrenchClubPopup closePopup={closeFrenchClubPopup} />}
      {showJapaneseClubPopup && <JapaneseClubPopup closePopup={closeJapaneseClubPopup} />}
      {showMusicIndustryAssociationClubPopup && <MusicIndustryAssociationClubPopup closePopup={closeMusicIndustryAssociationClubPopup} />}
      {showAccountingSocietyPopup && <AccountingSocietyPopup closePopup={closeAccountingSocietyPopup} />}
      {showActiveMindsPopup && <ActiveMindsPopup closePopup={closeActiveMindsPopup} />}
      {showAfricanStudentsOrganizationPopup && <AfricanStudentsOrganizationPopup closePopup={closeAfricanStudentsOrganizationPopup} />}
      {showBollywoodJhoomPopup && <BollywoodJhoomPopup closePopup={closeBollywoodJhoomPopup} />}
      {showDancinDonsPopup && <DancinDonsPopup closePopup={closeDancinDonsPopup} />}

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