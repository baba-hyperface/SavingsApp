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
  Box,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import "../styles/buttonStyles.css";
import { usePlans } from "./ContextApi";

const SaveButton = ({ totalBalance, onBalanceUpdate, updateBalance }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [frequency, setFrequency] = useState("");
  const [autoDeduction, setAutoDeduction] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [completionDate, setCompletionDate] = useState("");
  const { userId } = usePlans();

  useEffect(() => {
    calculateRequiredAmount();
  }, [goalAmount, currentAmount, frequency, goalDate]);

  const calculateRequiredAmount = () => {
    const parsedGoal = parseInt(goalAmount);
    const parsedAmount = parseInt(currentAmount);
    const daysLeft = calculateDaysLeft(goalDate);

    if (parsedGoal && parsedAmount && daysLeft > 0) {
      const remainingAmount = parsedGoal - parsedAmount;
      let requiredAmountPerPeriod = 0;
      let completionDate;

      switch (frequency) {
        case "daily":
          requiredAmountPerPeriod = Math.ceil(remainingAmount / daysLeft);
          completionDate = new Date(
            Date.now() + daysLeft * 24 * 60 * 60 * 1000
          );
          console.log("completionDate", completionDate);
          break;
        case "weekly":
          const weeksLeft = Math.ceil(daysLeft / 7);
          requiredAmountPerPeriod = Math.ceil(remainingAmount / weeksLeft);
          completionDate = new Date(
            Date.now() + weeksLeft * 7 * 24 * 60 * 60 * 1000
          );
          break;
        case "monthly":
          const monthsLeft = Math.ceil(daysLeft / 30);
          requiredAmountPerPeriod = Math.ceil(remainingAmount / monthsLeft);
          completionDate = new Date(
            Date.now() + monthsLeft * 30 * 24 * 60 * 60 * 1000
          );
          break;
        default:
          requiredAmountPerPeriod = 0;
      }

      setRequiredAmount(requiredAmountPerPeriod);
      console.log("completion date formate like", completionDate);
      if (completionDate instanceof Date && !isNaN(completionDate)) {
        console.log(completionDate);
        setCompletionDate(completionDate.toDateString());
      } else {
        console.error("Invalid completion date:", completionDate);
      }
    } else {
      setRequiredAmount(0);
      setCompletionDate("");
    }
  };
  const [required, setRequired] = useState({
    requiredAmountPerPeriodday: 0,
    requiredAmountPerPeriodweek: 0,
    requiredAmountPerPeriodmon: 0,
    completionDateday: "",
    completionDateweek: "",
    completionDatemon: "",
  });

  const calculateRequirements = () => {
    const remainingAmount = goalAmount - currentAmount;

    const goalDateObj = new Date(goalDate);
    const today = new Date();
    const daysRemaining = Math.ceil(
      (goalDateObj - today) / (1000 * 60 * 60 * 24)
    );

    const requiredAmountPerPeriodday = remainingAmount / daysRemaining;
    const requiredAmountPerPeriodweek =
      remainingAmount / Math.ceil(daysRemaining / 7);
    const requiredAmountPerPeriodmon =
      remainingAmount / Math.ceil(daysRemaining / 30);

    const completionDateday = new Date(
      today.getTime() + daysRemaining * 24 * 60 * 60 * 1000
    );
    const completionDateweek = new Date(
      today.getTime() + Math.ceil(daysRemaining / 7) * 7 * 24 * 60 * 60 * 1000
    );
    const completionDatemon = new Date(
      today.getTime() + Math.ceil(daysRemaining / 30) * 30 * 24 * 60 * 60 * 1000
    );

    setRequired({
      requiredAmountPerPeriodday: requiredAmountPerPeriodday.toFixed(2),
      requiredAmountPerPeriodweek: requiredAmountPerPeriodweek.toFixed(2),
      requiredAmountPerPeriodmon: requiredAmountPerPeriodmon.toFixed(2),
      completionDateday: completionDateday.toISOString().split("T")[0],
      completionDateweek: completionDateweek.toISOString().split("T")[0],
      completionDatemon: completionDatemon.toISOString().split("T")[0],
    });
  };
  useEffect(() => {
    if (currentAmount && goalAmount && goalDate) {
      calculateRequirements();
    }
  }, [currentAmount, goalAmount, goalDate]);

  const calculateDaysLeft = (goalDate) => {
    const selectedDate = new Date(goalDate);
    const currentDate = new Date();
    const timeDiff = selectedDate - currentDate;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

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
      currentBalance: currentAmount,
      targetAmount: goalAmount,
      category: category,
      color: randomColor,
      emoji: emoji,
      autoDeduction,
      endDate: completionDate,
      dailyAmount: autoDeduction ? dailyAmount : 0,
      frequency,
      dayOfWeek,
      dayOfMonth,
    };
    try {
      const res = await api.post(`/user/${userId}/savingplan`, savingPlan);
      console.log("created", res.data);
      const newBalance = await updateBalance(
        userId,
        totalBalance,
        currentAmount,
        false
      );
      onBalanceUpdate(newBalance);
    } catch (error) {
      console.log(error.message);
    }
    setName("");
    setAmount("");
    setGoal("");
    setEmoji("");
    setCategory("");
    setAutoDeduction("no");
    setDailyAmount("");
    setDays("");
    onClose();
    window.location.reload();
  };

  return (
    <div>
      <button className="action-buttons" onClick={onOpen}>
        <i className="fa-solid fa-piggy-bank"></i>{" "}
        <span className="button-text">Save it</span>
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
          <ModalHeader>Create a New Saving Pot - Step {step}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 1 && (
              <>
                <FormControl mb={3}>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="travel">Travel & Vacations</option>
                    <option value="health">Health & Wellness</option>
                    <option value="home">Home & Property</option>
                    <option value="business">
                      Business & Entrepreneurship
                    </option>
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
                  <FormLabel>Pot Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </>
            )}

            {step === 2 && (
              <>
                <FormControl mb={3}>
                  <FormLabel>Current Amount</FormLabel>
                  <Input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                  />
                </FormControl>
                {currentAmount > totalBalance && (
                  <Text color={"red"}>
                    You can't add more than {totalBalance}{" "}
                  </Text>
                )}

                <FormControl mb={3}>
                  <FormLabel>Goal Amount</FormLabel>
                  <Input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>Goal End Date</FormLabel>
                  <Input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                  />
                </FormControl>
                {goalDate && (
                  <>
                    <p>
                      Daily required amount:
                      {required.requiredAmountPerPeriodday},Completion Date:{" "}
                      {required.completionDateday}
                    </p>
                    <p>
                      Weekly required amount:
                      {required.requiredAmountPerPeriodweek},Completion Date:{" "}
                      {required.completionDateweek}
                    </p>
                    <p>
                      Monthly required amount:
                      {required.requiredAmountPerPeriodmon},Completion Date
                      (Monthly): {required.completionDatemon}
                    </p>
                  </>
                )}
              </>
            )}
            {step === 3 && (
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
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </FormControl>
                )}

                {autoDeduction && (
                  <>
                    {requiredAmount > 0 && (
                      <div>
                        <p>
                          To reach your goal by {goalDate}, you need to save:
                        </p>
                        <p>
                          <strong>₹{requiredAmount}</strong> per {frequency}
                        </p>
                        <p>
                          Estimated completion date:{" "}
                          <strong>{completionDate}</strong>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {step === 4 && (
              <>
                {autoDeduction && (
                  <>
                    {frequency === "daily" && (
                      <Text mb={3}>
                        You will need to pay approximately{" "}
                        <strong>{requiredAmount}</strong> {frequency} to reach
                        your goal by {completionDate}.
                      </Text>
                    )}

                    {frequency === "weekly" && (
                      <>
                        <FormControl mb={3}>
                          <FormLabel>Choose Day of the Week</FormLabel>
                          <Select
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(e.target.value)}
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </Select>
                        </FormControl>
                        <Text mb={3}>
                          Paying on <strong>{dayOfWeek}</strong> each week will
                          help you reach your goal by {goalDate}.
                        </Text>
                      </>
                    )}

                    {frequency === "monthly" && (
                      <>
                        <FormControl mb={3}>
                          <FormLabel>Choose Day of the Month</FormLabel>
                          <Input
                            type="number"
                            placeholder="e.g., 15"
                            value={dayOfMonth}
                            onChange={(e) =>
                              setDayOfMonth(
                                e.target.value > 30 ? 30 : e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <Text mb={3}>
                          Paying on day <strong>{dayOfMonth}</strong> of each
                          month will help you reach your goal by {goalDate}.
                        </Text>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <Box display="flex" justifyContent="space-between" mt={4}>
              {step > 1 && <Button onClick={prevStep}>Previous</Button>}
              {step < 4 ? (
                <Button colorScheme="blue" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button colorScheme="green" onClick={handleSavePlan}>
                  Create Pot
                </Button>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SaveButton;
