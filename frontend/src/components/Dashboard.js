import React, { useState, useEffect } from 'react';
import FeaturedEvents from './FeaturedEvents';
import FeaturedClubs from './FeaturedClubs';
import { useNavigate } from 'react-router-dom';
import headerImage from '../images/header img.jpg' 

const Dashboard = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 15,
    totalClubs: 8,
    weeklyEvents: 12,
    newClubs: 5
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuth(true);
    }
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - using your header-image-container style */}
      <div id="header-image-container">
        <img src={headerImage} alt="Header" />
        <div className="header-image-text">
          <h1>Welcome to MastodonHub</h1>
          <p>Your gateway to campus life!</p>
          {!isAuth && (
            <button 
              onClick={handleGetStarted}
              className="clear-event"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* Featured Events Section */}
      <div id="FeaturedEvents">
        <div className="flex justify-between items-center">
          <h2>Featured Events</h2>
          <button 
            onClick={() => navigate('/events')}
            className="clear-event"
          >
            View All →
          </button>
        </div>
        <FeaturedEvents />
      </div>

      {/* Featured Clubs Section */}
      <div id="FeaturedClubs">
        <div className="flex justify-between items-center">
          <h2>Featured Clubs</h2>
          <button 
            onClick={() => navigate('/clubs')}
            className="clear-event"
          >
            View All →
          </button>
        </div>
        <FeaturedClubs />
      </div>

      {/* Stats at the bottom */}
      <div className="clubs-container-dashboard">
        <div className="events-container">
          <div className="event">
            <h3>Total Events</h3>
            <p>{stats.totalEvents}</p>
          </div>
          <div className="event">
            <h3>Active Clubs</h3>
            <p>{stats.totalClubs}</p>
          </div>
          <div className="event">
            <h3>This Week</h3>
            <p>{stats.weeklyEvents}</p>
          </div>
          <div className="event">
            <h3>New Clubs</h3>
            <p>{stats.newClubs}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;