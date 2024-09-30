// contexts/AccountsContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAccounts, getAccountDetails } from '../services/api';

const AccountsContext = createContext();

export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching accounts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const updateAccount = async (accountId) => {
    try {
      const updatedAccount = await getAccountDetails(accountId);
      setAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.id === accountId ? updatedAccount : account
        )
      );
      return updatedAccount;
    } catch (err) {
      setError(err.message);
      console.error('Error updating account:', err);
      throw err;
    }
  };

  const refreshAccounts = async () => {
    await fetchAccounts();
  };

  return (
    <AccountsContext.Provider value={{ 
      accounts, 
      isLoading, 
      error, 
      updateAccount,
      refreshAccounts
    }}>
      {children}
    </AccountsContext.Provider>
  );
};