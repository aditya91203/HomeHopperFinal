import { FaHome, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import './TenantDashboard.css';

function MyApplications() {
  // Mock applications data
  const applications = [
    {
      id: 1,
      property: 'Beachfront Apartment',
      date: '2023-05-15',
      status: 'approved',
      landlord: 'John Smith'
    },
    {
      id: 2,
      property: 'Downtown Loft',
      date: '2023-06-01',
      status: 'pending',
      landlord: 'Sarah Johnson'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheck className="status-icon approved" />;
      case 'rejected': return <FaTimes className="status-icon rejected" />;
      default: return <FaClock className="status-icon pending" />;
    }
  };

  return (
    <div className="applications-container">
      <h2>My Rental Applications</h2>
      
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-card">
            <div className="application-header">
              <FaHome className="property-icon" />
              <h3>{app.property}</h3>
              <div className="application-status">
                {getStatusIcon(app.status)}
                <span className={`status-${app.status}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="application-details">
              <p><strong>Landlord:</strong> {app.landlord}</p>
              <p><strong>Applied:</strong> {app.date}</p>
            </div>
            
            {app.status === 'approved' && (
              <button className="btn-view-lease">
                View Lease Agreement
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;