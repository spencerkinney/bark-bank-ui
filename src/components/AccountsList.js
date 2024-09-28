import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Avatar,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

const AccountItem = ({ account, onSelect, isSelected }) => (
  <HStack 
    p={4} 
    borderWidth={1} 
    borderRadius="lg" 
    cursor="pointer" 
    onClick={() => onSelect(account)}
    bg={isSelected ? 'blue.50' : 'white'}
    borderColor={isSelected ? 'blue.500' : 'gray.200'}
    _hover={{ bg: isSelected ? 'blue.100' : 'gray.50', borderColor: 'blue.500' }}
    transition="all 0.2s"
    alignItems="flex-start"
  >
    <Avatar size="md" name={account.user.username} src={account.profile_picture} />
    <Box flex={1}>
      <Text fontWeight="bold" fontSize="md" noOfLines={1}>{account.user.username}'s Account</Text>
      <Text fontSize="sm" color="gray.500">Account: {account.account_number}</Text>
    </Box>
    <Text fontWeight="bold" fontSize="md">${parseFloat(account.balance).toFixed(2)}</Text>
  </HStack>
);

const AccountsList = ({ accounts, onAccountSelect, selectedAccountId, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAccounts = accounts.filter(account => 
    account.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.account_number.includes(searchQuery)
  );

  return (
    <VStack spacing={4} align="stretch">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<FiSearch color="gray.400" />} />
        <Input 
          placeholder="Search accounts" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      {isLoading ? (
        <Text>Loading accounts...</Text>
      ) : (
        filteredAccounts.map(account => (
          <AccountItem 
            key={account.id} 
            account={account} 
            onSelect={onAccountSelect}
            isSelected={account.id === selectedAccountId}
          />
        ))
      )}
    </VStack>
  );
};

export default AccountsList;