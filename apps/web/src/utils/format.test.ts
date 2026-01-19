import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatMileage,
  formatPercentage,
  getVehicleTypeDisplay,
  getConditionDisplay,
} from './format';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    const result = formatCurrency(45990, 'USD');
    expect(result).toContain('45,990');
    expect(result).toContain('$');
  });

  it('formats GBP correctly', () => {
    const result = formatCurrency(32500, 'GBP');
    expect(result).toContain('32,500');
    expect(result).toContain('£');
  });

  it('formats EUR correctly', () => {
    const result = formatCurrency(48900, 'EUR');
    expect(result).toContain('48');
    expect(result).toContain('900');
  });

  it('formats zero correctly', () => {
    const result = formatCurrency(0, 'USD');
    expect(result).toContain('0');
  });

  it('formats large numbers correctly', () => {
    const result = formatCurrency(1234567, 'USD');
    expect(result).toContain('1,234,567');
  });
});

describe('formatMileage', () => {
  it('formats small numbers', () => {
    expect(formatMileage(1234)).toBe('1,234');
  });

  it('formats large numbers', () => {
    expect(formatMileage(123456)).toBe('123,456');
  });

  it('formats zero', () => {
    expect(formatMileage(0)).toBe('0');
  });
});

describe('formatPercentage', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercentage(0.15)).toBe('15.0%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('formats one', () => {
    expect(formatPercentage(1)).toBe('100.0%');
  });

  it('formats small percentages', () => {
    expect(formatPercentage(0.035)).toBe('3.5%');
  });
});

describe('getVehicleTypeDisplay', () => {
  it('formats sedan', () => {
    expect(getVehicleTypeDisplay('sedan')).toBe('Sedan');
  });

  it('formats suv', () => {
    expect(getVehicleTypeDisplay('suv')).toBe('SUV');
  });

  it('formats truck', () => {
    expect(getVehicleTypeDisplay('truck')).toBe('Truck');
  });

  it('handles case insensitivity', () => {
    expect(getVehicleTypeDisplay('SEDAN')).toBe('Sedan');
    expect(getVehicleTypeDisplay('SuV')).toBe('SUV');
  });

  it('returns original for unknown type', () => {
    expect(getVehicleTypeDisplay('unknown')).toBe('unknown');
  });
});

describe('getConditionDisplay', () => {
  it('formats new', () => {
    expect(getConditionDisplay('new')).toBe('New');
  });

  it('formats certified', () => {
    expect(getConditionDisplay('certified')).toBe('Certified Pre-Owned');
  });

  it('formats used', () => {
    expect(getConditionDisplay('used')).toBe('Used');
  });

  it('formats excellent', () => {
    expect(getConditionDisplay('excellent')).toBe('Excellent');
  });

  it('handles case insensitivity', () => {
    expect(getConditionDisplay('NEW')).toBe('New');
    expect(getConditionDisplay('UsEd')).toBe('Used');
  });

  it('returns original for unknown condition', () => {
    expect(getConditionDisplay('unknown')).toBe('unknown');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2024-01-10T00:00:00Z');
    expect(result).toMatch(/January|10|2024/);
  });

  it('handles different date formats', () => {
    const result = formatDate('2024-12-25T12:00:00Z');
    expect(result).toMatch(/December|25|2024/);
  });
});
