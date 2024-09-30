// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import AccountsList from './AccountsList';
import AccountDetails from './AccountDetails';
import TransferForm from './TransferForm';
import CreateAccount from './CreateAccount';
import { useAccounts } from '../contexts/AccountsContext';

const Dashboard = ({ onLogout }) => {
  const { accounts, isLoading, error, updateAccount, refreshAccounts } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toast = useToast();

  useEffect(() => {
    refreshAccounts();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleAccountSelect = async (account) => {
    try {
      const updatedAccount = await updateAccount(account.id);
      setSelectedAccount(updatedAccount);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch account details. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTransferComplete = async () => {
    await refreshAccounts();
    if (selectedAccount) {
      const updatedAccount = await updateAccount(selectedAccount.id);
      setSelectedAccount(updatedAccount);
    }
  };

  const handleAccountCreated = async () => {
    await refreshAccounts();
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
                />
              </Box>
            </Box>
          )}
        </Flex>

        <Box mt={8}>
          <CreateAccount onAccountCreated={handleAccountCreated} />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
