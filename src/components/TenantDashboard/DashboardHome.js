import { FaHome, FaClipboardCheck,FaMoneyBillAlt, FaFileContract } from 'react-icons/fa';

function DashboardHome() {
  // Mock data
  const stats = [
    { title: 'Active Applications', value: 2, icon: <FaClipboardCheck /> },
    { title: 'Current Lease', value: 1, icon: <FaFileContract /> },
    { title: 'Upcoming Payment', value: '$1200', icon: <FaMoneyBillAlt /> }
  ];

  return (
    <div className="dashboard-home">
      <h2>Tenant Dashboard</h2>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button>Apply for New Property</button>
        <button>Make Payment</button>
        <button>Report Maintenance</button>
      </div>
    </div>
  );
}

export default DashboardHome;