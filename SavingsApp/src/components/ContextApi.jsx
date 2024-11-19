import React, { createContext, useState, useEffect, useContext } from "react";
import api from "./api";
import { useDisclosure, useToast } from "@chakra-ui/react";

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const userId = localStorage.getItem("userid");

  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const handleDeductCloseModal = () => setIsDeductModalOpen(false);
  const [selectedPlan, setSelectedPlan] = useState([]);

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const [categories, setCategories] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterByAutoDeduction, setFilterByAutoDeduction] = useState("");
  const [autoDeductionStatus, setAutoDeductionStatus] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleFilterOpen = () => setIsFilterModalOpen(true);
  const handleFilterClose = () => {
    setIsFilterModalOpen(false);
  };
  const handleFilterApply = () => {
    console.log("Applying filters");
    handleFilterClose();
  };

  useEffect(() => {
    let filtered = plans.filter((plan) => {
      const categoryMatch =
        selectedCategory === "" ||
        (plan.category || "Others") === selectedCategory;
      const autoDeductionMatch =
        filterByAutoDeduction === "" ||
        (filterByAutoDeduction === "active" && plan.autoDeduction) ||
        (filterByAutoDeduction === "inactive" && !plan.autoDeduction);
      const autoDeductionStatusMatch =
        autoDeductionStatus === "" ||
        (autoDeductionStatus === "paused" && !plan.autoDeductionStatus) ||
        (autoDeductionStatus === "running" && plan.autoDeductionStatus);
      return (
        categoryMatch &&
        autoDeductionMatch &&
        autoDeductionStatusMatch
      );
    },[plans])

    filtered = filtered.sort((a, b) => {
      if (a.potStatus === b.potStatus) return 0; 
      return a.potStatus ? -1 : 1;
    });

    if (sortOption) {
      filtered = filtered.sort((a, b) => {
        if (sortOption === "name-asc")
          return a.potPurpose.localeCompare(b.potPurpose);
        if (sortOption === "name-desc")
          return b.potPurpose.localeCompare(a.potPurpose);
        if (sortOption === "amount-asc") return a.targetAmount - b.targetAmount;
        if (sortOption === "amount-desc")
          return b.targetAmount - a.targetAmount;
        if (sortOption === "goalRemaining-asc")
          return a.currentBalance - b.currentBalance;
        if (sortOption === "goalRemaining-desc")
          return b.currentBalance - a.currentBalance;
        return 0;
      });
    }

    setFilteredPlans(filtered);
  }, [
    selectedCategory,
    filterByAutoDeduction,
    autoDeductionStatus,
    sortOption,
    plans,
  ]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDeductOpenModal = (plan) => {
    console.log("selectedPlanId 1", plan);
    setSelectedPlan(plan);
    console.log("after setting plan",selectedPlan);
    setIsDeductModalOpen(true);
  };


  useEffect(() => {
    console.log("Updated selectedPlan in useEffect:", selectedPlan);
}, [selectedPlan]);


  const handleAutoDeductionStatus = async (planId, potPurpose) => {
    try {
      const response = await api.patch(
        `/user/${userId}/savingplanautodeductionstatus/${planId}`
      );
      // setPlans(response.data.pots);
      console.log("updatating pot status",response.data.pots);
      const isPaused = !response.data.status;
      const colorScheme = isPaused ? "blue" : "green";

      toast({
        title: `${potPurpose} status updated.`,
        description: response.data.status
          ? "Your daily deduction is resumed."
          : "Your daily deduction is paused.",
        status: "success",
        duration: 3000,
        isClosable: true,
        colorScheme,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating saving plan:", error);

      toast({
        title: "Error",
        description: "Failed to update the status of the saving plan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePlan = async (planId, isActive) => {
    try {
      const res = await api.patch(
        `/user/${userId}/savingplandeactivate/${planId}`
      );
      // setPlans(res.data.pots);
      const potStatus = !res.data.potStatus;
      const colorScheme = potStatus ? "red" : "green";
      if (potStatus) {
      } else {
        setPlans((prevPlans) =>
          prevPlans.filter((plan) => plan._id !== planId)
        );
        toast({
          title: "Plan Activated",
          description: "Your saving plan has been successfully activated.",
          status: "success",
          duration: 3000,
          isClosable: true,
          colorScheme,
        });
      }
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating saving plan:", error);
      toast({
        title: "Error",
        description: "Failed to update the saving plan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <PlanContext.Provider
      value={{
        handleAutoDeductionStatus,
        refreshKey,
        setRefreshKey,
        plans,
        setPlans,
        handleDeletePlan,

        isDeductModalOpen,
        handleDeductCloseModal,
        setIsDeductModalOpen,
        handleDeductOpenModal,

        filteredPlans,
        setFilteredPlans,
        selectedCategory,
        setSelectedCategory,
        filterByAutoDeduction,
        setFilterByAutoDeduction,
        autoDeductionStatus,
        setAutoDeductionStatus,
        sortOption,
        setSortOption,
        categories,
        setCategories,
        isFilterOpen,
        onFilterOpen,
        onFilterClose,
        handleFilterApply,
        handleCategoryChange,
        handleFilterOpen,
        handleFilterClose,
        isFilterModalOpen,
        setIsFilterModalOpen,
        selectedPlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlans = () => {
  return useContext(PlanContext);
};
