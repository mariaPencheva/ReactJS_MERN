import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/authSlice'; 
import { useNavigate } from 'react-router-dom';

const Signup = ({ onNotify }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repass: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[a-z.]+\.[a-z]+$/;

    if (formData.username.length < 3) {
      onNotify('Username is too short!', 'error');
      return;
    }

    if (!emailPattern.test(formData.email)) {
      onNotify('Invalid email address!', 'error');
      return;
    }

    if (formData.password.length < 6) {
      onNotify('Password must be at least 6 characters long!', 'error');
      return;
    }

    if (formData.password !== formData.repass) {
      onNotify('Passwords do not match!', 'error');
      return;
    }

      try {
      const resultAction = await dispatch(signup(formData));
      
      if (signup.fulfilled.match(resultAction)) {
        onNotify('Registration successful!', 'success');
        navigate('/profile');
      } else {
        if (resultAction.payload && resultAction.payload.message === 'User already exists') {
          onNotify('User already exists', 'error');
        } else {
          onNotify(resultAction.error.message || 'Registration failed', 'error');
        }
      }
    } catch (err) {
      onNotify('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>SignUp</h2>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
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
              className="form-input"
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
              className="form-input"
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
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="form-submit-button">Sign Up</button>

        </form>
      </div>
    </div>
  );
};

export default Signup;
