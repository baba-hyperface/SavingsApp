import React, { useEffect, useState } from 'react'
import '../styles/buttonStyles.css'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, toastStore, useToast } from '@chakra-ui/react';
import { updateBalance } from './MinusMoney';


export const WithdrawMoney = ({totalBalance, onBalanceUpdate, updateBalance}) => {
    const {onClose, onOpen, isOpen} = useDisclosure();
   const [balance, setBalance] = useState(totalBalance);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addMoney, setAddMoney] = useState('');
    const toast = useToast();
    const userIdFromLocalStorage = localStorage.getItem("userid")

    useEffect(() => {
      setBalance(totalBalance || 0);
  }, [totalBalance]);
    

  const handleWithdraw = async () => {

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


    try {
      setLoading(true);
      const newBalance = await updateBalance(userIdFromLocalStorage, balance, addMoney, false)
      onBalanceUpdate(newBalance);
      toast({
        title: "Withdrawal successful.",
        description: `₹${addMoney} has been withdrawn from your account.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setAddMoney("");
      onClose();
      setLoading(false);
    } catch (error) {
     console.log(error);
     toast({
      title: "Withdrawal failed.",
      description: "An error occurred while processing your withdrawal. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
     setError(error); 
    }
  };

  return (
    <div>
       <button className='action-buttons' onClick={onOpen}><i className="fa-solid fa-hand-holding-dollar"></i>Withdraw it</button>
       <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent sx={{
            backgroundColor: "#E5EBF6",
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif"
          }}>
          <ModalHeader>Withdraw Money</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
              type="number" 
              placeholder='₹0'
              value={addMoney}
              onChange={(e) => {setAddMoney(e.target.value)}}
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                backgroundColor: "#f0f0f0",
                color: "#000" 
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleWithdraw}>
              Withdraw
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>


  )
}
