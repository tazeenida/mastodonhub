import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Clubs from './components/ClubsPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Update from './components/Update';
import './styles.css';
import Faq from './components/Faq';
import HelpCenter from './components/HelpCenter';
import SupportTeam from './components/SupportTeam';
import UserManual from './components/UserManual';
import ContactSupport from './components/ContactSupport';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Navigation/>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Clubs" element={<Clubs />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Update" element={<Update />} />
            <Route path="/HelpCenter" element={<HelpCenter/>} />
            <Route path="/Faq" element={<Faq/>} />
            <Route path="/SupportTeam" element={<SupportTeam/>} />
            <Route path="/UserManual" element={<UserManual />} />
            <Route path="/ContactSupport" element={<ContactSupport/>} />
          </Routes>
        </div>
      <Footer/>
    </div>
  );
}

export default App;