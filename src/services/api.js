// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://barkbankapi-e88bfd94ccc1.herokuapp.com' 
  : 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,  // Note the '/api/' added here
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    // Note: We use axios directly here because the token endpoint is not under /api/
    const response = await axios.post(`${API_BASE_URL}/token/`, { username, password });
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const getAccounts = async () => {
  try {
    const response = await api.get('accounts/');
    return response.data;
  } catch (error) {
    console.error('Get accounts error:', error.response || error);
    throw new Error('Failed to fetch accounts. Please try again later.');
  }
};

export const getAccountDetails = async (accountId) => {
  try {
    const response = await api.get(`accounts/${accountId}/`);
    return response.data;
  } catch (error) {
    console.error('Get account details error:', error.response || error);
    throw new Error('Failed to fetch account details. Please try again later.');
  }
};

export const getAccountBalance = async (accountId) => {
  try {
    const response = await api.get(`accounts/${accountId}/balance/`);
    return response.data;
  } catch (error) {
    console.error('Get account balance error:', error.response || error);
    throw new Error('Failed to fetch account balance. Please try again later.');
  }
};

export const getTransferHistory = async (accountId) => {
  try {
    const response = await api.get(`accounts/${accountId}/transfers/`);
    
    // Sort transfers by timestamp in descending order (latest first)
    const sortedTransfers = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Return only the last 5 transfers
    return sortedTransfers.slice(0, 5);
  } catch (error) {
    console.error('Get transfer history error:', error.response || error);
    throw new Error('Failed to fetch transfer history. Please try again later.');
  }
};

export const createTransfer = async (transferData) => {
  try {
    const response = await api.post('transfers/', transferData);
    return response.data;
  } catch (error) {
    console.error('Create transfer error:', error.response || error);
    throw new Error(error.response?.data?.detail || 'Transfer failed. Please try again later.');
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await api.post('accounts/', accountData);
    return response.data;
  } catch (error) {
    console.error('Create account error:', error.response || error);
    throw new Error('Failed to create account. Please try again later.');
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('users/');
    return response.data;
  } catch (error) {
    console.error('Get users error:', error.response || error);
    throw new Error('Failed to fetch users. Please try again later.');
  }
};

export default api;