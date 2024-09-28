import React, { createContext, useState, useContext, useEffect } from 'react';

const AccountsContext = createContext();

export const useAccounts = () => useContext(AccountsContext);

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch accounts
    const fetchAccounts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts([
        {
          id: '1234',
          name: 'John Doe',
          accountNumber: '1234',
          balance: 5000,
          transactions: [
            { date: '2023-09-27', description: 'Deposit', amount: 1000 },
            { date: '2023-09-26', description: 'Withdrawal', amount: -500 },
          ],
          profilePicture: 'https://media.licdn.com/dms/image/v2/D5603AQGEuyDy-wIvFw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1697874981733?e=1732752000&v=beta&t=CfN3fzsy4OFpb16YNzXwPPD0yusei_bdQxJFBuHamu8'
        },
        {
          id: '5678',
          name: 'Jane Smith',
          accountNumber: '5678',
          balance: 7500,
          transactions: [
            { date: '2023-09-28', description: 'Salary', amount: 3000 },
            { date: '2023-09-25', description: 'Online Purchase', amount: -200 },
          ],
          profilePicture: 'https://example.com/jane-smith.jpg'
        },
        // Add more mock accounts as needed
      ]);
      setIsLoading(false);
    };

    fetchAccounts();
  }, []);

  const updateAccount = (updatedAccount) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === updatedAccount.id ? updatedAccount : account
      )
    );
  };

  return (
    <AccountsContext.Provider value={{ accounts, isLoading, updateAccount }}>
      {children}
    </AccountsContext.Provider>
  );
};