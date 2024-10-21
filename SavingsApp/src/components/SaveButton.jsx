import React, { useEffect, useState } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import '../styles/buttonStyles.css';
import axios from 'axios';
import { SavingPlans } from './SavingPlans';
import api from './api';
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

export const SaveButton = ({totalBalance, onBalanceUpdate, updateBalance}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [name, setName] = useState('');
  const[balance, setBalance]= useState(totalBalance);
  const [amount, setAmount] = useState('');
  const [goal, setGoal] = useState('');
  const [emoji, setEmoji] = useState('');
  const toast = useToast();
  const userIdFromLocalStorage = localStorage.getItem("userid");

  useEffect(() => {
    setBalance(totalBalance || 0);
}, [totalBalance]);

  const handleSavePlan = async () => {
    const randomColor = generateRandomColor();
    const parsedAmount = parseInt(amount);
    if(parsedAmount > totalBalance){
      toast({
        title: "Insufficient balance.",
        description: `You cannot add more than your available balance of ₹${totalBalance}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return
    }
    const savingPlan = {
      potPurpose: name,
      currentBalance: amount,
      targetAmount: goal,
      color: randomColor,
      imoji: emoji,
      user: userIdFromLocalStorage,
    };

    try {
      const res = await api.post(`/user/${userIdFromLocalStorage}/savingplan`, savingPlan);
      console.log("created", res.data);
      const newBalance = await updateBalance(userIdFromLocalStorage, balance, amount, false)
      onBalanceUpdate(newBalance);
    } catch (error) {
      console.log(error.message);
    }
    setName('');
    setAmount('');
    setGoal('');
    setEmoji('');
    onClose();
    window.location.reload()
  };

  return (
    <div>
      <button className='action-buttons' onClick={onOpen}>
        <i className="fa-solid fa-piggy-bank"></i> Save it!
      </button>

      {/* Modal for saving plans */}
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