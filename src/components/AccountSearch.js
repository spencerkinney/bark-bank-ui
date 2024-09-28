import React, { useState } from 'react';
import { Input, Button, HStack, VStack, Text, Box } from '@chakra-ui/react';

const AccountSearch = ({ onAccountFound }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const mockAccounts = [
    { accountNumber: '1234', name: 'John Doe' },
    { accountNumber: '5678', name: 'Jane Smith' },
    { accountNumber: '9101', name: 'Bob Johnson' },
  ];

  const handleSearch = () => {
    // In a real app, this would be an API call
    const account = mockAccounts.find(a => a.accountNumber === query);
    if (account) {
      onAccountFound({
        ...account,
        balance: 5000,
        transactions: [
          { date: '2023-09-27', description: 'Deposit', amount: 1000 },
          { date: '2023-09-26', description: 'Withdrawal', amount: -500 },
        ],
      });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSuggestions(
      mockAccounts.filter(a => 
        a.accountNumber.includes(value) || 
        a.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSuggestionClick = (account) => {
    setQuery(account.accountNumber);
    setSuggestions([]);
    handleSearch();
  };

  return (
    <VStack align="stretch">
      <HStack>
        <Input 
          placeholder="Search by account number or name" 
          value={query}
          onChange={handleInputChange}
        />
        <Button colorScheme="brand" onClick={handleSearch}>Search</Button>
      </HStack>
      {suggestions.length > 0 && (
        <Box borderWidth={1} borderRadius="md" mt={2}>
          {suggestions.map(account => (
            <Box 
              key={account.accountNumber} 
              p={2} 
              _hover={{ bg: 'gray.100' }}
              cursor="pointer"
              onClick={() => handleSuggestionClick(account)}
            >
              <Text>{account.name} - {account.accountNumber}</Text>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  );
};

export default AccountSearch;