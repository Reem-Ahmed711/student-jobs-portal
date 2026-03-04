import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let result;
    if (method === 'email') {
      result = await forgotPassword(email);
    } else {
      result = { success: true, message: 'Reset link sent to your phone' };
    }

    setLoading(false);
    if (result.success) {
      setSuccess('Password reset link sent! Check your ' + method);
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.error || 'Failed to send reset link');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#1E3A5F', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Reset Password
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Choose how you want to reset your password
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#dc2626',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#155724',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-check-circle"></i>
            {success}
          </div>
        )}

        {/* Method Toggle */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '25px',
          background: '#f3f4f6',
          padding: '4px',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setMethod('email')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              background: method === 'email' ? 'white' : 'transparent',
              color: method === 'email' ? '#1E3A5F' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: method === 'email' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
            Email
          </button>
          <button
            onClick={() => setMethod('phone')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              background: method === 'phone' ? 'white' : 'transparent',
              color: method === 'phone' ? '#1E3A5F' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: method === 'phone' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <i className="fas fa-phone"></i>
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {method === 'email' ? (
            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={inputWrapStyle}>
                <i className="fas fa-envelope" style={inputIconStyle}></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@science.cu.edu.eg"
                  style={inputStyle}
                  required
                />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                We'll send a password reset link to this email
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={inputWrapStyle}>
                <i className="fas fa-phone" style={inputIconStyle}></i>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 123 456 7890"
                  style={inputStyle}
                  required
                />
              </div>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                We'll send a password reset code to this phone
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: '#1E3A5F',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              marginBottom: '15px'
            }}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Sending...</>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <Link
            to="/login"
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '6px'
};

const inputWrapStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const inputIconStyle = {
  position: 'absolute',
  left: '12px',
  color: '#9ca3af',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '11px 12px 11px 36px',
  background: '#f9fafb',
  border: '1.5px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#374151',
  outline: 'none',
  boxSizing: 'border-box'
};

export default ForgotPassword;