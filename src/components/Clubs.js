import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClubsPage from './ClubsPage';
import CeramicsClub from './CeramicsClub';
import MusicTherapyClub from './MusicTherapyClub';
import BasketballClub from './BasketballClubPopup';
import FrenchClub from './FrenchClub';
import JapaneseClub from './JapaneseClub';
import MusicIndustryAssociationClub from './MusicIndustryAssociationClub';
import AccountingSociety from './AccountingSociety'; // Import AccountingSociety component
import ActiveMinds from './ActiveMinds'; // Import ActiveMinds component
import AfricanStudentsOrganization from './AfricanStudentsOrganization'; // Import AfricanStudentsOrganization component
import BollywoodJhoom from './BollywoodJhoom'; // Import BollywoodJhoom component
import DancinDons from './DancinDons'; // Import DancinDons component

const Clubs = () => {
  const [showCeramicsPopup, setShowCeramicsPopup] = useState(false);
  const [showMusicTherapyPopup, setShowMusicTherapyPopup] = useState(false);

  const openCeramicsPopup = () => setShowCeramicsPopup(true);
  const closeCeramicsPopup = () => setShowCeramicsPopup(false);

  const openMusicTherapyPopup = () => setShowMusicTherapyPopup(true);
  const closeMusicTherapyPopup = () => setShowMusicTherapyPopup(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClubsPage
          openCeramicsPopup={openCeramicsPopup}
          openMusicTherapyPopup={openMusicTherapyPopup}
        />} />
        <Route path="/ceramics-club" element={<CeramicsClub closePopup={closeCeramicsPopup} />} />
        <Route path="/music-therapy-club" element={<MusicTherapyClub closePopup={closeMusicTherapyPopup} />} />
        <Route path="/basketball-club" element={<BasketballClub />} />
        <Route path="/french-club" element={<FrenchClub />} />
        <Route path="/japanese-club" element={<JapaneseClub />} />
        <Route path="/music-industry-association-club" element={<MusicIndustryAssociationClub />} />
        <Route path="/accounting-society" element={<AccountingSociety />} /> {/* Route for AccountingSociety */}
        <Route path="/active-minds" element={<ActiveMinds />} /> {/* Route for ActiveMinds */}
        <Route path="/african-students-organization" element={<AfricanStudentsOrganization />} /> {/* Route for AfricanStudentsOrganization */}
        <Route path="/bollywood-jhoom" element={<BollywoodJhoom />} /> {/* Route for BollywoodJhoom */}
        <Route path="/dancin-dons" element={<DancinDons />} /> {/* Route for DancinDons */}
      </Routes>

      {showCeramicsPopup && <CeramicsClub closePopup={closeCeramicsPopup} />}
      {showMusicTherapyPopup && <MusicTherapyClub closePopup={closeMusicTherapyPopup} />}
    </Router>
  );
}

export default Clubs;
