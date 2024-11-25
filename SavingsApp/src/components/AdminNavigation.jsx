import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../styles/AdminNav.css'
import api from "./api";

export const AdminNavigation = () => {
  const location = useLocation(); 

  const handleGenerateUsers = async () => {
    try {
      const count = 1000000;
        const yesorno = confirm(`are you confirm generation of users,${count}`);
        if(yesorno){
          const response = await api.post('/generate-users', { count });
          alert(response.data.message);
        }
    } catch (error) {
        console.error(error);
        alert('Error generating users');
    }
};

  return (
    <div className="admin-navigation">
      <Link to="/admin">
        <div className={`nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
          <i className="fa-solid fa-users"></i>
          <h1>Users</h1>
        </div>
      </Link>
      <Link to="/Allsavingplan">
        <div
          className={`nav-item ${location.pathname === "/Allsavingplan" ? "active" : ""}`}
        >
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
      <Link>
        <div 
        onClick={handleGenerateUsers}  
        className={`nav-item ${location.pathname === "/admingenerateusers" ? "active" : ""}`}>
          <i className="fa-solid fa-layer-group"></i>
          <h1>GenerateUsers</h1>
        </div>
      </Link>
    </div>
  );
};
