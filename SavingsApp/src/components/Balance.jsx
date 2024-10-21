import React, { useEffect, useState } from 'react';
import '../styles/balance.css';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, useToast } from '@chakra-ui/react';
import { DonutChart } from './DonutChart';
import api from './api';

export const Balance = ({totalBalance, onBalanceUpdate, accNum, expDate, updateBalance}) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [balance, setBalance] = useState(totalBalance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addMoney, setAddMoney] = useState('');
  const toast = useToast();
  const[potData, setPotData] = useState([]);
  const userIdFromLocalStorage = localStorage.getItem("userid")

  useEffect(() => {
    setBalance(totalBalance || 0);
  }, [totalBalance]);

  useEffect(() => {
    console.log("rendering....");
    console.log(totalBalance)
  })


  function formatDate(expDate) {
    const date = new Date(expDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}/${month}`;
  }

  const formattedDate = formatDate(expDate);

  useEffect(() => {
    const fetchPotData = async () => {
        try {
            const res = await api.get(`/user/${userIdFromLocalStorage}/savingplan`)
            setPotData(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    fetchPotData();
}, []);

  const handleAddMoney = async () => {
      try {
        setLoading(true);
        const newBalance = await updateBalance(userIdFromLocalStorage, balance, addMoney, true)
        setBalance(newBalance);
        onBalanceUpdate(newBalance);
        setAddMoney("");
        onClose();
        toast({
          title: "Amount added successfully",
          description: `Added ${addMoney} to your wallet`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      } catch (error) {
       console.log(error);
       setError(error); 
      }
    };

  return (
    <div>
      <div className='balance-container'>
        <div className='balance-container-left'>
          <div className='amount-container'>
            <div>
              <h4 className='total-balance'>Total balance:</h4>
              <h1 className='balance-amount'><i className="fa-solid fa-indian-rupee-sign"></i>{balance}</h1>
            </div>
            <div className='account-details-container'>
              <div className='account-number'>
                <h5>Number</h5>
                <p>{accNum}</p>
              </div>
              <div className='expire-date'>
                <h5>Exp</h5>
                <p>{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='balance-container-right'>
          <button className='add-fund-button' onClick={onOpen}>Add Money</button>
        </div>
        <div className='donut-style'>
        <DonutChart savingsData={potData} />
        </div>
      </div>

      
      <Modal isOpen={isOpen} onClose={onClose} >
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
