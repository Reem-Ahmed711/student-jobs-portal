import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getEmployerJobs, getAIMatching } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const EmployerAIMatching = () => {
  const { darkMode } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchThreshold, setMatchThreshold] = useState(70);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getEmployerJobs();
      let jobsData = response.data?.data || response.data || [];
      setJobs(jobsData);
      if (jobsData.length > 0) {
        setSelectedJob(jobsData[0]);
        await fetchMatches(jobsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (jobId) => {
    setLoading(true);
    try {
      const response = await getAIMatching(jobId);
      let matchesData = response.data?.matches || response.data?.data || [];
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching AI matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setSelectedJob(job);
    await fetchMatches(jobId);
  };

  const filteredMatches = matches.filter(m => (m.matchScore || m.match) >= matchThreshold);

  const getScoreColor = (score) => {
    if (score >= 90) return { bg: '#d4edda', color: '#155724', border: '#16a34a' };
    if (score >= 80) return { bg: '#fff3cd', color: '#856404', border: '#f59e0b' };
    return { bg: '#f8d7da', color: '#721c24', border: '#ef4444' };
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return 'fa-star';
    if (score >= 80) return 'fa-thumbs-up';
    return 'fa-chart-line';
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
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .ai-card {
          animation: slideInUp 0.5s ease-out;
          transition: all 0.3s ease;
        }
        .ai-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -12px rgba(0,0,0,0.2);
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-robot" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                AI-Powered Candidate Matching
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Intelligent recommendations powered by Gemini AI
              </p>
            </div>
          </div>
        </div>

        {/* Job Selection Card */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          animation: 'slideInUp 0.4s ease-out'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
                Select Job Position
              </label>
              <select
                value={selectedJob?.id}
                onChange={(e) => handleJobChange(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '12px 16px',
                  border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`,
                  borderRadius: '12px',
                  background: darkMode ? '#0f172a' : 'white',
                  color: darkMode ? '#e2e8f0' : '#333',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.applicants || 0} applicants)
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fas fa-sliders-h" style={{ marginRight: '8px' }}></i>
                Match Threshold: <span style={{ color: '#1E3A5F', fontWeight: '700' }}>{matchThreshold}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)',
                  accentColor: '#1E3A5F'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: darkMode ? '#94a3b8' : '#999' }}>
                <span>⬤ Low</span>
                <span>⬤ Medium</span>
                <span>⬤ High</span>
              </div>
            </div>
          </div>
          
          {selectedJob && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: darkMode ? '#0f172a' : '#f8f9fa',
              borderRadius: '12px',
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div><strong>Department:</strong> {selectedJob.department}</div>
              <div><strong>Required Skills:</strong> {selectedJob.skills?.slice(0, 5).join(', ')}</div>
              <div><strong>Match Analysis:</strong> {filteredMatches.length} top candidates</div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredMatches.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                <i className="fas fa-users" style={{ marginRight: '10px' }}></i>
                Top Matched Candidates ({filteredMatches.length})
              </h3>
              <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Ranked by AI based on skills and experience</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: '#d4edda', borderRadius: '12px' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#155724' }}>{filteredMatches.filter(m => (m.matchScore || m.match) >= 90).length}</div>
                <div style={{ fontSize: '12px', color: '#155724' }}>Excellent Match</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fff3cd', borderRadius: '12px' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#856404' }}>{filteredMatches.filter(m => (m.matchScore || m.match) >= 80 && (m.matchScore || m.match) < 90).length}</div>
                <div style={{ fontSize: '12px', color: '#856404' }}>Good Match</div>
              </div>
            </div>
          </div>
        )}

        {/* Candidates Grid */}
        {filteredMatches.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.5s ease-out'
          }}>
            <i className="fas fa-robot" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>No candidates found</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
              {jobs.length === 0 ? 'Please post a job to see AI matches' : `No candidates match the ${matchThreshold}% threshold`}
            </p>
            {matchThreshold > 50 && (
              <button
                onClick={() => setMatchThreshold(50)}
                style={{
                  marginTop: '20px',
                  padding: '10px 24px',
                  background: '#1E3A5F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                Lower threshold to 50%
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
            {filteredMatches.map((candidate, index) => {
              const score = candidate.matchScore || candidate.match || 0;
              const scoreStyle = getScoreColor(score);
              const isTopMatch = index === 0;
              
              return (
                <div
                  key={candidate.id || index}
                  className="ai-card"
                  style={{
                    background: darkMode ? '#1e293b' : 'white',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: isTopMatch ? '0 10px 30px rgba(102,126,234,0.15)' : '0 4px 15px rgba(0,0,0,0.08)',
                    borderLeft: `4px solid ${scoreStyle.border}`,
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  {isTopMatch && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '20px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '30px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      <i className="fas fa-crown"></i> Top Match
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: `linear-gradient(135deg, ${scoreStyle.border}30, ${scoreStyle.border}10)`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          color: scoreStyle.border
                        }}>
                          <i className={`fas ${getScoreIcon(score)}`}></i>
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                            {candidate.name || 'Anonymous'}
                          </h3>
                          <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{candidate.email}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        color: scoreStyle.color,
                        background: scoreStyle.bg,
                        padding: '4px 12px',
                        borderRadius: '30px',
                        minWidth: '70px'
                      }}>
                        {score}%
                      </div>
                      <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999', marginTop: '4px' }}>match score</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <i className="fas fa-graduation-cap" style={{ fontSize: '12px', color: '#1E3A5F' }}></i>
                      <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{candidate.department || 'Computer Science'}</span>
                      {candidate.gpa && (
                        <span style={{ fontSize: '12px', background: '#E6F0FA', padding: '2px 8px', borderRadius: '20px', color: '#1E3A5F' }}>
                          GPA: {candidate.gpa}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(candidate.skills || []).slice(0, 5).map((skill, i) => (
                        <span key={i} style={{
                          background: darkMode ? '#334155' : '#E6F0FA',
                          color: darkMode ? '#e2e8f0' : '#1E3A5F',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                      {(candidate.skills || []).length > 5 && (
                        <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999' }}>
                          +{(candidate.skills || []).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '15px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => { e.stopPropagation(); window.open(`/student-profile?uid=${candidate.id}`, '_blank'); }}
                    >
                      <i className="fas fa-user"></i> View Profile
                    </button>
                    <button
                      className="btn btn-success"
                      style={{ padding: '8px 16px', fontSize: '13px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); alert(`✅ ${candidate.name} has been shortlisted!`); }}
                    >
                      <i className="fas fa-star"></i> Shortlist
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={(e) => { e.stopPropagation(); alert(`📧 Interview invitation sent to ${candidate.name}!`); }}
                    >
                      <i className="fas fa-envelope"></i> Contact
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Insights Footer */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea10, #764ba210)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <i className="fas fa-brain" style={{ fontSize: '24px', color: '#667eea', marginBottom: '10px', display: 'block' }}></i>
          <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
            AI analyzes skills, experience, and qualifications to find the best matches for your position.
          </p>
        </div>
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
          backdropFilter: 'blur(4px)',
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
              fontSize: '24px',
              cursor: 'pointer',
              color: darkMode ? '#94a3b8' : '#999'
            }}>&times;</button>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <i className="fas fa-user" style={{ fontSize: '32px', color: 'white' }}></i>
              </div>
              <h2 style={{ fontSize: '22px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{selectedCandidate.name}</h2>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>{selectedCandidate.email}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(selectedCandidate.skills || []).map((s, i) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Education</h4>
              <p>{selectedCandidate.degree || 'Computer Science'}</p>
              <p>{selectedCandidate.university || 'Cairo University'}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>Schedule Interview</button>
              <button className="btn btn-success" style={{ flex: 1, background: '#10b981' }}>Download CV</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployerAIMatching;
