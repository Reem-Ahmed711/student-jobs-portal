// C:\Student-job-portal\Frontend\src\pages\ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await forgotPassword(email);
      
      // نجاح العملية بغض النظر عن استجابة الـ API (لأسباب أمنية)
      setSuccess('✅ If an account exists with this email, you will receive a password reset link shortly.');
      setEmail('');
      
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      console.error('Forgot password error:', err);
      // لا نكشف للمستخدم إذا كان الإيميل موجود أم لا (لأسباب أمنية)
      setSuccess('✅ If an account exists with this email, you will receive a password reset link shortly.');
      setEmail('');
      setTimeout(() => navigate('/login'), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .reset-card {
          animation: slideInUp 0.5s ease-out;
        }
        .input-field {
          transition: all 0.3s ease;
        }
        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .btn-submit {
          transition: all 0.3s ease;
        }
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30,58,95,0.3);
        }
      `}</style>

      <div className="reset-card" style={{
        background: darkMode ? '#1e293b' : 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 30px rgba(30,58,95,0.3)'
          }}>
            <i className="fas fa-key" style={{ fontSize: '28px', color: 'white' }}></i>
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: darkMode ? '#f1f5f9' : '#1E3A5F',
            marginBottom: '8px' 
          }}>
            Forgot Password?
          </h2>
          <p style={{ color: darkMode ? '#94a3b8' : '#6b7280', fontSize: '14px' }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
            color: '#dc2626',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
            color: '#155724',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <i className="fas fa-check-circle"></i>
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: darkMode ? '#94a3b8' : '#374151'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-envelope" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '16px'
              }}></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@science.cu.edu.eg"
                className="input-field"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: darkMode ? '#0f172a' : '#f9fafb',
                  border: `1.5px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: darkMode ? '#e2e8f0' : '#374151',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              We'll send a password reset link to this email address
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Sending reset link...</>
            ) : (
              <><i className="fas fa-paper-plane"></i> Send Reset Link</>
            )}
          </button>

          <Link
            to="/login"
            style={{
              display: 'block',
              textAlign: 'center',
              color: darkMode ? '#94a3b8' : '#6b7280',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1E3A5F'}
            onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94a3b8' : '#6b7280'}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '6px' }}></i>
            Back to Login
          </Link>
        </form>

        {/* Help Text */}
        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: darkMode ? '#0f172a' : '#f8f9fa',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
            <i className="fas fa-question-circle" style={{ marginRight: '6px' }}></i>
            Having trouble? <Link to="/contact" style={{ color: '#1E3A5F', textDecoration: 'none' }}>Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
