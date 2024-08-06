import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../redux/authSlice';

const Signin = ({ onNotify }) => {
  const { isLoading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = true;
      onNotify('Email is required!', 'error');
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = true;
      onNotify('Password is required!', 'error');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(errors).forEach((error) => onNotify(error, 'error'));
      return;
    }

    try {
      await dispatch(signin(formData)).unwrap();
      onNotify('Login successful!', 'success');
      navigate('/profile');
    } catch (err) {
      onNotify(/*'Failed to login: ' + */err, 'error');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <form className="signin-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button type="submit" className="form-submit-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
          <span className="signup-signin-link">
            If you do not have an account, click 
            <a href="/signup"> here</a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signin;
