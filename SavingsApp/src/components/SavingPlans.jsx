
import React, { useEffect, useState } from "react";
import "../styles/SavingPlans.css";
import {
  useDisclosure,Modal,ModalOverlay,ModalContent,
  ModalHeader,ModalFooter,ModalBody,ModalCloseButton,
  Button,Input,useToast,Select,useBreakpointValue,Box,Text,
} from "@chakra-ui/react";

import { FiFilter, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePlans } from "./ContextApi";
import { DeductionModal } from "./DetuctionModel";
import api from "./api";

export const SavingPlans = ({
  totalBalance,
  onBalanceUpdate,
  updateBalance,
}) => {
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addMoney, setAddMoney] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterByAutoDeduction, setFilterByAutoDeduction] = useState("all");
  const [autoDeductionStatus, setAutoDeductionStatus] = useState("all");
  const { onClose, onOpen, isOpen } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();
  const [balance, setBalance] = useState(totalBalance);
  const toast = useToast();

  const {
    refreshkey,
    handleAutoDeductionStatus,
    plans,
    setPlans,
    handleDeletePlan,
    isDeductModalOpen,
    handleDeductCloseModal,
    handleSaveDeduction,
    setIsDeductModalOpen,
    handleDeductOpenModal,
  } = usePlans();

  const nav = useNavigate();
  const userIdFromLocalStorage = localStorage.getItem("userid");
  const userId = userIdFromLocalStorage;

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

  useEffect(() => {
    const filtered = plans.filter((plan) => {
      const categoryMatch =
        selectedCategory === "all" ||
        (plan.category || "Others") === selectedCategory;

      const autoDeductionMatch =
        filterByAutoDeduction === "all" ||
        (filterByAutoDeduction === "active" && plan.autoDeduction) ||
        (filterByAutoDeduction === "inactive" && !plan.autoDeduction);

      const autoDeductionStatusMatch =
        autoDeductionStatus === "all" ||
        (autoDeductionStatus === "paused" && !plan.autoDeductionStatus) ||
        (autoDeductionStatus === "running" && plan.autoDeductionStatus);

      return (
        categoryMatch &&
        autoDeductionMatch &&
        autoDeductionStatusMatch &&
        plan.potStatus
      );
    });

    setFilteredPlans(filtered);
  }, [selectedCategory, filterByAutoDeduction, autoDeductionStatus, plans]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFilterApply = () => {
    onFilterClose();
  };

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

  const handleDeactivate = (potid, isActive) => {
    const confirmAction = window.confirm(
      "Are you sure you want to deactivate this plan?"
    );
    if (!confirmAction) {
      return;
    }
    handleDeletePlan(potid, isActive);
    toast({
      title: "Deactivated the pot",
      description: "The pot deactivated succesfully...",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div className="saving-plans-container">
      <div className="header">
        <div>
          <h4>Savings plan</h4>
          <h3>{filteredPlans.length} saving plans</h3>
        </div>
        <Button
          colorScheme="blue"
          onClick={onFilterOpen}
          leftIcon={<FiFilter />}
        >
          Filter
        </Button>
      </div>

      <div className="plans-list">
        {filteredPlans.map((plan) => (
          <div key={plan._id} className="plan-card">
            <div onClick={() => handleNav(plan._id)}>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${
                      (plan.currentBalance / plan.targetAmount) * 100
                    }%`,
                    backgroundColor: plan.color,
                  }}
                />
              </div>
              <div className="plan-details">
                <h4>{plan.potPurpose}</h4>
                <p>
                  <span className="current-amount">
                    ₹{plan.currentBalance.toFixed(2)}
                  </span>{" "}
                  /{" "}
                  <span className="goal-amount">
                    ₹{plan.targetAmount.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            <div className="action-buttons-saving">
              {plan.currentBalance >= plan.targetAmount ? (
                <div className="target-achieved">
                  <p>🎉 Target Achieved!</p>
                  <Button onClick={() => handleClaimAmount(plan._id, false)}>
                    <i className="fa-solid fa-hand-holding-dollar"></i> Claim
                    Amount
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                     className="add-money-btn"
                   >
                     {plan.autoDeduction ? (
                       <Box
                         onClick={() =>
                           handleAutoDeductionStatus(plan._id, plan.potPurpose)
                         }
                         style={{ display: "flex", alignItems: "center" }}
                       >
                         {plan.autoDeductionStatus ? (
                           <span
                             style={{
                               display: "flex",
                               alignItems: "center",
                               marginLeft: "8px",
                             }}
                           >
                             <i
                               className="fa-solid fa-pause-circle"
                               style={{ color: "red", marginRight: "4px" }}
                             ></i>
                             <span>Pause</span>
                           </span>
                         ) : (
                           <span
                             style={{
                               display: "flex",
                               alignItems: "center",
                               marginLeft: "8px",
                             }}
                           >
                             <i
                               className="fa-solid fa-play-circle"
                               style={{ color: "green", marginRight: "4px" }}
                             ></i>
                             <span>Resume</span>
                           </span>
                         )}
                       </Box>
                     ) : (
                       <Box
                       onClick={() => handleDeductOpenModal(plan._id)}
                         style={{ display: "flex", alignItems: "center" }}
                       >
                         <span >Set Deduct</span>
                       </Box>
                     )}
                   </Button>

                  <Button
                    onClick={() => {
                      setSelectedPlanId(plan._id);
                      onOpen();
                    }}
                    className="add-money-btn"
                  >
                    <i className="fa-solid fa-plus"></i> Add Money
                  </Button>

                  <Button
                    onClick={() => handleDeletePlan(plan._id, false)}
                    className="delete-btn"
                    _hover={{ bg: "red.500", color: "white" }}
                    bg="gray.200"
                    color="black"
                  >
                    <i className="fa-regular fa-circle-pause"></i> Deactivate
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <DeductionModal
        isOpen={isDeductModalOpen}
        onClose={handleDeductCloseModal}
        onSave={handleSaveDeduction}
      />

      {/* Add Money Modal */}
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

      {/* Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Plans</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Category Filter
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select a category"
              variant="filled"
              mb={4}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </Select>
            Auto Deduction (Active/Inactive)
            <Select
              value={filterByAutoDeduction}
              onChange={(e) => setFilterByAutoDeduction(e.target.value)}
              placeholder="Auto Deduction"
              variant="filled"
              mb={4}
            >
              <option value="all">All</option>
              <option value="active">Auto Deduction Active</option>
              <option value="inactive">Auto Deduction Inactive</option>
            </Select>
            Auto Deduction (Running/Paused)
            <Select
              value={autoDeductionStatus}
              onChange={(e) => setAutoDeductionStatus(e.target.value)}
              placeholder="Auto Deduction Status"
              variant="filled"
            >
              <option value="all">All</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onFilterClose}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SavingPlans;
