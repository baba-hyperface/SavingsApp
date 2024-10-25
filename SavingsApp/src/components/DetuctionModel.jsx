import { 
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, 
    ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, Box 
  } from '@chakra-ui/react';
import { useState } from 'react';
  
  export function DeductionModal({ isOpen, onClose, onSave }) {
    const [dailyAmount, setDailyAmount] = useState('');
    console.log(dailyAmount);
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          sx={{
            backgroundColor: "#E5EBF6",
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          <ModalHeader>Set Daily Deduction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Daily Deduction Amount</FormLabel>
              <Input
                type="number"
                placeholder="Enter daily deduction amount"
                value={dailyAmount}
                onChange={(e) => setDailyAmount(e.target.value)}
                sx={{ fontFamily: "Noto Sans, sans-serif" }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => onSave(dailyAmount)}>Save</Button>
            <Button variant="outline" onClick={onClose} ml={3}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }