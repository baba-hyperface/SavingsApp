// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [currentBalance, setCurrentBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userIdFromLocalStorage = localStorage.getItem("userid");

    useEffect(() => {
        const fetchUserdata = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/user/${userIdFromLocalStorage}`);
                setUser(res.data);
                setCurrentBalance(res.data.totalBalance);
                setLoading(false);
            } catch (error) {
                setError(error);
                console.log(error);
                setLoading(false);
            }
        };
        fetchUserdata();
    }, [userIdFromLocalStorage]);


    const handleBalanceUpdate = (newBalance) => {
      setCurrentBalance(newBalance);
      console.log("Updated Balance:", newBalance);
  };

    const updateBalance = async (userId, currentBalance, amountToAddOrSubtract, isAddition) => {
        const moneyChange = parseInt(amountToAddOrSubtract, 10);
        if (!isNaN(moneyChange) && moneyChange > 0) {
            const newBalance = isAddition ? currentBalance + moneyChange : currentBalance - moneyChange;
            try {
                const res = await api.patch(`/user/${userId}/balance`, { balance: newBalance });
                setCurrentBalance(res.data.user.totalBalance);
                setUser(res.data.user);
                return res.data.user.totalBalance;
            } catch (error) {
                console.error('Error updating balance:', error);
                throw error;
            }
        } else {
            throw new Error('Invalid amount provided');
        }
    };

    const handleTransactionHistoryUpdate = (transaction) => {
        setHistory((prevHistory) => [...(prevHistory || []), transaction]);
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/history`);
                setHistory(res.data.historydata);
            } catch (error) {
                console.log("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                currentBalance,
                setCurrentBalance,
                history,
                handleBalanceUpdate,
                setHistory,
                loading,
                error,
                updateBalance,
                handleTransactionHistoryUpdate,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};