import React, { useState } from 'react';

function UpdatePage() {
  const [updateMessageVisible, setUpdateMessageVisible] = useState(false);

  // Function to handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    setUpdateMessageVisible(true); // Display update message
    setTimeout(() => {
      setUpdateMessageVisible(false); // Hide update message after 3 seconds
    }, 3000);
  };

  return (
    <div className="update-form-container">
      <h1 className="update-heading">Update Your Information</h1>
      <form onSubmit={handleFormSubmit} id="update-form">
        <label htmlFor="email" className="update-label">Email</label>
        <input type="email" id="email" name="email" className="update-input" required /><br />

        <label htmlFor="name" className="update-label">Name</label>
        <input type="text" id="name" name="name" className="update-input" required /><br />

        <label htmlFor="password" className="update-label">Password</label>
        <input type="password" id="password" name="password" className="update-input" minLength="8" required /><br />

        <label htmlFor="phone" className="update-label">Phone Number</label>
        <input type="tel" id="phone" name="phone" className="update-input" pattern="[0-9]{10}" title="Please enter a 10-digit integer phone number" required /><br />

        <button type="submit" className="update-button">Update</button>
      </form>
      {updateMessageVisible && <div className="update-message">Profile updated!</div>}
    </div>
  );
}

export default UpdatePage;
