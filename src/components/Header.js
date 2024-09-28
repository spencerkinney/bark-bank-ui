import React from 'react';
import { HStack, Text, Box } from '@chakra-ui/react';

const Header = () => (
  <HStack justify="space-between" py={4}>
    <HStack spacing={2}>
      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
        bark<Box as="span" color="blue.500">.</Box>
      </Text>
    </HStack>
    <Text fontSize="sm" fontWeight="medium" color="gray.600">Customer Support Portal</Text>
  </HStack>
);

export default Header;