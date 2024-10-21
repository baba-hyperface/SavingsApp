import React, { useEffect, useState } from 'react';
import '../styles/SavingPlans.css';
import { DonutChart } from './DonutChart';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

export const SavingPlans = ({totalBalance, onBalanceUpdate, updateBalance}) => {
  const [plans, setPlans] = useState([]);
  const [addMoney, setAddMoney] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null); 
  const { onClose, onOpen, isOpen } = useDisclosure();
  const[balance, setBalance] = useState(totalBalance);
  const[count, setCount] = useState(0);
  const userIdFromLocalStorage = localStorage.getItem("userid")

  const userId = userIdFromLocalStorage; 
  const toast = useToast();

  useEffect(() => {
    setBalance(totalBalance || 0);
}, [totalBalance]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}/savingplan`);
        setPlans(res.data);
      } catch (error) {
        console.error('Error fetching saving plans:', error);
      }
    };
    fetchPlans();
  }, [userId]);


  const handleAddMoney = async () => {
    if (addMoney > totalBalance) {
      toast({
        title: "Insufficient balance.",
        description: `You cannot withdraw more than your available balance of ₹${totalBalance}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (selectedPlanId && addMoney) {
      try {
        const amountToAdd = parseFloat(addMoney);
        const response = await axios.patch(`http://localhost:5000/api/user/${userId}/savingplan/${selectedPlanId}`, {
          currentBalance: amountToAdd,
        });
        const newBalance = await updateBalance(userId, balance, addMoney, false)
        onBalanceUpdate(newBalance);
        toast({
          title: "Amount added successful.",
          description: `₹${addMoney} has been added to your savings.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        console.log(response.data.pot);
         const updatedPlan = response.data.pot;
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan._id === updatedPlan._id ? updatedPlan : plan
          )
        );
        console.log(addMoney);
        toast({
          title: "Success",
          description: `Added ₹${amountToAdd} to ${updatedPlan.potPurpose}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setAddMoney('');
        onClose();
      } catch (error) {
        console.error('Error updating saving plan:', error);
        toast({
          title: "Error",
          description: "Failed to add money to the saving plan.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Input Error",
        description: "Please enter a valid amount.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

 
  const handleDeletePlan = async (planId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this plan?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/user/${userId}/savingplan/${planId}`);
        setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== planId));
        toast({
          title: "Amount debited",
          description: "Your savings added to your Bankaccount",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting saving plan:', error);
        toast({
          title: "Error",
          description: "Failed to delete the saving plan.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <div>
      <div className="saving-plans-container">
        <div className="header">
          <h4>Savings plan</h4>
        </div>
        <h3>{plans.length} saving plans</h3>
        <div className="plans-list">
          {plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${(plan.currentBalance / plan.targetAmount) * 100}%`, backgroundColor: plan.color }}
                />
              </div>
              <div className="plan-icon">{plan.imoji}</div>
              <div className="plan-details">
                <h4>{plan.potPurpose}</h4>
                <p>
                  <span className="current-amount">₹{plan.currentBalance.toFixed(2)}</span> /
                  <span className="goal-amount"> ₹{plan.targetAmount.toFixed(2)}</span>
                </p>
              </div>
              <div className="action-buttons-saving">
                <button
                  onClick={() => {
                    setSelectedPlanId(plan._id);
                    console.log(plan._id);
                    onOpen();
                  }}
                  className="add-money-btn"
                >
                  <i className="fa-solid fa-plus"></i> Add Money
                </button>
                <button onClick={() => handleDeletePlan(plan._id)} className="delete-btn">
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='dummy-styling'>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent sx={{
          backgroundColor: "#E5EBF6",
          color: "rgb(65, 65, 65)",
          borderRadius: "10px",
          fontFamily: "Noto Sans, sans-serif"
        }}>
          <ModalHeader>Add Money</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="number"
              value={addMoney}
              onChange={(e) => setAddMoney(e.target.value)}
              placeholder='₹0'
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                backgroundColor: "#f0f0f0",
                color: "#000"
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleAddMoney}>
              Add {addMoney ? "₹" + addMoney : ""}
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};