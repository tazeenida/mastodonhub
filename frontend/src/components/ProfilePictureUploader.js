import React, { useState } from 'react';
import axios from 'axios';

const backendUrl = 'http://127.0.0.1:8000';

const ProfilePictureUploader = ({ onPictureUpdate }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleUpload = async () => {
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
        window.location.href = '/login';
        return;
      }
      
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
      
      if (response.status === 200 || response.status === 201) {
        setSuccess('Profile picture updated successfully!');
        // Call the callback function to update the parent component
        if (onPictureUpdate && typeof onPictureUpdate === 'function') {
          onPictureUpdate(response.data.profile_picture_url);
        }
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError(error.response?.data?.error || 'Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        {previewImage ? (
          <img 
            src={previewImage} 
            alt="Profile Preview" 
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
            <span style={{ color: 'white' }}>No Image</span>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="file"
          id="profile-picture"
          style={{ 
            display: 'block',
            margin: '10px auto',
            maxWidth: '220px'
          }}
          onChange={handleImageChange}
          accept="image/jpeg,image/png,image/gif"
        />
        <small style={{ 
          color: 'rgb(207, 185, 145)', 
          display: 'block', 
          textAlign: 'center',
          marginTop: '5px' 
        }}>
          Upload a JPEG, PNG, or GIF image (max 5MB)
        </small>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button 
          onClick={handleUpload}
          disabled={!profilePicture || uploading}
          style={{
            backgroundColor: 'rgb(207, 185, 145)',
            color: 'black',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: !profilePicture || uploading ? 'not-allowed' : 'pointer',
            opacity: !profilePicture || uploading ? 0.7 : 1
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Profile Picture'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          color: '#ff5252', 
          textAlign: 'center',
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          color: '#4caf50', 
          textAlign: 'center',
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '5px'
        }}>
          {success}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;