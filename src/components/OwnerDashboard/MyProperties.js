import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle, FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa';
import './OwnerDashboard.css';

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const getOwnerIdFromToken = () => {
    const token = localStorage.getItem('ownerToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        'http://localhost:5162/api/Property/my-properties',
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      console.log('API Response:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      // Handle the special $values case from .NET API
      const dataArray = response.data.$values || 
                       (Array.isArray(response.data) ? response.data : [response.data]);

      const formattedProperties = dataArray.map((property, index) => ({
        id: property.propertyID || property.id || index, // Fallback to index if no ID
        title: property.propertyName || property.title || `Property ${index + 1}`,
        price: property.rentAmount || property.price || 0,
        address: property.address || 'Address not specified',
        state: property.state || 'State not specified',
        country: property.country || 'Country not specified',
        status: property.availabilityStatus ? 'Available' : 'Occupied',
        image: property.imagePath 
          ? `http://localhost:5162/${property.imagePath.replace(/\\/g, '/')}`
          : '/no-image-placeholder.jpg', // Use local placeholder
        amenities: property.amenities 
          ? (typeof property.amenities === 'string' 
              ? property.amenities.split(',').map(a => a.trim()) 
              : property.amenities)
          : [],
        createdAt: property.createdAt ? new Date(property.createdAt) : new Date()
      }));

      setProperties(formattedProperties);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.title || err.response?.data || err.message || 'Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    setDeleteLoading(true);
    setDeleteId(propertyId);
    
    try {
      const token = localStorage.getItem('ownerToken');
      if (!token) throw new Error('Authentication required');

      await axios.delete(
        `http://localhost:5162/api/Property/${propertyId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.title || err.response?.data || 'Failed to delete property');
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner-icon" />
        <p>Loading your properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error Loading Properties</h3>
        <p>{error.toString()}</p>
        <div className="error-actions">
          <button onClick={fetchProperties} className="btn-retry">
            Retry
          </button>
          <Link to="/owner-login" className="btn-secondary">
            Login Again
          </Link>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="empty-container">
        <h3>No Properties Found</h3>
        <p>You haven't listed any properties yet.</p>
        <Link to="/add-property" className="btn-primary">
          <FaPlusCircle /> Add Your First Property
        </Link>
      </div>
    );
  }

  return (
    <div className="owner-properties-container">
      <div className="properties-header">
        <h2>My Properties</h2>
        <Link to="/add-property" className="btn-primary">
          <FaPlusCircle /> Add New Property
        </Link>
      </div>

      <div className="properties-grid">
        {properties.map(property => (
          <div key={`property-${property.id}`} className="property-card">
            <div className="property-image-container">
              <img 
                src={property.image} 
                alt={property.title} 
                onError={(e) => {
                  e.target.src = '/no-image-placeholder.png';
                }}
              />
              <div className={`property-status-badge ${property.status.toLowerCase()}`}>
                {property.status}
              </div>
            </div>

            <div className="property-details">
              <h3>{property.title}</h3>
              <p className="property-location">
                {property.address}, {property.state}, {property.country}
              </p>
              <p className="property-price">${property.price}/month</p>
              
              {property.amenities.length > 0 && (
                <div className="property-amenities">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={`amenity-${property.id}-${index}`} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="amenity-more">+{property.amenities.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            <div className="property-actions">
              <Link 
                to={`/edit-property/${property.id}`} 
                className="btn-edit"
              >
                <FaEdit /> Edit
              </Link>
              <button 
                onClick={() => handleDeleteProperty(property.id)}
                className="btn-delete"
                disabled={deleteLoading && deleteId === property.id}
              >
                {deleteLoading && deleteId === property.id ? (
                  <FaSpinner className="spinner" />
                ) : (
                  <FaTrash />
                )} Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProperties;