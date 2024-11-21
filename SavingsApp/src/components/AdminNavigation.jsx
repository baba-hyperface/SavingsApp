import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../styles/AdminNav.css'

export const AdminNavigation = () => {
  const location = useLocation(); 

  return (
    <div className="admin-navigation">
      <Link to="/admin">
        <div className={`nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
          <i className="fa-solid fa-users"></i>
          <h1>Users</h1>
        </div>
      </Link>
      <Link to="/allsavingplan">
        <div
          className={`nav-item ${location.pathname === "/allsavingplan" ? "active" : ""}`}
        >
          <i className="fa-solid fa-piggy-bank"></i>
          <h1>Saving Plan</h1>
        </div>
      </Link>
      <Link to="/adminshowcategory">
        <div className={`nav-item ${location.pathname === "/adminshowcategory" ? "active" : ""}`}>
          <i className="fa-solid fa-layer-group"></i>
          <h1>Category</h1>
        </div>
      </Link>
    </div>
  );
};
