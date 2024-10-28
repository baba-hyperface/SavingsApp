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

const EditDeductionModel = ({pot,isOpen,onClose}) => {
  const [step, setStep] = useState(1);
  const [currentAmount, setCurrentAmount] = useState(pot.currentBalance);
  const [goalAmount, setGoalAmount] = useState(pot.targetAmount);
  const [goalDate, setGoalDate] = useState(pot.endDate);
  const [frequency, setFrequency] = useState(pot.frequency);
  const [autoDeduction, setAutoDeduction] = useState(pot.autoDeduction);
  const [dayOfWeek, setDayOfWeek] = useState(pot.dayOfWeek);
  const [dayOfMonth, setDayOfMonth] = useState(pot.dayOfMonth);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [completionDate, setCompletionDate] = useState("");
  const { userId } = usePlans();

  useEffect(() => {
    calculateRequiredAmount();
  }, [goalAmount, currentAmount, frequency, goalDate]);


  useEffect(() => {
    if (pot) {
      setCurrentAmount(pot.currentBalance || 0);
      setGoalAmount(pot.targetAmount || 0);
      setGoalDate(pot.endDate || "");
      setFrequency(pot.frequency || "daily");
      setAutoDeduction(pot.autoDeduction || false);
      setDayOfWeek(pot.dayOfWeek || "Monday");
      setDayOfMonth(pot.dayOfMonth || 1);
    }
  }, [pot]);

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

    const savingPlan = {
    //   potPurpose: name,
    //   currentBalance: currentAmount,
    //   targetAmount: goalAmount,
    //   category: category,
    //   color: randomColor,
    //   emoji: emoji,
      autoDeduction,
      endDate: completionDate,
      dailyAmount: autoDeduction ? requiredAmount : 0,
      frequency,
      dayOfWeek,
      dayOfMonth,
    };
    // try {
    //   const res = await api.post(`/user/${userId}/savingplan`, savingPlan);
    //   console.log("created", res.data);
    //   const newBalance = await updateBalance(
    //     userId,
    //     totalBalance,
    //     currentAmount,
    //     false
    //   );
    //   onBalanceUpdate(newBalance);
    // } catch (error) {
    //   console.log(error.message);
    // }
    console.log(savingPlan);
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
          <ModalHeader>Editing your Pot AutoDeduction- Step {step}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            {step === 1 && (
              <>
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

            {step === 3 && (
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
              {step < 3 ? (
                <Button colorScheme="blue" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button colorScheme="green" onClick={handleSavePlan}>
                  Update
                </Button>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditDeductionModel;
// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   Button,
//   Text,
//   Box,
//   Checkbox,
//   InputGroup,
//   InputRightElement,
// } from "@chakra-ui/react";
// import "../styles/buttonStyles.css";
// import { usePlans } from "./ContextApi";
// import { CalendarIcon } from "@chakra-ui/icons";
// import DatePicker from "react-datepicker";
// import '../styles/inputdate.css';

// const EditDeductionModel = ({ pot, isOpen, onClose }) => {
//   const [step, setStep] = useState(1);
//   const [currentAmount, setCurrentAmount] = useState("");
//   const [goalAmount, setGoalAmount] = useState("");
//   const [goalDate, setGoalDate] = useState("");
//   const [frequency, setFrequency] = useState("");
//   const [autoDeduction, setAutoDeduction] = useState(false);
//   const [dayOfWeek, setDayOfWeek] = useState("");
//   const [dayOfMonth, setDayOfMonth] = useState("");
//   const [requiredAmount, setRequiredAmount] = useState(0);
//   const [completionDate, setCompletionDate] = useState("");
//   const { userId } = usePlans();


//   useEffect(() => {
//     calculateRequiredAmount();
//   }, [goalAmount, currentAmount, frequency, goalDate]);

//   const calculateRequiredAmount = () => {
//     const parsedGoal = parseInt(goalAmount);
//     const parsedAmount = parseInt(currentAmount);
//     const daysLeft = calculateDaysLeft(goalDate);

//     if (parsedGoal && parsedAmount && daysLeft > 0) {
//       const remainingAmount = parsedGoal - parsedAmount;
//       let requiredAmountPerPeriod = 0;
//       let completionDate;

//       switch (frequency) {
//         case "daily":
//           requiredAmountPerPeriod = Math.ceil(remainingAmount / daysLeft);
//           completionDate = new Date(
//             Date.now() + daysLeft * 24 * 60 * 60 * 1000
//           );
//           break;
//         case "weekly":
//           const weeksLeft = Math.ceil(daysLeft / 7);
//           requiredAmountPerPeriod = Math.ceil(remainingAmount / weeksLeft);
//           completionDate = new Date(
//             Date.now() + weeksLeft * 7 * 24 * 60 * 60 * 1000
//           );
//           break;
//         case "monthly":
//           const monthsLeft = Math.ceil(daysLeft / 30);
//           requiredAmountPerPeriod = Math.ceil(remainingAmount / monthsLeft);
//           completionDate = new Date(
//             Date.now() + monthsLeft * 30 * 24 * 60 * 60 * 1000
//           );
//           break;
//         default:
//           requiredAmountPerPeriod = 0;
//       }

//       setRequiredAmount(requiredAmountPerPeriod);
//       if (completionDate instanceof Date && !isNaN(completionDate)) {
//         setCompletionDate(completionDate.toDateString());
//       } else {
//         console.error("Invalid completion date:", completionDate);
//       }
//     } else {
//       setRequiredAmount(0);
//       setCompletionDate("");
//     }
//   };

//   const calculateDaysLeft = (goalDate) => {
//     const selectedDate = new Date(goalDate);
//     const currentDate = new Date();
//     const timeDiff = selectedDate - currentDate;
//     return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//   };

//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);

//   const handleSavePlan = async () => {
//     const savingPlan = {
//       autoDeduction,
//       endDate: completionDate,
//       dailyAmount: autoDeduction ? requiredAmount : 0,
//       frequency,
//       dayOfWeek,
//       dayOfMonth,
//     };
//     console.log(savingPlan);
//     onClose();
//     window.location.reload();
//   };

//   return (
//     <div>
//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         size="md"
//         isCentered
//         closeOnOverlayClick={false}
//         blockScrollOnMount={true}
//       >
//         <ModalOverlay
//           sx={{
//             backdropFilter: { base: "none", lg: "blur(5px)" },
//             height: "100vh",
//           }}
//         />
//         <ModalContent
//           className="modal-container"
//           sx={{
//             color: "rgb(65, 65, 65)",
//             borderRadius: "10px",
//             fontFamily: "Noto Sans, sans-serif",
//             width: { base: "100%", lg: "60%" },
//             maxWidth: { base: "100vw", lg: "60vw" },
//             height: { base: "100vh", lg: "auto" },
//             overflowY: { base: "auto", lg: "unset" },
//           }}
//         >
//           <ModalHeader>
//             Editing your Pot AutoDeduction - Step {step}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {step === 1 && (
//               <>
//                 <FormControl mb={3}>
//                   <FormLabel>Goal End Date</FormLabel>
//                   <InputGroup>
//                     <InputRightElement
//                       pointerEvents="none"
//                       children={<CalendarIcon color="teal.500" />}
//                     />
//                     <DatePicker
//                       selected={goalDate}
//                       onChange={(date) => setGoalDate(date)}
//                       customInput={
//                         <Input
//                           placeholder="Select a date"
//                           bg="gray.50"
//                           borderColor="teal.400"
//                           _hover={{ borderColor: "teal.500" }}
//                           _focus={{
//                             borderColor: "teal.600",
//                             boxShadow: "0 0 0 1px teal.600",
//                           }}
//                           borderRadius="md"
//                           padding="0.5rem"
//                           fontWeight="500"
//                           cursor="pointer"
//                         />
//                       }
//                       dateFormat="MMMM d, yyyy"
//                       popperPlacement="bottom"
//                       popperClassName="custom-datepicker-popper"
//                       wrapperClassName="custom-datepicker-wrapper"
//                     />
//                   </InputGroup>
//                 </FormControl>
//                 {goalDate && (
//                   <>
//                     <p>Daily required amount: ₹{requiredAmount}</p>
//                     <p>Estimated completion date: {completionDate}</p>
//                   </>
//                 )}
//               </>
//             )}
//             {step === 2 && (
//               <>
//                 <FormControl mb={3}>
//                   <FormLabel>Auto Deduction</FormLabel>
//                   <Checkbox
//                     isChecked={autoDeduction}
//                     onChange={(e) => setAutoDeduction(e.target.checked)}
//                   >
//                     Enable Auto Deduction
//                   </Checkbox>
//                 </FormControl>
//                 {autoDeduction && (
//                   <FormControl mb={3}>
//                     <FormLabel>Payment Frequency</FormLabel>
//                     <Select
//                       value={frequency}
//                       onChange={(e) => setFrequency(e.target.value)}
//                     >
//                       <option value="daily">Daily</option>
//                       <option value="weekly">Weekly</option>
//                       <option value="monthly">Monthly</option>
//                     </Select>
//                   </FormControl>
//                 )}
//               </>
//             )}
//             {step === 3 && autoDeduction && (
//               <>
//                 <Text mb={3}>
//                   You will need to pay approximately ₹{requiredAmount}{" "}
//                   {frequency} to reach your goal by {completionDate}.
//                 </Text>
//               </>
//             )}
//             <Box display="flex" justifyContent="space-between" mt={4}>
//               {step > 1 && <Button onClick={prevStep}>Previous</Button>}
//               {step < 3 ? (
//                 <Button colorScheme="blue" onClick={nextStep}>
//                   Next
//                 </Button>
//               ) : (
//                 <Button colorScheme="green" onClick={handleSavePlan}>
//                   Update
//                 </Button>
//               )}
//             </Box>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default EditDeductionModel;
