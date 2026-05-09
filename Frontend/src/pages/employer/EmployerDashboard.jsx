// C:\Student-job-portal\Frontend\src\pages\employer\EmployerDashboard.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  getEmployerStats, 
  getEmployerJobs, 
  getEmployerApplications, 
  acceptApplication,
  rejectApplication,
  getAIMatching 
} from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApplicants: 0,
    acceptedApplicants: 0,
    avgMatchScore: 76
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [selectedJobForAI, setSelectedJobForAI] = useState(null);
  const [aiResults, setAiResults] = useState([]);
  const [showStatsModal, setShowStatsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, jobsRes, appsRes] = await Promise.all([
        getEmployerStats().catch(() => ({ data: { data: {} } })),
        getEmployerJobs().catch(() => ({ data: { data: [] } })),
        getEmployerApplications().catch(() => ({ data: { data: [] } }))
      ]);
      
      const statsData = statsRes.data?.data || statsRes.data || {};
      setStats({
        totalJobs: statsData.totalJobs || 0,
        activeJobs: statsData.activeJobs || 0,
        totalApplicants: statsData.totalApplicants || 0,
        pendingApplicants: statsData.pendingApplicants || 0,
        acceptedApplicants: statsData.acceptedApplicants || 0,
        avgMatchScore: statsData.avgMatchScore || 76
      });
      
      const jobsData = jobsRes.data?.data || jobsRes.data || [];
      setActiveJobs(jobsData);
      
      const applications = appsRes.data?.data || appsRes.data || [];
      const formattedApplicants = applications.slice(0, 5).map(app => ({
        id: app.id,
        student: app.student || { name: app.studentName || 'Student', email: app.studentEmail || '' },
        jobTitle: app.jobTitle,
        match: app.match || Math.floor(Math.random() * 25) + 70,
        status: app.status || 'pending',
        appliedAt: app.appliedAt
      }));
      setRecentApplicants(formattedApplicants);
      
    } catch (error) {
      console.error('Error fetching employer data:', error);
      setError('فشل تحميل البيانات. الرجاء تحديث الصفحة.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (applicantId) => {
    try {
      await acceptApplication(applicantId);
      setRecentApplicants(prev =>
        prev.map(app =>
          app.id === applicantId ? { ...app, status: 'accepted' } : app
        )
      );
      setStats(prev => ({
        ...prev,
        acceptedApplicants: prev.acceptedApplicants + 1,
        pendingApplicants: prev.pendingApplicants - 1
      }));
      alert('✅ Applicant accepted successfully!');
    } catch (error) {
      console.error('Error accepting applicant:', error);
      alert('❌ Failed to accept applicant');
    }
  };

  const handleReject = async (applicantId) => {
    if (!window.confirm('Are you sure you want to reject this applicant?')) return;
    try {
      await rejectApplication(applicantId);
      setRecentApplicants(prev =>
        prev.map(app =>
          app.id === applicantId ? { ...app, status: 'rejected' } : app
        )
      );
      setStats(prev => ({
        ...prev,
        pendingApplicants: prev.pendingApplicants - 1
      }));
      alert('✅ Applicant rejected');
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      alert('❌ Failed to reject applicant');
    }
  };

  const handleAIMatchForJob = async (jobId, jobTitle) => {
    setSelectedJobForAI({ id: jobId, title: jobTitle });
    setShowAIPopup(true);
    setAiResults([]);
    try {
      const response = await getAIMatching(jobId);
      setAiResults(response.data?.matches || response.data?.data || []);
    } catch (error) {
      console.error('AI matching error:', error);
      alert('❌ AI matching failed. Please try again later.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return { bg: '#d4edda', color: '#155724', icon: 'fa-check-circle', text: 'Accepted' };
      case 'rejected': return { bg: '#f8d7da', color: '#721c24', icon: 'fa-times-circle', text: 'Rejected' };
      case 'shortlisted': return { bg: '#cce5ff', color: '#004085', icon: 'fa-star', text: 'Shortlisted' };
      default: return { bg: '#fff3cd', color: '#856404', icon: 'fa-clock', text: 'Pending' };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #f3f3f3', borderTop: '4px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '60px', background: darkMode ? '#1e293b' : 'white', borderRadius: '20px' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '20px' }}></i>
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</h3>
          <button onClick={fetchData} style={{ padding: '10px 24px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>إعادة المحاولة</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .stat-card {
          transition: all 0.3s ease;
          animation: slideInUp 0.5s ease-out;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .applicant-row {
          transition: all 0.2s ease;
        }
        .applicant-row:hover {
          transform: translateX(5px);
          background: ${darkMode ? '#2d2a6e' : '#f8f9fa'};
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          borderRadius: '24px',
          padding: '30px',
          marginBottom: '30px',
          color: 'white',
          animation: 'slideInUp 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Employer'}! 👋
              </h1>
              <p style={{ opacity: 0.9 }}>
                {user?.institution || user?.department || 'Department Dashboard'} • Manage your job postings and applicants
              </p>
            </div>
            <button
              onClick={() => navigate('/employer-post-job')}
              style={{
                padding: '12px 28px',
                background: 'white',
                color: '#1E3A5F',
                border: 'none',
                borderRadius: '40px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-plus-circle"></i>
              Post New Job
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowStatsModal(true)}>
            <div style={{ width: '50px', height: '50px', background: '#E6F0FA', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#1E3A5F' }}>
              <i className="fas fa-briefcase" style={{ fontSize: '22px' }}></i>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.activeJobs}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Active Jobs</p>
            <small style={{ color: '#10b981' }}>+{stats.totalJobs - stats.activeJobs} closed</small>
          </div>
          
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#E6F0FA', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#1E3A5F' }}>
              <i className="fas fa-users" style={{ fontSize: '22px' }}></i>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.totalApplicants}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Total Applicants</p>
            <small style={{ color: '#f59e0b' }}>{stats.pendingApplicants} pending</small>
          </div>
          
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#E6F0FA', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#1E3A5F' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '22px' }}></i>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.acceptedApplicants}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Hired</p>
            <small style={{ color: '#10b981' }}>Success rate</small>
          </div>
          
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#E6F0FA', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#1E3A5F' }}>
              <i className="fas fa-chart-line" style={{ fontSize: '22px' }}></i>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.avgMatchScore}%</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Avg Match Score</p>
            <small style={{ color: '#10b981' }}>Quality applicants</small>
          </div>
        </div>

        {/* AI Insights Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '5px', color: 'white' }}>
              <i className="fas fa-robot" style={{ marginRight: '8px' }}></i>
              AI Insights
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, color: 'white' }}>
              {activeJobs.length > 0 
                ? `Review top candidates for "${activeJobs[0]?.title}" to find the best match` 
                : 'Post your first job to get AI-powered candidate recommendations'}
            </p>
          </div>
          {activeJobs.length > 0 && (
            <button
              onClick={() => handleAIMatchForJob(activeJobs[0].id, activeJobs[0].title)}
              style={{
                padding: '10px 24px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i className="fas fa-robot"></i> View AI Matches
            </button>
          )}
        </div>

        {/* Main Content - Two Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Recent Applicants */}
          <div style={{ animation: 'slideInUp 0.6s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                <i className="fas fa-user-graduate" style={{ marginRight: '10px' }}></i>
                Recent Applicants
              </h3>
              <button 
                onClick={() => navigate('/employer-applicants')}
                style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
              >
                View All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            {recentApplicants.length === 0 ? (
              <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-user-slash" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>No applicants yet</p>
                <button onClick={() => navigate('/employer-post-job')} style={{ marginTop: '15px', color: '#1E3A5F', background: 'none', border: 'none', cursor: 'pointer' }}>Post a job to get applicants →</button>
              </div>
            ) : (
              <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', overflow: 'hidden' }}>
                {recentApplicants.map((applicant, idx) => {
                  const statusBadge = getStatusBadge(applicant.status);
                  return (
                    <div key={applicant.id} className="applicant-row" style={{ padding: '15px 20px', borderBottom: idx < recentApplicants.length - 1 ? `1px solid ${darkMode ? '#334155' : '#e0e0e0'}` : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#E6F0FA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E3A5F' }}>
                              {applicant.student?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{applicant.student?.name || 'Student'}</p>
                              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#999' }}>{applicant.jobTitle}</p>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge" style={{ background: statusBadge.bg, color: statusBadge.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                            <i className={`fas ${statusBadge.icon}`} style={{ marginRight: '4px', fontSize: '10px' }}></i>
                            {statusBadge.text}
                          </span>
                          <p style={{ fontSize: '12px', color: '#10b981', marginTop: '5px' }}>{applicant.match}% Match</p>
                        </div>
                      </div>
                      {applicant.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleAccept(applicant.id)} className="btn btn-success" style={{ padding: '6px 16px', fontSize: '12px', background: '#00C851' }}>Accept</button>
                          <button onClick={() => handleReject(applicant.id)} className="btn btn-danger" style={{ padding: '6px 16px', fontSize: '12px' }}>Reject</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Jobs */}
          <div style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '10px' }}></i>
                Active Jobs
              </h3>
              <button onClick={() => navigate('/employer-my-jobs')} style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Manage <i className="fas fa-arrow-right"></i></button>
            </div>
            
            {activeJobs.length === 0 ? (
              <div style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                <i className="fas fa-briefcase-slash" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>No active jobs</p>
                <button onClick={() => navigate('/employer-post-job')} style={{ marginTop: '15px', padding: '8px 20px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>Post Your First Job →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeJobs.map(job => (
                  <div key={job.id} style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '18px', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '4px' }}>{job.title}</h4>
                        <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{job.department} • Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="badge" style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                        {job.applicants || 0} applicants
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                      <button onClick={() => navigate(`/employer-applicants?jobId=${job.id}`)} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>View Applicants</button>
                      <button onClick={() => handleAIMatchForJob(job.id, job.title)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-robot"></i> AI Match
                      </button>
                      <button onClick={() => navigate(`/employer-edit-job/${job.id}`)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '20px',
          animation: 'slideInUp 0.8s ease-out'
        }}>
          <button onClick={() => navigate('/employer-shortlisted')} style={{ padding: '12px 24px', background: darkMode ? '#1e293b' : 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <i className="fas fa-star" style={{ color: '#f59e0b' }}></i> Shortlisted Candidates
          </button>
          <button onClick={() => navigate('/employer-hiring-history')} style={{ padding: '12px 24px', background: darkMode ? '#1e293b' : 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <i className="fas fa-history"></i> Hiring History
          </button>
          <button onClick={() => navigate('/employer-settings')} style={{ padding: '12px 24px', background: darkMode ? '#1e293b' : 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>
      </div>

      {/* AI Matching Popup Modal */}
      {showAIPopup && selectedJobForAI && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setShowAIPopup(false)}>
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAIPopup(false)} style={{
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
              <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <i className="fas fa-robot" style={{ fontSize: '28px', color: 'white' }}></i>
              </div>
              <h2 style={{ fontSize: '22px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>AI Matching</h2>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>Top candidates for: <strong>{selectedJobForAI.title}</strong></p>
            </div>
            
            {aiResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '40px', color: '#667eea', marginBottom: '15px' }}></i>
                <p>Analyzing candidates with AI...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {aiResults.map((candidate, index) => {
                  const score = candidate.matchScore || candidate.match || 0;
                  return (
                    <div key={candidate.id || index} style={{
                      padding: '15px',
                      background: index === 0 ? (darkMode ? '#2d2a6e' : '#f0f7ff') : 'transparent',
                      borderRadius: '16px',
                      border: index === 0 ? `2px solid ${darkMode ? '#818cf8' : '#1E3A5F'}` : `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h4 style={{ fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                            {candidate.name}
                            {index === 0 && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#1E3A5F', color: 'white', padding: '2px 10px', borderRadius: '20px' }}>Top Choice</span>}
                          </h4>
                          <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{candidate.email}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: score >= 90 ? '#10b981' : score >= 80 ? '#f59e0b' : '#ef4444' }}>{score}%</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        {(candidate.skills || []).slice(0, 5).map((skill, i) => <span key={i} className="skill-tag" style={{ fontSize: '11px' }}>{skill}</span>)}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>View Profile</button>
                        <button className="btn btn-success" style={{ padding: '6px 14px', fontSize: '12px', background: '#10b981' }}>Shortlist</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Details Modal */}
      {showStatsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowStatsModal(false)}>
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', marginBottom: '20px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>Detailed Statistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Jobs:</span><strong>{stats.totalJobs}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Active Jobs:</span><strong>{stats.activeJobs}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Applicants:</span><strong>{stats.totalApplicants}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pending Review:</span><strong>{stats.pendingApplicants}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Accepted/Hired:</span><strong>{stats.acceptedApplicants}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Average Match Score:</span><strong>{stats.avgMatchScore}%</strong></div>
            </div>
            <button onClick={() => setShowStatsModal(false)} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployerDashboard;
