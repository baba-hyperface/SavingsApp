import React, { useEffect, useState } from 'react';
import '../styles/SavingPlans.css';
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
import { FiFilter } from 'react-icons/fi';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { usePlans } from './ContextApi';

export const SavingPlans = ({ totalBalance, onBalanceUpdate, updateBalance }) => {
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addMoney, setAddMoney] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterByAutoDeduction, setFilterByAutoDeduction] = useState('all');
  const [autoDeductionStatus, setAutoDeductionStatus] = useState('all');
  const { onClose, onOpen, isOpen } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const [balance, setBalance] = useState(totalBalance);
  const toast = useToast();
  const nav = useNavigate();
  const userIdFromLocalStorage = localStorage.getItem("userid");
  const userId = userIdFromLocalStorage;
  const {
    refreshkey,
    handleAutoDeductionStatus,
    plans,
    setPlans,
    handleDeletePlan,
  } = usePlans();

  useEffect(() => {
    setBalance(totalBalance || 0);
  }, [totalBalance]);

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
  }, [userId, refreshkey]);

  useEffect(() => {
    const filtered = plans.filter(plan => {
      const categoryMatch = selectedCategory === 'all' || (plan.category || 'Others') === selectedCategory;
      const autoDeductionMatch = filterByAutoDeduction === 'all' ||
        (filterByAutoDeduction === 'active' && plan.autoDeduction) ||
        (filterByAutoDeduction === 'inactive' && !plan.autoDeduction);
      const autoDeductionStatusMatch = autoDeductionStatus === 'all' ||
        (autoDeductionStatus === 'paused' && !plan.autoDeductionStatus) ||
        (autoDeductionStatus === 'running' && plan.autoDeductionStatus);
      return categoryMatch && autoDeductionMatch && autoDeductionStatusMatch && plan.potStatus;
    });
    setFilteredPlans(filtered);
  }, [selectedCategory, filterByAutoDeduction, autoDeductionStatus, plans]);

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
          title: "Amount added successfully.",
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

  const handleClaimAmount = (potid, isActive) => {
      handleDeletePlan(potid, isActive)
      toast({
        title: "Claim Successful",
        description: "The amount has been claimed successfully. and debited to bank",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  };

  const handleDeactivate = (potid, isActive) => {
    const confirmAction = window.confirm("Are you sure you want to deactivate this plan?");
      if (!confirmAction) {
        return; 
      }
    handleDeletePlan(potid, isActive)
    toast({
      title: "Deactivated the pot",
      description: "The pot deactivated succesfully...",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } 

  return (
    <div className="saving-plans-container">
      <div className="header">
        <div>
          <h4>Savings plan</h4>
          <h3>{filteredPlans.length} saving plans</h3>
        </div>
        <Button colorScheme="blue" onClick={onFilterOpen} leftIcon={<FiFilter />}>
          Filter
        </Button>
      </div>

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Plans</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Category Filter
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select a category"
              variant="filled"
              mb={4}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </Select>
            Auto Deduction (Active/Inactive)
            <Select
              value={filterByAutoDeduction}
              onChange={(e) => setFilterByAutoDeduction(e.target.value)}
              placeholder="Auto Deduction"
              variant="filled"
              mb={4}
            >
              <option value="all">All</option>
              <option value="active">Auto Deduction Active</option>
              <option value="inactive">Auto Deduction Inactive</option>
            </Select>
            Auto Deduction (Running/Paused)
            <Select
              value={autoDeductionStatus}
              onChange={(e) => setAutoDeductionStatus(e.target.value)}
              placeholder="Auto Deduction Status"
              variant="filled"
            >
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onFilterClose}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="plans-list">
        {filteredPlans.map((plan) => (
          <div key={plan._id} className="plan-card">
            <div onClick={() => nav(`/savingplan/${plan._id}`)}>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${(plan.currentBalance / plan.targetAmount) * 100}%`,
                    backgroundColor: plan.color,
                  }}
                />
              </div>
              <div className="plan-details">
                <h4>{plan.potPurpose}</h4>
                <p>
                  <span className="current-amount">₹{plan.currentBalance.toFixed(2)}</span> /{' '}
                  <span className="goal-amount">₹{plan.targetAmount.toFixed(2)}</span>
                </p>
              </div>
            </div>
            <div className="action-buttons-saving">
              {plan.currentBalance >= plan.targetAmount ? (
                <div className="target-achieved" >
                  <p>🎉 Target Achieved!</p>
                  <button onClick={() => handleClaimAmount(plan._id, false)}>
                    <i className="fa-solid fa-hand-holding-dollar"   ></i>  Claim Amount
                  </button>
                </div>
              ) : (
                <>
                  <button className="add-money-btn" onClick={() => handleAutoDeductionStatus(plan._id, plan.potPurpose)}>
                    {plan.autoDeduction ? (
                      <>
                        <i className="fa-solid fa-play-circle"></i>
                        Running
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-pause-circle"></i>
                        Paused
                      </>
                    )}
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
                  <button onClick={() => handleDeactivate(plan._id, false)} className="delete-btn">
                    <i className="fa-regular fa-circle-pause"></i> Deactivate
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Money Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Money to Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter amount"
              type="number"
              value={addMoney}
              onChange={(e) => setAddMoney(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddMoney}>
              Add Money
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};