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
  Select, 
} from '@chakra-ui/react';
import api from './api';
import { Transaction } from './Transaction';
import { useNavigate } from 'react-router-dom';

export const SavingPlans = ({ totalBalance, onBalanceUpdate, updateBalance }) => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]); // New state for filtered plans
  const [categories, setCategories] = useState([]); // For dropdown categories
  const [addMoney, setAddMoney] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'all'
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [balance, setBalance] = useState(totalBalance);
  const [hsitoryOpen, setHistory] = useState(false);
  const toast = useToast();
  const userIdFromLocalStorage = localStorage.getItem("userid");
  const userId = userIdFromLocalStorage;
  const nav = useNavigate();
  

  useEffect(() => {
    setBalance(totalBalance || 0);
  }, [totalBalance]);

  const HandleHistory = () => {
    setHistory(!hsitoryOpen);
  }

  const handleNav = (potid) => {
    console.log(potid)
      nav(`/savingplan/${potid}`)
  }

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get(`/user/${userId}/savingplan`);
        const fetchedPlans = res.data;
        setPlans(fetchedPlans);
        const categoriesSet = new Set(fetchedPlans.map(plan => plan.category || 'Others'));
        setCategories(['all', ...Array.from(categoriesSet)]);
        setFilteredPlans(fetchedPlans);
      } catch (error) {
        console.error('Error fetching saving plans:', error);
      }
    };
    fetchPlans();
  }, [userId]);
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter(plan => (plan.category || 'Others') === selectedCategory);
      setFilteredPlans(filtered);
    }
  }, [selectedCategory, plans]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

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
        const response = await api.patch(`/user/${userId}/savingplan/${selectedPlanId}`, {
          currentBalance: amountToAdd,
        });
        const newBalance = await updateBalance(userId, balance, addMoney, false);
        onBalanceUpdate(newBalance);
        toast({
          title: "Amount added successful.",
          description: `₹${addMoney} has been added to your savings.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const updatedPlan = response.data.pot;
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan._id === updatedPlan._id ? updatedPlan : plan
          )
        );
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
        await api.delete(`/user/${userId}/savingplan/${planId}`);
        setPlans((prevPlans) => prevPlans.filter((plan) => plan._id !== planId));
        toast({
          title: "Amount debited",
          description: "Your savings added to your Bank account",
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
          <div>
          <div>
          <h4>Savings plan</h4>
        </div>
        <h3>{filteredPlans.length} saving plans</h3>
          </div>
          <div>
        <Select
  value={selectedCategory}
  onChange={handleCategoryChange}
  placeholder="Select a category"
  variant="filled"
  borderRadius="md"
  borderColor="teal.500"
  focusBorderColor="teal.500"
  _hover={{
    borderColor: "teal.300",
  }}
  size="sm"  
  fontWeight="medium"
  bg="gray.50" 
  color="gray.600" 
  p={2} 
  width="200px" 
  boxShadow="sm" 
  _focus={{
    outline: "none",
    boxShadow: "0 0 2px 2px rgba(56, 178, 172, 0.6)", 
  }}
>
  {categories.map((category, index) => (
    <option key={index} value={category}>
      {category === 'all' ? 'All Categories' : category}
    </option>
  ))}
</Select>
</div>
</div>


        <div className="plans-list">
          {filteredPlans.map((plan) => (
            <div key={plan._id} className="plan-card">
              <div onClick={() => handleNav(plan._id)}>
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
              </div>
              <div className="action-buttons-saving">
                <button className="add-money-btn">
                  {plan.autoDeduction ? <i className="fa-solid fa-play-circle" style={{color: "green"}}></i> : <i className="fa-solid fa-play-circle" style={{color: "red"}}></i>}
                </button>
                <button
                  onClick={() => {
                    setSelectedPlanId(plan._id);
                    onOpen();
                  }}
                  className="add-money-btn"
                >
                  <i className="fa-solid fa-plus"></i> Add Money
                </button>
                <button onClick={() => handleDeletePlan(plan._id)} className="delete-btn">
                <i class="fa-regular fa-circle-pause"></i> Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='dummy-styling'></div>

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
