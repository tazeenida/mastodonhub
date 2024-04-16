import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClubsPage from './ClubsPage';
import CeramicsClub from './CeramicsClub';
import MusicTherapyClub from './MusicTherapyClub';
import BasketballClub from './BasketballClubPopup'; // Import BasketballClub component

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
        <Route path="/basketball-club" element={<BasketballClub />} /> {/* Route for BasketballClub */}
      </Routes>

      {showCeramicsPopup && <CeramicsClub closePopup={closeCeramicsPopup} />}
      {showMusicTherapyPopup && <MusicTherapyClub closePopup={closeMusicTherapyPopup} />}
    </Router>
  );
}

export default Clubs;