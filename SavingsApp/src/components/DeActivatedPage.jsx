import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Stack, Button, useColorModeValue, useToast } from '@chakra-ui/react';
import api from './api'; 
import { usePlans } from './ContextApi';
import moment from 'moment';

export const DeActivatedPage = () => {
  const [deactivatedPlans, setDeactivatedPlans] = useState([]);
  const { handleDeletePlan} = usePlans();
  const userId=localStorage.getItem("userid");
  const toast = useToast();


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
    >
      <Text>De-activate golas:-</Text><br/>
        <SimpleGrid gap={4} columns={{ base: 1, sm: 2, md: 3 }} >

          {deactivatedPlans.map((plan) => (
            <Box
              key={plan._id}
              p={6}
              shadow="lg"
              borderWidth="2px"
              borderRadius="lg"
              // bg={useColorModeValue('white', 'gray.800')}
              // transition="transform 0.3s ease"
              // _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
              textAlign="center"
            >
              <Stack spacing={4}>
                <Text 
                  fontWeight="bold" 
                  // fontSize="2xl" 
                  // color={useColorModeValue('teal.600', 'teal.300')}
                >
                  {plan.potPurpose}
                </Text>
                <Text fontSize="sm" >
                  Category: {plan.category || 'Others'}
                </Text>
                <Button
                  // mt={4}
                  colorScheme="blue"
                  size="md"
                  // width={"80%"}
                  
                  // variant="solid"
                  onClick={() => handleDeletePlan(plan._id, true)}
                  // _hover={{ bg: 'green.500', transform: 'scale(1.1)' }}
                >
                  Reactivate
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
    </Box>
  );
};
export const calculateNextDeductionDate = (savingPot) => {
  const { 
    lastAutoDeductionDate, 
   startDate, 
    frequency, 
    dayOfWeek, 
    dayOfMonth 
  } = savingPot;

  let baseDate = lastAutoDeductionDate || startDate;
  baseDate = moment(baseDate);

 let nextDeductionDate;
 switch (frequency) {
   case "daily":
     nextDeductionDate=baseDate.add(1,"day");
     break;
     case "weekly":
       if (!dayOfWeek) {
         throw new Error("dayOfWeek is required for weekly frequency.");
       }
       nextDeductionDate = baseDate.clone().add(1, "week").isoWeekday(dayOfWeek);
       break;
     
     case "monthly":
       if(!dayOfMonth){
         throw new Error("dayOfMonth is required for Monthly frequency.");
       }
       nextDeductionDate= baseDate.clone().add(1,"month").date(dayOfMonth);

       if (!nextDeductionDate.isValid()) {
         nextDeductionDate = baseDate.clone().add(1, "month").endOf("month");
       }
       break;
 
   default:
     throw new Error("Invalid frequency ")
     
 }

 if (nextDeductionDate.isBefore(moment())) {
   nextDeductionDate = calculateNextDeductionDate({
     ...savingPot,
     lastAutoDeductionDate: nextDeductionDate.toDate(),
   });
 }
 return nextDeductionDate.toDate();
};
