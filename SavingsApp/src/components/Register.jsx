import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FormControl, FormLabel, Box, Button, Input, Text, VStack, useToast, FormHelperText, HStack, Icon } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setPasswordCriteria({
      minLength: value.length >= 6,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[@$!%*?&]/.test(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (!allCriteriaMet) {
      alert("Password does not meet all requirements.");
      return;
    }

    navigate('/account', { state: { email, name, password } });
  };

  return (
    <Box maxW="sm" mx="auto" mt="10" p="6" boxShadow="md" borderRadius="md">
      <Text fontSize="2xl" fontWeight="bold">Register</Text>
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
              onChange={handlePasswordChange}
              required
            />
            <FormHelperText mt={2} fontSize="sm">
              <HStack wrap="wrap" spacing={6} align="center">
                <HStack align="center" >
                  <Icon
                    as={passwordCriteria.minLength ? CheckIcon : CloseIcon}
                    color={passwordCriteria.minLength ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.minLength ? 'green.500' : 'red.500'}>
                    6+ characters
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasUpperCase ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasUpperCase ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasUpperCase ? 'green.500' : 'red.500'}>
                    Uppercase
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasLowerCase ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasLowerCase ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasLowerCase ? 'green.500' : 'red.500'}>
                    Lowercase
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasNumber ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasNumber ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasNumber ? 'green.500' : 'red.500'}>
                    Number
                  </Text>
                </HStack>
                <HStack align="center" spacing={2}>
                  <Icon
                    as={passwordCriteria.hasSpecialChar ? CheckIcon : CloseIcon}
                    color={passwordCriteria.hasSpecialChar ? 'green.500' : 'red.500'}
                  />
                  <Text color={passwordCriteria.hasSpecialChar ? 'green.500' : 'red.500'}>
                    Special char
                  </Text>
                </HStack>
              </HStack>
            </FormHelperText>
          </FormControl>

          <Button type="submit" colorScheme="blue" isDisabled={Object.values(passwordCriteria).includes(false)}>Add Account</Button>
        </VStack>
      </form>
      <br />
      <p>Already have an account? <Text color="blue" as={Link} to="/login" size="md">Login</Text></p>
    </Box>
  );
};

export default Register;