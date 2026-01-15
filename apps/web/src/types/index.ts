export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  preferredCurrency: string;
  roles: string[];
}

export interface Vehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  type: string;
  condition: string;
  mileage: number;
  price: number;
  currency: string;
  country: string;
  status: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  features: string[];
  images: string[];
  dealerRating: number;
  location: string;
  listingDate: string;
}

export interface VehicleFilter {
  make?: string;
  model?: string;
  type?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  country?: string;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  vehicleTypes?: string[];
}

export interface Valuation {
  id: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: string;
  estimatedValue: number;
  marketValue: number;
  depreciationRate: number;
  calculatedAt: string;
}

export interface ValuationRequest {
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: string;
  currency?: string;
}

export interface ValuationResponse {
  estimatedValue: number;
  marketValue: number;
  depreciationRate: number;
  currency: string;
  confidence: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
