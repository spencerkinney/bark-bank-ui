// contexts/AccountsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAccounts, getAccountDetails } from '../services/api';

const AccountsContext = createContext();

export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const fetchedAccounts = await getAccounts();
        setAccounts(fetchedAccounts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

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
      throw err;
    }
  };

  const refreshAccounts = async () => {
    setIsLoading(true);
    try {
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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