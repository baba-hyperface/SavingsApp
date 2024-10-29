import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import '../styles/SavingPage.css';
import { SavingPlanHistory } from './SavingPlanHistory';
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
import EditDeductionModel from './EditDetuctionModel';

export const SavingPlanPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const { id } = useParams();
  const userid = localStorage.getItem('userid');
  const toast = useToast();
  const[balance, setBalance] = useState(null)
  const {
    isOpen: isOptionsOpen,
    onOpen: onOptionsOpen,
    onClose: onOptionsClose,
  } = useDisclosure();
  const {
    isOpen: isInputModalOpen,
    onOpen: onInputModalOpen,
    onClose: onInputModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditDeductionOpen,
    onOpen: onEditDeductionOpen,
    onClose: onEditDeductionClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/user/${userid}/savingplan/${id}`);
        setData(res.data); 
        setBalance(res.data.currentBalance);
      } catch (error) {
        console.error('Error fetching saving plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userid, id, balance]);

  useEffect(() => {
    console.log("savingPLan re rendered")
  })

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionsClose();

    if (option === 'Add Money') {
      onInputModalOpen(); 
    } else if (option === 'Modify Auto Deduction') {
      onEditDeductionOpen();
    }
  };

  const handleSubmit = async () => {
    try {
        if (selectedOption === 'Add Money') {
            const addedAmount = parseFloat(inputValue);
            if (!inputValue || isNaN(addedAmount) || addedAmount <= 0) {
                toast({
                    title: "Invalid Amount",
                    description: "Please enter a valid amount greater than zero.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            } 
            await api.patch(`/user/${userid}/savingplan/${id}`, {
                currentBalance: addedAmount,
            });
            setBalance(addedAmount);
            toast({
                title: "Money added successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
         else if (selectedOption === 'Change End Date') {
            const newEndDate = new Date(inputValue);
            await api.patch(`/user/${userid}/savingplan/${id}`, {
                endDate: newEndDate.toISOString(),
            });
            toast({
                title: "End date updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }

        setData(prevData => ({
            ...prevData,
            currentBalance: inputValue,
        }));
        setInputValue('');
        setSelectedOption(null); 
        onInputModalClose();
    } catch (error) {
        console.error('Error updating saving plan:', error);
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        toast({
            title: "Error",
            description: errorMessage,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
};

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  const remainingAmount = data.targetAmount ? (data.targetAmount - data.currentBalance) : 0;
  const daysRequired = data.dailyAmount > 0 ? Math.ceil(remainingAmount / data.dailyAmount) : 'N/A';
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };


  console.log("main balance", balance);
  console.log("current balance changed", data.currentBalance);

  return (
    <div className='saving-plan-page-main-container'>
      <div>
        <div className="app-container">
          <h1 className='savingpage-header'>Your {data.potPurpose} Saving Plan</h1>
          <div className="goal-section">
            <div className='header-container-savepage'>
              <div>
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <h3>₹{data.dailyAmount}</h3>
                <p>Daily Target</p>
              </div>
            </div>
            <div className='header-container-savepage'>
              <div>
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div>
                <h3>₹{remainingAmount}</h3>
                <p>Remaining</p>
              </div>
            </div>
            <div className="add-goal-card" onClick={onOptionsOpen}>
            <i class="fa-solid fa-bars"></i>
              <p>Manage</p>
            </div>
          </div>

          <div className='money-and-date-container'>
            <div className='money-deails-container'>
              <div>
                <h3>₹{data.targetAmount || 'N/A'}</h3>
                <p>{data.potPurpose} goal set amount</p>
              </div>
              <div>
                <h3>{daysRequired} days</h3>
                <p>Days to reach target</p>
              </div>
              <div>
                <h3>₹{balance}</h3>
                <p>Current balance</p>
              </div>
            </div>
            <div className='date-deails-container'>
              <div className='date-child-container'>
                <div>
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <div>
                  <h5>{formatDate(data.startDate)}</h5>
                  <p>Start date</p>
                </div>
              </div>
              <div className='date-child-container'>
                <div>
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <div>
                  <h5>{formatDate(data.endDate)}</h5>
                  <p>End date</p>
                </div>
              </div>
            </div>
          </div>
          <div className='saving-page-image'>
            <img src="https://img.freepik.com/premium-vector/saving-money-with-large-jar-concept-illustration_135170-34.jpg" alt="" />
          </div>
          <div>
            <SavingPlanHistory />
          </div>
        </div>
      </div>
      <Modal isOpen={isOptionsOpen} onClose={onOptionsClose}>
        <ModalOverlay sx={{
            backdropFilter: { base: "none", lg: "blur(5px)" },
            height: "100vh",
          }}/>
        <ModalContent
          className="modal-container"
          sx={{
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif",
            width: { base: "100%", lg: "60%" },
            maxWidth: { base: "100vw", lg: "60vw" },
            height: { base: "100vh", lg: "auto" },
            overflowY: { base: "auto", lg: "unset" },
          }}
        >
          <ModalHeader>Choose an Option</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button onClick={() => handleOptionClick('Add Money')} width="100%" mb={2}>Add Money</Button>
            <Button onClick={() => handleOptionClick('Modify Auto Deduction')} width="100%" mb={2}>Modify Auto Deduction</Button>
            <Button onClick={() => handleOptionClick('Change End Date')} width="100%">Change End Date</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isInputModalOpen} onClose={onInputModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedOption}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={`Enter amount for ${selectedOption}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="number"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <EditDeductionModel pot={data} isOpen={isEditDeductionOpen} onClose={onEditDeductionClose} />
    </div>
  );
};
