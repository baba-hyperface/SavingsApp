import React, { useEffect, useState } from 'react';
import '../styles/transaction.css';
import api from './api';

export const Transaction = () => {
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

  if(!historydata && historydata === undefined){
    return (<>
    no data 
    </>)
  }

  const groupByDate = (transactions) => {
    return transactions.reduce((groupedTransactions, transaction) => {
      const transactionDate = new Date(transaction.date).toLocaleDateString();
      if (!groupedTransactions[transactionDate]) {
        groupedTransactions[transactionDate] = [];
      }
      groupedTransactions[transactionDate].push(transaction);
      return groupedTransactions;
    }, {});
  };

  // Grouping transactions by date
  const groupedTransactions = groupByDate(historydata);


  return (
    <div>
      {/* Icon to toggle transaction history */}
      <div className="custom-transaction-icon-container">
        <i className="fa-solid fa-clock-rotate-left" onClick={toggleHistory}></i>
      </div>

      {/* Transaction history container */}
      <div className={`custom-transaction-history-container ${isHistoryOpen ? 'open' : ''}`}>
        <div className="custom-transaction-close-btn-container">
          <i className="fa-solid fa-xmark" onClick={toggleHistory}></i>
        </div>

        {loading ? (
          <p>Loading transaction history...</p>
        ) : error ? (
          <p>Error loading history.</p>
        ) : (
          <div className="custom-transaction-list">
            <h3>Transactions</h3>
            {Object.keys(groupedTransactions).length > 0 ? (
              Object.keys(groupedTransactions).map((date, index) => (
                <div key={index} className="date-group">
                  <h4>{date}</h4>

                  {groupedTransactions[date].map((transaction, index) => (
                    <div key={index} className="custom-transaction-item-container">
                      <div className="custom-transaction-details-container">
                        <p>{transaction.type}</p>
                        <p>{new Date(transaction.date).toLocaleString()}</p>
                      </div>
                      <div>
                        <p>
                          <span>{transaction.from}</span> - to - <span>{transaction.to}</span>
                        </p>
                      </div>
                      <div className="custom-transaction-amount-container">
                        <p>{transaction.type === 'Debited' || transaction.type === 'Sent' ? '-' : '+'} ₹{transaction.amount}</p>
                      </div>
                    </div>
                  ))}
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
