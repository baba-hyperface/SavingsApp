import React, { createContext, useState, useEffect, useContext } from 'react';
import api from './api'; 
import { useToast } from '@chakra-ui/react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const userId=localStorage.getItem("userid");

  const handleAutoDeductionStatus = async (planId, potPurpose) => {

    try {
      const response = await api.patch(`/user/${userId}/savingplanstatus/${planId}`);
      
      const isPaused = !response.data.status;
      const colorScheme = isPaused ? 'blue' : 'green';

      toast({
        title: `${potPurpose} status updated.`,
        description: response.data.status
          ? "Your daily deduction is resumed."
          : "Your daily deduction is paused.",
        status: 'success',
        duration: 3000,
        isClosable: true,
        colorScheme,
      });

      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating saving plan:', error);

      toast({
        title: 'Error',
        description: 'Failed to update the status of the saving plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

const handleDeletePlan = async (planId, isActive) => {
    if (!isActive) {
      const confirmAction = window.confirm("Are you sure you want to deactivate this plan?");
      if (!confirmAction) {
        return; 
      }
    }
  
    try {
      const res = await api.patch(`/user/${userId}/savingplandeactivate/${planId}`);
      const potStatus = !res.data.potStatus; 
      const colorScheme=potStatus? "red":"green";
      if (potStatus) { 
        toast({
          title: "Plan Deactivated",
          description: "Your saving plan has been successfully deactivated.",
          status: "success",
          duration: 3000,
          isClosable: true,
          colorScheme,
        });
      } else {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== planId));
        toast({
          title: "Plan Activated",
          description: "Your saving plan has been successfully activated.",
          status: "success",
          duration: 3000,
          isClosable: true,
          colorScheme,
        });
      }
      setRefreshKey(prev => prev + 1);
      window.location.reload();
    } catch (error) {
      console.error("Error updating saving plan:", error);
      toast({
        title: "Error",
        description: "Failed to update the saving plan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <PlanContext.Provider
      value={{ 
        handleAutoDeductionStatus,
        refreshKey,setRefreshKey,
        plans,setPlans,
        handleDeletePlan
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlans = () => {
    return useContext(PlanContext);
  };