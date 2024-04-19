import React from 'react';

import headerImage from '../images/header img.jpg'
import sportsClub from '../images/sports club.jpg'
import envClub from '../images/env club.jpg'
import musicClub from '../images/music club.jpg'
import writingClub from '../images/Writing club.jpg'
import photographyClub from '../images/photo club.jpg'
import artsClub from '../images/arts club.jpg'
import musicEvent from '../images/music event.jpg'
import advenEvent from '../images/adven event.jpg'
import movieEvent from '../images/movie event.jpg'
import eatsEvent from '../images/eats event.jpg'
import snackEvent from '../images/snack event.jpg'


const Dashboard = () => {
  return (
    <div>
      <div id="header-image-container">
      <img src={headerImage} alt="Header" />
        <div className="header-image-text">
          <h1>Welcome to MastodonHub</h1>
          <p>Discover amazing events and clubs on your campus!</p>
        </div>
      </div>
      <main>
        <div className="clubs-container">
          <section id="clubs">
            <h2>Clubs</h2>
            <div className="clubs-wrapper">
              <figure className="club">
                <img src={sportsClub} alt="Sports" />
                <figcaption><a href="/link/to/sports/club" style={{ color: 'white', textDecoration: 'none' }}>Sports Club</a></figcaption>
              </figure>
              <figure className="club">
                <img src={envClub} alt="Env" />
                <figcaption><a href="/link/to/sports/club" style={{ color: 'white', textDecoration: 'none' }}>Environment Club</a></figcaption>
              </figure>
              <figure className="club">
                <img src={musicClub} alt="Music" />
                <figcaption><a href="/link/to/sports/club" style={{ color: 'white', textDecoration: 'none' }}>Music Club</a></figcaption>
              </figure>
              <figure className="club">
                <img src={writingClub} alt="Writing" />
                <figcaption><a href="/link/to/sports/club" style={{ color: 'white', textDecoration: 'none' }}>Writing Club</a></figcaption>
              </figure>
              <figure className="club">
                <img src={photographyClub} alt="Photography" />
                <figcaption><a href="/link/to/sports/club" style={{ color: 'white', textDecoration: 'none' }}>Photography Club</a></figcaption>
              </figure>
              <figure className="club">
                <img src={artsClub} alt="Arts" />
                <figcaption><a href="/link/to/sports/club" style={{ color: 'white', textDecoration: 'none' }}>Arts Club</a></figcaption>
              </figure>
              
              {/* Add more clubs */}
            </div>
          </section>
          <section id="upcoming-events">
            <h2>Upcoming Events</h2>
            <div className="events-wrapper">
              <div className="event">
                <img src={musicEvent} alt="Music" />
                <h3><a href="/link/to/musical/night" style={{ color: 'white', textDecoration: 'none' }}>Musical night</a></h3>
              </div>
              <div className="event">
                <img src={advenEvent} alt="Adven" />
                <h3><a href="/link/to/musical/night" style={{ color: 'white', textDecoration: 'none' }}>Outdoor adventure</a></h3>
              </div>
              <div className="event">
                <img src={movieEvent} alt="Movie" />
                <h3><a href="/link/to/musical/night" style={{ color: 'white', textDecoration: 'none' }}>Movie night</a></h3>
              </div>
              <div className="event">
              <img src={eatsEvent} alt="Eats" />
                <h3><a href="/link/to/musical/night" style={{ color: 'white', textDecoration: 'none' }}>Eats and treats</a></h3>
              </div>
              <div className="event">
                <img src={snackEvent} alt="Snack" />
                <h3><a href="/link/to/musical/night" style={{ color: 'white', textDecoration: 'none' }}>Snack and study</a></h3>
              </div>
              {/* Add more events */}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
