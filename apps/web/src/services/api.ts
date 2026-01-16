// API service using Axios for AutoStack
import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  Vehicle,
  VehicleFilter,
  ValuationRequest,
  ValuationResponse,
  Valuation,
} from '../types';

// Create axios instance with base configuration
// Uses relative path 'api' so nginx can proxy to backend services
const apiClient: AxiosInstance = axios.create({
  baseURL: 'api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/vehicles/login', credentials);
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
    const response = await apiClient.get<{ data: Vehicle[]; count: number }>('/vehicles');
    return response.data.data;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get<{ data: Vehicle }>(`/vehicles/${id}`);
    return response.data.data;
  },

  search: async (filter: VehicleFilter): Promise<Vehicle[]> => {
    const response = await apiClient.post<{ data: Vehicle[]; count: number }>(
      '/vehicles/search',
      filter
    );
    return response.data.data;
  },

  getByQuery: async (params: Record<string, string>): Promise<Vehicle[]> => {
    const query = new URLSearchParams(params).toString();
    const response = await apiClient.get<{ data: Vehicle[]; count: number }>(
      `/vehicles?${query}`
    );
    return response.data.data;
  },
};

// Valuations API
export const valuationsAPI = {
  getAll: async (): Promise<Valuation[]> => {
    const response = await apiClient.get<{ data: Valuation[]; count: number }>(
      '/valuations'
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Valuation> => {
    const response = await apiClient.get<{ data: Valuation }>(`/valuations/${id}`);
    return response.data.data;
  },

  estimate: async (request: ValuationRequest): Promise<ValuationResponse> => {
    const response = await apiClient.post<{ data: ValuationResponse }>(
      '/valuations/estimate',
      request
    );
    return response.data.data;
  },

  getSummary: async (): Promise<any> => {
    const response = await apiClient.get('/valuations/summary');
    return response.data;
  },
};
