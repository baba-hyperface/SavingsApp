import React, { useEffect, useState } from 'react';
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
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
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
  const [days, setDays] = useState('');
  const [step, setStep] = useState(1);
  const toast = useToast();
  const userIdFromLocalStorage = localStorage.getItem('userid');

  useEffect(() => {
    setBalance(totalBalance || 0);
  }, [totalBalance]);

  useEffect(() => {
    calculateDailyAmount();
  }, [goal, amount, days]);

  const calculateDailyAmount = () => {
    const parsedGoal = parseInt(goal);
    const parsedCurrentAmount = parseInt(amount);
    const parsedDays = parseInt(days);

    if (parsedGoal && parsedCurrentAmount && parsedDays > 0) {
      const neededAmount = parsedGoal - parsedCurrentAmount;
      const dailyNeeded = Math.ceil(neededAmount / parsedDays);
      setDailyAmount(dailyNeeded);
    } else {
      setDailyAmount(0);
    }
  };

  const handleSavePlan = async () => {
    const randomColor = generateRandomColor();
    const parsedAmount = parseInt(amount);
    if (parsedAmount > totalBalance) {
      toast({
        title: 'Insufficient balance.',
        description: `You cannot add more than your available balance of ₹${totalBalance}.`,
        status: 'error',
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
      autoDeduction: autoDeduction === 'yes',
      dailyAmount: autoDeduction === 'yes' ? dailyAmount : 0,
    };

    try {
      const res = await api.post(`/user/${userIdFromLocalStorage}/savingplan`, savingPlan);
      console.log('created', res.data);
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
    setDays('');
    setStep(1);
    onClose();
    window.location.reload();
  };

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderInputField = () => {
    switch (step) {
      case 1:
        return (
          <FormControl mb={3}>
            <FormLabel>What is the purpose of your saving plan?</FormLabel>
            <Input
              placeholder="Enter plan name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        );
      case 2:
        return (
          <FormControl mb={3}>
            <FormLabel>What is your current amount?</FormLabel>
            <Input
              type="number"
              placeholder="Enter current amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>
        );
      case 3:
        return (
          <FormControl mb={3}>
            <FormLabel>What is your goal amount?</FormLabel>
            <Input
              type="number"
              placeholder="Enter goal amount"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </FormControl>
        );
      case 4:
        return (
          <FormControl mb={3}>
            <FormLabel>In how many days would you like to achieve this goal?</FormLabel>
            <Input
              type="number"
              placeholder="Enter number of days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </FormControl>
        );
      case 5:
        return (
          <FormControl mb={3}>
            <FormLabel>Which category does this plan belong to?</FormLabel>
            <Select
              placeholder="Select category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
        );
      case 6:
        return (
          <FormControl mb={3}>
            <FormLabel>Pick an emoji or icon to represent this plan</FormLabel>
            <Input
              placeholder="E.g., 🎧"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
            />
          </FormControl>
        );
      case 7:
        return (
          <FormControl mb={3}>
            <FormLabel>
              Enable daily auto-deduction of {dailyAmount ? '₹' + dailyAmount : ''}?
            </FormLabel>
            <Select
              placeholder="Select an option"
              value={autoDeduction}
              onChange={(e) => setAutoDeduction(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <button className="action-buttons" onClick={onOpen}>
        <i className="fa-solid fa-piggy-bank"></i> <span className="button-text">Save it</span>
      </button>
      <p className="send-text">Save</p>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        closeOnOverlayClick={false}
        blockScrollOnMount={true}
      >
      <ModalOverlay
  sx={{
    backdropFilter: { base: 'none', lg: 'blur(5px)' }, // Blur only on larger screens
    height: "100vh", // Full height to ensure it fits the screen
  }}
/>
<ModalContent
  className="modal-container"
  sx={{
    backgroundColor: "#E5EBF6",
    color: "rgb(65, 65, 65)",
    borderRadius: "10px",
    fontFamily: "Noto Sans, sans-serif",
    width: { base: "100%", lg: "60%" },
    maxWidth: { base: "100vw", lg: "60vw" },
    height: { base: "100vh", lg: "auto" }, // Full height for mobile, auto for larger screens
    overflowY: { base: "auto", lg: "unset" }, // Scrollable on mobile if content overflows
  }}
>
          <ModalHeader>{step === 7 ? 'Review & Save' : 'Add a New Saving Plan'}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>{renderInputField()}</ModalBody>

          <ModalFooter>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious} mr={3}>
                Previous
              </Button>
            )}
            {step < 7 ? (
              <Button colorScheme="blue" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button colorScheme="green" onClick={handleSavePlan}>
                Save
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};