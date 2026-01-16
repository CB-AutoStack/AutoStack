import { useState } from 'react';
import axios from 'axios';
import { valuationsAPI } from '../services/api';
import type { ValuationResponse } from '../types';
import { formatCurrency, formatPercentage } from '../utils/format';
import useRoxFlag from '../hooks/useRoxFlag';

export default function ValuationPage() {
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: 'good',
    currency: 'USD',
  });
  const [valuation, setValuation] = useState<ValuationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reactive feature flag
  const isInstantEnabled = useRoxFlag('enableInstantTradeIn');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const request = {
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        mileage: parseInt(formData.mileage),
        condition: formData.condition,
        currency: formData.currency,
      };

      const result = await valuationsAPI.estimate(request);
      setValuation(result);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to calculate valuation');
      } else {
        setError('Failed to calculate valuation');
      }
      console.error('Valuation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '2rem' }}>Vehicle Trade-In Valuation</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>
            {isInstantEnabled ? 'Get Instant Valuation' : 'Request Valuation'}
          </h3>

          {isInstantEnabled && (
            <div style={{ padding: '1rem', backgroundColor: '#e7f5ff', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#1971c2' }}>
                ✨ Instant valuation enabled! Get your estimate in seconds.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 2020"
                required
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="form-group">
              <label>Make</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="e.g., Honda"
                required
              />
            </div>

            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Civic"
                required
              />
            </div>

            <div className="form-group">
              <label>Mileage</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                placeholder="e.g., 45000"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                required
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>

            {error && (
              <div style={{ padding: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Calculating...' : isInstantEnabled ? 'Get Instant Estimate' : 'Request Valuation'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Valuation Result</h3>

          {!valuation ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#999' }}>
              <p>Enter your vehicle information to get a valuation estimate</p>
            </div>
          ) : (
            <div>
              <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Estimated Trade-In Value
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4a9eff' }}>
                  {formatCurrency(valuation.estimatedValue, valuation.currency)}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#666' }}>Market Value:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {formatCurrency(valuation.marketValue, valuation.currency)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#666' }}>Depreciation Rate:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {formatPercentage(valuation.depreciationRate)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#666' }}>Confidence Level:</span>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {valuation.confidence}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#e7f5ff', borderRadius: '4px', marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#1971c2' }}>
                  This is an estimated value based on current market conditions. Contact a dealer for an official appraisal.
                </p>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                Find Vehicles in This Price Range
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
