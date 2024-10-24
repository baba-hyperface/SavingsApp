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
  };

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/history`);
        setHistorydata(res.data.historydata);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log("error in history fetching", error);
      }
    };
    fetchUserdata();
  }, []);

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

  const groupedTransactions = groupByDate(historydata);

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

          {loading ? (
            <p>Loading transaction history...</p>
          ) : error ? (
            <p>Error loading history.</p>
          ) : (
            <div className="transactions">
              <h3>Transactions</h3>
              {Object.keys(groupedTransactions).length > 0 ? (
                Object.keys(groupedTransactions).map((date, index) => (
                  <div key={index} className="date-group">
                    
                    <h4>{date}</h4>
                    {groupedTransactions[date].map((transaction, index) => (
                      <div key={index} className="transaction-item">
                        <div className="transaction-details">
                          <p>Type: {transaction.type}</p>
                          <p>Time: {new Date(transaction.date).toLocaleTimeString()}</p>
                        </div>
                        <div>
                          <p>
                            <span>{transaction.from}</span> - to - <span>{transaction.to}</span>
                          </p>
                        </div>
                        <div className="transaction-amount">
                          <p>
                            {transaction.type === 'Withdrawn' || transaction.type === 'Sent' ? '-' : '+'}₹{transaction.amount}
                          </p>
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
      )}
    </div>
  );
};
