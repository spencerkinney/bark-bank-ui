import React from 'react';
import { VStack, Box, Text, Spinner, Button } from '@chakra-ui/react';

const AccountsList = ({ accounts, onAccountSelect, selectedAccountId, isLoading }) => {
  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (!accounts || accounts.length === 0) {
    return <Text>No accounts found.</Text>;
  }

  return (
    <VStack spacing={4} align="stretch">
      {accounts.map((account) => {
        // Check for first and last name in user_detail, fallback to "Unknown User" if missing
        const userName = account?.user_detail?.first_name && account?.user_detail?.last_name
          ? `${account.user_detail.first_name} ${account.user_detail.last_name}`
          : 'Unknown User';

        return (
          <Box
            key={account.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            bg={selectedAccountId === account.id ? 'gray.100' : 'white'}
          >
            <Text fontSize="lg" fontWeight="bold">
              {userName}
            </Text>
            <Text>Account Number: ****{account.account_number?.slice(-4)}</Text>
            <Button mt={2} onClick={() => onAccountSelect(account)}>
              View Account
            </Button>
          </Box>
        );
      })}
    </VStack>
  );
};

export default AccountsList;
