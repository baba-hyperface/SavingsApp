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
        const categoriesSet = new Set(
          fetchedPlans.map((plan) => plan.category || "Others")
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
                <div className="creating-pot-container-savingplan">
                <i
                    className={`fa ${
                      plan.category &&
                      categories.find((cat) => cat.label === plan.category).icon
                    }`}
                  ></i>
                  <p>{plan.category}</p>
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