import React from 'react';
import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { AccountsProvider } from './contexts/AccountsContext';
import Dashboard from './components/Dashboard';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'white',
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
  return (
    <ChakraProvider theme={theme}>
      <AccountsProvider>
        <Box maxWidth="1200px" margin="auto" p={4}>
          <Dashboard />
        </Box>
      </AccountsProvider>
    </ChakraProvider>
  );
}

export default App;