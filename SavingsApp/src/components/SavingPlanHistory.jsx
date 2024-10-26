import React, { useEffect, useState } from 'react';
import '../styles/SavingPllanPageHistory.css';
import api from './api';
import { useParams } from 'react-router-dom';
import { div } from 'framer-motion/client';

export const SavingPlanHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistorydata] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const { id } = useParams();

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };


  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/history/${id}`);
        setHistorydata(res.data.historydata);
        console.log("Fetched history data:", res.data.historydata);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log("Error in history fetching:", error);
        setLoading(false);
      }
    };
    fetchUserdata();
  }, [id]);

  if(!history && history === undefined){
    return (
      <div className='no-history-available'>No History Available</div>
    )
  }

  return (
    <div>
      <div className='icon-container'>
        <i className="fa-solid fa-clock-rotate-left"
           style={{fontSize: '20px'}}
           onClick={toggleHistory}></i>
      </div>

      <div className={`transaction-history ${isHistoryOpen ? 'open' : ''}`}>
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
                      <span>{transaction.from}</span> - to - <span>{transaction.to}</span>
                    </p>
                  </div>
                  <div className="transaction-amount">
                    <p>{transaction.type === 'withdrawn' || transaction.type === 'Sent' ? '-' : '+'}₹{transaction.amount}</p>
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
