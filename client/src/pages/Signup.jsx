import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/authSlice'; 
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repass: ''
  });

  const [error, setError] = useState(null);
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

    if (!emailPattern.test(formData.email)) {
      setError('Invalid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.repass) {
      setError('Passwords do not match');
      return;
    }

     try {
        console.log('Submitting form data:', formData);
        await dispatch(signup(formData));
        navigate('/profile');
    } catch (err) {
      console.error('Failed to signup:', err);
      setError('Registration failed');
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

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
