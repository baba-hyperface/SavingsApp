import React, { useEffect, useState } from 'react'
import { Greeting } from './Greeting'
import { Balance } from './Balance';
import { SendMoney } from './SendMoney';
import { WithdrawMoney } from './WithdrawMoney';
import { SavingPlans } from './SavingPlans';
import api from './api';
import { DonutChart } from './DonutChart';
import '../App.css'
import { Transaction } from './Transaction';
import { DeActivated } from './DeActivated';
import { SaveButton } from './SaveButton';
import { Router, useNavigate } from 'react-router-dom';
import { SavePlanList } from './SavePlanList';

export const ChildDashBoard = ({data, setUser}) => {
    let {name,email, totalBalance, accountNumber, expDate} = data;
    const [currentBalance, setCurrentBalance] = useState(totalBalance);
    const [history, setHistory] = useState([]);
    const nav = useNavigate();

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

const handleNav = () => {
  nav('/savingplan')
}


  return (
    <div className='main-container'>
      <div className='header-container'>
      <Greeting name={name} />
      <Transaction history={history} />
      </div>
      <div className='balance-donut-container'>
      <Balance totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} accNum={accountNumber} expDate={expDate} updateBalance={updateBalance} email={email} onHistoryChange={handleTransactionHistoryUpdate} />
      </div>
      <div className='button-action-container'>
        <SendMoney totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance} onHistoryChange={handleTransactionHistoryUpdate} email={email} accountNum={name}/>
        <WithdrawMoney totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance} email={email} onHistoryChange={handleTransactionHistoryUpdate}/>
        <div>
        <button className="action-buttons" onClick={handleNav}>
        <i className="fa-solid fa-piggy-bank"></i>{" "}
        <span className="button-text">Goals</span>
      </button>
      <p className="send-text">Goals</p>
        </div>
      </div>
        <div  style={{ display: 'none' }}>
          <SavingPlans totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance}/>
         </div>

    </div>
  )
}
