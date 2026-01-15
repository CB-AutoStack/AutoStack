import axios, { AxiosInstance } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  Vehicle,
  VehicleFilter,
  ValuationRequest,
  ValuationResponse,
  Valuation,
} from '../types';

// API base URLs from environment
const INVENTORY_API_URL = import.meta.env.VITE_API_INVENTORY_URL || 'http://localhost:8001';
const VALUATIONS_API_URL = import.meta.env.VITE_API_VALUATIONS_URL || 'http://localhost:8002';

// Create axios instances
const inventoryAPI: AxiosInstance = axios.create({
  baseURL: INVENTORY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const valuationsAPI: AxiosInstance = axios.create({
  baseURL: VALUATIONS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

addAuthInterceptor(inventoryAPI);
addAuthInterceptor(valuationsAPI);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await inventoryAPI.post<LoginResponse>('/api/v1/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await inventoryAPI.get<{ data: Vehicle[]; count: number }>('/api/v1/vehicles');
    return response.data.data;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const response = await inventoryAPI.get<{ data: Vehicle }>(`/api/v1/vehicles/${id}`);
    return response.data.data;
  },

  search: async (filter: VehicleFilter): Promise<Vehicle[]> => {
    const response = await inventoryAPI.post<{ data: Vehicle[]; count: number }>(
      '/api/v1/vehicles/search',
      filter
    );
    return response.data.data;
  },

  getByQuery: async (params: Record<string, string>): Promise<Vehicle[]> => {
    const query = new URLSearchParams(params).toString();
    const response = await inventoryAPI.get<{ data: Vehicle[]; count: number }>(
      `/api/v1/vehicles?${query}`
    );
    return response.data.data;
  },
};

// Valuations API
export const valuationsAPI = {
  getAll: async (): Promise<Valuation[]> => {
    const response = await valuationsAPI.get<{ data: Valuation[]; count: number }>(
      '/api/v1/valuations'
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Valuation> => {
    const response = await valuationsAPI.get<{ data: Valuation }>(`/api/v1/valuations/${id}`);
    return response.data.data;
  },

  estimate: async (request: ValuationRequest): Promise<ValuationResponse> => {
    const response = await valuationsAPI.post<{ data: ValuationResponse }>(
      '/api/v1/valuations/estimate',
      request
    );
    return response.data.data;
  },

  getSummary: async (): Promise<any> => {
    const response = await valuationsAPI.get('/api/v1/valuations/summary');
    return response.data;
  },
};

export { inventoryAPI, valuationsAPI };
