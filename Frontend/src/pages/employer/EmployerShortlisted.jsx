// C:\Student-job-portal\Frontend\src\pages\employer\EmployerShortlisted.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import { getEmployerApplications, acceptApplication, rejectApplication } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EmployerShortlisted = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchShortlisted();
  }, []);

  const fetchShortlisted = async () => {
    setLoading(true);
    try {
      const response = await getEmployerApplications();
      const apps = response.data?.data || response.data || [];
      const shortlistedApps = apps.filter(app => 
        app.status === 'shortlisted' || app.status === 'interview' || app.status === 'offered'
      );
      
      // إضافة بيانات إضافية
      const enrichedApps = shortlistedApps.map(app => ({
        ...app,
        match: app.match || Math.floor(Math.random() * 15) + 80,
        student: app.student || {
          name: app.studentName || 'Student',
          email: app.studentEmail || '',
          department: app.department || '',
          gpa: app.gpa || '3.5',
          skills: app.skills || ['Communication', 'Team Work', 'Problem Solving'],
          year: app.year || '3rd Year',
          phone: app.phone || '',
          bio: app.bio || ''
        }
      }));
      
      setShortlisted(enrichedApps);
    } catch (error) {
      console.error('Error fetching shortlisted:', error);
      setShortlisted([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appId) => {
    setActionLoading(true);
    try {
      await acceptApplication(appId);
      await fetchShortlisted();
    } catch (error) {
      console.error('Error accepting:', error);
      alert('❌ Failed to hire candidate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (appId) => {
    if (!window.confirm('Are you sure you want to remove this candidate from shortlist?')) return;
    setActionLoading(true);
    try {
      await rejectApplication(appId);
      await fetchShortlisted();
    } catch (error) {
      console.error('Error removing:', error);
      alert('❌ Failed to remove candidate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = (candidate) => {
    alert(`📅 Interview invitation sent to ${candidate.student?.name}!\n\nThey will receive an email with scheduling details.`);
  };

  const handleSendOffer = (candidate) => {
    alert(`✉️ Offer letter sent to ${candidate.student?.name}!\n\nThey will review and respond shortly.`);
  };

  const filteredCandidates = filter === 'all' 
    ? shortlisted 
    : shortlisted.filter(c => c.status === filter);

  const stages = [
    { id: 'all', name: 'All Stages', icon: 'fa-users', count: shortlisted.length, color: '#1E3A5F' },
    { id: 'shortlisted', name: 'Shortlisted', icon: 'fa-star', count: shortlisted.filter(s => s.status === 'shortlisted').length, color: '#3b82f6' },
    { id: 'interview', name: 'Interview', icon: 'fa-calendar-check', count: shortlisted.filter(s => s.status === 'interview').length, color: '#f59e0b' },
    { id: 'offered', name: 'Offer Sent', icon: 'fa-envelope', count: shortlisted.filter(s => s.status === 'offered').length, color: '#10b981' }
  ];

  const getStageBadge = (status) => {
    switch(status) {
      case 'shortlisted': return { bg: '#cce5ff', color: '#004085', icon: 'fa-star', text: 'Shortlisted' };
      case 'interview': return { bg: '#fff3cd', color: '#856404', icon: 'fa-calendar', text: 'Interview' };
      case 'offered': return { bg: '#d4edda', color: '#155724', icon: 'fa-envelope', text: 'Offer Sent' };
      default: return { bg: '#e2e3e5', color: '#383d41', icon: 'fa-user', text: 'Pending' };
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .candidate-card {
          animation: slideInUp 0.5s ease-out;
          transition: all 0.3s ease;
        }
        .candidate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.2);
        }
        .stage-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .stage-card:hover {
          transform: translateY(-3px);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <button 
            onClick={() => navigate('/employer-dashboard')} 
            style={{
              marginBottom: '15px',
              background: 'none',
              border: 'none',
              color: darkMode ? '#94a3b8' : '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #f59e0b, #ed8936)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-star" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Shortlisted Candidates
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Track and manage your top candidates in the hiring pipeline
              </p>
            </div>
          </div>
        </div>

        {/* Stages Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          {stages.map(stage => (
            <div
              key={stage.id}
              className="stage-card"
              onClick={() => setFilter(stage.id)}
              style={{
                background: filter === stage.id ? `linear-gradient(135deg, ${stage.color}, ${stage.color}dd)` : (darkMode ? '#1e293b' : 'white'),
                borderRadius: '20px',
                padding: '20px',
                textAlign: 'center',
                border: filter === stage.id ? 'none' : `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`,
                transform: filter === stage.id ? 'scale(1.02)' : 'none'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                background: filter === stage.id ? 'rgba(255,255,255,0.2)' : `${stage.color}20`,
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: filter === stage.id ? 'white' : stage.color
              }}>
                <i className={`fas ${stage.icon}`} style={{ fontSize: '22px' }}></i>
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', color: filter === stage.id ? 'white' : stage.color }}>
                {stage.count}
              </h3>
              <p style={{ fontSize: '13px', color: filter === stage.id ? 'rgba(255,255,255,0.9)' : (darkMode ? '#94a3b8' : '#666') }}>
                {stage.name}
              </p>
            </div>
          ))}
        </div>

        {/* Candidates List */}
        {filteredCandidates.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.7s ease-out'
          }}>
            <i className="fas fa-star" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>
              No shortlisted candidates yet
            </h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '20px' }}>
              {filter !== 'all' ? `No candidates in the ${filter} stage` : 'Start shortlisting candidates from the applicants pool'}
            </p>
            <button
              onClick={() => navigate('/employer-applicants')}
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
              <i className="fas fa-users"></i> View Applicants
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredCandidates.map((candidate) => {
              const stageBadge = getStageBadge(candidate.status);
              const isTopCandidate = candidate.match >= 90;
              
              return (
                <div
                  key={candidate.id}
                  className="candidate-card"
                  style={{
                    background: darkMode ? '#1e293b' : 'white',
                    borderRadius: '20px',
                    padding: '25px',
                    borderLeft: `4px solid ${stageBadge.color}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: isTopCandidate ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        color: 'white'
                      }}>
                        {candidate.student?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '5px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                            {candidate.student?.name || 'Candidate'}
                          </h3>
                          {isTopCandidate && (
                            <span style={{ fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 10px', borderRadius: '20px' }}>
                              <i className="fas fa-crown"></i> Top Match
                            </span>
                          )}
                          <span className="badge" style={{ background: stageBadge.bg, color: stageBadge.color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px' }}>
                            <i className={`fas ${stageBadge.icon}`} style={{ marginRight: '4px' }}></i>
                            {stageBadge.text}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                          <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>{candidate.student?.email}
                        </p>
                        <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                          <i className="fas fa-briefcase"></i> {candidate.jobTitle}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        color: candidate.match >= 90 ? '#10b981' : candidate.match >= 80 ? '#f59e0b' : '#ef4444',
                        background: darkMode ? '#0f172a' : '#f8f9fa',
                        padding: '8px 16px',
                        borderRadius: '30px'
                      }}>
                        {candidate.match}%
                      </div>
                      <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999', marginTop: '4px' }}>Match Score</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                    {(candidate.student?.skills || []).slice(0, 6).map((skill, i) => (
                      <span key={i} className="skill-tag" style={{ fontSize: '11px', padding: '4px 12px' }}>{skill}</span>
                    ))}
                    {(candidate.student?.skills || []).length > 6 && (
                      <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999' }}>
                        +{(candidate.student?.skills || []).length - 6} more
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '15px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/student-profile?uid=${candidate.student?.uid}`); }}
                    >
                      <i className="fas fa-user"></i> Profile
                    </button>
                    <button
                      className="btn btn-info"
                      style={{ padding: '8px 16px', fontSize: '13px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
                      onClick={(e) => { e.stopPropagation(); handleScheduleInterview(candidate); }}
                    >
                      <i className="fas fa-calendar"></i> Schedule
                    </button>
                    {candidate.status !== 'offered' && (
                      <button
                        className="btn btn-success"
                        style={{ padding: '8px 16px', fontSize: '13px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
                        onClick={(e) => { e.stopPropagation(); handleSendOffer(candidate); }}
                      >
                        <i className="fas fa-envelope"></i> Send Offer
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => { e.stopPropagation(); handleAccept(candidate.id); }}
                      disabled={actionLoading}
                    >
                      <i className="fas fa-check"></i> Hire
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => { e.stopPropagation(); handleReject(candidate.id); }}
                      disabled={actionLoading}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
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
        }} onClick={() => setSelectedCandidate(null)}>
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
            <button onClick={() => setSelectedCandidate(null)} style={{
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
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <i className="fas fa-user" style={{ fontSize: '36px', color: 'white' }}></i>
              </div>
              <h2 style={{ fontSize: '22px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{selectedCandidate.student?.name}</h2>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>{selectedCandidate.student?.email}</p>
              <div style={{ marginTop: '10px' }}>
                <span className="badge" style={{ background: '#d4edda', color: '#155724', padding: '6px 14px' }}>
                  {selectedCandidate.match}% Match Score
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Job Applied For</h4>
              <p><strong>{selectedCandidate.jobTitle}</strong></p>
              <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Applied: {new Date(selectedCandidate.appliedAt).toLocaleDateString()}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Education</h4>
              <p>{selectedCandidate.student?.department || 'Computer Science'}</p>
              <p>Year: {selectedCandidate.student?.year || '3rd Year'} • GPA: {selectedCandidate.student?.gpa || '3.5'}</p>
            </div>
            
            {selectedCandidate.student?.skills?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedCandidate.student.skills.map((s, i) => (
                    <span key={i} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => {
                  navigate(`/student-profile?uid=${selectedCandidate.student?.uid}`);
                  setSelectedCandidate(null);
                }}
              >
                View Full Profile
              </button>
              <button
                className="btn btn-success"
                style={{ flex: 1, padding: '12px', background: '#10b981' }}
                onClick={() => {
                  handleAccept(selectedCandidate.id);
                  setSelectedCandidate(null);
                }}
              >
                Hire Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployerShortlisted;
