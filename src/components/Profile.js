import React, { useEffect, useState } from 'react';
import profileimg from '../images/profile img.png'; // Make sure to import your profile image

function Dashboard() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Function to fetch user data and update profile
    function fetchUserData() {
      // Assuming your backend provides user data via an API endpoint
      fetch("api/userData")
        .then(response => response.json())
        .then(data => {
          // Update profile name and ID with user data
          document.getElementById("profile-name").innerText = data.name;
          setUserId(data.id);
        })
        .catch(error => console.error("Error fetching user data:", error));
    }

    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  // Event handler for loading events content
  const handleEventsClick = () => {
    loadEvents();
  };

  // Function to load events content
  function loadEvents() {
    // Assuming there's an events section on the profile page
    fetch("events.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("events-content").innerHTML = html;
        document.getElementById("events-content").style.display = "block";
      })
      .catch(error => console.error("Error loading events:", error));
  }

  return (
    <div>
      <main>
        {/* Student Profile */}
        <div className="student-profile py-4">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-transparent text-center">
                    <img className="profile_img" src={profileimg} alt="profile img" />
                    <h3 id="profile-name">Name</h3>
                    <p id="user-id">User ID: {userId}</p> {/* Display user ID */}
                    {/* Update Profile button */}
                    <a href="./Update" className="update-link">
                      <button className="update-button">Update Profile</button>
                    </a>
                  </div>
                  <div className="card-body">
                    <p className="mb-0">
                      <strong className="pr-1">Registered Events</strong>
                      <a href="#" id="registered-events-link" onClick={handleEventsClick}>View</a>
                    </p>
                    <div id="events-content" style={{ display: 'none' }}> {/* Container for events content */}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
