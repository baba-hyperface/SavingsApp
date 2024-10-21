import React, { createContext, useState } from 'react';

export const SavingPlansContext = createContext();

export const SavingPlansProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  return (
    <SavingPlansContext.Provider value={{ plans, setPlans }}>
      {children}
    </SavingPlansContext.Provider>
  );
};