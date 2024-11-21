import React, { useEffect, useState } from "react";
import "../styles/SavingPlans.css";
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
  useBreakpointValue,
  Box,
} from "@chakra-ui/react";
import api from "./api";
import { FiFilter, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePlans } from "./ContextApi";
import { FilterModal } from "./FilterModel";
import EditDeductionModel from "./EditDetuctionModel";
import { SaveButton } from "./SaveButton";
import { DeActivatedPage } from "./DeActivatedPage";
export const SavingPlans = ({
  totalBalance,
  onBalanceUpdate,
  updateBalance,
}) => {
  const [addMoney, setAddMoney] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [balance, setBalance] = useState(totalBalance);
  const toast = useToast();
  const {
    refreshkey,
    handleAutoDeductionStatus,
    setPlans,
    handleDeletePlan,
    isDeductModalOpen,
    handleDeductCloseModal,
    filteredPlans,
    handleDeductOpenModal,
    setFilteredPlans,
    setCategories,
    handleFilterOpen,
    isFilterModalOpen,
    handleFilterApply,
    handleFilterClose, plans,
    selectedPlan, selectedCategory, filterByAutoDeduction, autoDeductionStatus
  } = usePlans();

  const handleDeleteHere = (potid, isActive) => {
    if (!isActive) {
      const confirmAction = window.confirm(
        "Are you sure you want to deactivate this plan?"
      );
      if (!confirmAction) {
        return;
      }
    }
    handleDeletePlan(potid, isActive);
    const colorScheme = "red";
    toast({
      title: "Plan Deactivated",
      description: "Your saving plan has been successfully deactivated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      colorScheme
    });
  }

  const userIdFromLocalStorage = localStorage.getItem("userid");
  const userId = userIdFromLocalStorage;
  const nav = useNavigate();
  useEffect(() => {
    setBalance(totalBalance || 0);
  }, [totalBalance]);
  const handleNav = (potid) => {
    nav(`/savingplan/${potid}`);
  };
  const selectWidth = useBreakpointValue({ base: "100%", md: "200px" });
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get(`/user/${userId}/savingplan`);
        const fetchedPlans = res.data;
        setPlans(fetchedPlans);
        // console.log("plan shape",plans.category.shape);
        const categoriesSet = new Set(
          fetchedPlans.map((plan) => plan.category?  plan.category.name : "Others")
        );
        setCategories(["all", ...Array.from(categoriesSet)]);
        setFilteredPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching saving plans:", error);
      }
    };
    fetchPlans();
  }, [userId, refreshkey]);
  console.log("ooodnninid")
  const handleAddMoney = async () => {
    if (addMoney > totalBalance) {
      toast({
        title: "Insufficient balance.",
        description: `You cannot withdraw more than your available balance of ₹${totalBalance}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (selectedPlanId && addMoney) {
      try {
        const amountToAdd = parseFloat(addMoney);
        const response = await api.patch(
          `/user/${userId}/savingplan/${selectedPlanId}`,
          {
            currentBalance: amountToAdd,
          }
        );
        const newBalance = await updateBalance(
          userId,
          balance,
          addMoney,
          false
        );
        onBalanceUpdate(newBalance);
        toast({
          title: "Amount added successfully.",
          description: `₹${addMoney} has been added to your savings.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const updatedPlan = response.data.pot;
        setPlans((prevPlans) =>
          prevPlans.map((plan) =>
            plan._id === updatedPlan._id ? updatedPlan : plan
          )
        );
        setAddMoney("");
        onClose();
      } catch (error) {
        console.error("Error updating saving plan:", error);
        toast({
          title: "Error",
          description: "Failed to add money to the saving plan.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Input Error",
        description: "Please enter a valid amount.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleClaimAmount = (potid, isActive) => {
    handleDeletePlan(potid, isActive);
    toast({
      title: "Claim Successful",
      description:
        "The amount has been claimed successfully. and debited to bank",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const getShapeStyle = (shape, backgroundColor) => {
    const baseStyle = {
      display: "flex",
      margin:"auto",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "110px",
      height: "110px",
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
      default:
        return baseStyle;
    }
  };




  if (filteredPlans.length === 0 && !selectedCategory && !filterByAutoDeduction && !autoDeductionStatus) {
    return (
      <div className="no-saving-plan-container saving-plans-container">
        <h1>Start Saving</h1>
        <div>
          <SaveButton />
        </div>
      </div>
    )
  }


  return (
    <div>
      <div className="saving-plans-container">
        <div className="header">
          <div>
            <h4>Savings plan</h4>
            <h3>{filteredPlans.length} saving plans</h3>
          </div>
          <Button
            colorScheme="blue"
            onClick={() => handleFilterOpen()}
            leftIcon={<FiFilter />}
          >
            Filter
          </Button>
        </div>
        <div className="plans-list">
          {filteredPlans.map((plan, ind) => (
            <div key={plan._id} className="plan-card">
              <div className="saving-plan-top-container">
                <div>
                <div className="creating-pot-savingplan">
                        <span
                          style={{...getShapeStyle( plan.category.shape , plan.category.backgroundColor)}}
                          mr={4}
                          className="category-icon"
                        >
                          {plan.category.iconType === "url" && (
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
                                src={plan.category.icon}
                              />
                            </>
                          )}
                          {plan.category.iconType === "class" && (
                            <>
                              <i className={plan.category.icon}></i>
                            </>
                          )}
                        </span>
                  <h1 style={{textAlign:"center"}}>{plan.category.name}</h1>

                </div>
                </div>
                <div className="saving-plan-top-right-container">
                <div onClick={() => handleNav(plan._id)}>
                <div className="plan-details">
                  <h4>{plan.potPurpose}</h4>
                  <p>
                    <span className="current-amount">
                      ₹{plan.currentBalance.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${(plan.currentBalance / plan.targetAmount) * 100}%`,
                      backgroundColor: plan.color,
                    }}
                  >
                  </div>
                </div>
                <div>
                      <span className="progress-text-savingplan">
                      {((plan.currentBalance / plan.targetAmount) * 100).toFixed(1)}% of {plan.targetAmount} Goal
                    </span>
                </div>
              </div>
                </div>
              </div>
              <div className="savingplan-middle-border">
              <hr />
              </div>
              <div className="action-buttons-saving">
                {plan.currentBalance >= plan.targetAmount ? (
                  <div className="target-achieved">
                    <p>🎉  Target Achieved!</p>
                    <button onClick={() => handleClaimAmount(plan._id, false)} className="claim-amount">
                      <i className="fa-solid fa-hand-holding-dollar"></i> Claim
                      Amount
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="add-money-btn">
                      {plan.autoDeduction ? (
                        <Box
                          onClick={() =>
                            handleAutoDeductionStatus(plan._id, plan.potPurpose)
                          }
                          display="flex"
                          alignItems="center"
                        >
                          {plan.autoDeductionStatus ? (
                            <span>
                              <i
                                className="fa-solid fa-pause-circle"
                                style={{ color: "red", marginRight: "4px" }}
                              ></i>
                              Pause
                            </span>
                          ) : (
                            <span>
                              <i
                                className="fa-solid fa-play-circle"
                                style={{ color: "green", marginRight: "4px" }}
                              ></i>
                              Resume
                            </span>
                          )}
                        </Box>
                      ) : (
                        <Box
                          onClick={() => handleDeductOpenModal(plan._id)}
                          style={{ display: "flex", alignItems: "center" }} >
                          <span>Set Deduct</span>
                        </Box>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPlanId(plan._id);
                        onOpen();
                      }}
                      className="add-money-btn"
                    >
                      <i className="fa-solid fa-plus"></i> Add Money
                    </button>
                    <button
                      onClick={() => handleDeleteHere(plan._id, false)}
                      className="delete-btn"
                      _hover={{ bg: "red.500", color: "white" }}
                      bg="gray.200"
                      color="black"
                    >
                      <i className="fa-regular fa-circle-pause"></i> Deactivate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterClose}
        onSave={handleFilterApply}
      />
      <EditDeductionModel
        isOpen={isDeductModalOpen}
        onClose={handleDeductCloseModal}
        potId={selectedPlan}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Money to Saving Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter amount"
              value={addMoney}
              onChange={(e) => setAddMoney(e.target.value)}
              type="number"
              variant="filled"
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddMoney}>
              Add
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </div>
  );
};