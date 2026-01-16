import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vehiclesAPI } from '../services/api';
import type { Vehicle } from '../types';
import { formatCurrency, formatMileage } from '../utils/format';
import { flags } from '../features/flags';

export default function SearchPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    currency: '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehiclesAPI.getAll();
      setVehicles(sortVehicles(data));
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortVehicles = (vehicleList: Vehicle[]) => {
    const algorithm = flags.searchAlgorithm.getValue();

    if (algorithm === 'price-low-to-high') {
      return [...vehicleList].sort((a, b) => a.price - b.price);
    } else if (algorithm === 'newest-first') {
      return [...vehicleList].sort((a, b) => b.year - a.year);
    }
    // Default: recommended (could be based on user preferences)
    return vehicleList;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.make) params.make = filters.make;
      if (filters.type) params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.currency) params.currency = filters.currency;

      const data = await vehiclesAPI.getByQuery(params);
      setVehicles(sortVehicles(data));
    } catch (error) {
      console.error('Failed to search vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      make: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      currency: '',
    });
    loadVehicles();
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Browse Vehicles</h2>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Search Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Make</label>
            <input
              type="text"
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              placeholder="e.g., Tesla, BMW"
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="hatchback">Hatchback</option>
            </select>
          </div>
          <div className="form-group">
            <label>Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="100000"
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
          <button onClick={resetFilters} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Found {vehicles.length} vehicles
          </p>
          <div className="grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="card">
                {vehicle.images && vehicle.images.length > 0 && (
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '1rem',
                    }}
                  />
                )}
                <h4 style={{ marginBottom: '0.5rem' }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>{vehicle.trim}</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4a9eff' }}>
                  {formatCurrency(vehicle.price, vehicle.currency)}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span>{formatMileage(vehicle.mileage)} miles</span>
                  <span>{vehicle.condition}</span>
                </div>
                {flags.showDealerRatings.isEnabled() && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    ⭐ {vehicle.dealerRating.toFixed(1)} Dealer Rating
                  </p>
                )}
                <Link
                  to={`/vehicles/${vehicle.id}`}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
