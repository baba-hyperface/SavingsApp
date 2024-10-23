import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import '../styles/SavingPage.css'
import { SavingPlanHistory } from './SavingPlanHistory';
export const SavingPlanPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const userid = localStorage.getItem('userid');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/user/${userid}/savingplan/${id}`);
        setData(res.data);
      } catch (error) {
        console.error('Error fetching saving plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userid, id]);
  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }
  return (
    <div>
      <div className='saving-child-container'>
            <div className="saving-plan-container">
            <div className="saving-plan-header" style={{ backgroundColor: data.color }}>
        <h1>{data.potPurpose}</h1>
        <span className="emoji">{data.imoji}</span>
      </div>
      <div className="saving-plan-details">
        <p>Target Amount: ₹{data.targetAmount || 'N/A'}</p>
        <p>Current Balance: ₹{data.currentBalance}</p>
        <p>Daily Deduction: ₹{data.dailyAmount}</p>
        <p>Category: {data.category}</p>
        <p>Auto Deduction: {data.autoDeduction ? 'Enabled' : 'Disabled'}</p>
      </div>
       </div>
       <SavingPlanHistory />
      </div>
      <div>
      </div>     
    </div>
  );
};