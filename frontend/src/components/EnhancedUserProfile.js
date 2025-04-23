import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = 'http://127.0.0.1:8000';

const EnhancedUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const navigate = useNavigate();

  const logoutAndRedirect = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        logoutAndRedirect();
        return;
      }

      try {
        console.log('Fetching user profile data...');
        const response = await axios.get(`${backendUrl}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile data received:', response.data);
        setUserData(response.data);

        // Set preview image if profile picture exists
        if (response.data.profile_picture_url) {
          console.log('Profile picture URL:', response.data.profile_picture_url);

          // Use the full URL directly if it's provided as a complete URL
          const imageUrl = response.data.profile_picture_url.startsWith('http')
            ? response.data.profile_picture_url
            : `${backendUrl}${response.data.profile_picture_url}`;

          // Add timestamp to bust cache
          const finalUrl = `${imageUrl}?t=${new Date().getTime()}`;
          console.log('Setting preview image to:', finalUrl);

          setPreviewImage(finalUrl);
        } else {
          console.log('No profile picture URL found in data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error?.response && error.response.status === 401) {
          logoutAndRedirect();
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      const response = await axios.put(`${backendUrl}/profile/update/`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Profile updated successfully:', response.data);
      setUserData(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error?.response && error.response.status === 401) {
        logoutAndRedirect();
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file format. Please upload a JPEG, PNG, or GIF image.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }

      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      setError('Please select an image to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        logoutAndRedirect();
        return;
      }

      console.log('Uploading profile picture:', profilePicture.name);

      const formData = new FormData();
      formData.append('profile_picture', profilePicture);

      const response = await axios.post(
        `${backendUrl}/profile/picture/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Upload response:', response.data);

      if (response.status === 200 || response.status === 201) {
        setSuccess('Profile picture updated successfully!');

        // Update user data with new profile picture URL
        if (response.data.profile_picture_url) {
          const fullUrl = response.data.profile_picture_url.startsWith('http')
            ? response.data.profile_picture_url
            : `${backendUrl}${response.data.profile_picture_url}`;

          console.log('New profile picture URL:', fullUrl);

          // Update URL with timestamp to prevent caching
          const finalUrl = `${fullUrl}?t=${new Date().getTime()}`;
          setPreviewImage(finalUrl);

          setUserData(prevData => ({
            ...prevData,
            profile_picture_url: response.data.profile_picture_url
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError(error.response?.data?.error || 'Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/change-password/`,
        { current_password: currentPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Password changed successfully.');
      setChangePasswordMode(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password.');
    }
  };

  const handleSecurityQuestionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      logoutAndRedirect();
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/security-question/`,
        { security_question: securityQuestion, security_answer: securityAnswer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Security question updated successfully.');
      setSecurityQuestion('');
      setSecurityAnswer('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update security question.');
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile">
      <h2>Profile</h2>

      {/* Profile Picture Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid rgb(207, 185, 145)',
                display: 'block',
                margin: '0 auto'
              }}
            />
          ) : (
            <div
              style={{
                width: '150px',
                height: '150px',
                backgroundColor: '#333',
                borderRadius: '50%',
                border: '2px solid rgb(207, 185, 145)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}
            >
              <span style={{ color: 'white' }}>No Profile Picture</span>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <input
            type="file"
            id="profile-picture"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif"
            style={{ margin: '0 auto', display: 'block' }}
          />
          <small style={{ color: 'rgb(207, 185, 145)', display: 'block', margin: '5px 0' }}>
            Upload a JPEG, PNG, or GIF image (max 5MB)
          </small>
          <button
            onClick={uploadProfilePicture}
            disabled={!profilePicture || uploading}
            style={{
              backgroundColor: 'rgb(207, 185, 145)',
              color: 'black',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: !profilePicture || uploading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Profile Picture'}
          </button>

          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ color: 'green', marginTop: '10px' }}>
              {success}
            </div>
          )}
        </div>
      </div>

      {/* Existing User Profile Form */}
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.first_name}</p>
          <p>Last Name: {userData.last_name}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      )}

      {/* Change Password Section */}
      <div style={{ marginTop: '30px' }}>
        <h3>Change Password</h3>
        {changePasswordMode ? (
          <form onSubmit={handleChangePassword}>
            <div>
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Change Password</button>
            <button onClick={() => setChangePasswordMode(false)}>Cancel</button>
          </form>
        ) : (
          <button onClick={() => setChangePasswordMode(true)}>Change Password</button>
        )}
      </div>

      {/* Security Question Section */}
      <div style={{ marginTop: '30px' }}>
        <h3>Security Question</h3>
        <form onSubmit={handleSecurityQuestionSubmit}>
          <div>
            <label>Security Question</label>
            <input
              type="text"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Security Answer</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update Security Question</button>
        </form>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;