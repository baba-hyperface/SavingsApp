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

  const categories = [
    { label: "Holiday", icon: "fa-solid fa-plane" },
    { label: "Health", icon: "fa-solid fa-heart-pulse" },
    { label: "Home", icon: "fa-solid fa-house" },
    { label: "Business", icon: "fa-solid fa-briefcase" },
    { label: "Education", icon: "fa-solid fa-graduation-cap" },
    { label: "Gadgets", icon: "fa-solid fa-mobile" },
    { label: "Gifts", icon: "fa-solid fa-gift" },
    { label: "Emergency", icon: "fa-solid fa-ambulance" },
    { label: "Vehicle", icon: "fa-solid fa-car" },
    { label: "Others", icon: "fa-solid fa-ellipsis" },
  ];


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
                <i
                      className={`fa ${data.category &&
                        categories.find((cat) => cat.label === data.category).icon
                        }`}
                    ></i>
                  <p>{data.category}</p>
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
                <h3 className="current-amount-savingpage"><span>₹{data.dailyAmount}</span> {data.frequncy? data.frequncy:"Daily"} Target</h3>
              </div>
            <div>
                <h3 className="current-amount-savingpage"><span>₹{remainingAmount}</span> Remaining to Reach Target </h3>
              </div>
              <div>
              <h3 className="current-amount-savingpage"><span>{daysRequired}</span> Days Left to Reach Target</h3>
            </div>
          </div>
        </div>

        <div className="money-and-date-container">
          <div className="money-deails-container">
          </div>
          <div className="date-deails-container">
            <div className="date-child-container">
              <div>
                <i className="fa-solid fa-calendar-days"></i>
              </div>
              <div>
                <h5>{formatDate(data.startDate)}</h5>
                <p>Start date</p>
              </div>
            </div>
            <div className="date-child-container">
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
