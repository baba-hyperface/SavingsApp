import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Stack, Button, useColorModeValue, useToast } from '@chakra-ui/react';
import api from './api'; 
import { usePlans } from './ContextApi';

export const DeActivatedPage = () => {
  const [deactivatedPlans, setDeactivatedPlans] = useState([]);
  const { handleDeletePlan} = usePlans();
  const toast = useToast();
  const userId=localStorage.getItem("userid");
  const bgGradient = useColorModeValue(
    'linear(to-br, teal.100, blue.50)',
    'linear(to-br, teal.700, blue.900)'
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get(`/user/${userId}/savingplan`);
        const fetchedPlans = res.data;
        const deactivated = fetchedPlans.filter(plan => !plan.potStatus);
        setDeactivatedPlans(deactivated);
      } catch (error) {
        console.error('Error fetching saving plans:', error);
      }
    };
    fetchPlans();
  }, [userId]);

  return (
    <Box 
      p={8} 
      minH="100vh" 
    >
      <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center">
        Deactivated Saving Pots 
        <Text fontSize={20} >{deactivatedPlans.length}</Text>
      </Text>
      {deactivatedPlans.length === 0 ? (
        <Text fontSize="xl" textAlign="center">No deactivated pots available.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
          {deactivatedPlans.map((plan) => (
            <Box
              key={plan._id}
              p={6}
              shadow="lg"
              borderWidth="2px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.800')}
              transition="transform 0.3s ease"
              _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
              textAlign="center"
            >
              <Stack spacing={4}>
                <Text 
                  fontWeight="bold" 
                  fontSize="2xl" 
                  color={useColorModeValue('teal.600', 'teal.300')}
                >
                  {plan.potPurpose}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Category: {plan.category || 'Others'}
                </Text>
                <Button
                  mt={4}
                  colorScheme="blue"
                  size="md"
                  variant="solid"
                  onClick={() => handleDeletePlan(plan._id, true)}
                  _hover={{ bg: 'green.500', transform: 'scale(1.1)' }}
                >
                  Reactivate
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
