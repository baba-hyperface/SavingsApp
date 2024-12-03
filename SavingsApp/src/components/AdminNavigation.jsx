import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/AdminNav.css";
import api from "./api";

export const AdminNavigation = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateUsers = async () => {
    try {
      const count = 1000000;
      const yesorno = confirm(`Are you sure you want to generate ${count} users?`);
      if (yesorno) {
        setIsLoading(true); 
        const response = await api.post('/generate-users', { count });
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error generating users");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
        <div className="loading-spinner">
          <i className="fa-solid fa-spinner"></i>
        </div>
          <h2 style={{ animation: "none", transform: "none",color:"white", }}>
            Generating, please wait...
          </h2>
      </div>
      )}
      <div className="admin-navigation">
        <Link to="/admin">
          <div className={`nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
            <i className="fa-solid fa-users"></i>
            <h1>Users</h1>
          </div>
        </Link>
        <Link to="/Allsavingplan">
          <div className={`nav-item ${location.pathname === "/Allsavingplan" ? "active" : ""}`}>
            <i className="fa-solid fa-piggy-bank"></i>
            <h1>Saving Plan</h1>
          </div>
        </Link>
        <Link to="/Category">
          <div className={`nav-item ${location.pathname === "/Category" ? "active" : ""}`}>
            <i className="fa-solid fa-layer-group"></i>
            <h1>Category</h1>
          </div>
        </Link>
        <div
          onClick={handleGenerateUsers}
          className={`nav-item ${location.pathname === "/admingenerateusers" ? "active" : ""}`}
        >
          <i className="fa-solid fa-layer-group"></i>
          <h1>Generate Users</h1>
        </div>
      </div>
    </>
  );
};
