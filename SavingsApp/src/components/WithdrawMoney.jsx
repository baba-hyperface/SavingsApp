import React, { useEffect, useState } from 'react';
import '../styles/buttonStyles.css';
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, useToast } from '@chakra-ui/react';
import { updateBalance } from './MinusMoney';
import api from './api';

export const WithdrawMoney = ({totalBalance, onBalanceUpdate, updateBalance, email, onHistoryChange}) => {
    const { onClose, onOpen, isOpen } = useDisclosure();
    const [balance, setBalance] = useState(totalBalance);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addMoney, setAddMoney] = useState('');
    const toast = useToast();
    const userIdFromLocalStorage = localStorage.getItem("userid");

    useEffect(() => {
      setBalance(totalBalance || 0);
    }, [totalBalance]);

    const handleWithdraw = async () => {
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

        try {
            setLoading(true);
            const newBalance = await updateBalance(userIdFromLocalStorage, balance, addMoney, false);
            onBalanceUpdate(newBalance);

            await api.post('/history', {
                email: email,
                type: "Debited",
                amount: addMoney,
                from: "Wallet",
                to: "Bank",
                date: new Date()
            });

            onHistoryChange({
                email: email,
                type: "Debited",
                amount: addMoney,
                from: "wallet",
                to: "Bank",
                date: new Date()
            });

            toast({
                title: "Withdrawal successful.",
                description: `₹${addMoney} has been withdrawn from your account.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setAddMoney("");
            onClose();
        } catch (error) {
            console.log(error);
            toast({
                title: "Withdrawal failed.",
                description: "An error occurred while processing your withdrawal. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button className='action-buttons' onClick={onOpen}>
                <i className="fa-solid fa-hand-holding-dollar"></i> 
                <span className='button-text'>Withdraw</span>
            </button>
            <p className='send-text'>Withdraw</p>

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay
                    sx={{
                        backdropFilter: { base: "none", lg: "blur(10px)" },
                        height: "100vh",
                    }}
                />
                <ModalContent
          className="modal-container"
          sx={{
            color: "rgb(65, 65, 65)",
            borderRadius: "10px",
            fontFamily: "Noto Sans, sans-serif",
            width: { base: "100%", lg: "30%" },
            maxWidth: { base: "100vw", lg: "60vw" },
            height: { base: "90vh", lg: "auto" },
            overflowY: { base: "auto", lg: "unset" },
          }}
        >
                    <ModalHeader>Withdraw Money</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input 
                            type="number" 
                            placeholder='₹0'
                            value={addMoney}
                            onChange={(e) => setAddMoney(e.target.value)}
                            sx={{
                                fontFamily: "Noto Sans, sans-serif",
                                backgroundColor: "#f0f0f0",
                                color: "#000" 
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleWithdraw} isLoading={loading}>
                            {loading ? "Withdrawing..." : `Withdraw ${addMoney ? "₹" + addMoney : ""}`}
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}