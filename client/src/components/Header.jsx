import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearUser } from '../redux/authSlice';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    navigate('/');
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
        {user ? (
          <>
            <Link to="/profile" className={`header__menu ${location.pathname === '/profile' ? 'active' : ''}`}>
              Profile
            </Link>
            <button onClick={handleLogout} className="header__button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className={`header__button ${location.pathname === '/signin' ? 'active' : ''}`}>
              Sign In
            </Link>
            <Link to="/signup" className={`header__button ${location.pathname === '/signup' ? 'active' : ''}`}>
              SignUp
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
