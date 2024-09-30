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

const AccountDetails = ({ account }) => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account?.id) {
      fetchTransferHistory();
    }
  }, [account?.id]);

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

  // Check for first and last name, fallback to "Unknown User" if missing
  const userName = account?.user?.first_name && account?.user?.last_name
    ? `${account.user.first_name} ${account.user.last_name}`
    : 'Unknown User';

  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white">
      <VStack align="stretch" spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">{userName}</Heading>
          <Text fontSize="2xl" fontWeight="bold">{formatCurrency(account?.balance)}</Text>
        </HStack>
        <Text fontSize="md" color="gray.600">
          Account Number: ****{account?.account_number?.slice(-4) || '****'}
        </Text>
        <Heading size="md">Recent Transfers</Heading>
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
                        ? `To: ****${transfer.to_account?.account_number?.slice(-4) || '****'}`
                        : `From: ****${transfer.from_account?.account_number?.slice(-4) || '****'}`}
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
