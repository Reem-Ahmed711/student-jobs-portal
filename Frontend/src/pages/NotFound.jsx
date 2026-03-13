// client/my-app/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{
        marginLeft: '280px',
        padding: '2rem',
        width: 'calc(100% - 280px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>

        <div className="float" style={{
          fontSize: '120px',
          color: '#1E3A5F',
          marginBottom: '2rem',
          textShadow: '0 10px 20px rgba(30,58,95,0.2)'
        }}>
          404
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          color: '#1E3A5F',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Page Not Found
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/student-dashboard"
          className="btn btn-primary"
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            textDecoration: 'none'
          }}
        >
          <i className="fas fa-home" style={{ marginRight: '0.5rem' }}></i>
          Back to Dashboard
        </Link>

        <div style={{
          marginTop: '3rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <Link
            to="/available-jobs"
            style={{
              color: '#1E3A5F',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e8f0fe'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <i className="fas fa-briefcase" style={{ marginRight: '0.5rem' }}></i>
            Browse Jobs
          </Link>
          <Link
            to="/contact"
            style={{
              color: '#1E3A5F',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e8f0fe'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;