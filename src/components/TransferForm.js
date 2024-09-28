import React, { useState, useEffect } from 'react';
import { VStack, HStack, Input, Button, Text, useToast, InputGroup, InputLeftElement, FormControl, FormErrorMessage } from '@chakra-ui/react';

const TransferForm = ({ onTransfer, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const formatAmount = (value) => {
    const number = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(number) ? '' : number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d.]/g, '');
    setAmount(rawValue);
    setFormattedAmount(formatAmount(rawValue));
  };

  const handleToAccountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setToAccount(value.replace(/(\d{4})(?=\d)/g, '$1 '));
  };

  useEffect(() => {
    validateForm();
  }, [amount, toAccount]);

  const validateForm = () => {
    const newErrors = {};
    if (parseFloat(amount) > currentBalance) {
      newErrors.amount = "Transfer amount exceeds available balance";
    }
    if (parseFloat(amount) <= 0) {
      newErrors.amount = "Transfer amount must be greater than zero";
    }
    if (toAccount.length !== 19) {  // 16 digits + 3 spaces
      newErrors.toAccount = "Account number must be 16 digits";
    }
    setErrors(newErrors);
  };

  const handleTransfer = () => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors before submitting",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onTransfer(parseFloat(amount), toAccount.replace(/\s/g, ''));
    toast({
      title: "Transfer Successful",
      description: `${formattedAmount} transferred to account ${toAccount}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setAmount('');
    setFormattedAmount('');
    setToAccount('');
  };

  return (
    <VStack spacing={4} align="stretch" bg="white" p={6} borderRadius="md" boxShadow="sm">
      <Text fontSize="xl" fontWeight="bold">New Transfer</Text>
      <FormControl isInvalid={errors.amount}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
            children="$"
          />
          <Input
            placeholder="0.00"
            value={formattedAmount}
            onChange={handleAmountChange}
            type="text"
            inputMode="decimal"
          />
        </InputGroup>
        <FormErrorMessage>{errors.amount}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.toAccount}>
        <Input
          placeholder="Account Number (16 digits)"
          value={toAccount}
          onChange={handleToAccountChange}
          maxLength={19}
        />
        <FormErrorMessage>{errors.toAccount}</FormErrorMessage>
      </FormControl>
      <Button 
        onClick={handleTransfer} 
        bg="black" 
        color="white" 
        _hover={{ bg: 'gray.800' }} 
        isDisabled={Object.keys(errors).length > 0}
      >
        Transfer
      </Button>
    </VStack>
  );
};

export default TransferForm;