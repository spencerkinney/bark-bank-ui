// components/Login.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import { login } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const usernameRef = useRef(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      height="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="white"
    >
      <Box width="100%" maxWidth="360px" p={6}>
        <VStack spacing={4} as="form" onSubmit={handleLogin} align="stretch">
          <Heading size="xl" fontWeight="bold" color="black" mb={1}>
            Welcome to Bark
          </Heading>
          <Text fontSize="md" color="gray.600" mb={4}>Sign in to your account</Text>
          <Input
            ref={usernameRef}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="lg"
            variant="filled"
            bg="gray.100"
            border="none"
            borderRadius="full"
            _placeholder={{ color: "gray.500" }}
            _focus={{ bg: "gray.200", boxShadow: "none" }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            variant="filled"
            bg="gray.100"
            border="none"
            borderRadius="full"
            _placeholder={{ color: "gray.500" }}
            _focus={{ bg: "gray.200", boxShadow: "none" }}
          />
          <Button 
            type="submit" 
            width="100%" 
            bg="black"
            color="white"
            size="lg"
            mt={2}
            isLoading={isLoading}
            loadingText="Signing In"
            borderRadius="full"
            _hover={{ bg: 'gray.800' }}
          >
            Sign In
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
