// D:\student-jobs-portal\Frontend\src\pages\employer\EmployerShortlisted.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getShortlistedCandidates, updateShortlistStage } from '../../services/api';

const EmployerShortlisted = () => {
  const [selectedStage, setSelectedStage] = useState('all');
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // ============== جلب البيانات ==============
  useEffect(() => {
    fetchShortlisted();
  }, []);

  const fetchShortlisted = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log("🔵 Fetching shortlisted candidates...");
      const response = await getShortlistedCandidates();
      console.log("📊 Shortlisted response:", response.data);
      
      let shortlistData = [];
      if (response.data?.success && Array.isArray(response.data?.data)) {
        shortlistData = response.data.data;
      } else if (Array.isArray(response.data)) {
        shortlistData = response.data;
      } else if (response.data?.shortlisted && Array.isArray(response.data?.shortlisted)) {
        shortlistData = response.data.shortlisted;
      }
      
      setShortlisted(shortlistData);
    } catch (err) {
      console.error("❌ Error fetching shortlisted:", err);
      setError(err.response?.data?.message || 'Failed to load shortlisted candidates');
    } finally {
      setLoading(false);
    }
  };

  // ============== تحديث المرحلة ==============
  const handleUpdateStage = async (shortlistId, stage, candidateName) => {
    setUpdatingId(shortlistId);
    
    try {
      const response = await updateShortlistStage(shortlistId, stage, interviewDate, feedbackText);
      
      if (response.data?.success) {
        setShortlisted(prev =>
          prev.map(item =>
            item.id === shortlistId
              ? { ...item, stage: stage, interviewDate: interviewDate || item.interviewDate, feedback: feedbackText || item.feedback }
              : item
          )
        );
        alert(`✅ ${candidateName} moved to ${stage}`);
        setShowInterviewModal(null);
        setInterviewDate('');
        setFeedbackText('');
      } else {
        alert('❌ Failed to update stage: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error updating stage:", error);
      alert('❌ Failed to update stage. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // ============== دوال مساعدة ==============
  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    
    try {
      let d;
      if (typeof date.toDate === 'function') {
        d = date.toDate();
      } else if (date && typeof date === 'object' && date.seconds) {
        d = new Date(date.seconds * 1000);
      } else {
        d = new Date(date);
      }
      
      if (isNaN(d.getTime())) return 'Invalid date';
      
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' - ' + d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Interview': return { bg: '#d4edda', color: '#155724' };
      case 'Under Review': return { bg: '#fff3cd', color: '#856404' };
      case 'Offer Sent': return { bg: '#cce5ff', color: '#004085' };
      case 'Hired': return { bg: '#d4edda', color: '#155724' };
      case 'Rejected': return { bg: '#f8d7da', color: '#721c24' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  // حساب الإحصائيات
  const stages = [
    { id: 'all', name: 'All Stages', count: shortlisted.length },
    { id: 'Interview', name: 'Interview', count: shortlisted.filter(s => s.stage === 'Interview').length },
    { id: 'Under Review', name: 'Under Review', count: shortlisted.filter(s => s.stage === 'Under Review').length },
    { id: 'Offer Sent', name: 'Offer Sent', count: shortlisted.filter(s => s.stage === 'Offer Sent').length },
    { id: 'Hired', name: 'Hired', count: shortlisted.filter(s => s.stage === 'Hired').length }
  ];

  const filteredShortlisted = selectedStage === 'all'
    ? shortlisted
    : shortlisted.filter(s => s.stage === selectedStage);

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginLeft: '15px', color: '#666' }}>Loading shortlisted candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Shortlisted Candidates
          </h1>
          <p style={{ color: '#666' }}>Track candidates in your hiring pipeline</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span><i className="fas fa-exclamation-triangle"></i> {error}</span>
            <button 
              onClick={fetchShortlisted}
              style={{
                background: '#721c24',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stage Filters */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          {stages.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              style={{
                padding: '10px 20px',
                background: selectedStage === stage.id ? '#0B2A4A' : 'white',
                color: selectedStage === stage.id ? 'white' : '#0B2A4A',
                border: selectedStage === stage.id ? 'none' : '1px solid #0B2A4A',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedStage === stage.id ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {stage.name}
              <span style={{
                background: selectedStage === stage.id ? 'rgba(255,255,255,0.2)' : '#E6F0FA',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                color: selectedStage === stage.id ? 'white' : '#0B2A4A'
              }}>
                {stage.count}
              </span>
            </button>
          ))}
        </div>

        {/* Shortlisted Candidates List */}
        {filteredShortlisted.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-star" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No shortlisted candidates</h3>
            <p style={{ color: '#999' }}>
              {selectedStage === 'all'
                ? "You haven't shortlisted any candidates yet"
                : `No candidates in ${selectedStage} stage`}
            </p>
            <button 
              onClick={() => window.location.href = '/employer-applicants'}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: '#0B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-users"></i> View Applicants
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredShortlisted.map((candidate, index) => {
              const stageColors = getStageColor(candidate.stage);
              const isUpdating = updatingId === candidate.id;
              
              return (
                <div 
                  key={candidate.id} 
                  className="card" 
                  style={{ 
                    animation: `slideInUp ${0.7 + index * 0.05}s ease-out`,
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: candidate.stage === 'Interview' ? '4px solid #00C851' : 
                               candidate.stage === 'Offer Sent' ? '4px solid #0B2A4A' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: '#E6F0FA',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: '#0B2A4A'
                      }}>
                        {candidate.studentName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{candidate.studentName}</h3>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{candidate.studentEmail}</p>
                        <p style={{ color: '#999', fontSize: '13px' }}>
                          {candidate.jobTitle} • GPA: {candidate.studentGpa}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        background: '#E6F0FA',
                        padding: '8px 16px',
                        borderRadius: '30px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>{candidate.matchScore}%</span>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: stageColors.bg,
                        color: stageColors.color
                      }}>
                        <i className={`fas ${candidate.stage === 'Interview' ? 'fa-calendar-alt' : 
                                          candidate.stage === 'Offer Sent' ? 'fa-file-signature' : 
                                          candidate.stage === 'Hired' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                        {' '}{candidate.stage}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(candidate.studentSkills || []).slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="skill-tag" style={{
                          background: '#E6F0FA',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#0B2A4A'
                        }}>
                          {skill}
                        </span>
                      ))}
                      {(candidate.studentSkills || []).length === 0 && (
                        <span style={{ color: '#999', fontSize: '12px' }}>No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Interview Info */}
                  {candidate.interviewDate && (
                    <div style={{
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}>
                      <p style={{ color: '#00C851', fontSize: '13px', marginBottom: '5px' }}>
                        <i className="fas fa-calendar-check"></i>
                        Interview: {formatDate(candidate.interviewDate)}
                      </p>
                      {candidate.feedback && (
                        <p style={{ color: '#0B2A4A', fontSize: '13px' }}>
                          <strong>Feedback:</strong> {candidate.feedback}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {candidate.stage === 'Under Review' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setShowInterviewModal(candidate.id);
                          setInterviewDate('');
                          setFeedbackText('');
                        }}
                        disabled={isUpdating}
                        style={{
                          padding: '8px 16px',
                          background: '#0B2A4A',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-calendar-alt"></i> Schedule Interview
                      </button>
                    )}
                    
                    {candidate.stage === 'Interview' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleUpdateStage(candidate.id, 'Offer Sent', candidate.studentName)}
                        disabled={isUpdating}
                        style={{
                          padding: '8px 16px',
                          background: '#00C851',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        {isUpdating ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-file-signature"></i> Send Offer</>}
                      </button>
                    )}
                    
                    {candidate.stage === 'Offer Sent' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleUpdateStage(candidate.id, 'Hired', candidate.studentName)}
                        disabled={isUpdating}
                        style={{
                          padding: '8px 16px',
                          background: '#00C851',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        {isUpdating ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <><i className="fas fa-check-circle"></i> Confirm Hire</>}
                      </button>
                    )}
                    
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.href = `mailto:${candidate.studentEmail}`}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid #0B2A4A',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#0B2A4A'
                      }}
                    >
                      <i className="fas fa-envelope"></i> Contact
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interview Modal */}
      {showInterviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '25px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ color: '#0B2A4A', marginBottom: '20px' }}>Schedule Interview</h3>
            
            <div className="input-group" style={{ marginBottom: '15px' }}>
              <label className="input-label">Interview Date & Time</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </div>
            
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label className="input-label">Feedback / Notes</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows="3"
                placeholder="Add any notes or feedback..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowInterviewModal(null)}
                style={{
                  padding: '10px 20px',
                  background: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const candidate = shortlisted.find(s => s.id === showInterviewModal);
                  if (candidate) {
                    handleUpdateStage(showInterviewModal, 'Interview', candidate.studentName);
                  }
                }}
                disabled={!interviewDate}
                style={{
                  padding: '10px 20px',
                  background: '#0B2A4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: interviewDate ? 'pointer' : 'not-allowed',
                  opacity: interviewDate ? 1 : 0.6
                }}
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerShortlisted;