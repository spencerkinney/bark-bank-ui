// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://barkbankapi-e88bfd94ccc1.herokuapp.com' 
  : 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
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
    const response = await api.post('/token/', { username, password });
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const getAccounts = async () => {
  try {
    const response = await api.get('/api/accounts/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch accounts. Please try again later.');
  }
};

export const getAccountDetails = async (accountId) => {
  try {
    const response = await api.get(`/api/accounts/${accountId}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch account details. Please try again later.');
  }
};

export const getAccountBalance = async (accountId) => {
  try {
    const response = await api.get(`/api/accounts/${accountId}/balance/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch account balance. Please try again later.');
  }
};

export const getTransferHistory = async (accountId) => {
  try {
    const response = await api.get(`/api/accounts/${accountId}/transfers/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch transfer history. Please try again later.');
  }
};

export const createTransfer = async (transferData) => {
  try {
    const response = await api.post('/api/transfers/', {
      from_account: transferData.from_account,
      to_account: transferData.to_account,
      amount: transferData.amount
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Transfer failed. Please try again later.');
  }
};

export const createAccount = async (userId, accountNumber, initialDeposit) => {
  try {
    const response = await api.post('/api/accounts/', {
      user: userId,
      account_number: accountNumber,
      initial_deposit: initialDeposit.toString(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create account. Please try again later.');
  }
};