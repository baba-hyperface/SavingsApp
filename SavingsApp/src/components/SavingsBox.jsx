import React, { useState } from 'react';
import '../styles/savingBox.css'

export const SavingsBox = () => {
  const [interval, setInterval] = useState('daily');  
  const [amount, setAmount] = useState(0);

  const handleAddSavings = () => {
    const savingsAmount = parseFloat(amount);
    if (savingsAmount > 0) {
      setAmount(0);  
    }
  };

  return (
    <div className="savings-box">
      <h3>Save More!</h3>
      <div className="input-section">
        <label>Select Saving Interval:</label>
        <select value={interval} onChange={(e) => setInterval(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="input-section">
        <label>Enter Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <button onClick={handleAddSavings} className="add-money-btn">Add Savings</button>
    </div>
  );
};

