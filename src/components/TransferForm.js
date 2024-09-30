// components/TransferForm.js
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

const TransferForm = ({ onTransferComplete, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('$0.00');
  const [fromAccountNumber, setFromAccountNumber] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setAmount(rawValue);
    setDisplayAmount(formatCurrency(rawValue));
  };

  const handleFromAccountChange = (e) => {
    const formatted = formatAccountNumber(e.target.value);
    setFromAccountNumber(formatted);
  };

  const handleToAccountChange = (e) => {
    const formatted = formatAccountNumber(e.target.value);
    setToAccountNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount) / 100;
    const fromAccountNumberClean = fromAccountNumber.replace(/\s/g, '');
    const toAccountNumberClean = toAccountNumber.replace(/\s/g, '');

    if (isNaN(numericAmount) || numericAmount <= 0 || fromAccountNumberClean.length !== 16 || toAccountNumberClean.length !== 16) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount and 16-digit account numbers for both accounts',
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
        from_account_number: fromAccountNumberClean,
        to_account_number: toAccountNumberClean,
        amount: numericAmount.toFixed(2)
      });
      setAmount('');
      setDisplayAmount('$0.00');
      setFromAccountNumber('');
      setToAccountNumber('');
      toast({
        title: 'Transfer Successful',
        description: `Transferred ${formatCurrency(amount)} from account ${fromAccountNumberClean} to account ${toAccountNumberClean}`,
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
          <FormLabel>From Account</FormLabel>
          <Input
            value={fromAccountNumber}
            onChange={handleFromAccountChange}
            placeholder="0000 0000 0000 0000"
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>To Account</FormLabel>
          <Input
            value={toAccountNumber}
            onChange={handleToAccountChange}
            placeholder="0000 0000 0000 0000"
            type="text"
          />
        </FormControl>
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
