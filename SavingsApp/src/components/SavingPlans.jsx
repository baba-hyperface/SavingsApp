import React, { useContext, useEffect, useState } from "react";
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
  Skeleton,
} from "@chakra-ui/react";
import api from "./api";
import { FiFilter, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePlans } from "./ContextApi";
import { FilterModal } from "./FilterModel";
import EditDeductionModel from "./EditDetuctionModel";
import { SaveButton } from "./SaveButton";
import { AuthContext } from "./AuthApi";
import { calculateNextDeductionDate } from "./DeActivatedPage";
export const SavingPlans = () => {
  const {handleBalanceUpdate: onBalanceUpdate, updateBalance} = useContext(AuthContext);
  const [addMoney, setAddMoney] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [totalBalance, setTotalBalance] = useState(0);
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
  const [user, setUser] = useState([]);

  useEffect(() => {
      const fetchUserdata = async () => {
          try {
              setLoading(true);
              const res = await api.get(`/user/${userIdFromLocalStorage}`);
              setTotalBalance(res.data.totalBalance);
          } catch (error) {
              console.log(error);
          }
      };
      fetchUserdata();
  }, []);

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
        console.log(plans);
        const categoriesSet = new Set(
          fetchedPlans.map((plan) => plan.category ? plan.category.name : "Others")
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
        description: `You cannot Add more than your available balance of ₹${totalBalance}.`,
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


  const activePlans = filteredPlans.filter((plan) => plan.potStatus);
  const deactivatedPlans = filteredPlans.filter((plan) => !plan.potStatus);

  const totalBalanceCal = activePlans.reduce((acc, curr) => {
    return acc + curr.currentBalance;
  }, 0);

  const getShapeStyle = (shape, backgroundColor) => {
    console.log("getShape is called");
    const baseStyle = {
      display: "flex",
      margin: "auto",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "120px",
      height: "120px",
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
          width: "50px",
          height: "50px",
        };
        case "msg":
        return {
          ...baseStyle,
          backgroundColor,
          borderRadius:"60px 50px 50px 0px",
          width: "50px",
          height: "50px",
        };
      default:
        return baseStyle;
    }
  };

  useEffect(() => {
    const checkDetails = () => {
      if (activePlans.length === 0 && deactivatedPlans.length === 0) {
        return (
          <div className="no-saving-plan-container saving-plans-container">
            <h1>Start Saving</h1>
            <div>
              <SaveButton />
            </div>
          </div>
        )
      }
    }
    checkDetails();
  }, [])


  const renderSkeletons = () =>
    Array.from({ length: activePlans.length + deactivatedPlans.length }).map((_, index) => (
      <div key={index} className="plan-card skeleton-card">
        <div className="saving-plan-top-container">
          <div>
            <Skeleton circle={true} height={40} width={40} />
          </div>
          <div className="saving-plan-top-right-container">
            <Skeleton width="60%" height={7} mb={3} />
            <Skeleton width="80%" height={7} mb={3}/>
            <Skeleton width="90%" height={7} />
          </div>
        </div>
        <div className="savingplan-middle-border">
          <Skeleton height={1} />
        </div>
        <div className="action-buttons-saving">
          <Skeleton width="30%" height={30} />
          <Skeleton width="30%" height={30} />
          <Skeleton width="30%" height={30} />
        </div>
      </div>
    ));

    
    if (loading) {
      return (
        <div className="plans-list">
          {renderSkeletons()}
        </div>
      );
    }

  return (
    <div>
      <div className="saving-plans-container">
        <div>
          <h1 className="totalsaving-heading">Total savings: ₹{totalBalanceCal}</h1>
        </div>
        <div className="header">
          <div>
            <SaveButton totalBalance={totalBalance} onBalanceUpdate={onBalanceUpdate} updateBalance={updateBalance} />
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
                  <div className="creating-pot-savingplan">
                    <span
                      style={{ ...getShapeStyle(plan.category.shape? plan.category.shape:"", plan.category.backgroundColor) }}
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
                       <div className="category-items-style-plans">
                       <span>
                        {console.log("gdftgdgfdgfdg",plan.category)}
                        {console.log("gdftgdgfdgfdg",plan)}
                         <i className={plan.category.icon}></i>
                       </span>
                       <h1>{plan.category.name}</h1>
                     </div>
                      )}
                    </span>

           
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
                        {Math.round(((plan.currentBalance / plan.targetAmount) * 100))}% of ₹{plan.targetAmount} 
                      </span>
                    </div>
                    <div>
                      <span className="progress-text-savingplan-deduction">
                        {(plan.autoDeduction && plan.autoDeductionStatus) && <> Next Deduction: {calculateNextDeductionDate(plan).toLocaleDateString()} </> }
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
        {deactivatedPlans.length > 0  && (
        <h1 className="saving-active-deactive-heading">Deactivated Goals</h1>
        )}
        <div className="plans-list">
          {deactivatedPlans.map((plan, ind) => (
            <div key={plan._id} className="plan-card">
              <div className="saving-plan-top-container">
                <div>

                  <div className="creating-pot-savingplan">
                    <span
                      style={{ ...getShapeStyle(plan.category.shape, plan.category.backgroundColor) }}
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
                        <div className="category-items-style">
                          <span>
                            <i className={plan.category.icon}></i>
                          </span>
                          <h1>{plan.category.name}</h1>
                        </div>
                      )}
                    </span>

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

