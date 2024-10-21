import React, { useState } from 'react'
import { Greeting } from './Greeting'
import { Balance } from './Balance';
import { SendMoney } from './SendMoney';
import { WithdrawMoney } from './WithdrawMoney';
import { SaveButton } from './SaveButton';
import { Was } from './Was';
import { SavingPlans } from './SavingPlans';
// import axios from 'axios';
import api from './api';
import { DonutChart } from './DonutChart';
import '../App.css'

export const ChildDashBoard = ({data, setUser}) => {
    let {name, totalBalance, accountNumber, expDate} = data;
    const [currentBalance, setCurrentBalance] = useState(totalBalance);

    const handleBalanceUpdate = (newBalance) => {
        setCurrentBalance(newBalance);
        console.log("Updated Balance:", newBalance);
      };

      console.log(totalBalance);

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



  return (
    <div className='main-container'>
      <Greeting name={name} />
      <div className='balance-donut-container'>
      <Balance totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} accNum={accountNumber} expDate={expDate} updateBalance={updateBalance} />
      </div>
      <div className='button-action-container'>
        <SendMoney totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance}/>
        <WithdrawMoney totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance} />
        <SaveButton totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance} />
        <Was />
      </div>
      <SavingPlans totalBalance={totalBalance} onBalanceUpdate={handleBalanceUpdate} updateBalance={updateBalance}/>
    </div>
  )
}
