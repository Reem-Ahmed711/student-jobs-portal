// src/pages/StudentApplications.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getUserApplications, withdrawApplication, confirmInterview } from '../services/api';

const StudentApplications = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await getUserApplications();
        console.log('Applications response:', response.data);
        
        let appsData = [];
        if (response.data?.success && Array.isArray(response.data?.data)) {
          appsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          appsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data?.data)) {
          appsData = response.data.data;
        } else {
          appsData = [];
        }
        
        setApplications(appsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    setWithdrawing(true);
    try {
      await withdrawApplication(appId);
      setApplications(prev => prev.filter(app => app.id !== appId));
      alert('✅ Application withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('❌ Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleConfirmInterview = async (appId) => {
    try {
      await confirmInterview(appId);
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: 'confirmed' } : app
      ));
      alert('✅ Interview confirmed successfully!');
    } catch (error) {
      console.error('Error confirming interview:', error);
      alert('❌ Failed to confirm interview');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return { bg: '#fff3cd', color: '#856404', label: 'Pending' };
      case 'interview': return { bg: '#d4edda', color: '#155724', label: 'Interview' };
      case 'accepted': return { bg: '#cce5ff', color: '#004085', label: 'Accepted' };
      case 'rejected': return { bg: '#f8d7da', color: '#721c24', label: 'Rejected' };
      case 'confirmed': return { bg: '#d1ecf1', color: '#0c5460', label: 'Confirmed' };
      default: return { bg: '#e2e3e5', color: '#383d41', label: status || 'Unknown' };
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status?.toLowerCase() === 'pending').length,
    interview: applications.filter(a => a.status?.toLowerCase() === 'interview').length,
    accepted: applications.filter(a => a.status?.toLowerCase() === 'accepted').length
  };

  const StatCard = ({ number, label, icon, color }) => (
    <div className="stat-card" style={{
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '1.5rem'
      }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h3 style={{ fontSize: '1.8rem', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '0.25rem' }}>{number}</h3>
        <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '0.9rem' }}>{label}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: darkMode ? '#f1f5f9' : '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
          <i className="fas fa-file-alt" style={{ marginRight: '10px' }}></i>
          My Applications
        </h1>
        <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
          <i className="fas fa-graduation-cap" style={{ marginRight: '5px' }}></i>
          {user?.department || 'All Departments'} • {applications.length} total applications
        </p>
      </div>

      <div className="stats-grid">
        <StatCard number={stats.total} label="Total Applications" icon="fa-file-alt" color="#1E3A5F" />
        <StatCard number={stats.pending} label="Pending" icon="fa-clock" color="#f59e0b" />
        <StatCard number={stats.interview} label="Interview" icon="fa-calendar-check" color="#16a34a" />
        <StatCard number={stats.accepted} label="Accepted" icon="fa-check-circle" color="#0077B5" />
      </div>

      {/* Filter Buttons */}
      <div style={{ 
        background: darkMode ? '#1e293b' : 'white', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontWeight: '500' }}>
            <i className="fas fa-filter" style={{ marginRight: '5px' }}></i>
            Filter by:
          </span>
          {['all', 'pending', 'interview', 'accepted', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 16px', fontSize: '14px', textTransform: 'capitalize' }}
            >
              {status === 'all' && <i className="fas fa-list" style={{ marginRight: '5px' }}></i>}
              {status === 'pending' && <i className="fas fa-hourglass-half" style={{ marginRight: '5px' }}></i>}
              {status === 'interview' && <i className="fas fa-handshake" style={{ marginRight: '5px' }}></i>}
              {status === 'accepted' && <i className="fas fa-check-circle" style={{ marginRight: '5px' }}></i>}
              {status === 'rejected' && <i className="fas fa-times-circle" style={{ marginRight: '5px' }}></i>}
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center' 
        }}>
          <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
          <h3 style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>No applications found</h3>
          <p style={{ color: darkMode ? '#64748b' : '#999', marginBottom: '20px' }}>
            {filter === 'all' ? "You haven't applied to any jobs yet" : `No ${filter} applications found`}
          </p>
          <button 
            onClick={() => window.location.href = '/available-jobs'}
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredApplications.map(app => {
            const statusColors = getStatusColor(app.status);
            return (
              <div key={app.id} style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                borderRadius: '12px', 
                padding: '20px',
                border: app.status?.toLowerCase() === 'interview' ? '2px solid #16a34a20' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>{app.jobTitle}</h3>
                      <span className="badge" style={{ background: '#E6F0FA', color: '#1E3A5F' }}>
                        <i className="fas fa-percent" style={{ marginRight: '5px', fontSize: '11px' }}></i>
                        {app.match || app.matchScore || 75}% Match
                      </span>
                    </div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '5px' }}>
                      <i className="fas fa-building" style={{ marginRight: '5px' }}></i>
                      {app.company || app.department} • <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i>{app.location || 'Cairo University'}
                    </p>
                  </div>
                  
                  <span className="badge" style={{ 
                    padding: '6px 12px', 
                    fontSize: '13px',
                    background: statusColors.bg,
                    color: statusColors.color
                  }}>
                    <i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '5px' }}></i>
                    {statusColors.label}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '15px',
                  color: darkMode ? '#94a3b8' : '#666',
                  fontSize: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i> {app.type || 'Part-Time'}</span>
                  <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i> Applied: {app.appliedDate || new Date().toLocaleDateString()}</span>
                  <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px' }}></i> {app.salary || 'N/A'}</span>
                </div>

                {app.status?.toLowerCase() === 'interview' && app.interviewDate && (
                  <div style={{
                    background: '#d4edda',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <i className="fas fa-calendar-check" style={{ color: '#155724', marginRight: '8px' }}></i>
                      <strong>Interview Scheduled:</strong> {app.interviewDate}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  {app.status?.toLowerCase() === 'pending' && (
                    <button 
                      onClick={() => handleWithdraw(app.id)}
                      disabled={withdrawing}
                      className="btn btn-danger" 
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fas fa-times"></i>
                      {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                  {app.status?.toLowerCase() === 'interview' && (
                    <button 
                      onClick={() => handleConfirmInterview(app.id)}
                      className="btn btn-success" 
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fas fa-check"></i>
                      Confirm Interview
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
