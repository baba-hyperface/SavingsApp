
import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userid');
    setIsAuthenticated(false);
    navigate('/'); 
  };

  return (
    <Box as="nav" borderBottom="1px solid" borderColor="gray.200" pt={5} pb={5}>
      <HStack justifyContent="space-between" maxW="1200px" mx="auto" pr={6} pl={6}>
        <Heading as="h1" size="lg" color="blue.500">
          Coins Stash
        </Heading>

        <HStack spacing={6}>
          <Text fontWeight={900} as={Link} to='/' fontSize="lg" _hover={{ color: "blue.500" }}>
            Home
          </Text>

          {isAuthenticated ? (
            <>
            <Text
            as={Link} 
            to='/dashboard'
            fontSize="lg"
            _hover={{ color: "blue.500" }}
            fontWeight={900}
          >
            DashBoard
          </Text>
          
          <Text
              as={Link} 
              to='/'
              onClick={handleLogout}
              fontSize="lg"
              _hover={{ color: "blue.500" }}
              fontWeight={900}
            >
              Logout
            </Text>
          </>
          ) : (
            <>
              <Text
                as={Link}
                to='/login'
                fontSize="lg"
                _hover={{ color: "blue.500" }}
                fontWeight={900}
              >
                Login
              </Text>
              <Text
                as={Link}
                to='/register'
                fontSize="lg"
                _hover={{ color: "blue.500" }}
                fontWeight={900}
              >
                Signup
              </Text>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Nav;
