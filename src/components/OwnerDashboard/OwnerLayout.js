import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaHome,
  FaPlus,
  FaClipboardList,
  FaFileContract,
  FaBell,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import './OwnerDashboard.css';
import FloatingHomeButton from '../FloatingHomeButton/FloatingHomeButton';

function OwnerLayout() {
  const [ownerName, setOwnerName] = useState("Owner");

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    if (!token) return;

    axios
      .get("http://localhost:5162/api/Owner/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setOwnerName(res.data.fullName); // ✅ backend must return fullName or use res.data.name
      })
      .catch((err) => {
        console.error("Failed to fetch owner name:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ownerToken'); // clear the JWT token
    window.location.href = '/sell-login'; // redirect to login page
  };
  

  return (
    <div className="owner-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-summary">
          <img src="https://via.placeholder.com/80" alt="Owner" />
          <h3>{ownerName}</h3> {/* ✅ dynamic name */}
          <p>Premium Member</p>
        </div>

        <nav>
          <Link to="/owner" className="nav-link">
            <FaHome className="icon" /> Dashboard
          </Link>
          <Link to="/owner/profile" className="nav-link">
            <FaUser className="icon" /> Profile
          </Link>
          <Link to="/owner/add-property" className="nav-link">
            <FaPlus className="icon" /> Add Property
          </Link>
          <Link to="/owner/properties" className="nav-link">
            <FaHome className="icon" /> My Properties
          </Link>
          <Link to="/owner/applications" className="nav-link">
            <FaClipboardList className="icon" /> Applications
          </Link>
          <Link to="/owner/leases" className="nav-link">
            <FaFileContract className="icon" /> Leases
          </Link>
          <Link to="/owner/notifications" className="nav-link">
            <FaBell className="icon" /> Notifications
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <FaSignOutAlt className="icon" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default OwnerLayout;
