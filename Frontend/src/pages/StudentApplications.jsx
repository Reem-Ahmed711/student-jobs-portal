// C:\Student-job-portal\Frontend\src\pages\StudentApplications.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getMyApplications, withdrawApplication } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentApplications = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawing, setWithdrawing] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getMyApplications();
      let appsData = response.data?.data || response.data || [];
      
      // إضافة match score مؤقت إذا لم يكن موجود
      appsData = appsData.map(app => ({
        ...app,
        match: app.match || Math.floor(Math.random() * 25) + 70,
        appliedAt: app.appliedAt || new Date().toISOString()
      }));
      
      setApplications(appsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status?.toLowerCase() === filter.toLowerCase());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) return;

    setWithdrawing(true);
    try {
      await withdrawApplication(appId);
      await fetchApplications();
      showToast('✅ Application withdrawn successfully', 'success');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      showToast('❌ Failed to withdraw application', 'error');
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted':
        return { bg: '#d4edda', color: '#155724', icon: 'fa-check-circle', text: 'Accepted', border: '#10b981' };
      case 'interview':
        return { bg: '#cce5ff', color: '#004085', icon: 'fa-calendar-check', text: 'Interview Scheduled', border: '#3b82f6' };
      case 'rejected':
        return { bg: '#f8d7da', color: '#721c24', icon: 'fa-times-circle', text: 'Not Selected', border: '#ef4444' };
      case 'shortlisted':
        return { bg: '#fff3cd', color: '#856404', icon: 'fa-star', text: 'Shortlisted', border: '#f59e0b' };
      default:
        return { bg: '#fff3cd', color: '#856404', icon: 'fa-clock', text: 'Under Review', border: '#f59e0b' };
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status?.toLowerCase() === 'pending' || a.status?.toLowerCase() === 'under review').length,
    interview: applications.filter(a => a.status?.toLowerCase() === 'interview').length,
    accepted: applications.filter(a => a.status?.toLowerCase() === 'accepted').length,
    shortlisted: applications.filter(a => a.status?.toLowerCase() === 'shortlisted').length
  };

  const StatCard = ({ number, label, icon, color, trend }) => (
    <div className="stat-card" style={{
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{
        width: '50px',
        height: '50px',
        background: `${color}20`,
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '22px'
      }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h3 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '4px' }}>{number}</h3>
        <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>{label}</p>
        {trend && <small style={{ color: '#10b981' }}>{trend}</small>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .app-card {
          transition: all 0.3s ease;
          animation: slideInUp 0.5s ease-out;
        }
        .app-card:hover {
          transform: translateX(5px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-file-alt" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                My Applications
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Track and manage all your job applications
              </p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {toast.message}
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <StatCard number={stats.total} label="Total Applications" icon="fa-file-alt" color="#1E3A5F" />
          <StatCard number={stats.pending} label="Under Review" icon="fa-clock" color="#f59e0b" />
          <StatCard number={stats.shortlisted} label="Shortlisted" icon="fa-star" color="#8b5cf6" />
          <StatCard number={stats.interview} label="Interviews" icon="fa-calendar-check" color="#16a34a" />
          <StatCard number={stats.accepted} label="Accepted" icon="fa-check-circle" color="#10b981" />
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ 
          marginBottom: '30px', 
          padding: '20px',
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '16px',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
              <i className="fas fa-filter" style={{ marginRight: '8px' }}></i>
              Filter by:
            </span>
            {['all', 'pending', 'shortlisted', 'interview', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => { setFilter(status); setCurrentPage(1); }}
                style={{
                  padding: '8px 20px',
                  background: filter === status ? '#1E3A5F' : 'transparent',
                  color: filter === status ? 'white' : (darkMode ? '#94a3b8' : '#666'),
                  border: filter === status ? 'none' : `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: filter === status ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '60px',
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            animation: 'slideInUp 0.7s ease-out'
          }}>
            <i className="fas fa-inbox" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>
              No applications found
            </h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '20px' }}>
              {filter !== 'all' 
                ? `No ${filter} applications found` 
                : "You haven't applied to any jobs yet"}
            </p>
            <button 
              onClick={() => navigate('/available-jobs')}
              className="btn btn-primary"
              style={{
                padding: '12px 28px',
                background: '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
      }}
            >
              <i className="fas fa-search"></i> Browse Jobs
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentItems.map((app) => {
                const statusConfig = getStatusConfig(app.status);
                const isTopMatch = app.match >= 90;
                
                return (
                  <div 
                    key={app.id} 
                    className="app-card"
                    style={{
                      background: darkMode ? '#1e293b' : 'white',
                      borderRadius: '20px',
                      padding: '20px',
                      borderLeft: `4px solid ${statusConfig.border}`,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => setSelectedApp(app)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                            {app.jobTitle || 'Position'}
                          </h3>
                          {isTopMatch && (
                            <span style={{ fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 10px', borderRadius: '20px' }}>
                              <i className="fas fa-crown"></i> Top Match
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666', marginBottom: '5px' }}>
                          <i className="fas fa-building" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                          {app.employerName || app.department || 'Department'}
                        </p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                          <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i> Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                          {app.salary && <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px' }}></i> {app.salary}</span>}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge" style={{ 
                          background: statusConfig.bg, 
                          color: statusConfig.color, 
                          padding: '6px 14px', 
                          borderRadius: '30px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <i className={`fas ${statusConfig.icon}`} style={{ fontSize: '11px' }}></i>
                          {statusConfig.text}
                        </span>
                        <div style={{ marginTop: '8px' }}>
                          <span className="badge" style={{ 
                            background: app.match >= 90 ? '#d4edda' : app.match >= 80 ? '#fff3cd' : '#f8d7da',
                            color: app.match >= 90 ? '#155724' : app.match >= 80 ? '#856404' : '#721c24',
                            padding: '4px 12px',
                            borderRadius: '30px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {app.match}% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    {app.skills && app.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                        {app.skills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="skill-tag" style={{ fontSize: '11px', padding: '4px 12px' }}>
                            {skill}
                          </span>
                        ))}
                        {app.skills.length > 4 && (
                          <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999' }}>
                            +{app.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Interview Section */}
                    {app.status?.toLowerCase() === 'interview' && app.interviewDate && (
                      <div style={{
                        background: '#cce5ff',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div>
                          <i className="fas fa-calendar-check" style={{ color: '#004085', marginRight: '8px' }}></i>
                          <strong>Interview Scheduled:</strong> {new Date(app.interviewDate).toLocaleString()}
                        </div>
                        <button style={{
                          padding: '6px 16px',
                          background: '#004085',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>
                          Add to Calendar
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '15px' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/job/${app.jobId}`); }}
                        className="btn btn-outline" 
                        style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fas fa-eye"></i> View Job
                      </button>
                      {app.status?.toLowerCase() === 'pending' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleWithdraw(app.id); }}
                          disabled={withdrawing}
                          className="btn btn-danger" 
                          style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <i className="fas fa-times"></i>
                          {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                        className="btn btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fas fa-info-circle"></i> Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '30px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`btn ${currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                      style={{ minWidth: '36px', height: '36px', padding: '0 8px', borderRadius: '8px', fontWeight: currentPage === pageNum ? '600' : '400' }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setSelectedApp(null)}>
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedApp(null)} style={{
              position: 'absolute',
              top: '15px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: darkMode ? '#94a3b8' : '#999'
            }}>&times;</button>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <i className="fas fa-file-alt" style={{ fontSize: '28px', color: 'white' }}></i>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{selectedApp.jobTitle}</h2>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>{selectedApp.employerName || selectedApp.department}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Application Status</h4>
              <div style={{ padding: '10px', background: darkMode ? '#0f172a' : '#f8f9fa', borderRadius: '12px' }}>
                <span className="badge" style={{ background: getStatusConfig(selectedApp.status).bg, color: getStatusConfig(selectedApp.status).color, padding: '6px 14px' }}>
                  {getStatusConfig(selectedApp.status).text}
                </span>
                <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666', marginTop: '10px' }}>
                  Applied on {new Date(selectedApp.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Application Timeline</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '13px' }}>Application Submitted - {new Date(selectedApp.appliedAt).toLocaleDateString()}</span>
                </div>
                {selectedApp.status === 'reviewing' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '13px' }}>Under Review</span>
                  </div>
                )}
                {selectedApp.status === 'interview' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '13px' }}>Interview Scheduled</span>
                  </div>
                )}
              </div>
            </div>
            
            {selectedApp.message && (
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Your Message</h4>
                <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666', padding: '10px', background: darkMode ? '#0f172a' : '#f8f9fa', borderRadius: '12px' }}>
                  {selectedApp.message}
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => {
                  navigate(`/job/${selectedApp.jobId}`);
                  setSelectedApp(null);
                }}
              >
                View Job Posting
              </button>
              {selectedApp.status?.toLowerCase() === 'pending' && (
                <button
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={() => {
                    handleWithdraw(selectedApp.id);
                    setSelectedApp(null);
                  }}
                >
                  Withdraw Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentApplications;
