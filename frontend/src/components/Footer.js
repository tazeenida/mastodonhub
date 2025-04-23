// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
  return (
    <footer className="footer-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="left-column">
        <a style={{ fontSize: '20px' }}><strong>MastodonHub</strong></a>
        <br />
        <a style={{ fontSize: '15px' }}>Your go-to event platform.</a>
      </div>
      <div className="right-column" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>
        <Link to="/helpCenter" style={{ fontSize: '12px' }}>Help Center</Link>
        <Link to="/faq" style={{ fontSize: '12px' }}>FAQs</Link>
        <Link to="/supportTeam" style={{ fontSize: '12px' }}>Support Team</Link>
        <Link to="/userManual" style={{ fontSize: '12px' }}>User Manual</Link>
        <a href="/contactSupport" style={{ fontSize: '12px' }}>Contact Support</a>
      </div>
    </footer>
  );
};

export default Footer;