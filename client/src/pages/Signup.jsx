import React, { useState } from 'react';
import axios from 'axios';
import './signup.scss';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repass: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //TODO validate email, username and password

    if (formData.password !== formData.repass) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData, { withCredentials: true });

      if (response.status === 201) {
        console.log('Registration successful');
        const signinResponse = await axios.post('http://localhost:3000/api/auth/signin', {
          email: formData.email,
          password: formData.password
        });

        if (signinResponse.status === 200) {
          localStorage.setItem('token', signinResponse.data.token);
          window.location.href = '/profile';
        }
      }
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      alert('Registration failed. Please try again.');
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

          <div className="form-group">
            <button type="submit" className="submit-button">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
