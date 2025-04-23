import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';

const backendUrl = 'http://127.0.0.1:8000';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token !== null) {
        setIsAuth(true);
        
        // Check for admin status
        try {
          const response = await axios.get(`${backendUrl}/api/check-admin/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data && response.data.is_admin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          const userRole = localStorage.getItem('user_role');
          if (userRole === 'admin') {
            setIsAdmin(true);
          }
        }
        
        // Fetch profile picture and username
        try {
          const profileResponse = await axios.get(`${backendUrl}/profile/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Set username
          if (profileResponse.data.username) {
            setUsername(profileResponse.data.username);
          }
          
          // Set profile picture
          if (profileResponse.data.profile_picture_url) {
            const imageUrl = profileResponse.data.profile_picture_url.startsWith('http') 
              ? profileResponse.data.profile_picture_url 
              : `${backendUrl}${profileResponse.data.profile_picture_url}`;
            
            setProfilePicture(`${imageUrl}?t=${new Date().getTime()}`);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };
    
    checkAuth();
  }, []);

  return(
    <nav className="main-nav">
      <div className="mastodon-label">
        <p>MastodonHub</p>
      </div>
      <ul>
        <li><Link to="/Dashboard">Dashboard</Link></li>
        <li><Link to="/Events">Events</Link></li>
        <li><Link to="/Clubs">Clubs</Link></li>
        <li><Link to="/RequestForm">Request Form</Link></li>
        <li><Link to="/SuggestionForm">Have a comment?</Link></li>
        {/* Admin link - only shown to admins */}
        {isAdmin && (
          <li><Link to="/admin/clubs">Admin: Clubs</Link></li>
        )}
        {isAdmin && (
          <li><Link to="/admin/events">Admin: Events</Link></li>
        )}
      </ul>
      <div className="login-signup">
        {isAuth ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link 
              to="/UserProfile" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginRight: '15px',
                textDecoration: 'none',
                color: 'black',
                backgroundColor: 'transparent'
              }}
            >
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%',
                    border: '2px solid rgb(207, 185, 145)',
                    objectFit: 'cover',
                    marginRight: '8px'
                  }} 
                />
              ) : (
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%',
                  backgroundColor: '#333',
                  border: '2px solid rgb(207, 185, 145)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  marginRight: '8px'
                }}>
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              {username || 'User'}
            </Link>
            <Link 
              to="/logout" 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: 'black', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '4px' 
              }}
            >
              Logout
            </Link>
          </div>
        ) : (
          <>
            <Link 
              to="/Signup" 
              style={{ 
                marginRight: '10px',
                padding: '8px 16px', 
                backgroundColor: 'black', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '4px' 
              }}
            >
              Signup
            </Link>
            <Link 
              to="/login" 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: 'black', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '4px' 
              }}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;