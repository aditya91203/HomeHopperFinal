import { useState } from 'react';
import PropertyCard from '../shared/PropertyCard'; // Fixed import path
import './TenantDashboard.css';

function PropertySearch() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  // Enhanced mock data
  const [properties] = useState([
    { 
      id: 1, 
      title: 'Downtown Apartment', 
      price: 1200, 
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
    },
    { 
      id: 2, 
      title: 'Suburban House', 
      price: 800, 
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
    }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter logic would go here
    console.log('Searching with:', searchParams);
  };

  return (
    <div className="property-search">
      <h2>Find Your Next Home</h2>
      
      <form onSubmit={handleSearch} className="search-filters">
        <input 
          type="text" 
          placeholder="Location" 
          value={searchParams.location}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Min Price" 
          value={searchParams.minPrice}
          onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Max Price" 
          value={searchParams.maxPrice}
          onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
        />
        <select
          value={searchParams.bedrooms}
          onChange={(e) => setSearchParams({...searchParams, bedrooms: e.target.value})}
        >
          <option value="">Any Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="property-results">
        {properties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            showApplyButton={true}
          />
        ))}
      </div>
    </div>
  );
}

export default PropertySearch;