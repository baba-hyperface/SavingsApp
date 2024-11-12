import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Nav.css';
import api from './api';
import Cookies from 'js-cookie';

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
        await api.post('/logout', {});

        localStorage.removeItem('accessToken');
        localStorage.removeItem('userid');
        setIsAuthenticated(false); 
        navigate('/'); 
    } catch (error) {
        console.error('Logout failed:', error);
    }
  }

const role = Cookies.get('role');
console.log("role",role);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); 
  };

  return (
    <nav className="nav">
      <div className="nav-content">
        <h1 className="nav-logo">Coins Stash</h1>

        {/* Links for larger screens */}
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link className="nav-link" to="/dashboard">DashBoard</Link>
              </li>
              
              { role=="admin" &&
              <li>
                <Link className="nav-link" to="/admin">Admin</Link>
                
              </li>
          }
              <li>
                <Link className="nav-link logout-btn" to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li>
                <Link className="nav-link" to="/register">Signup</Link>
              </li>
            </>
          )}
        </ul>

        {/* Menu Toggle for mobile */}
        <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ?  <i class="fa-solid fa-x"></i> : <i className="fa-solid fa-bars"></i>}
        </button>
      </div>

      {isMenuOpen && (
        <div className="menu-body">
          <ul>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/chart" onClick={toggleMenu}>Chart</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>

                { role=="admin" &&
                <li><Link to="/admin" onClick={toggleMenu}>Admin panel</Link></li>
}
                <li><Link to="/" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                <li><Link to="/register" onClick={toggleMenu}>Signup</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
