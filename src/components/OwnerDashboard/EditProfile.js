import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUser, FaPhone, FaLock, FaSave } from 'react-icons/fa';
import './OwnerDashboard.css';

function EditProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: location.state.profile.name || '',
    phoneNumber: location.state.profile.phone || '',
    password: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) throw new Error('JWT token not found');

      // Prepare payload as per OwnerUpdateDTO
      const payload = {
        name: profile.name,
        contactDetails: profile.phoneNumber,
      };
      if (profile.password.trim() !== '') {
        payload.newPassword = profile.password;
      }

      console.log('📤 Sending payload:', payload);

      const response = await axios.put('http://localhost:5162/api/Owner/update-profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        navigate('/owner/profile');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="edit-profile-page">
      <h2>Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><FaUser /> Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label><FaPhone /> Phone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label><FaLock /> New Password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current"
          />
        </div>

        <button type="submit" className="btn-save">
          <FaSave /> Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
