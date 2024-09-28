import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AccountsProvider } from './contexts/AccountsContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  colors: {
    brand: {
      50: '#f7fafc',
      500: '#1a202c',
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
      },
      variants: {
        solid: {
          bg: 'black',
          color: 'white',
          _hover: {
            bg: 'gray.800',
          },
        },
        outline: {
          borderColor: 'black',
          color: 'black',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'full',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
          } />
          <Route path="/" element={
            isAuthenticated ? (
              <AccountsProvider>
                <Box maxWidth="1200px" margin="auto" p={4}>
                  <Dashboard onLogout={handleLogout} />
                </Box>
              </AccountsProvider>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
