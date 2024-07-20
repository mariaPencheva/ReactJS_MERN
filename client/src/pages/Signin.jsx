import React, { useState } from "react";
import axios from "axios";
import './signin.scss'

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signin", formData, { withCredentials: true });

      if (response.status === 200) {
        // console.log("Sign In successful");
        localStorage.setItem('token', response.data.token);
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      alert('Login failed. Please try again.');
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
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="form-input"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="form-input"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
