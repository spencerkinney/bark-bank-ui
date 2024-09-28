import React, { useState, useEffect } from 'react';
import { VStack, HStack, Text } from '@chakra-ui/react';
import Header from './Header';
import SearchBar from './SearchBar';
import AccountsList from './AccountsList';
import AccountDetails from './AccountDetails';
import TransferForm from './TransferForm';
import { useAccounts } from '../contexts/AccountsContext';

const Dashboard = () => {
  const { accounts, isLoading, updateAccount } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);

  useEffect(() => {
    setFilteredAccounts(accounts);
  }, [accounts]);

  const handleSearch = (query) => {
    const filtered = accounts.filter(account => 
      account.name.toLowerCase().includes(query.toLowerCase()) ||
      account.accountNumber.includes(query)
    );
    setFilteredAccounts(filtered);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleTransfer = async (amount, toAccount) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedAccount = {
      ...selectedAccount,
      balance: selectedAccount.balance - parseFloat(amount),
      transactions: [
        { date: new Date().toISOString().split('T')[0], description: `Transfer to ${toAccount}`, amount: -parseFloat(amount) },
        ...selectedAccount.transactions
      ]
    };
    
    updateAccount(updatedAccount);
    setSelectedAccount(updatedAccount);
  };

  return (
    <VStack spacing={8} align="stretch">
      <Header />
      <HStack justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">Accounts</Text>
        <SearchBar onSearch={handleSearch} />
      </HStack>
      <AccountsList 
        accounts={filteredAccounts} 
        isLoading={isLoading}
        onAccountSelect={handleAccountSelect}
      />
      {selectedAccount && (
        <>
          <AccountDetails account={selectedAccount} />
          <TransferForm onTransfer={handleTransfer} />
        </>
      )}
    </VStack>
  );
};

export default Dashboard;