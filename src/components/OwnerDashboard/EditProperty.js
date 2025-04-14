import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import './OwnerDashboard.css';

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState({
    propertyName: '',
    address: '',
    state: '',
    country: '',
    rentAmount: '',
    availabilityStatus: false,
    amenities: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('ownerToken');
        const response = await axios.get(`http://localhost:5162/api/Property/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        setProperty({
          propertyName: data.propertyName || '',
          address: data.address || '',
          state: data.state || '',
          country: data.country || '',
          rentAmount: data.rentAmount || '',
          availabilityStatus: data.availabilityStatus || false,
          amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : data.amenities || ''
        });
      } catch (err) {
        console.error('❌ Failed to load property:', err);
        setError('Failed to load property');
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('ownerToken');
      const ownerId = JSON.parse(atob(token.split('.')[1]))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      const payload = {
        ...property,
        ownerID: parseInt(ownerId),
        rentAmount: parseFloat(property.rentAmount),
        amenities: property.amenities.trim() // backend expects a string
      };

      await axios.put(`http://localhost:5162/api/Property/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Property updated successfully!');
      navigate('/owner/properties');
    } catch (err) {
      console.error('❌ Error updating property:', err.response || err.message);
      alert('Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <Link to="/owner/properties" className="back-link">
          <FaArrowLeft /> Back to Properties
        </Link>
        <h2>Edit Property</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="property-form styled-form">
        <label>
          Property Name:
          <input
            type="text"
            name="propertyName"
            value={property.propertyName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={property.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          State:
          <input
            type="text"
            name="state"
            value={property.state}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            name="country"
            value={property.country}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Rent Amount:
          <input
            type="number"
            name="rentAmount"
            value={property.rentAmount}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="availabilityStatus"
            checked={property.availabilityStatus}
            onChange={handleChange}
          />
          Available
        </label>

        <label>
          Amenities (comma separated):
          <input
            type="text"
            name="amenities"
            value={property.amenities}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={submitting}>
          <FaSave /> {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditProperty;
