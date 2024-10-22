import React, { useEffect, useState } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, FormControl, FormLabel, Select, useToast } from '@chakra-ui/react';
import '../styles/buttonStyles.css';
import api from './api';

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

export const SaveButton = ({ totalBalance, onBalanceUpdate, updateBalance }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(totalBalance);
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState('');
  const [emoji, setEmoji] = useState('');
  const [category, setCategory] = useState('');
  const [autoDeduction, setAutoDeduction] = useState('no');
  const [dailyAmount, setDailyAmount] = useState(0);
  const toast = useToast();
  const userIdFromLocalStorage = localStorage.getItem("userid");

  useEffect(() => {
    setBalance(totalBalance || 0);
  }, [totalBalance]);

  const handleSavePlan = async () => {
    const randomColor = generateRandomColor();
    const parsedAmount = parseInt(amount);
    if (parsedAmount > totalBalance) {
      toast({
        title: "Insufficient balance.",
        description: `You cannot add more than your available balance of ₹${totalBalance}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const savingPlan = {
      potPurpose: name,
      currentBalance: amount,
      targetAmount: goal,
      category: category,
      color: randomColor,
      emoji: emoji,
      user: userIdFromLocalStorage,
      autoDeduction: autoDeduction === 'yes' ? true : false,
      dailyAmount: autoDeduction === 'yes' ? dailyAmount : 0, 
    };

    try {
      const res = await api.post(`/user/${userIdFromLocalStorage}/savingplan`, savingPlan);
      console.log("created", res.data);
      const newBalance = await updateBalance(userIdFromLocalStorage, balance, amount, false);
      onBalanceUpdate(newBalance);
    } catch (error) {
      console.log(error.message);
    }

    setName('');
    setAmount('');
    setGoal('');
    setEmoji('');
    setCategory('');
    setAutoDeduction('no');
    setDailyAmount('');
    onClose();
    window.location.reload();
  };

  return (
    <div>
      <button className='action-buttons' onClick={onOpen}>
        <i className="fa-solid fa-piggy-bank"></i> Save it!
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          className='modal-container'
          sx={{
            backgroundColor: "#E5EBF6",
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          <ModalHeader>Add a New Saving Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <FormControl mb={3}>
              <FormLabel>Select Category</FormLabel>
              <Select
                placeholder="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              >
                <option value="travel">Travel & Vacations</option>
                <option value="health">Health & Wellness</option>
                <option value="home">Home & Property</option>
                <option value="business">Business & Entrepreneurship</option>
                <option value="education">Education & Learning</option>
                <option value="gadgets">Gadgets & Electronics</option>
                <option value="vehicle">Vehicle & Transportation</option>
                <option value="gifts">Gifts & Celebrations</option>
                <option value="emergency">Emergency Fund</option>
                <option value="retirement">Retirement & Long-term</option>
                <option value="hobbies">Hobbies & Entertainment</option>
                <option value="clothing">Clothing & Fashion</option>
                <option value="charity">Charity & Giving</option>
                <option value="misc">Miscellaneous</option>
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Plan Name</FormLabel>
              <Input
                placeholder="Plan Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Current Amount</FormLabel>
              <Input 
                type="number" 
                placeholder="Current Amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Goal Amount</FormLabel>
              <Input
                type="number"
                placeholder="Goal Amount"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Choose Emoji (Icon)</FormLabel>
              <Input
                placeholder="E.g., 🎧"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Would you like auto-deduction for daily savings?</FormLabel>
              <Select
                placeholder="Select an option"  
                value={autoDeduction}
                onChange={(e) => setAutoDeduction(e.target.value)}
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </FormControl>

            {/* Show daily amount input if auto-deduction is yes */}
            {autoDeduction === 'yes' && (
              <FormControl mb={3}>
                <FormLabel>Daily Deduction Amount</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter daily amount"
                  value={dailyAmount}
                  onChange={(e) => setDailyAmount(e.target.value)}
                  sx={{ fontFamily: "Noto Sans, sans-serif" }}
                />
              </FormControl>
            )}

          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSavePlan}>
              Save Plan
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
