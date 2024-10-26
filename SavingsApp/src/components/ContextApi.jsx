import React, { createContext, useState, useEffect, useContext } from 'react';
import api from './api'; 
import { useToast } from '@chakra-ui/react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const userId=localStorage.getItem("userid");

  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const handleDeductCloseModal = () => setIsDeductModalOpen(false);
  const [selectedPlanId,setSelectedPlanId]=useState("");

  const handleDeductOpenModal = (planId) => {
    console.log("selectedPlanId 1",planId);

    setSelectedPlanId(planId); 

    // console.log("selectedPlanId",selectedPlanId);
    setIsDeductModalOpen(true);

  };

  console.log("planid", selectedPlanId);

  const handleSaveDeduction = async (deductionAmount) => {
    console.log("Daily Deduction Amount Saved:", deductionAmount);

    try{
      console.log("selectedPlanId",selectedPlanId);
      console.log("Deduction amount from front",deductionAmount);
      const response=await api.patch(`/user/${userId}/savingsplanActivatingAutodeduct/${selectedPlanId}`, {deductionAmount} );
      console.log(response.data.status);
      if(response.data.status){
      toast({
        title: `Status updated.`,
        description: "Your daily deduction is activated",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    } catch (error) {
      console.error('Error updating saving plan:', error);

      toast({
        title: 'Error',
        description: 'Failed to update the Daily Detuction status of the saving plan.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsDeductModalOpen(false);
  };


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
    }
  
    try {
      const res = await api.patch(`/user/${userId}/savingplandeactivate/${planId}`);
      const potStatus = !res.data.potStatus; 
      const colorScheme=potStatus? "red":"green";
      if (potStatus) { 
        console.log("plan deActivated")
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
        handleDeletePlan,

        isDeductModalOpen,handleDeductCloseModal,
        handleSaveDeduction,setIsDeductModalOpen,
        handleDeductOpenModal

        // setDeductPlan
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlans = () => {
    return useContext(PlanContext);
  };