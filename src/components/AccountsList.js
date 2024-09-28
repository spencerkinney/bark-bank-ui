import React from 'react';
import { VStack, HStack, Text, Avatar, Box, Skeleton } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const AccountItem = ({ account, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <HStack 
      p={4} 
      borderWidth={1} 
      borderRadius="lg" 
      cursor="pointer" 
      onClick={() => onSelect(account)}
      _hover={{ bg: 'gray.50', borderColor: 'blue.500' }}
      transition="all 0.2s"
    >
      <Avatar size="md" src={account.profilePicture} name={account.name} />
      <Box flex={1}>
        <Text fontWeight="bold">{account.name}</Text>
        <Text fontSize="sm" color="gray.500">Account: {account.accountNumber}</Text>
      </Box>
      <Text fontWeight="bold">${account.balance.toFixed(2)}</Text>
    </HStack>
  </motion.div>
);

const AccountsList = ({ accounts, isLoading, onAccountSelect }) => (
  <VStack spacing={4} align="stretch">
    {isLoading ? (
      Array(3).fill().map((_, i) => (
        <Skeleton key={i} height="80px" />
      ))
    ) : (
      accounts.map(account => (
        <AccountItem 
          key={account.id} 
          account={account} 
          onSelect={onAccountSelect} 
        />
      ))
    )}
  </VStack>
);

export default AccountsList;