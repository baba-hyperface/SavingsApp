import React, { useEffect, useState } from 'react';
import '../styles/transaction.css';
import api from './api';

export const Transaction = ({ history }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historydata, setHistorydata] = useState([]);

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
    console.log("Toggled history open state:", !isHistoryOpen);
  };

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/history`);
        setHistorydata(res.data.historydata);
        console.log("Fetched history data:", res.data.historydata);
      } catch (error) {
        setError(error);
        console.log("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserdata();
  }, []);

  return (
    <div>
      {/* Icon to toggle transaction history */}
      <div className="transaction-icon-container">
        <i className="fa-solid fa-clock-rotate-left" onClick={toggleHistory}></i>
      </div>

      {/* Transaction history container */}
      <div className={`transaction-history-container ${isHistoryOpen ? 'open' : ''}`}>
        <div className="transaction-close-btn-container">
          <i className="fa-solid fa-xmark" onClick={toggleHistory}></i>
        </div>

        {loading ? (
          <p>Loading transaction history...</p>
        ) : error ? (
          <p>Error loading history.</p>
        ) : (
          <div className="transaction-list">
            <h3>Transactions</h3>
            {historydata.length > 0 ? (
              historydata.map((transaction, index) => (
                <div key={index} className="transaction-item-container">
                  <div className="transaction-details-container">
                    <p>{transaction.type}</p>
                    <p>{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p>
                      <span>{transaction.from}</span> - to - <span>{transaction.to}</span>
                    </p>
                  </div>
                  <div className="transaction-amount-container">
                    <p>{transaction.type === 'Debited' || transaction.type === 'Sent' ? '-' : '+'} ₹{transaction.amount}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No transaction history available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
