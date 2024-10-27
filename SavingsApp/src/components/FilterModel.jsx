import { usePlans } from "./ContextApi";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";

export function FilterModal({ isOpen, onClose, onSave }) { 
  const {
    selectedCategory,
    setSelectedCategory,
    filterByAutoDeduction,
    setFilterByAutoDeduction,
    autoDeductionStatus,
    setAutoDeductionStatus,
    sortOption,
    setSortOption,
    categories,
  } = usePlans();

  const handleFilterApply = () => {
    console.log("Filters applied with:", {
      selectedCategory,
      filterByAutoDeduction,
      autoDeductionStatus,
      sortOption,
    });

    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Filter and Sort Plans</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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

          <Select
            value={autoDeductionStatus}
            onChange={(e) => setAutoDeductionStatus(e.target.value)}
            placeholder="Auto Deduction Status"
            variant="filled"
            mb={4}
          >
            <option value="all">All</option>
            <option value="paused">Paused</option>
            <option value="running">Running</option>
          </Select>

          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            placeholder="Sort by"
            variant="filled"
            mb={4}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="amount-asc">Balance (Lowest)</option>
            <option value="amount-desc">Balance (Highest)</option>
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onSave}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

