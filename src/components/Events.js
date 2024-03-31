import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import banner_event from '../images/banner (2).jpg';
import music_event from '../images/music.png';
import art from '../images/art.png';
import sports from '../images/sports.png';
import workshops from '../images/workshop_event1.jpg';
import SearchForm from './SearchForm';
import MusicEvents from './MusicEvents';
import SportsEvents from './SportsEvents';
import WorkshopEvents from './WorkshopEvent';
import ArtEvents from './ArtEvents';
import YourEvents from './YourEvents';

function Events() {

  return (
    <div>
      <section id="Banner">
        <img src={banner_event} alt="banner_event" width="100%" height="400px" />
        <div className="Events-Banner">Discover exciting events with MastodonHub</div>
      </section>
      <SearchForm/>
      <section id="FeaturedEvents">
        <h1>Featured Events</h1>
        <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }} className="event-images">
          <Link to="/music_event" className="featured-event-link">
            <img src={music_event} alt="music_event" />
            <div className="event-title">Summer Music Festival</div>
          </Link>
          <Link to="/art" className="featured-event-link">
            <img src={art} alt="art_event" />
            <div className="event-title">Art Gallery Opening</div>
          </Link>
          <Link to="/sports" className="featured-event-link">
            <img src={sports} alt="Hunger Games by Suzanne Collins" />
            <div className="event-title">Soccer Match</div>
          </Link>
          <Link to="/workshops" className="featured-event-link">
            <img src={workshops} alt="The Things We Cannot Say" />
            <div className="event-title">Writing Workshops</div>
          </Link>
        </div>
      </section>
      <YourEvents/>
    </div>
  );
}

export default Events;
