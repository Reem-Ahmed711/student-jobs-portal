// client/my-app/src/pages/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(formData);
    setLoading(false);
    
    if (result.success) {
      console.log('✅ User role:', result.user?.role);
      
      if (result.user?.role === 'student') {
        navigate('/student-dashboard');
      } else if (result.user?.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // استخدام بيانات وهمية للـ Google login
      const result = await login({ 
        email: 'google.user@gmail.com', 
        password: 'google-auth-mock' 
      });
      
      if (result.success) {
        if (result.user?.role === 'student') {
          navigate('/student-dashboard');
        } else if (result.user?.role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      }
    } catch (err) {
      setError('Google login failed');
    }
    setLoading(false);
  };

  const handleLinkedInLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // استخدام بيانات وهمية للـ LinkedIn login
      const result = await login({ 
        email: 'linkedin.user@linkedin.com', 
        password: 'linkedin-auth-mock' 
      });
      
      if (result.success) {
        if (result.user?.role === 'student') {
          navigate('/student-dashboard');
        } else if (result.user?.role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      }
    } catch (err) {
      setError('LinkedIn login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: "'Segoe UI', sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .left-panel {
          animation: slideInLeft 0.6s ease-out;
        }
        .right-panel {
          animation: slideInRight 0.6s ease-out;
        }
        .input-field {
          transition: all 0.3s ease;
        }
        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(30, 58, 95, 0.2);
        }
        .btn-primary {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(30, 58, 95, 0.3);
        }
        .btn-primary:active {
          transform: translateY(0);
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }
        .btn-primary:focus:not(:active)::after {
          animation: ripple 1s ease-out;
        }
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          20% {
            transform: scale(25, 25);
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
      `}</style>

      {/* Left panel - background image with gradient */}
      <div className="left-panel" style={{
        flex: '1',
        background: 'linear-gradient(135deg, rgba(30,58,95,0.95) 0%, rgba(60,100,150,0.9) 100%), url("https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80") center/cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        
        <div style={{ maxWidth: '500px', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            marginBottom: '1.5rem',
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Welcome Back to<br />Your Future
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.95,
            lineHeight: '1.6',
            marginBottom: '3rem'
          }}>
            Find the perfect part-time job while studying at the heart of Cairo University
          </p>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-check-circle" style={{ color: '#4CAF50', fontSize: '1.2rem' }}></i>
              <span>500+ Jobs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-check-circle" style={{ color: '#4CAF50', fontSize: '1.2rem' }}></i>
              <span>1000+ Students</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-check-circle" style={{ color: '#4CAF50', fontSize: '1.2rem' }}></i>
              <span>50+ Departments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="right-panel" style={{
        flex: '0.9',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative',
        overflowY: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto'
        }}>
          {/* Logo and welcome message */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2.5rem',
            animation: 'fadeIn 0.8s ease-out'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 10px 30px rgba(30,58,95,0.3)'
            }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: '32px', color: 'white' }}></i>
            </div>
            <h2 style={{ 
              fontSize: '2rem', 
              color: '#1E3A5F', 
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              Sign In
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Error message with animation */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'slideInRight 0.3s ease-out'
            }}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Social login buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            animation: 'fadeIn 1s ease-out'
          }}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#374151',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              className="btn-primary"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1E3A5F';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
              Google
            </button>
            <button
              onClick={handleLinkedInLogin}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#374151',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
              className="btn-primary"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1E3A5F';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fab fa-linkedin" style={{ color: '#0077b5', fontSize: '20px' }}></i>
              LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            margin: '1.5rem 0',
            animation: 'fadeIn 1.2s ease-out'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)' }} />
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 1.4s ease-out' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#1E3A5F',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '1rem'
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@science.cu.edu.eg"
                  required
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E3A5F';
                    e.target.style.boxShadow = '0 0 0 4px rgba(30,58,95,0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#1E3A5F',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '1rem',
                  zIndex: 1
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 3rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E3A5F';
                    e.target.style.boxShadow = '0 0 0 4px rgba(30,58,95,0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f9fafb';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    fontSize: '1rem',
                    padding: '0.5rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1E3A5F'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1.5rem 0'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                color: '#374151'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#1E3A5F'
                  }}
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                style={{
                  color: '#1E3A5F',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2a4a7a'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A5F'}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '1.5rem',
                boxShadow: '0 4px 15px rgba(30,58,95,0.3)'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p style={{
            textAlign: 'center',
            fontSize: '0.95rem',
            color: '#6b7280',
            animation: 'fadeIn 1.6s ease-out'
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#1E3A5F',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2a4a7a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A5F'}
            >
              Create one
            </Link>
          </p>

          {/* Back to home */}
          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.9rem',
            animation: 'fadeIn 1.8s ease-out'
          }}>
            <Link
              to="/"
              style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1E3A5F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;