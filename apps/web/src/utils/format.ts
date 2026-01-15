/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const locale = getCurrencyLocale(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get locale string for a currency
 */
function getCurrencyLocale(currency: string): string {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'de-DE',
    CAD: 'en-CA',
    AUD: 'en-AU',
  };
  return localeMap[currency] || 'en-US';
}

/**
 * Format a date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format mileage with commas
 */
export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('en-US').format(mileage);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Get display name for vehicle type
 */
export function getVehicleTypeDisplay(type: string): string {
  const typeMap: Record<string, string> = {
    sedan: 'Sedan',
    suv: 'SUV',
    truck: 'Truck',
    hatchback: 'Hatchback',
    wagon: 'Wagon',
    coupe: 'Coupe',
    van: 'Van',
    convertible: 'Convertible',
  };
  return typeMap[type.toLowerCase()] || type;
}

/**
 * Get display name for condition
 */
export function getConditionDisplay(condition: string): string {
  const conditionMap: Record<string, string> = {
    new: 'New',
    certified: 'Certified Pre-Owned',
    used: 'Used',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };
  return conditionMap[condition.toLowerCase()] || condition;
}
