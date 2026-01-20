import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehiclesAPI } from '../services/api';
import type { Vehicle } from '../types';
import { formatCurrency, formatMileage, formatDate, getConditionDisplay } from '../utils/format';
import useRoxFlag from '../hooks/useRoxFlag';
import useRoxVariant from '../hooks/useRoxVariant';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeMonths, setFinanceMonths] = useState('60');

  // Feature flags
  const showFinancingCalculator = useRoxFlag('showFinancingCalculator');
  const enable360Photos = useRoxFlag('enable360Photos');
  const vehicleRecommendations = useRoxVariant('vehicleRecommendations');

  useEffect(() => {
    if (id) {
      loadVehicle(id);
    }
  }, [id]);

  const loadVehicle = async (vehicleId: string) => {
    try {
      const data = await vehiclesAPI.getById(vehicleId);
      setVehicle(data);
      setFinanceAmount(data.price.toString());
    } catch (err) {
      setError('Vehicle not found');
      console.error('Failed to load vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly payment for financing calculator
  const calculatePayment = (): number => {
    const principal = parseFloat(financeAmount) || 0;
    const months = parseInt(financeMonths) || 60;
    const interestRate = 0.06; // 6% APR
    const monthlyRate = interestRate / 12;
    if (principal === 0 || months === 0) return 0;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
           (Math.pow(1 + monthlyRate, months) - 1);
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
              <div style={{ position: 'relative' }}>
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23f0f0f0' width='800' height='400'/%3E%3Ctext x='50%25' y='45%25' font-size='24' text-anchor='middle' fill='%23666' dy='.3em'%3E${vehicle.type.toUpperCase()}%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='18' text-anchor='middle' fill='%23999' dy='.3em'%3EImage Not Available%3C/text%3E%3C/svg%3E`;
                  }}
                />
                {enable360Photos && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#4a9eff',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}>
                    🔄 360° View Available
                  </div>
                )}
              </div>
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

            {showFinancingCalculator && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Finance Calculator</h4>
                <div className="form-group">
                  <label>Loan Amount</label>
                  <input
                    type="number"
                    value={financeAmount}
                    onChange={(e) => setFinanceAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="form-group">
                  <label>Loan Term</label>
                  <select value={financeMonths} onChange={(e) => setFinanceMonths(e.target.value)}>
                    <option value="36">36 months (3 years)</option>
                    <option value="48">48 months (4 years)</option>
                    <option value="60">60 months (5 years)</option>
                    <option value="72">72 months (6 years)</option>
                  </select>
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px' }}>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Estimated Monthly Payment</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4a9eff' }}>
                    {formatCurrency(calculatePayment(), vehicle.currency)}/mo
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                    Based on 6% APR. Actual rates may vary.
                  </p>
                </div>
              </div>
            )}
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

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>You Might Also Like</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            {vehicleRecommendations === 'price-based' && 'Based on similar price range'}
            {vehicleRecommendations === 'feature-based' && 'Based on similar features and specifications'}
            {vehicleRecommendations === 'ai-powered' && 'Personalized recommendations powered by AI'}
          </p>
          <Link to="/search" className="btn btn-primary">
            Browse Similar Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
}
