import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehiclesAPI } from '../services/api';
import type { Vehicle } from '../types';
import { formatCurrency, formatMileage, formatDate, getConditionDisplay } from '../utils/format';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadVehicle(id);
    }
  }, [id]);

  const loadVehicle = async (vehicleId: string) => {
    try {
      const data = await vehiclesAPI.getById(vehicleId);
      setVehicle(data);
    } catch (err) {
      setError('Vehicle not found');
      console.error('Failed to load vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading vehicle details...</p></div>;
  }

  if (error || !vehicle) {
    return (
      <div className="container">
        <div className="card">
          <h2>Vehicle Not Found</h2>
          <p>{error}</p>
          <Link to="/search" className="btn btn-primary">Back to Search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/search" style={{ display: 'inline-block', marginBottom: '1rem', color: '#4a9eff' }}>
        ← Back to Search
      </Link>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            {vehicle.images && vehicle.images.length > 0 && (
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            )}
          </div>

          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <h3 style={{ color: '#666', marginBottom: '1.5rem' }}>{vehicle.trim}</h3>

            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4a9eff', marginBottom: '1.5rem' }}>
              {formatCurrency(vehicle.price, vehicle.currency)}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Mileage</p>
                <p style={{ fontWeight: 'bold' }}>{formatMileage(vehicle.mileage)} miles</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Condition</p>
                <p style={{ fontWeight: 'bold' }}>{getConditionDisplay(vehicle.condition)}</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Fuel Type</p>
                <p style={{ fontWeight: 'bold' }}>{vehicle.fuelType}</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Transmission</p>
                <p style={{ fontWeight: 'bold' }}>{vehicle.transmission}</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Drivetrain</p>
                <p style={{ fontWeight: 'bold' }}>{vehicle.drivetrain}</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Location</p>
                <p style={{ fontWeight: 'bold' }}>{vehicle.location}</p>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              Contact Dealer
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              Save to Favorites
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Vehicle Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p><strong>VIN:</strong> {vehicle.vin}</p>
              <p><strong>Exterior Color:</strong> {vehicle.exteriorColor}</p>
              <p><strong>Interior Color:</strong> {vehicle.interiorColor}</p>
            </div>
            <div>
              <p><strong>Status:</strong> {vehicle.status}</p>
              <p><strong>Dealer Rating:</strong> ⭐ {vehicle.dealerRating.toFixed(1)}</p>
              <p><strong>Listed:</strong> {formatDate(vehicle.listingDate)}</p>
            </div>
          </div>
        </div>

        {vehicle.features && vehicle.features.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {vehicle.features.map((feature, index) => (
                <div key={index} style={{ padding: '0.5rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
