import React, { useEffect, useRef, useState } from "react";
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
  Toast,
  useToast,
  border,
} from "@chakra-ui/react";
import gsap from "gsap";
import "../styles/buttonStyles.css";
import "../styles/saveButton.css";
import { usePlans } from "./ContextApi";
import api from "./api";

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

export const SaveButton = ({
  totalBalance,
  onBalanceUpdate,
  updateBalance,
}) => {
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
  const [requiredAmount, setRequiredAmount] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [emoji, setEmoji] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  // const { userId } = usePlans();
  
  const toast = useToast();
  const modalRef = useRef(null);
  const userIdFromLocalStorage = localStorage.getItem("userid");
  const userId =userIdFromLocalStorage;
  const [categories, setCategories] = useState([]);
  const [iconname, setIconName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [shape, setShape] = useState("circle");
  const [iconType, setIconType] = useState("url"); // Either 'url' or 'class'
  

  useEffect(() => {
    calculateRequiredAmount();
  }, [goalAmount, currentAmount, frequency, goalDate]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categoriesget");
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        setStep(4);
      }, 3000);
    }
  }, [step]);

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

  const animateExit = (onComplete) => {
    gsap.to(modalRef.current, {
      opacity: 0,
      x: -100, 
      duration: 0.2, 
      ease: "power1.inOut", 
      onComplete,
    });
  };

  const nextStep = () => {
    animateExit(() => setStep((prev) => prev + 1));
  };

  const prevStep = () => {
    animateExit(() => setStep((prev) => prev - 1));
  };

  useEffect(() => {
    if (!modalRef.current) return;
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, x: 100 }, 
      {
        opacity: 1,
        x: 0, 
        duration: 0.2,
        ease: "power1.inOut", 
      }
    );
  }, [step]);

  const handleSavePlan = async () => {
    const randomColor = generateRandomColor();
    const parsedAmount = parseInt(currentAmount);
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
      imoji: emoji,
      autoDeduction,
      dailyAmount: autoDeduction ? requiredAmount : 0,
      frequency,
      dayOfWeek,
      dayOfMonth,
    };
    if (completionDate) {
      savingPlan.endDate = completionDate;
    }
    console.log("savingsplan", savingPlan);
    try {
      console.log("savingPlan", savingPlan);
      setLoading(true);
      const res = await api.post(
        `/user/${userIdFromLocalStorage}/savingplan`,
        savingPlan
      );
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
    } finally {
      setLoading(false);
    }
    setName("");
    setCurrentAmount("");
    setGoalAmount("");
    setEmoji("");
    setCategory("");
    setAutoDeduction(false);
    setRequiredAmount("");
    setDayOfMonth("");
    setDayOfWeek("");
    setCompletionDate("");
    onClose();
    window.location.reload();
  };
  const frequencies = ["daily", "weekly", "monthly"];
  const handleClick = (value) => {
    setFrequency(value);
  };

  const percentage = ((currentAmount / goalAmount) * 100).toFixed(1);

  const getShapeStyle = (shape, backgroundColor) => {
    const baseStyle = {
      display: "flex",
      margin:"auto",
      justifyContent: "center",
      // FlexDirection:"column",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "150px",
      height: "150px",
    };

    switch (shape) {
      case "circle":
        return { ...baseStyle, borderRadius: "50%", backgroundColor };
      case "square":
        return { ...baseStyle, borderRadius: "8px", backgroundColor };
      case "hexagon":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        };
      case "cave":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius: "100px 100px 10px 10px",
        };
      case "star":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        };
        case "den":
        return {
          ...baseStyle,
          backgroundColor,
          clipPath: "polygon(0% 20%, 100% 20%, 100% 80%, 0% 80%)", 
        };
        case "msg":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius:"60px 50px 50px 0px",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div>
      <button className="action-buttons-saving-plan" onClick={onOpen}>
        <i className="fa-solid fa-piggy-bank"></i>{" "}
        <span className="button-text-save-button">Save it</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        isCentered
        blockScrollOnMount={true}
      >
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
            width: { base: "100%", lg: "30%" },
            maxWidth: { base: "100vw", lg: "60vw" },
            height: { base: "70vh", lg: "auto" },
            overflowY: "auto",
          }}
        >
          <ModalBody className="modal-body" ref={modalRef}>
            <div className="modal-close-button" onClick={onClose}>
              <i class="fa-solid fa-xmark"></i>
            </div>
            {step !== 1 && step !== 3 && (
              <i
                className="fa-solid fa-chevron-left back-icon"
                onClick={prevStep}
              ></i>
            )}

            {step === 1 && (
              <div className="step-container">
                <h1 className="main-heading">Define Your Goal</h1>
                <div className="nav-container">
                  <h1 className="label">Choose a Category</h1>
                  <p className="start-saving-for-it">
                    Start saving towards your dream today!
                  </p>
                </div>
                <div className="category-container">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => {
                        setCategory(cat._id);
                        setIconName(cat.name)
                        setIcon(cat.icon)
                        setBackgroundColor(cat.backgroundColor)
                        setIconType(cat.iconType)
                        setShape(cat.shape)
                        nextStep();
                        setIcon(cat.icon);

                      }}
                      className={` ${category === cat.name ? "selected" : ""}`}
                    >
                      <div  className="category-items-style">
                        <span
                          style={{...getShapeStyle(cat.shape, cat.backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {cat.iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    category.shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={cat.icon}
                              />
                            </>
                            
                          )}
                          {cat.iconType === "class" && (
                            <div className="category-items-style">
                              <span>
                          <i className={cat.icon}></i>
                              </span>
                          <h1>{cat.name}</h1>
                            </div>
                          )}
                        </span>
                      </div>
                          {/* <p style={{color: "black"}}>{cat.name}</p> */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-container">
                <div>
                  <h1 className="label">Personalize Your Goal</h1>
                </div>
                <div className="creating-pot">
                <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", 
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                        <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
                </div>
                <div className="input-feld-and-label-container">
                  <label className="label-for-input">Goal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Goal Name"
                    className="input-field"
                  />
                  <button className="next-button" onClick={nextStep}>
                    Create
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step3">
                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                           <div className="category-items-style">
                           <span>
                       <i className={icon}></i>
                           </span>
                       <h1>{iconname}</h1>
                         </div>
                          )}
                        </span>
                </div>
                <p className="pot-created-text">
                  <strong>{name}</strong> Goal Successfully Created!
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="step4">
                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                        <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
                </div>
                <div className="step-verification-container">
                  <p>1 Step Closer to Your Goal</p>
                  <p>
                    Become a verified member to Start adding Money to your goal
                  </p>
                </div>
                <button className="next-button" onClick={nextStep}>
                  Verify Now
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="step-container">
                <h1 className="label">Set Your Starting Point</h1>
                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                           <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
                </div>
                <div className="input-feld-and-label-container">
                  <label className="label-for-input">
                    Enter Current Amount
                  </label>
                  <input
                    type="text"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="Enter your current amount"
                    className="input-field"
                  />
                  <button className="next-button" onClick={nextStep}>
                    Set Current Amount
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="step-container">
                <h1 className="label">Define Your Target</h1>
                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                              <h1>{iconname}</h1>
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                        <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
        
                </div>
                <div className="input-feld-and-label-container">
                  <label className="label-for-input">Goal Amount</label>
                  <input
                    type="number"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="Enter the total amount you'd like to save"
                    className="input-field"
                  />
                  <button className="next-button" onClick={nextStep}>
                    Set a Goal Amount
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="step-container">
                <h1 className="label">Timeline for Your Goal</h1>
                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                        <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
            
                </div>
                <div className="input-feld-and-label-container">
                  <label className="label-for-input">End Date</label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    placeholder="Select a date to achieve your goal"
                    className="input-field"
                  />
                  <button className="next-button" onClick={nextStep}>
                    {goalDate === "" ? "Skip" : "Set end date"}
                  </button>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="step-container">
                <h1 className="label">Automate Your Savings</h1>

                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                        <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
                 
                </div>

                <div className="toggle-container">
                  <label>
                    <input
                      type="checkbox"
                      checked={autoDeduction}
                      onChange={() => setAutoDeduction(!autoDeduction)}
                      className="checkbox-input-box"
                    />
                    Choose Deduction Frequency
                  </label>
                </div>

                {!autoDeduction && (
                  <button className="next-button" onClick={nextStep}>
                    Skip
                  </button>
                )}

                {autoDeduction && (
                  <>
                    <label className="label">Select Deduction Frequency</label>
                    <div
                      className="frequency-container"
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      {frequencies.map((freq) => (
                        <div
                          key={freq}
                          onClick={() => handleClick(freq)}
                          className={`frequency-option ${
                            frequency === freq ? "selected" : ""
                          }`}
                          style={{
                            cursor: "pointer",
                            padding: "10px",
                            border: `2px solid ${
                              frequency === freq ? "green" : "gray"
                            }`,
                            borderRadius: "5px",
                            backgroundColor:
                              frequency === freq ? "#e0f7ff" : "#fff",
                            opacity: frequency && frequency !== freq ? 0.5 : 1,
                            flex: "1",
                            textAlign: "center",
                          }}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </div>
                      ))}
                    </div>

                    {frequency && (
                      <div className="frequency-options">
                        {frequency === "daily" && <></>}
                        {frequency === "weekly" && (
                          <select
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(e.target.value)}
                            className="input-field"
                          >
                            <option value="">Select a Day of the Week</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        )}
                        {frequency === "monthly" && (
                          <input
                            type="number"
                            value={dayOfMonth}
                            onChange={(e) =>
                              setDayOfMonth(Math.min(30, e.target.value))
                            }
                            placeholder="Enter date of the month"
                            className="input-field"
                          />
                        )}
                      </div>
                    )}

                    {requiredAmount > 0 && goalDate && (
                      <div className="summary">
                        <p>
                          To reach your goal by {goalDate}, you need to save
                          approximately <span>₹{requiredAmount}</span> per{" "}
                          {frequency}.
                        </p>
                        <p>
                          Estimated completion date:{" "}
                          <span>{completionDate}</span>
                        </p>
                      </div>
                    )}

                    {!goalDate && (
                      <div className="input-feld-and-label-container">
                        <label className="label-for-input">
                          Enter Auto Deduction Amount{" "}
                          {frequency ? frequency : "Daily"}
                        </label>
                        <input
                          type="number"
                          value={requiredAmount == 0 ? "" : requiredAmount}
                          onChange={(e) => setRequiredAmount(e.target.value)}
                          placeholder="Deduction amount Amount"
                          className="input-field"
                        />
                      </div>
                    )}

                    <button className="next-button" onClick={nextStep}>
                      Set Auto Deduction
                    </button>
                  </>
                )}
              </div>
            )}
            {step === 9 && (
              <div className="step-container">
                <div className="creating-pot">
                  <span
                          style={{...getShapeStyle(shape, backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {iconType === "url" && (
                            <>
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", // Circle-specific styling
                                }}
                                src={icon}
                              />
                            </>
                          )}
                          {iconType === "class" && (
                            <div className="category-items-style">
                            <span>
                        <i className={icon}></i>
                            </span>
                        <h1>{iconname}</h1>
                          </div>
                          )}
                        </span>
               
                </div>

                <div className="creating-pot-last-step">
                  <p>Currently in the Pot</p>
                  <h1 className="current-amount-while-creating">
                    ₹{currentAmount.toLocaleString()}
                  </h1>

                  <div className="progress-container">
                    <div
                      className="progress"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="progress-text">
                        {percentage}% of ₹{goalAmount.toLocaleString()} Goal
                      </span>
                    </div>
                  </div>
                </div>

                <button className="lock-button" onClick={handleSavePlan}>
                  {loading ? "Loading..." : "Lock And Load"}
                </button>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};