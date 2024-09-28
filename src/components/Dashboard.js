import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import AccountsList from './AccountsList';
import AccountDetails from './AccountDetails';
import TransferForm from './TransferForm';
import { getAccounts, getAccountDetails } from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = async (account) => {
    try {
      const accountDetails = await getAccountDetails(account.id);
      setSelectedAccount(accountDetails);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }
  };

  const handleTransferComplete = async (result) => {
    if (selectedAccount) {
      const updatedAccount = await getAccountDetails(selectedAccount.id);
      setSelectedAccount(updatedAccount);
    }
    await fetchAccounts();
  };

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Container maxW="container.xl" py={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading size="xl">Bark Bank</Heading>
          <Flex alignItems="center">
            <Text fontSize="sm" color="gray.500" mr={4}>Customer Support Portal</Text>
            <Button
              leftIcon={<FiLogOut />}
              onClick={onLogout}
              variant="ghost"
              size="sm"
            >
              Logout
            </Button>
          </Flex>
        </Flex>
        
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          <Box flex={1}>
            <AccountsList 
              accounts={accounts} 
              onAccountSelect={handleAccountSelect}
              selectedAccountId={selectedAccount?.id}
              isLoading={isLoading}
            />
          </Box>
          
          {selectedAccount && (
            <Box flex={1}>
              <AccountDetails account={selectedAccount} />
              <Box mt={6}>
                <TransferForm 
                  onTransferComplete={handleTransferComplete}
                  currentBalance={selectedAccount.balance}
                  fromAccount={selectedAccount.id}
                />
              </Box>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Dashboard;