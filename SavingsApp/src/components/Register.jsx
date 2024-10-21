import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FormControl, FormLabel, Box, Button, Input, Text, VStack, useToast } from '@chakra-ui/react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const navigate = useNavigate();


  const handleSubmit = () => {
    navigate('/account', { state: { email, name, password } });

  };

  
  return (
    <Box maxW="sm" mx="auto" mt="10" p="6" boxShadow="md" borderRadius="md" >
      <Text fontSize="2xl">Register</Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormControl>
          
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
         
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          
          <Button type="submit" color={"blue.500"} >Add Account</Button>
        </VStack>
      </form>
      <br />
      <p>Already have an account? <Text color={"blue"} as={Link} to="/login" size="md">Login</Text></p>
    </Box>
  );
};

export default Register;