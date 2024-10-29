import React, { useEffect, useState } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, useToast } from '@chakra-ui/react';
import '../styles/buttonStyles.css';
import api from './api';

export const SendMoney = ({totalBalance, onBalanceUpdate, updateBalance, onHistoryChange, email, accountNum}) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [balance, setBalance] = useState(totalBalance);
  const [holderName, setHolderName] = useState('');
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const userIdFromLocalStorage = localStorage.getItem("userid")

  useEffect(() => {
    setBalance(totalBalance)
  }, [totalBalance])

  const handleSendMoney = async () => {
    if (amount > totalBalance) {
      toast({
        title: "Insufficient balance.",
        description: `You cannot Send more than your available balance of ₹${totalBalance}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    



    try {
      const newBalance = await updateBalance(userIdFromLocalStorage, balance, amount, false)
      onBalanceUpdate(newBalance);

      await api.post('/history', {
        email: email,
        type: "transfer",
        amount: amount,
        from: accountNum,
        to: holderName,
        date: new Date()
    });

      onHistoryChange({
        email: email,
        type : "transfer",
        amount: amount,
        from: accountNum,
        to: holderName,
        date: new Date()
      })

      toast({
        title: "Transaction successful.",
        description: `₹${amount} has been debited from your account.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setAccountNumber('');
      setIfsc('');
      setHolderName('');
      setAmount('');
      onClose();
    } catch (error) {
     console.log(error);
     toast({
      title: "Transaction failed",
      description: "An error occurred while processing your Transaction. Please try again.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    }
  };

  return (
    <div>
    <div>
  <button className='action-buttons' onClick={onOpen}>
    <i className="fa-solid fa-paper-plane"></i>
    <span className='button-text'>Send it</span>
  </button>
  <p className='send-text'>Send</p>
</div>

     
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
          sx={{
            backdropFilter: { base: "none", lg: "blur(10px)" },
            height: "100vh",
          }}
        />
        <ModalContent
          className="modal-container"
          sx={{
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif",
            width: { base: "100%", lg: "60%" },
            maxWidth: { base: "100vw", lg: "60vw" },
            height: { base: "90vh", lg: "auto" },
            overflowY: { base: "auto", lg: "unset" },
          }}
        >
          <ModalHeader>Send Money</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
              placeholder="Account Number" 
              value={accountNumber} 
              onChange={(e) => setAccountNumber(e.target.value)} 
              mb={3} // Margin for spacing
              sx={{ fontFamily: "Noto Sans, sans-serif" }}
            />
            <Input 
              placeholder="IFSC Code" 
              value={ifsc} 
              onChange={(e) => setIfsc(e.target.value)} 
              mb={3}
              sx={{ fontFamily: "Noto Sans, sans-serif" }}
            />
            <Input 
              placeholder="Account Holder Name" 
              value={holderName} 
              onChange={(e) => setHolderName(e.target.value)} 
              mb={3}
              sx={{ fontFamily: "Noto Sans, sans-serif" }}
            />
            <Input 
              type="number" 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              sx={{ fontFamily: "Noto Sans, sans-serif" }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSendMoney}>
              Pay {amount ? "₹" + amount : ""}
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
