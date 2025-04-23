import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/password-reset-confirm/${uidb64}/${token}/`, { new_password: newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Reset Password</h3>
          <div className="form-group mt-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">Reset Password</button>
          </div>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      </form>
    </div>
  );
};

export default PasswordResetConfirm;