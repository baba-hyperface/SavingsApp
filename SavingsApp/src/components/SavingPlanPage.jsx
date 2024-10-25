import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import '../styles/SavingPage.css';
import { SavingPlanHistory } from './SavingPlanHistory';
import { div } from 'framer-motion/client';

export const SavingPlanPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const userid = localStorage.getItem('userid');
  console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/user/${userid}/savingplan/${id}`);
        setData(res.data); 
        console.log(res.data)
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

  console.log(data.dailyAmount)
  const remainingAmount = data.targetAmount ? (data.targetAmount - data.currentBalance) : 0;
  const daysRequired = data.dailyAmount > 0 ? Math.ceil(remainingAmount / data.dailyAmount) : 'N/A';
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
      <div className='saving-plan-page-main-container'>
            <div>
            <div className="app-container">
      <h1 className='savingpage-header'>Your {data.potPurpose} Saving Plan</h1>
      <div className="goal-section">
        <div className='header-container-savepage'>
          <div>
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <h3>₹{data.dailyAmount}</h3>
            <p>Daily Target</p>
          </div>
        </div>
        <div className='header-container-savepage'>
          <div>
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div>
            <h3>₹{remainingAmount}</h3>
            <p>Remaining</p>
          </div>
        </div>
        <div className="add-goal-card">
          <i className="fa-solid fa-plus"></i>
          <p> Add Money</p>
        </div>
      </div>

      <div className='money-and-date-container'>
        <div className='money-deails-container'>
          <div>
            <h3>₹{data.targetAmount || 'N/A'}</h3>
            <p>{data.potPurpose} goal set amount</p>
          </div>
          <div>
            <h3>{daysRequired} days</h3>
            <p>Days to reach target</p>
          </div>
          <div>
            <h3>₹{data.currentBalance}</h3>
            <p>Current balance</p>
          </div>
        </div>
        <div className='date-deails-container'>
          <div className='date-child-container'>
            <div>
              <i className="fa-solid fa-calendar-days"></i>
            </div>
            <div>
              <h5>{formatDate(data.startDate)}</h5>
              <p>Start date</p>
            </div>
          </div>
          <div className='date-child-container'>
            <div>
              <i className="fa-solid fa-calendar-days"></i>
            </div>
            <div>
              <h5>{formatDate(data.endDate)}</h5>
              <p>End date</p>
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className='saving-page-image'>
            <img src="https://img.freepik.com/premium-vector/saving-money-with-large-jar-concept-illustration_135170-34.jpg" alt="" />
      </div>
    </div>
            </div>
            <div>
                  <SavingPlanHistory />
            </div>


      </div>
  );
};
