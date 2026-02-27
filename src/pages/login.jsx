import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/main.css';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/student-profile');
  };

  const handleSocialLogin = (provider) => {
    navigate('/student-profile');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Welcome Back to<br />Your Future</h2>
        <p>Find the perfect part-time job while studying at the heart of Cairo University</p>
      </div>

      <div className="login-right">
        <div className="faculty-logo">
          <h3>Faculty of Science</h3>
        </div>

        <h1>Sign In to Your Account</h1>

        <div className="social-buttons">
          <button 
            className="social-btn google"
            onClick={() => handleSocialLogin('Google')}
          >
            <i className="fab fa-google"></i> Google
          </button>

          <button 
            className="social-btn linkedin" 
            onClick={() => handleSocialLogin('LinkedIn')}
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </button>
        </div>

        <div className="divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@science.cu.edu.eg"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <p className="signup-link">
          Don't have an account ? <Link to="/register"> Create one as Student or Employer </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;