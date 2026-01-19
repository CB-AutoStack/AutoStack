import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { vehiclesAPI } from '../services/api';
import type { Vehicle } from '../types';
import { formatCurrency } from '../utils/format';

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedVehicles();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const vehicles = await vehiclesAPI.getAll();
      // Show first 6 vehicles as featured
      setFeaturedVehicles(vehicles.slice(0, 6));
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section className="hero" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Find Your Perfect Vehicle
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Browse thousands of quality vehicles from trusted dealers worldwide
        </p>
        <Link to="/search" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
          Browse All Vehicles
        </Link>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Featured Vehicles</h3>
        {loading ? (
          <p>Loading vehicles...</p>
        ) : (
          <div className="grid">
            {featuredVehicles.map((vehicle) => (
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
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {vehicle.mileage.toLocaleString()} miles • {vehicle.location}
                </p>
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
        )}
      </section>

      <section style={{ marginTop: '4rem', padding: '3rem 0', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            Know Your Trade-In Value
          </h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Get an instant estimate for your current vehicle
          </p>
          <Link to="/valuation" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
            Get Instant Valuation
          </Link>
        </div>
      </section>
    </div>
  );
}
