import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./api";
import "../styles/SavingPage.css";
import { SavingPlanHistory } from "./SavingPlanHistory";
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
  Box,
  Spinner,
} from "@chakra-ui/react";
import EditDeductionModel from "./EditDetuctionModel";

export const SavingPlanPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [balance, setBalance] = useState(null);
  const { id } = useParams();
  const userid = localStorage.getItem("userid");
  const toast = useToast();

  // const categories = [
  //   { label: "Holiday", icon: "fa-solid fa-plane" },
  //   { label: "Health", icon: "fa-solid fa-heart-pulse" },
  //   { label: "Home", icon: "fa-solid fa-house" },
  //   { label: "Business", icon: "fa-solid fa-briefcase" },
  //   { label: "Education", icon: "fa-solid fa-graduation-cap" },
  //   { label: "Gadgets", icon: "fa-solid fa-mobile" },
  //   { label: "Gifts", icon: "fa-solid fa-gift" },
  //   { label: "Emergency", icon: "fa-solid fa-ambulance" },
  //   { label: "Vehicle", icon: "fa-solid fa-car" },
  //   { label: "Others", icon: "fa-solid fa-ellipsis" },
  // ];


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
        console.error("Error fetching saving plan data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userid, id]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionsClose();

    if (option === "Add Money") {
      onInputModalOpen();
    } else if (option === "Modify Auto Deduction") {
      onEditDeductionOpen();
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedOption === "Add Money") {
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
          currentBalance: balance + addedAmount,
        });
        setBalance((prevBalance) => prevBalance + addedAmount);
        toast({
          title: "Money added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setInputValue("");
      onInputModalClose();
    } catch (error) {
      console.error("Error updating saving plan:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
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
    return (
      <div className="loading-container">
        <Spinner size="xl" color="blue.500" />
      </div>
    );
  }

  const remainingAmount = data.targetAmount
    ? data.targetAmount - balance
    : 0;
  const daysRequired =
    data.dailyAmount > 0
      ? Math.ceil(remainingAmount / data.dailyAmount)
      : "N/A";
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const getShapeStyle = (shape, backgroundColor) => {
    const baseStyle = {
      display: "flex",
      margin:"auto",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "130px",
      height: "130px",
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
          borderRadius: "50px 50px 0 0",
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
    <div className="saving-plan-page-main-container">
      <div>
        <h1 className="savingpage-header">
          Your {data.potPurpose} Saving Plan
        </h1>
        <div className="goal-section">
          <div className="header-container-savepage" >
            <div className="saving-plan-top-container-savingpage">
              <div>
                <div className="creating-pot-container-savingplan-page">
                <span
                          style={{...getShapeStyle( data.category.shape , data.category.backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {data.category.iconType === "url" && (
                            
                              <img
                                alt="Category Icon"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  borderRadius:
                                    shape === "circle" ? "50%" : "0", 
                                }}
                                src={data.category.icon}
                              />
                            
                          )}
                          {data.category.iconType === "class" && (
                            
                              <div className="category-items-style">
                          <span>
                            <i className={data.category.icon}></i>
                          </span>
                          <h1>{data.category.name}</h1>
                        </div>
                            
                          )}
                        </span>

                </div>
              </div>
              <div className="saving-plan-top-right-container-saving-plan">
                <div className="plan-details-savingpage">
                  <h1 className="current-amount-savingpage">
                      <span>₹{balance}</span> Current Balance
                  </h1>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${
                        (balance / data.targetAmount) * 100
                      }%`,
                      backgroundColor: data.color || "blue",
                    }}
                  ></div>
                </div>
                <span className="progress-text-savingpage">
                  {((balance / data.targetAmount) * 100)}% of ₹
                  {data.targetAmount}
                </span>
              </div>
            </div>
              <div>
              <h3 className="current-amount-savingpage"><span>{daysRequired}</span> Days Left to Reach Target</h3>
            </div>
          </div>
        </div>

        <div className="money-and-date-container">
          <div className="money-deails-container">
          </div>
        </div>
        <div>
               {/* <div className="add-goal-card" onClick={onOptionsOpen}>
            <i className="fa-solid fa-bars"></i>Manage
          </div> */}
          <SavingPlanHistory />
        </div>
      </div>
      <Modal isOpen={isOptionsOpen} onClose={onOptionsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose an Option</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button
              onClick={() => handleOptionClick("Add Money")}
              width="100%"
              mb={2}
            >
              Add Money
            </Button>
            <Button
              onClick={() => handleOptionClick("Modify Auto Deduction")}
              width="100%"
              mb={2}
            >
              Modify Auto Deduction
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isInputModalOpen} onClose={onInputModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Amount</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
