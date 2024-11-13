import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Nav.css";
import api from "./api";
import Cookies from "js-cookie";

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const userRole = Cookies.get("role");
    setIsAuthenticated(!!token);  
    setRole(userRole || null);
}, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout", {});
      if (res.status === 200) {
        Cookies.remove("accessToken");
        Cookies.remove("role");
        localStorage.removeItem("userid");
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        setRole(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-content">
        <h1 className="nav-logo">Coins Stash</h1>
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li>
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link className="nav-link" to="/dashboard">
                  DashBoard
                </Link>
              </li>
              {role === "admin" && (
                <li>
                  <Link className="nav-link" to="/admin">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  className="nav-link logout-btn"
                  to="/"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="/register">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Menu Toggle for mobile */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? (
            <i className="fa-solid fa-x"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="menu-body">
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/chart" onClick={toggleMenu}>
                Chart
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                </li>
                {role === "admin" && (
                  <li>
                    <Link to="/admin" onClick={toggleMenu}>
                      Admin panel
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={toggleMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={toggleMenu}>
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
