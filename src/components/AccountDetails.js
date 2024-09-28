import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from '@chakra-ui/react';
import { getTransferHistory } from '../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatAccountNumber = (accountNumber) => {
  return accountNumber.replace(/(\d{4})/g, '$1 ').trim();
};

const AccountDetails = ({ account }) => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransferHistory();
  }, [account.id]);

  const fetchTransferHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getTransferHistory(account.id);
      setTransfers(history);
    } catch (error) {
      console.error('Failed to fetch transfer history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white">
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{account.user.username}</Heading>
          <Text fontSize="2xl" fontWeight="bold">{formatCurrency(account.balance)}</Text>
        </HStack>
        <Text fontSize="md" color="gray.600">Account Number: {formatAccountNumber(account.account_number)}</Text>
        <Heading size="md">Transfer History</Heading>
        {isLoading ? (
          <Spinner size="xl" alignSelf="center" />
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transfers.map((transfer) => (
                  <Tr key={transfer.id}>
                    <Td>{new Date(transfer.timestamp).toLocaleDateString()}</Td>
                    <Td>
                      {transfer.from_account === account.id 
                        ? `To: ${transfer.to_account_user}` 
                        : `From: ${transfer.from_account_user}`}
                    </Td>
                    <Td isNumeric color={transfer.from_account === account.id ? 'red.500' : 'green.500'}>
                      {formatCurrency(transfer.amount)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AccountDetails;