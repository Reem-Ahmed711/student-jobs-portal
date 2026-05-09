// C:\Student-job-portal\Frontend\src\pages\StudentSavedJobs.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getSavedJobs, unsaveJob, applyForJob } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentSavedJobs = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const itemsPerPage = 4;

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await getSavedJobs();
      let jobsData = response.data?.data || response.data || [];
      
      // إضافة match score مؤقت إذا لم يوجد
      jobsData = jobsData.map(job => ({
        ...job,
        match: job.match || Math.floor(Math.random() * 20) + 80,
        skills: job.skills || ['Communication', 'Team Work', 'Problem Solving']
      }));
      
      setSavedJobs(jobsData);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleRemove = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to remove "${jobTitle}" from saved jobs?`)) return;
    
    setActionLoading(true);
    try {
      await unsaveJob(jobId);
      await fetchSavedJobs();
      if (currentPage > 1 && savedJobs.length <= itemsPerPage) {
        setCurrentPage(currentPage - 1);
      }
      showToast('✅ Job removed from saved', 'success');
    } catch (error) {
      console.error('Error removing saved job:', error);
      showToast('❌ Failed to remove job', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setActionLoading(true);
    try {
      await applyForJob({ jobId });
      showToast('✅ Application submitted successfully!', 'success');
      // إزالة الوظيفة من saved بعد التقديم
      await fetchSavedJobs();
    } catch (error) {
      console.error('Error applying for job:', error);
      showToast(error.response?.data?.error || '❌ Failed to apply', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const safeSavedJobs = Array.isArray(savedJobs) ? savedJobs : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeSavedJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeSavedJobs.length / itemsPerPage);

  const getMatchColor = (score) => {
    if (score >= 90) return { bg: '#d4edda', color: '#155724', border: '#10b981' };
    if (score >= 80) return { bg: '#fff3cd', color: '#856404', border: '#f59e0b' };
    return { bg: '#f8d7da', color: '#721c24', border: '#ef4444' };
  };

  const StatCard = ({ number, label, icon, color, trend }) => (
    <div style={{
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
      <div style={{ marginTop: '12px' }}>
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
        .saved-card {
          transition: all 0.3s ease;
          animation: slideInUp 0.5s ease-out;
        }
        .saved-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.2);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-bookmark" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Saved Jobs
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Jobs you've saved for later application
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard number={safeSavedJobs.length} label="Total Saved" icon="fa-bookmark" color="#1E3A5F" />
          <StatCard number={safeSavedJobs.filter(j => j.match >= 90).length} label="High Match" icon="fa-star" color="#10b981" />
          <StatCard number={safeSavedJobs.length} label="Ready to Apply" icon="fa-paper-plane" color="#f59e0b" />
        </div>

        {/* Saved Jobs List */}
        {safeSavedJobs.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.6s ease-out'
          }}>
            <i className="fas fa-bookmark" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>
              No saved jobs yet
            </h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '20px' }}>
              Start exploring and save jobs you're interested in
            </p>
            <button 
              onClick={() => navigate('/available-jobs')}
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
              <i className="fas fa-search"></i> Browse Available Jobs
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {currentItems.map((job) => {
                const matchColor = getMatchColor(job.match);
                const isTopMatch = job.match >= 90;
                
                return (
                  <div 
                    key={job.id} 
                    className="saved-card"
                    style={{
                      background: darkMode ? '#1e293b' : 'white',
                      borderRadius: '20px',
                      padding: '20px',
                      position: 'relative',
                      borderLeft: `4px solid ${matchColor.border}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedJob(job)}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(job.id, job.title); }}
                      disabled={actionLoading}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>

                    <div style={{ marginRight: '100px' }}>
                      {/* Title and Match */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                          {job.title}
                        </h3>
                        {isTopMatch && (
                          <span style={{
                            fontSize: '11px',
                            background: '#10b981',
                            color: 'white',
                            padding: '2px 10px',
                            borderRadius: '20px'
                          }}>
                            <i className="fas fa-crown"></i> Top Match
                          </span>
                        )}
                        <span className="badge" style={{
                          background: matchColor.bg,
                          color: matchColor.color,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <i className="fas fa-percent" style={{ fontSize: '11px' }}></i>
                          {job.match}% Match
                        </span>
                      </div>
                      
                      {/* Department */}
                      <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '10px' }}>
                        <i className="fas fa-building" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                        {job.department}
                      </p>
                      
                      {/* Skills */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {job.skills?.slice(0, 5).map((skill, index) => (
                          <span key={index} className="skill-tag" style={{
                            background: darkMode ? '#334155' : '#E6F0FA',
                            color: darkMode ? '#e2e8f0' : '#1E3A5F',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '11px'
                          }}>
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 5 && (
                          <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999' }}>
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>

                      {/* Job Details */}
                      <div style={{
                        display: 'flex',
                        gap: '25px',
                        marginBottom: '15px',
                        color: darkMode ? '#94a3b8' : '#666',
                        fontSize: '13px',
                        flexWrap: 'wrap'
                      }}>
                        {job.hours && (
                          <span>
                            <i className="far fa-clock" style={{ marginRight: '6px', color: '#1E3A5F' }}></i>
                            {job.hours}
                          </span>
                        )}
                        {job.deadline && (
                          <span>
                            <i className="far fa-calendar-alt" style={{ marginRight: '6px', color: '#1E3A5F' }}></i>
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {job.salary && (
                          <span>
                            <i className="fas fa-money-bill-alt" style={{ marginRight: '6px', color: '#1E3A5F' }}></i>
                            {job.salary}
                          </span>
                        )}
                        {job.location && (
                          <span>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#1E3A5F' }}></i>
                            {job.location}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '15px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewDetails(job.id); }}
                          className="btn btn-outline"
                          style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <i className="fas fa-eye"></i> View Details
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleApply(job.id); }}
                          disabled={actionLoading}
                          className="btn btn-primary"
                          style={{ 
                            padding: '8px 24px', 
                            fontSize: '13px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            opacity: actionLoading ? 0.7 : 1
                          }}
                        >
                          <i className="fas fa-paper-plane"></i>
                          {actionLoading ? 'Applying...' : 'Apply Now'}
                        </button>
                      </div>
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
                gap: '10px',
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
                
                <span style={{ 
                  padding: '8px 20px', 
                  background: '#1E3A5F', 
                  color: 'white', 
                  borderRadius: '10px',
                  fontWeight: '600'
                }}>
                  Page {currentPage} of {totalPages}
                </span>
                
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

      {/* Job Details Modal */}
      {selectedJob && (
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
        }} onClick={() => setSelectedJob(null)}>
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: '550px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedJob(null)} style={{
              position: 'absolute',
              top: '15px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: darkMode ? '#94a3b8' : '#999'
            }}>&times;</button>
            
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '8px' }}>
                {selectedJob.title}
              </h2>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                {selectedJob.department}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Job Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Hours:</strong> {selectedJob.hours || 'Flexible'}</div>
                <div><strong>Salary:</strong> {selectedJob.salary || 'Negotiable'}</div>
                <div><strong>Type:</strong> {selectedJob.type || 'Part-Time'}</div>
                <div><strong>Deadline:</strong> {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'Open'}</div>
              </div>
            </div>

            {selectedJob.skills?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Required Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedJob.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedJob.description && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Description</h4>
                <p style={{ color: darkMode ? '#94a3b8' : '#666', lineHeight: '1.6' }}>{selectedJob.description}</p>
              </div>
            )}

            {selectedJob.requirements?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '10px' }}>Requirements</h4>
                <ul style={{ paddingLeft: '20px', color: darkMode ? '#94a3b8' : '#666' }}>
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  handleApply(selectedJob.id);
                  setSelectedJob(null);
                }}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                Apply Now
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentSavedJobs;
