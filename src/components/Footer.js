import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom

const Footer = () => {
  const activeStyle = { color: 'white', backgroundColor: '#000' }; // Styles for active link

  return (
    <footer className="footer-container">
      <div className="left-column">
        {/* Using NavLink for SPA benefits without new tab */}
        <NavLink to="/" style={{ fontSize: '15px' }} activeStyle={activeStyle}><strong>MastodonHub</strong></NavLink>
        <br />
        <NavLink to="/" style={{ fontSize: '10px' }} activeStyle={activeStyle}>Your go-to event platform.</NavLink>
      </div>
      <div className="right-column">
        {/* External links or forced new tab navigation using regular <a> tags */}
        <a href="/HelpCenter" style={{ fontSize: '10px' }} target="_blank">Help Center</a>
        <a href="/Faq" style={{ fontSize: '10px' }} target="_blank">FAQs</a>
        <a href="/SupportTeam" style={{ fontSize: '10px' }} target="_blank">Support Team</a>
        <a href="/UserManual" style={{ fontSize: '10px' }} target="_blank">User Manual</a>
        <a href="/ContactSupport" style={{ fontSize: '10px' }} target="_blank">Contact Support</a>
      </div>
    </footer>
  );
}

export default Footer;
