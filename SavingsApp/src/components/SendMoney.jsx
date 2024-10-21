import React, { useEffect, useState } from 'react';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, useToast } from '@chakra-ui/react';
import '../styles/buttonStyles.css';

export const SendMoney = ({totalBalance, onBalanceUpdate, updateBalance}) => {
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
      <button className='action-buttons' onClick={onOpen}>
        Send it <i className="fa-solid fa-paper-plane"></i>
      </button>

     
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className='modal-container'
          sx={{
            backgroundColor: "#E5EBF6",
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif",
           
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
