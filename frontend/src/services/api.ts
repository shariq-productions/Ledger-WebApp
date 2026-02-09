/**
 * API service for backend communication
 */
import axios from 'axios';
import type { Party, TransactionType, Transaction, OutstandingTotal } from '../types';
import { getStoredToken, clearStoredToken } from '../utils/authStorage';

// const API_BASE_URL = '/api/v1';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Bearer token to all requests
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear token and trigger re-login (handled by component)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearStoredToken();
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(err);
  }
);

// Auth API (no token required for login)
export const authAPI = {
  login: (login_id: string, password: string) =>
    api.post<{ access_token: string; token_type: string; expires_in_hours: number }>(
      'https://ledger-webapp.onrender.com/api/v1/auth/login',
      { login_id, password }
    ),
};

// Party APIs (trailing slashes to avoid 307 redirect - redirect drops Authorization header)
export const partyAPI = {
  getAll: () => api.get<Party[]>('https://ledger-webapp.onrender.com/api/v1/parties/'),
  getById: (id: number) => api.get<Party>(`/https://ledger-webapp.onrenderparties/${id}`),
  create: (data: Omit<Party, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Party>('https://ledger-webapp.onrender.com/api/v1/parties/', data),
  update: (id: number, data: Partial<Party>) => 
    api.put<Party>(`/https://ledger-webapp.onrenderparties/${id}`, data),
  search: (searchTerm: string) => api.get<Party[]>(`/https://ledger-webapp.onrenderparties/search/${searchTerm}`),
  delete: (id: number) => api.delete(`https://ledger-webapp.onrender.com/api/v1/parties/${id}`),
};

// Transaction Type APIs
export const transactionTypeAPI = {
  getAll: () => api.get<TransactionType[]>('/transaction-types/'),
  getById: (id: number) => api.get<TransactionType>(`/https://ledger-webapp.onrendertransaction-types/${id}`),
  create: (data: Omit<TransactionType, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<TransactionType>('/transaction-types/', data),
  update: (id: number, data: Partial<TransactionType>) => 
    api.put<TransactionType>(`/https://ledger-webapp.onrendertransaction-types/${id}`, data),
  delete: (id: number) => api.delete(`https://ledger-webapp.onrender.com/api/v1/transaction-types/${id}`),
};

// Transaction APIs
export const transactionAPI = {
  getAll: (params?: { party_filter?: string; date_start?: string; date_end?: string }) => 
    api.get<Transaction[]>('https://ledger-webapp.onrender.com/api/v1/transactions/', { params }),
  getById: (id: number) => api.get<Transaction>(`/https://ledger-webapp.onrendertransactions/${id}`),
  create: (data: Omit<Transaction, 'id' | 'serial_number' | 'created_at' | 'updated_at'>) => 
    api.post<Transaction>('/transactions/', data),
  update: (id: number, data: Partial<Transaction>) => 
    api.put<Transaction>(`/https://ledger-webapp.onrendertransactions/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
  getOutstandingTotal: (params?: { party_filter?: string; date_end?: string }) =>
    api.get<OutstandingTotal>('/transactions/outstanding/total', { params }),
};
