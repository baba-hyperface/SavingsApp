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
  Spinner,
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
//   const {
//     currentBalance : totalBalance,
//     handleBalanceUpdate : onBalanceUpdate,
//     updateBalance,
// } = useContext(UserContext);

  const [addMoney, setAddMoney] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [balance, setBalance] = useState(totalBalance);
  const [loading, setLoading] = useState(false);
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
    const colorScheme = !isActive ? "red" : "green";
    if (!isActive) {
      toast({
        title: "Plan Deactivated",
        description: "Your saving plan has been successfully deactivated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        colorScheme
      });
    } else {
      toast({
        title: "Plan Activated",
        description: "Your saving plan has been successfully activated.",
        status: "success",
        duration: 3000,
        isClosable: true,
        colorScheme,
      });
    }
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
        setLoading(true);
        const res = await api.get(`/user/${userId}/savingplan`);
        const fetchedPlans = res.data.pots;
        setPlans(fetchedPlans);
        const categoriesSet = new Set(
          fetchedPlans.map((plan) => plan.category || "Others")
        );
        setCategories(["all", ...Array.from(categoriesSet)]);
        setFilteredPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching saving plans:", error);
      } finally {
        setLoading(false);
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

  const activePlans = filteredPlans.filter((plan) => plan.potStatus);
  const deactivatedPlans = filteredPlans.filter((plan) => !plan.potStatus);


  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="xl" color="blue.500" />
      </div>
    );
  }

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

  const totalBalanceCal = activePlans.reduce((acc, curr) => {
    return acc + curr.currentBalance;
  }, 0);
  


  return (
    <div>
      <div className="saving-plans-container">
        <div>
          <h1 className="totalsaving-heading">Total savings: ₹{totalBalanceCal}</h1>
        </div>
        <div className="header">
          <div>
              <SaveButton totalBalance={totalBalance} onBalanceUpdate={onBalanceUpdate} updateBalance={updateBalance}/>
          </div>
          <Button
            colorScheme="blue"
            onClick={() => handleFilterOpen()}
            leftIcon={<FiFilter />}
            p={"6"}
          >
            Filter
          </Button>
        </div>
        <h1 className="saving-active-deactive-heading">Active Goals</h1>
        <div className="plans-list">
          {activePlans.map((plan, ind) => (
            <div key={plan._id} className="plan-card">
              <div className="saving-plan-top-container">
                <div>
                  <div className="creating-pot-container-savingplan">
                    <i
                      className={`fa ${plan.category &&
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
                        {((plan.currentBalance / plan.targetAmount) * 100)}% of ₹{plan.targetAmount} 
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

                          style={{ cursor: plan.potStatus ? "pointer" : "not-allowed" }}
                          disabled={!plan.potStatus}
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

                          style={{ cursor: plan.potStatus ? "pointer" : "not-allowed", display: "flex", alignItems: "center" }}
                          disabled={!plan.potStatus}
                          onClick={() => handleDeductOpenModal(plan._id)}
                        >
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
                      style={{ cursor: plan.potStatus ? "pointer" : "not-allowed" }}
                      disabled={!plan.potStatus}
                    >
                      <i className="fa-solid fa-plus"></i> Add Money
                    </button>


                    <button
                      onClick={() => handleDeleteHere(plan._id, !plan.potStatus)}
                      className="delete-btn"
                      _hover={{ bg: "red.500", color: "white" }}
                      bg="gray.200"
                      color="black"
                    >
                      {plan.potStatus ? <i className="fa-regular fa-circle-pause"></i> : <i class="fa-solid fa-play" style={{ color: "green" }}></i>} {"  "}
                      {plan.potStatus ? "DeActivate" : "Activate"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <hr />
          <h1 className="saving-active-deactive-heading">Deactivated Goals</h1>
        <div className="plans-list">
          {deactivatedPlans.map((plan, ind) => (
            <div key={plan._id} className="plan-card">
              <div className="saving-plan-top-container">
                <div>
                  <div className="creating-pot-container-savingplan">
                    <i
                      className={`fa ${plan.category &&
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
                        {((plan.currentBalance / plan.targetAmount) * 100)}% of ₹{plan.targetAmount} 
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="savingplan-middle-border">
                <hr />
              </div>
              <div className="action-buttons-saving">
                    <button
                      onClick={() => handleDeleteHere(plan._id, !plan.potStatus)}
                      className="delete-btn"
                      _hover={{ bg: "red.500", color: "white" }}
                      bg="gray.200"
                      color="black"
                    >
                      {plan.potStatus ? <i className="fa-regular fa-circle-pause"></i> : <i class="fa-solid fa-play" style={{ color: "green" }}></i>} {"  "}
                      {plan.potStatus ? "DeActivate" : "Activate"}
                    </button>
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