import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../redux/authSlice'; 
import { useNavigate } from 'react-router-dom';

const Signup = ({ onNotify }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repass: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (formData.username.length < 3) {
      newErrors.username = 'Username is too short!';
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[a-z.]+\.[a-z]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email address!';
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long!';
      isValid = false;
    }

    if (formData.password !== formData.repass) {
      newErrors.repass = 'Passwords do not match!';
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      Object.values(newErrors).forEach((error, index) => {
        setTimeout(() => {
          onNotify(error, 'error');
        }, index * 2500);
      });
      return;
    }

    try {
      const resultAction = await dispatch(signup(formData));
      
      if (signup.fulfilled.match(resultAction)) {
        onNotify('Registration successful!', 'success');
        navigate('/profile');
      } else {
        setErrors({ server: 'Registration failed. Please try again.' });
        onNotify('Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      setErrors({ server: 'An error occurred. Please try again.' });
      onNotify('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Enter your username"
              required
            />
          </div>

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
          </div>

          <div className="form-group">
            <label htmlFor="repass" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="repass"
              name="repass"
              value={formData.repass}
              onChange={handleChange}
              className={`form-input ${errors.repass ? 'error' : ''}`}
              placeholder="Confirm your password"
              required
            />
          </div>

          {errors.server && <div className="form-error-message">{errors.server}</div>}

          <button type="submit" className="form-submit-button">Sign Up</button>

          <span className="signup-signin-link">
            If you have an account, click 
            <a href="/signin"> here</a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;