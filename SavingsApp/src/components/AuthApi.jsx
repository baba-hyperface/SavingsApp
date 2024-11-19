import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,setIsAuthenticated,
        role,setRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

