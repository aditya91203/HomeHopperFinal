import { FaUser, FaHome, FaCheck, FaTimes, FaEnvelope, FaPhone, FaSpinner } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerDashboard.css';

function RentalApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('ownerToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(
          'http://localhost:5162/api/Owner/rental-application-notifications', 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setApplications(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch applications');
        setApplications([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      const token = localStorage.getItem('ownerToken');
      await axios.put(
        `http://localhost:5162/api/Owner/rental-application/${id}/status`,
        { status: decision },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setApplications(prev => 
        Array.isArray(prev) 
          ? prev.map(app => app.id === id ? { ...app, status: decision } : app)
          : []
      );
    } catch (err) {
      alert(`Failed to update application: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Applications</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Ensure applications is always treated as an array
  const safeApplications = Array.isArray(applications) ? applications : [];

  if (safeApplications.length === 0) {
    return (
      <div className="no-applications">
        <h3>No Rental Applications Found</h3>
        <p>You currently have no pending rental applications.</p>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <h2>Rental Applications</h2>
      
      <div className="applications-list">
        {safeApplications.map(app => {
          // Ensure each application has required fields
          const safeApp = {
            id: app.id || 0,
            tenantName: app.tenantName || 'Unknown Tenant',
            propertyAddress: app.propertyAddress || 'Unknown Property',
            applicationDate: app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'Unknown Date',
            tenantEmail: app.tenantEmail || 'No email provided',
            tenantPhone: app.tenantPhone || 'No phone provided',
            status: app.status || 'pending'
          };

          return (
            <div key={safeApp.id} className="application-card">
              <div className="application-header">
                <h3>{safeApp.tenantName}</h3>
                <span className={`status-badge ${safeApp.status}`}>
                  {safeApp.status.toUpperCase()}
                </span>
              </div>
              
              <div className="application-details">
                <p><FaHome /> {safeApp.propertyAddress}</p>
                <p>Applied: {safeApp.applicationDate}</p>
                <p><FaEnvelope /> {safeApp.tenantEmail}</p>
                <p><FaPhone /> {safeApp.tenantPhone}</p>
              </div>
              
              {safeApp.status === 'pending' && (
                <div className="decision-buttons">
                  <button 
                    className="approve-btn"
                    onClick={() => handleDecision(safeApp.id, 'approved')}
                  >
                    <FaCheck /> Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleDecision(safeApp.id, 'rejected')}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RentalApplications;