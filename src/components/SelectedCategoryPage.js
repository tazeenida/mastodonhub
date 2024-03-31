// SelectedCategoryPage.js
import React from 'react';
import MusicEvents from './MusicEvents';
import ArtEvents from './ArtEvents';
import WorkshopEvents from './WorkshopEvent';
import SportsEvents from './SportsEvents';

function SelectedCategoryPage({ category }) {
  // Function to render events based on category
  const renderEvents = () => {
    switch (category) {
      case 'Music':
        return <MusicEvents />;
      case 'Art':
        return <ArtEvents />;
      case 'Workshops':
        return <WorkshopEvents />;
      case 'Sports':
        return <SportsEvents />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>{category}</h1>
      {renderEvents()}
    </div>
  );
}

export default SelectedCategoryPage;
