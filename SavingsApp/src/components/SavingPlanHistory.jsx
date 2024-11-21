import React, { useEffect, useState } from 'react';
import '../styles/SavingPllanPageHistory.css';
import api from './api';
import { useParams } from 'react-router-dom';

export const SavingPlanHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistoryData] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { id } = useParams();

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/history/${id}`);
        setHistoryData(res.data.historydata);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  return (
    <div>
      <div className={`transaction-history-container ${isHistoryOpen ? 'open' : ''}`}>
        <div className="transaction-close-btn-container" onClick={toggleHistory}>
        </div>

        {loading ? (
          <p>Loading transaction history...</p>
        ) : error ? (
          <p>Error loading history.</p>
        ) : (
          <div className="transaction-list">
            <h3 className='heading-of-transaction'>Transactions</h3>
            {!history && history === undefined ? (
              <p>No history available</p>
            ) : (
              history.map((transaction, index) => (
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
                    <p>
                      {transaction.type === 'withdrawn' || transaction.type === 'Sent'
                        ? '-'
                        : '+'}₹{transaction.amount}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};