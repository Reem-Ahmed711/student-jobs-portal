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
  if (result.user?.role === 'student') {
    navigate('/student-dashboard');
  } else if (result.user?.role === 'employer') {
    navigate('/employer-dashboard');
  } else {
    navigate('/admin-dashboard');
  }
}
    else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      alert('Google login integration will be added');
    } catch (err) {
      setError('Google login failed');
    }
    setLoading(false);
  };

  const handleLinkedInLogin = async () => {
    setLoading(true);
    setError('');
    try {
      alert('LinkedIn login integration will be added');
    } catch (err) {
      setError('LinkedIn login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left panel - background image */}
      <div style={{
        flex: '0 0 50%',
        background: 'linear-gradient(rgba(11,42,74,0.75), rgba(11,42,74,0.75)), url("C:\\student-jobs-portal\\client\\my-app\\images\\Job Portal.jpg") center/cover no-repeat',        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: '700', lineHeight: '1.2', marginBottom: '16px' }}>
          Welcome Back to<br />Your Future
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '380px', lineHeight: '1.6' }}>
          Find the perfect part-time job while studying at the heart of Cairo University
        </p>
      </div>

      {/* Right panel - login form */}
      <div style={{
        flex: '0 0 50%',
        background: '#f5f6fa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px', height: '56px',
              background: '#e8eef5',
              borderRadius: '12px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '10px',
            }}>
              <i className="fas fa-building" style={{ fontSize: '24px', color: '#1E3A5F' }}></i>
            </div>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Faculty of Science</p>
          </div>

          <h2 style={{ textAlign: 'center', color: '#1E3A5F', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            Sign In to Your Account
          </h2>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '14px' }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>{error}
            </div>
          )}

          {/* Social login */}
          <button onClick={handleGoogleLogin} style={socialBtnStyle}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
            <span>Continue with Google</span>
          </button>
          <button onClick={handleLinkedInLogin} style={{ ...socialBtnStyle, marginTop: '10px' }}>
            <i className="fab fa-linkedin" style={{ color: '#0077b5', fontSize: '18px' }}></i>
            <span>Continue with LinkedIn</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <div style={inputWrapStyle}>
                <i className="fas fa-envelope" style={inputIconStyle}></i>
                <input
                  type="email"
                  name="email"
                  placeholder="student@science.cu.edu.eg"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password</label>
              <div style={inputWrapStyle}>
                <i className="fas fa-lock" style={inputIconStyle}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: '40px' }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ color: '#1E3A5F', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: '#1E3A5F', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1,
              marginBottom: '16px',
            }}>
              {loading ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginBottom: '0' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1E3A5F', fontWeight: '600', textDecoration: 'none' }}>Create one as Student</Link>
            {' '}or{' '}
            <Link to="/register?type=employer" style={{ color: '#1E3A5F', fontWeight: '600', textDecoration: 'none' }}>Employer</Link>
          </p>
        </div>

        <p style={{ marginTop: '20px', color: '#9ca3af', fontSize: '13px' }}>
          ← <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

const socialBtnStyle = {
  width: '100%', padding: '11px', background: 'white',
  border: '1.5px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  fontSize: '14px', fontWeight: '500', color: '#374151',
};
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' };
const inputWrapStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputIconStyle = { position: 'absolute', left: '12px', color: '#9ca3af', fontSize: '14px' };
const inputStyle = {
  width: '100%', padding: '11px 12px 11px 36px', background: '#f9fafb',
  border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px',
  color: '#374151', outline: 'none', boxSizing: 'border-box',
};

export default Login;