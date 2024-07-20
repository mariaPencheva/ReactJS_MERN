import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.scss";

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <nav className="header">
      <Link to="/" className={`header__logo ${location.pathname === '/' ? 'active' : ''}`}>
        <img src="/logoTMS.png" alt="Task Board" />
        <h3>Task Board</h3>
      </Link>
      <div className="header__buttons">
        <Link to="/catalog" className={`header__menu ${location.pathname === '/catalog' ? 'active' : ''}`}>
          Catalog
        </Link>

        {!isAuthenticated ? (
          <>
            <Link to="/signin" className={`header__button ${location.pathname === '/signin' ? 'active' : ''}`}>
              Sign In
            </Link>
            <Link to="/signup" className={`header__button ${location.pathname === '/signup' ? 'active' : ''}`}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className={`header__menu ${location.pathname === '/profile' ? 'active' : ''}`}>
              Profile
            </Link>

            <button onClick={handleLogout} className="header__button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
