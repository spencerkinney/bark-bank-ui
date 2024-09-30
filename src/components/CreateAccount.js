import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Input,
    Button,
    Heading,
    FormControl,
    FormLabel,
    useToast,
    Select,
    Spinner,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { createAccount, getUsers } from '../services/api';

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

const CreateAccount = ({ onAccountCreated }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [displayAmount, setDisplayAmount] = useState('$0.00');
    const [initialDeposit, setInitialDeposit] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                toast({
                    title: 'Error loading users',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [toast]);

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        const accountNumberClean = accountNumber.replace(/\s/g, '');
        const numericAmount = parseFloat(initialDeposit) / 100;

        if (!selectedUser || !accountNumberClean || isNaN(numericAmount) || numericAmount <= 0 || accountNumberClean.length !== 16) {
            toast({
                title: 'Invalid Input',
                description: 'Please enter a valid 16-digit account number and positive initial deposit.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        const payload = {
            user: selectedUser,
            account_number: accountNumberClean,
            initial_deposit: numericAmount.toFixed(2)
        };

        try {
            await createAccount(payload);
            toast({
                title: 'Account Created',
                description: `Account ${accountNumberClean} has been successfully created.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onAccountCreated();
            setAccountNumber('');
            setInitialDeposit('');
            setDisplayAmount('$0.00');
            setSelectedUser('');
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccountChange = (e) => {
        const formatted = formatAccountNumber(e.target.value);
        setAccountNumber(formatted);
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, '');
        setInitialDeposit(rawValue);
        setDisplayAmount(formatCurrency(rawValue));
    };

    return (
        <Box
            borderWidth={1}
            borderRadius="lg"
            p={6}
            bg="white"
            maxW="lg"
            mx="auto"
            mt={8}
            boxShadow="lg"
        >
            <VStack spacing={4} as="form" onSubmit={handleCreateAccount}>
                <Heading size="lg" mb={4}>
                    Create New Account
                </Heading>

                {loadingUsers ? (
                    <Spinner size="xl" alignSelf="center" />
                ) : (
                    <FormControl id="user" isRequired>
                        <FormLabel>Select User</FormLabel>
                        <Select
                            placeholder="Select User"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username} ({user.email})
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <FormControl id="account-number" isRequired>
                    <FormLabel>Account Number</FormLabel>
                    <Input
                        placeholder="0000 0000 0000 0000"
                        value={accountNumber}
                        onChange={handleAccountChange}
                        maxLength={19}
                    />
                </FormControl>

                <FormControl id="initial-deposit" isRequired>
                    <FormLabel>Initial Deposit</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="$" />
                        <Input
                            placeholder="$0.00"
                            value={displayAmount}
                            onChange={handleAmountChange}
                            type="text"
                        />
                    </InputGroup>
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Creating Account"
                    width="full"
                >
                    Create Account
                </Button>
            </VStack>
        </Box>
    );
};

export default CreateAccount;
