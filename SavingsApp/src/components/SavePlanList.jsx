import React from 'react'
import "../styles/buttonStyles.css";
import { SavingPlans } from './SavingPlans';

export const SavePlanList = ({ totalBalance, onBalanceUpdate, updateBalance }) => {
  return (
    <div>
      <button className="action-buttons">
        <i className="fa-solid fa-piggy-bank"></i>{" "}
        <span className="button-text">Save it</span>
      </button>
      <p className="send-text">Save</p>
    </div>
  )
}
