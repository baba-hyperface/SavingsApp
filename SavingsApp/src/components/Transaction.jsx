import React, { useEffect, useState } from 'react';
import '../styles/transaction.css';
import api from './api';

export const Transaction = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historydata,setHistorydata]=useState([]);
  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userIdFromLocalStorage = localStorage.getItem("userid");

    useEffect(() => {
        const fetchUserdata = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/history`)
                setHistorydata(res.data);
                console.log(historydata);
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                console.log(error);
            }
        }
        fetchUserdata();
    }, []);


  return (
    <div>
      <div className='icon-container'>
        <i className="fa-solid fa-clock-rotate-left" onClick={toggleHistory}></i>
      </div>
      {isHistoryOpen && (
        <div className="transaction-history">
          <div className="close-container">
            <i className="fa-solid fa-xmark" onClick={toggleHistory}></i>
          </div>
          <div className="transactions">
            <h3>Transactions</h3>
            <div className="transaction-item">
              <div className="transaction-details">
                <p>Top up</p>
                <p>Today 1:53 PM</p>
              </div>
              <div className="transaction-amount">
                <p>+₹100.00</p>
                <p>Deposit</p>
              </div>
            </div>

            <div className="transaction-item">
              <div className="transaction-details">
                <p>Transfer</p>
                <p>Today 2:33 PM</p>
              </div>
              <div className="transaction-amount">
                <p>-₹500.00</p>
                <p>Send</p>
              </div>
            </div>

            <div className="transaction-item">
              <div className="transaction-details">
                <p>Received</p>
                <p>Today 3:32 PM</p>
              </div>
              <div className="transaction-amount">
                <p>+₹50.00</p>
                <p>Deposit</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
