import React from 'react';
import { Box, VStack, HStack, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const AccountDetails = ({ account }) => {
  return (
    <VStack spacing={6} align="stretch" bg="white" p={6} borderRadius="md" boxShadow="sm">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="semibold">{account.name}</Text>
        <Text fontSize="2xl" fontWeight="semibold">Balance: ${account.balance}</Text>
      </HStack>
      <Box>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>Recent Transactions</Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {account.transactions.map((transaction, index) => (
              <Tr key={index}>
                <Td>{transaction.date}</Td>
                <Td>{transaction.description}</Td>
                <Td isNumeric>${transaction.amount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default AccountDetails;