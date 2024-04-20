import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <br/>
      <section>
      <h1>Contact Support</h1>
    <p>
        Need further assistance? Contact our support team using the form below:
    </p>
      
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>&emsp;
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      /><br /><br/>
      <label htmlFor="email">Email:</label>&emsp;
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      /><br /><br/>
      <label htmlFor="message">Comments:</label><br />&emsp;&emsp;&emsp;&emsp;
      <textarea
        id="message"
        name="message"
        rows="8"
        value={formData.message}
        onChange={handleChange}
        required
      ></textarea><br /><br/>
      <button type="submit" style={{backgroundColor: "#cfb991", borderRadius: '4px' }}>Submit</button>
    </form>
      </section>

      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default ContactSupport;
