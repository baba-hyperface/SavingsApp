import React, { useEffect, useState } from 'react';
import '../styles/transaction.css';
import api from './api';

export const Transaction = ({history}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const toggleHistory = async () => {
      setIsHistoryOpen(!isHistoryOpen);
    };

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
              {history.length > 0 ? (
                history.map((transaction, index) => (
                  <div key={index} className="transaction-item">
                    <div className="transaction-details">
                      <p>{transaction.type}</p>
                      <p>{new Date(transaction.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p>
                        <span>{transaction.from}</span> - to  - <span>{transaction.to}</span>
                      </p>
                    </div>
                    <div className="transaction-amount">
                      <p>{transaction.type === 'Withdrawn' || transaction.type === 'Sent' ? '-' : '+'}₹{transaction.amount}</p>
                    </div>
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
