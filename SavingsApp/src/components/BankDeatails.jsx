import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import api from './api';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, useToast } from '@chakra-ui/react';

const BankDeatails = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [expDate, setExpDate] = useState("");
  const toast = useToast();

  const location = useLocation();
  const { email, name, password } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/register', { name, email, password,accountNumber,expDate });
        console.log("API response:", response);
        if(response.status==400 && response.message=="User already exists, try to login"){
            
      toast({
        title: 'User is already Exist Try to Login.',
        description: err.response?.data?.message || err.message || 'Please check your credentials.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
        }

        toast({
          title: 'Registration successful.',
          description: "You have been successfully Registration in.",
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        
      
    } catch (err) {
      console.error("Registration error:", err);


      toast({
        title: 'Registration failed.',
        description: err.response?.data?.message || err.message || 'Please check your credentials.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt="10" p="6" boxShadow="md" borderRadius="md" bg="white">
      <Text fontSize="2xl">Register</Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Account Number</FormLabel>
            <Input
              type="Number"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="password" mt="4" isRequired>
            <FormLabel>Expire Date</FormLabel>
            <Input
              type="date"
              placeholder="Enter ExpireDate"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" color={"blue.500"}>Register</Button>
        </VStack>
      </form>
      <br />
      <p><Text color={"blue"} as={Link} to="/register" size="md">Back</Text></p>
      
      <p>Already have an account? <Text color={"blue"} as={Link} to="/login" size="md">Login</Text></p>
    </Box>
  );
};

export default BankDeatails;