import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Checkbox,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import api from "./api";

const EditDeductionModel = ({ potId, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(0);
  const [goalDate, setGoalDate] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [autoDeduction, setAutoDeduction] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [requirements, setRequirements] = useState({
    daily: { amount: 0, date: "" },
    weekly: { amount: 0, date: "" },
    monthly: { amount: 0, date: "" },
  });
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${userId}/savingplan/${potId}`);
        const fetchedData = res.data;
        setData(fetchedData);
        setCurrentAmount(fetchedData.currentBalance || 0);
        setGoalAmount(fetchedData.targetAmount || 0);
        setGoalDate(fetchedData.endDate || "");
        setFrequency(fetchedData.frequency || "daily");
        setAutoDeduction(fetchedData.autoDeduction || false);
        setDayOfWeek(fetchedData.dayOfWeek || "Monday");
        setDayOfMonth(fetchedData.dayOfMonth || 1);
      } catch (error) {
        console.error("Error fetching pot details:", error);
      }
    };
    if (potId) fetchData();
  }, [potId, userId]);

  useEffect(() => {
    if (goalAmount && currentAmount && goalDate) {
      calculateRequirements();
    }
  }, [goalAmount, currentAmount, goalDate]);

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  };

  const calculateRequirements = () => {
    const remainingAmount = goalAmount - currentAmount;
    const daysRemaining = calculateDaysLeft(goalDate);

    if (daysRemaining > 0) {
      const dailyAmount = remainingAmount / daysRemaining;
      const weeklyAmount = remainingAmount / Math.ceil(daysRemaining / 7);
      const monthlyAmount = remainingAmount / Math.ceil(daysRemaining / 30);

      setRequirements({
        daily: {
          amount: dailyAmount.toFixed(2),
          date: new Date(
            Date.now() + daysRemaining * 24 * 60 * 60 * 1000
          ).toDateString(),
        },
        weekly: {
          amount: weeklyAmount.toFixed(2),
          date: new Date(
            Date.now() + Math.ceil(daysRemaining / 7) * 7 * 24 * 60 * 60 * 1000
          ).toDateString(),
        },
        monthly: {
          amount: monthlyAmount.toFixed(2),
          date: new Date(
            Date.now() +
              Math.ceil(daysRemaining / 30) * 30 * 24 * 60 * 60 * 1000
          ).toDateString(),
        },
      });
    } else {
      setRequirements({
        daily: { amount: 0, date: "" },
        weekly: { amount: 0, date: "" },
        monthly: { amount: 0, date: "" },
      });
    }
  };

  const handleSavePlan = async () => {
    const savingPlan = {
      autoDeduction,
      endDate: requirements[frequency]?.date || completionDate,
      dailyAmount: autoDeduction
        ? requirements[frequency]?.amount || requiredAmount
        : 0,
      frequency,
      dayOfWeek,
      dayOfMonth,
    };

    console.log("Saving Plan Data:", savingPlan); 

    try {
      const res = await api.patch(
        `/users/${userId}/savingplanupdateplandeduction/${potId}`,
        savingPlan
      );
      console.log("Updated plan:", res.data);
    } catch (error) {
      console.error("Error Editing saving plan:", error);
    }
    setStep(1);
    onClose();
    window.location.reload();
  };
  const frequencies=["daily","weekly","monthly"];
  const handleClick = (value) => {
    setFrequency(value);
  };

  return (
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
          backdropFilter: { base: "none", lg: "blur(5px)" },
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
          height: { base: "100vh", lg: "auto" },
          overflowY: { base: "auto", lg: "unset" },
        }}
      >
        <ModalHeader>Edit Pot Auto Deduction - Step {step}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 && (
            <>
              {goalDate
                ? "your Current Goal Date" + goalDate
                : "No Target Date you have"}
              <FormControl mb={3}>
                <FormLabel>Goal Date</FormLabel>
                <Input
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                />
              </FormControl>
              {goalDate && (
                <>
                  <Text>
                    Daily: ₹{requirements.daily.amount}, by{" "}
                    {requirements.daily.date}
                  </Text>
                  <Text>
                    Weekly: ₹{requirements.weekly.amount}, by{" "}
                    {requirements.weekly.date}
                  </Text>
                  <Text>
                    Monthly: ₹{requirements.monthly.amount}, by{" "}
                    {requirements.monthly.date}
                  </Text>
                </>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <FormControl mb={3}>
                <FormLabel>Auto Deduction</FormLabel>
                <Checkbox
                  isChecked={autoDeduction}
                  onChange={(e) => setAutoDeduction(e.target.checked)}
                >
                  Enable Auto Deduction
                </Checkbox>
              </FormControl>
              {autoDeduction && (
                <FormControl mb={3}>
                  <FormLabel>Payment Method</FormLabel>
                  <Box display="flex" gap={4}>
                    {frequencies.map((freq) => (
                      <Box
                        key={freq}
                        onClick={() => handleClick(freq)}
                        cursor="pointer"
                        p={4}
                        borderWidth={2}
                        borderRadius="md"
                        borderColor={
                          frequency === freq ? "blue.500" : "gray.300"
                        }
                        bg={frequency === freq ? "blue.100" : "white"}
                        opacity={frequency && frequency !== freq ? 0.5 : 1} 
                        _hover={{
                          bg: frequency === freq ? "blue.200" : "gray.100",
                        }} 
                      >
                        <Text textAlign="center">
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </FormControl>
              )}
              {autoDeduction && (
                <>
                  <Text>
                    To reach your goal by {goalDate}, you need to save:
                  </Text>
                  <Text fontWeight="bold">
                    ₹{requirements[frequency]?.amount} per {frequency}
                  </Text>
                  <Text>
                    Estimated completion date: {requirements[frequency]?.date}
                  </Text>
                </>
              )}
            </>
          )}
          {step === 3 && (
            <>
              {frequency === "weekly" && (
                <FormControl mb={3}>
                  <FormLabel>Choose Day of the Week</FormLabel>
                  <Select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </Select>
                </FormControl>
              )}
              {frequency === "monthly" && (
                <FormControl mb={3}>
                  <FormLabel>Choose Day of the Month</FormLabel>
                  <Input
                    type="number"
                    value={dayOfMonth}
                    onChange={(e) =>
                      setDayOfMonth(Math.min(30, e.target.value))
                    }
                  />
                </FormControl>
              )}
              <Text mb={3}>
                Paying on the <strong>{dayOfMonth}</strong> of each month will
                help you reach your goal by {goalDate}.
              </Text>
            </>
          )}
          <Box display="flex" justifyContent="space-between" mt={4}>
            {step > 1 && (
              <Button onClick={() => setStep(step - 1)} colorScheme="blue">
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} colorScheme="blue">
                Next
              </Button>
            ) : (
              <Button onClick={handleSavePlan} colorScheme="green">
                Save
              </Button>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditDeductionModel;
