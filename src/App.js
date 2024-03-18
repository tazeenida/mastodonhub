import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Clubs from './components/Clubs';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles.css';

function App() {
  return (
    <div>
      <Router>
        <div>
          <Navigation/>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Clubs" element={<Clubs />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;