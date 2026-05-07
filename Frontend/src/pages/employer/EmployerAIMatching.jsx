// src/pages/employer/EmployerAIMatching.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getAIMatches, getEmployerJobs } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const EmployerAIMatching = () => {
  const { darkMode } = useTheme();
  const [selectedJob, setSelectedJob] = useState('');
  const [matchThreshold, setMatchThreshold] = useState(70);
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchMatches();
    }
  }, [selectedJob, matchThreshold]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getEmployerJobs();
      console.log('Jobs response:', response.data);
      
      // Handle different response structures
      let jobsData = [];
      if (response.data?.success && Array.isArray(response.data?.data)) {
        jobsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data?.data)) {
        jobsData = response.data.data;
      } else if (response.data?.jobs && Array.isArray(response.data?.jobs)) {
        jobsData = response.data.jobs;
      } else {
        jobsData = [];
      }
      
      setJobs(jobsData);
      if (jobsData.length > 0) {
        setSelectedJob(jobsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    if (!selectedJob) return;
    
    setMatchingLoading(true);
    try {
      const response = await getAIMatches(selectedJob, { threshold: matchThreshold });
      console.log('AI Matches response:', response.data);
      
      // Handle different response structures
      let matchesData = [];
      if (response.data?.success && Array.isArray(response.data?.matches)) {
        matchesData = response.data.matches;
      } else if (Array.isArray(response.data)) {
        matchesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data?.data)) {
        matchesData = response.data.data;
      } else {
        matchesData = [];
      }
      
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching AI matches:', error);
      setMatches([]);
    } finally {
      setMatchingLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return '#16a34a';
    if (score >= 80) return '#f59e0b';
    return '#ef4444';
  };

  const filteredMatches = matches.filter(m => (m.matchScore || 0) >= matchThreshold);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '28px', color: darkMode ? '#f1f5f9' : '#0B2A4A', fontWeight: '600' }}>
            AI Matching
          </h1>
          <span style={{ 
            background: '#0B2A4A', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '12px' 
          }}>
            BETA
          </span>
        </div>
        <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
          Intelligent candidate matching powered by AI
        </p>
      </div>

      {/* AI Insights Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)', 
        borderRadius: '12px', 
        padding: '25px', 
        color: 'white', 
        marginBottom: '30px' 
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-robot"></i> AI Insights
        </h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '5px' }}>Top Required Skills</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Teaching', 'Research', 'Communication', 'Python'].map(skill => (
                <span key={skill} style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px' 
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '5px' }}>Avg Match Score</p>
            <p style={{ fontSize: '24px', fontWeight: '700' }}>
              {matches.length ? Math.round(matches.reduce((a, b) => a + (b.matchScore || 0), 0) / matches.length) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        background: darkMode ? '#1e293b' : 'white', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '30px', 
        display: 'flex', 
        gap: '30px', 
        alignItems: 'center', 
        flexWrap: 'wrap' 
      }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '14px' }}>
            Select Job
          </label>
          <select 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)} 
            style={{ 
              padding: '8px 16px', 
              border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
              borderRadius: '8px', 
              fontSize: '14px', 
              minWidth: '250px',
              background: darkMode ? '#0f172a' : 'white',
              color: darkMode ? '#e2e8f0' : '#333'
            }}
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.applicants || 0} applicants)
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: 2 }}>
          <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '14px' }}>
            Match Threshold: {matchThreshold}%
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={matchThreshold} 
            onChange={(e) => setMatchThreshold(parseInt(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Results */}
      {matchingLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMatches.length === 0 ? (
            <div style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              borderRadius: '12px', 
              padding: '60px', 
              textAlign: 'center' 
            }}>
              <i className="fas fa-robot" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
              <h3 style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>No matches found</h3>
              <p style={{ color: darkMode ? '#64748b' : '#999' }}>
                Try lowering the match threshold or check back later
              </p>
            </div>
          ) : (
            filteredMatches.map((candidate, index) => (
              <div 
                key={candidate.id || index} 
                style={{ 
                  background: darkMode ? '#1e293b' : 'white', 
                  borderRadius: '12px', 
                  padding: '20px',
                  borderLeft: `4px solid ${getMatchColor(candidate.matchScore || 0)}`
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
                      {candidate.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 style={{ color: darkMode ? '#f1f5f9' : '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>
                        {candidate.name || 'Unknown Candidate'}
                      </h3>
                      <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px' }}>
                        {candidate.email || ''}
                      </p>
                      <p style={{ color: darkMode ? '#64748b' : '#999', fontSize: '13px' }}>
                        GPA: {candidate.gpa || 'N/A'} • Available: {candidate.availability || 'Immediately'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      background: '#E6F0FA', 
                      padding: '8px 16px', 
                      borderRadius: '30px', 
                      marginBottom: '5px' 
                    }}>
                      <span style={{ fontSize: '24px', fontWeight: '700', color: getMatchColor(candidate.matchScore || 0) }}>
                        {candidate.matchScore || 0}%
                      </span>
                    </div>
                    <span style={{ 
                      background: darkMode ? '#334155' : '#f0f0f0', 
                      padding: '4px 8px', 
                      borderRadius: '20px', 
                      fontSize: '11px',
                      color: darkMode ? '#94a3b8' : '#666'
                    }}>
                      {candidate.predictedSuccess || Math.floor((candidate.matchScore || 0) * 0.9)}% predicted success
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {(candidate.skills?.matched || candidate.strengths || []).slice(0, 4).map((skill, idx) => (
                      <span key={idx} style={{ 
                        padding: '4px 12px', 
                        background: '#d4edda', 
                        color: '#155724', 
                        borderRadius: '20px', 
                        fontSize: '12px' 
                      }}>
                        {skill} ✓
                      </span>
                    ))}
                    {(candidate.skills?.missing || candidate.gaps || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} style={{ 
                        padding: '4px 12px', 
                        background: '#f8d7da', 
                        color: '#721c24', 
                        borderRadius: '20px', 
                        fontSize: '12px' 
                      }}>
                        {skill} ✗
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '15px', 
                  marginBottom: '15px', 
                  padding: '15px', 
                  background: darkMode ? '#0f172a' : '#f8f9fa', 
                  borderRadius: '8px' 
                }}>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                      <i className="fas fa-star" style={{ color: '#ffbb33' }}></i> Strengths
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>
                      {(candidate.strengths || []).slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                      {(candidate.strengths || []).length === 0 && <li>No strengths listed</li>}
                    </ul>
                  </div>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: '#ffbb33' }}></i> Areas to Consider
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>
                      {candidate.gaps?.map((w, i) => <li key={i}>{w}</li>)}
                      {(candidate.gaps || []).length === 0 && <li>No major gaps identified</li>}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline">
                    <i className="fas fa-chart-line"></i> Full Analysis
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-user-plus"></i> Shortlist
                  </button>
                  <button className="btn btn-success" style={{ background: '#00C851' }}>
                    <i className="fas fa-calendar-alt"></i> Schedule Interview
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerAIMatching;
