import React, { createContext, useState, useEffect, useContext } from "react";
import api from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [totalBalance, setTotalBalance] = useState(0);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userIdFromLocalStorage = localStorage.getItem("userid");

    useEffect(() => {
        const fetchUserdata = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/user/${userIdFromLocalStorage}`);
                setUser(res.data);
                setTotalBalance(res.data.totalBalance);
                setLoading(false);
            } catch (error) {
                setError(error);
                console.log(error);
                setLoading(false);
            }
        };
        fetchUserdata();
    }, []);

    const [currentBalance, setCurrentBalance] = useState(totalBalance);
    const [history, setHistory] = useState([]);

    const handleBalanceUpdate = (newBalance) => {
        setCurrentBalance(newBalance);
        console.log("Updated Balance:", newBalance);
      };

 const updateBalance = async (userId, currentBalance, amountToAddOrSubtract, isAddition) => {
  const moneyChange = parseInt(amountToAddOrSubtract, 10);
  if (!isNaN(moneyChange) && moneyChange > 0) {
    const newBalance = isAddition ? currentBalance + moneyChange : currentBalance - moneyChange;
    try {
      const res = await api.patch(`/user/${userId}/balance`, {
        balance: newBalance
      });
      setCurrentBalance(res.data.user.totalBalance);
      console.log(res.data.user);
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

useEffect(() => {
  const fetchUserdata = async () => {
      try {
          const res = await api.get(`/history`)
          console.log(res.data);
          setHistory(res.data.historydata);
          console.log(history);
          console.log(history.length)
      } catch (error) {
          console.log("error in history fetching",error);
      }
  }
  fetchUserdata();
}, []);

const handleTransactionHistoryUpdate = (transaction) => {
  setHistory((prevHistory) => [...(prevHistory || []), transaction]);
};

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,setIsAuthenticated,
        role,setRole, totalBalance, handleBalanceUpdate, updateBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

