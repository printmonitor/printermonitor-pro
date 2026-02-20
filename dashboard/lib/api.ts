import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email: string, password: string, fullName: string) =>
    api.post('/auth/register', { email, password, full_name: fullName }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  me: () => api.get('/auth/me'),
};

// Printers API
export const printersAPI = {
  list: () => api.get('/printers'),
  get: (id: number) => api.get(`/printers/${id}`),
  delete: (id: number) => api.delete(`/printers/${id}`),
};

// Metrics API
export const metricsAPI = {
  summary: () => api.get('/metrics/summary'),
  history: (printerId: number, days: number = 7) =>
    api.get(`/metrics/${printerId}?days=${days}`),
};

// Devices API
export const devicesAPI = {
  list: () => api.get('/devices'),
  register: (name: string, version: string) =>
    api.post('/devices/register', { name, version }),
};

// Remote Subnets API
export const remoteSubnetsAPI = {
  list: () => api.get('/remote-subnets'),
  create: (subnet: string, description?: string, deviceId?: number) =>
    api.post('/remote-subnets', { subnet, description, device_id: deviceId }),
  update: (id: number, data: any) =>
    api.patch(`/remote-subnets/${id}`, data),
  delete: (id: number) =>
    api.delete(`/remote-subnets/${id}`),
};
