import './styles.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Clubs from './components/ClubsPage';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
//import UserProfile from './components/UserProfile';
import RequestForm from './components/RequestForm';
import SuggestionForm from './components/SuggestionForm';
import ClubsAdmin from './components/ClubsAdmin';
import EventBlog from './components/EventBlog';
import EventsAdmin from './components/EventsAdmin';
import ContactSupport from './components/ContactSupport';
import UserManual from './components/UserManual'; // Import the UserManual component
import FAQsPage from './components/FAQsPage';
import SupportTeam from './components/SupportTeam';
import HelpCenter from './components/HelpCenter';

import EnhancedUserProfile from './components/EnhancedUserProfile';

function App() {
  const isLoggedIn = true; // example condition
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  const isSignedUp = true; // example condition
  if (!isSignedUp) {
    return <Navigate to="/signUp" />;
  }
  
  // Function to check if user is admin
  const isAdmin = () => {
    return localStorage.getItem('user_role') === 'admin';
  };
  
  return (
    <Router> {/* Wrap the entire app in the Router */}
      <div>
        <Navigation/>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/Dashboard" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/Dashboard" />} />
          <Route path="/Events" element={<Events />} />
          <Route path="/Clubs" element={<Clubs/>} />
          <Route path="/blogs" element={<EventBlog />} />
          <Route path="/RequestForm" element={<RequestForm />} />
          <Route path="/SuggestionForm" element={<SuggestionForm />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/UserProfile" element={<EnhancedUserProfile />} />
          <Route path="/Signup" element={<Signup />} />
          
          {/* Add the ClubsAdmin route here */}
          <Route 
            path="/admin/clubs" 
            element={isLoggedIn && isAdmin() ? <ClubsAdmin /> : <Navigate to="/Login" />} 
          />
          <Route 
            path="/admin/events" 
            element={isLoggedIn && isAdmin() ? <EventsAdmin /> : <Navigate to="/Login" />} 
          />
          {/* Add Help Center Route */}
          <Route path="/helpCenter" element={<HelpCenter />} />
          
          {/* Add Contact Support Route */}
          <Route path="/contactSupport" element={<ContactSupport />} />
          
          {/* Add User Manual Route */}
          <Route path="/userManual" element={<UserManual />} />

          {/* Add the FAQ route */}
          <Route path="/faq" element={<FAQsPage />} />

          {/* Add the Support Team route */}
          <Route path="/supportTeam" element={<SupportTeam />} />
          
          {isLoggedIn ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/Login" />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
        </Routes>
        <Footer/> {/* Footer is now inside the Router */}
      </div>
    </Router>
  );
}

export default App;