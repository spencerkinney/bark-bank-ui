import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { createTransfer } from '../services/api';

const formatCurrency = (value) => {
  const numericValue = parseFloat(value) / 100;
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(numericValue);
};

const formatAccountNumber = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19); // 16 digits + 3 spaces
};

const TransferForm = ({ onTransferComplete, currentBalance, fromAccount }) => {
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('$0.00');
  const [toAccount, setToAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setAmount(rawValue);
    setDisplayAmount(formatCurrency(rawValue));
  };

  const handleAccountChange = (e) => {
    const formatted = formatAccountNumber(e.target.value);
    setToAccount(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount) / 100;
    const toAccountNumber = toAccount.replace(/\s/g, '');

    if (isNaN(numericAmount) || numericAmount <= 0 || toAccountNumber.length !== 16) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount and 16-digit account number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (numericAmount > parseFloat(currentBalance)) {
      toast({
        title: 'Error',
        description: 'Insufficient funds for transfer',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createTransfer({
        from_account: fromAccount,
        to_account: toAccountNumber,
        amount: numericAmount.toFixed(2)
      });
      setAmount('');
      setDisplayAmount('$0.00');
      setToAccount('');
      toast({
        title: 'Transfer Successful',
        description: `Transferred ${formatCurrency(amount)} to account ${toAccountNumber}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onTransferComplete(result);
    } catch (error) {
      toast({
        title: 'Transfer Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} borderWidth={1} borderRadius="lg" p={6} bg="white">
      <VStack spacing={4} align="stretch">
        <Heading size="md">New Transfer</Heading>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
            <Input
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="$0.00"
              type="text"
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel>To Account</FormLabel>
          <Input
            value={toAccount}
            onChange={handleAccountChange}
            placeholder="0000 0000 0000 0000"
            type="text"
          />
        </FormControl>
        <Button 
          type="submit" 
          colorScheme="blue" 
          isLoading={isLoading}
          loadingText="Transferring"
        >
          Transfer
        </Button>
      </VStack>
    </Box>
  );
};

export default TransferForm;