import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { vehiclesAPI, authAPI } from '../services/api';
import type { Vehicle } from '../types';
import { formatCurrency, formatMileage } from '../utils/format';
import useRoxVariant from '../hooks/useRoxVariant';
import useRoxFlag from '../hooks/useRoxFlag';

export default function SearchPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    currency: '',
    transmission: '',
    fuelType: '',
  });

  // Reactive feature flags
  const searchAlgorithm = useRoxVariant('searchAlgorithm');
  const showDealerRatings = useRoxFlag('showDealerRatings');
  const enableAdvancedFilters = useRoxFlag('enableAdvancedFilters');
  const pricingDisplay = useRoxVariant('pricingDisplay');

  const sortVehicles = useCallback((vehicleList: Vehicle[]) => {
    if (searchAlgorithm === 'price-low-to-high') {
      return [...vehicleList].sort((a, b) => a.price - b.price);
    } else if (searchAlgorithm === 'newest-first') {
      return [...vehicleList].sort((a, b) => b.year - a.year);
    }
    // Default: recommended (could be based on user preferences)
    return vehicleList;
  }, [searchAlgorithm]);

  const loadVehicles = useCallback(async () => {
    try {
      const user = authAPI.getCurrentUser();
      let data;

      if (user?.country) {
        // Filter by user's country
        data = await vehiclesAPI.search({ country: user.country });
      } else {
        // Fallback to all vehicles if no user
        data = await vehiclesAPI.getAll();
      }

      setVehicles(sortVehicles(data));
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [sortVehicles]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Re-sort vehicles when search algorithm changes
  useEffect(() => {
    setVehicles((currentVehicles) =>
      currentVehicles.length > 0 ? sortVehicles(currentVehicles) : currentVehicles
    );
  }, [searchAlgorithm, sortVehicles]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const user = authAPI.getCurrentUser();
      const params: Record<string, string> = {};

      // Always filter by user's country if logged in
      if (user?.country) {
        params.country = user.country;
      }

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
      transmission: '',
      fuelType: '',
    });
    loadVehicles();
  };

  // Calculate estimated monthly payment (simple calculation)
  const calculateMonthlyPayment = (price: number): number => {
    const downPayment = price * 0.1; // 10% down
    const loanAmount = price - downPayment;
    const interestRate = 0.06; // 6% APR
    const months = 60; // 5 years
    const monthlyRate = interestRate / 12;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
           (Math.pow(1 + monthlyRate, months) - 1);
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
          {enableAdvancedFilters && (
            <>
              <div className="form-group">
                <label>Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </>
          )}
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
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23f0f0f0' width='400' height='200'/%3E%3Ctext x='50%25' y='40%25' font-size='16' text-anchor='middle' fill='%23666' dy='.3em'%3E${vehicle.type.toUpperCase()}%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='14' text-anchor='middle' fill='%23999' dy='.3em'%3EImage Not Available%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                )}
                <h4 style={{ marginBottom: '0.5rem' }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>{vehicle.trim}</p>
                {pricingDisplay === 'monthly-payment' ? (
                  <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4a9eff' }}>
                    {formatCurrency(calculateMonthlyPayment(vehicle.price), vehicle.currency)}/mo
                  </p>
                ) : pricingDisplay === 'both' ? (
                  <>
                    <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4a9eff' }}>
                      {formatCurrency(vehicle.price, vehicle.currency)}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      or {formatCurrency(calculateMonthlyPayment(vehicle.price), vehicle.currency)}/mo
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4a9eff' }}>
                    {formatCurrency(vehicle.price, vehicle.currency)}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <span>{formatMileage(vehicle.mileage)} miles</span>
                  <span>{vehicle.condition}</span>
                </div>
                {showDealerRatings && (
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
