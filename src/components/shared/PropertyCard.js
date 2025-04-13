import { FaBed, FaBath, FaRulerCombined, FaEdit, FaTrash } from 'react-icons/fa';

function PropertyCard({ property, showOwnerActions = false }) {
  return (
    <div className="property-card">
      <div className="property-status">{property.status}</div>
      <img src={property.image} alt={property.title} />
      <div className="property-details">
        <h3>{property.title}</h3>
        <p className="price">${property.price}/month</p>
        <p className="location">{property.location}</p>
        
        <div className="features">
          <span><FaBed /> {property.bedrooms}</span>
          <span><FaBath /> {property.bathrooms}</span>
          <span><FaRulerCombined /> 1200 sqft</span>
        </div>
        
        {showOwnerActions && (
          <div className="owner-actions">
            <button className="edit-btn">
              <FaEdit /> Edit
            </button>
            <button className="delete-btn">
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;