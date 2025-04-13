import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaSearch, FaFileAlt, FaMoneyBillAlt, FaUser } from 'react-icons/fa';
import './TenantDashboard.css';
import FloatingHomeButton from '../FloatingHomeButton/FloatingHomeButton';

function TenantLayout() {
  return (
    <div className="tenant-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-summary">
          <img src="https://via.placeholder.com/80" alt="Tenant" />
          <h3>Tenant Name</h3>
        </div>
        
        <nav>
          <Link to="/tenant" className="nav-link">
            <FaHome className="icon" /> Dashboard
          </Link>
          <Link to="/tenant/search" className="nav-link">
            <FaSearch className="icon" /> Find Properties
          </Link>
          <Link to="/tenant/applications" className="nav-link">
            <FaFileAlt className="icon" /> My Applications
          </Link>
          <Link to="/tenant/leases" className="nav-link">
            <FaFileAlt className="icon" /> My Leases
          </Link>
          <Link to="/tenant/payments" className="nav-link">
            <FaMoneyBillAlt className="icon" /> Payments
          </Link>
          <Link to="/tenant/profile" className="nav-link">
            <FaUser className="icon" /> Profile
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default TenantLayout;