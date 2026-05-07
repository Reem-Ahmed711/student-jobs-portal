// src/pages/StudentSavedJobs.jsx
import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getSavedJobs, unsaveJob, applyForJob } from '../services/api';

const StudentSavedJobs = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const response = await getSavedJobs();
        console.log('Saved jobs response:', response.data);
        
        let jobsData = [];
        if (response.data && Array.isArray(response.data)) {
          jobsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          jobsData = response.data.data;
        } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
          jobsData = response.data.jobs;
        } else {
          jobsData = [];
        }
        
        setSavedJobs(jobsData);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      alert('✅ Job removed from saved list');
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('❌ Failed to remove job');
    }
  };

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      await applyForJob({ jobId });
      alert('✅ Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('❌ Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
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
          <i className="fas fa-bookmark" style={{ marginRight: '10px' }}></i>
          Saved Jobs
        </h1>
        <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
          <i className="fas fa-graduation-cap" style={{ marginRight: '5px' }}></i>
          {user?.department || 'All Departments'} • {savedJobs.length} saved jobs
        </p>
      </div>

      <div className="stats-grid">
        <StatCard number={savedJobs.length} label="Total Saved" icon="fa-bookmark" color="#1E3A5F" />
        <StatCard number={savedJobs.filter(j => (j.match || j.matchScore || 0) >= 90).length} label="High Match (>90%)" icon="fa-star" color="#16a34a" />
        <StatCard number={savedJobs.length} label="Ready to Apply" icon="fa-paper-plane" color="#0077B5" />
      </div>

      {savedJobs.length === 0 ? (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center' 
        }}>
          <i className="fas fa-bookmark" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
          <h3 style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>No saved jobs yet</h3>
          <p style={{ color: darkMode ? '#64748b' : '#999', marginBottom: '20px' }}>Start exploring and save jobs you're interested in</p>
          <button 
            onClick={() => window.location.href = '/available-jobs'}
            className="btn btn-primary"
            style={{ padding: '12px 24px' }}
          >
            <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
            Browse Available Jobs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {savedJobs.map(job => (
            <div key={job.id} style={{ 
              position: 'relative',
              background: darkMode ? '#1e293b' : 'white',
              borderRadius: '12px',
              padding: '20px',
              border: (job.match || job.matchScore || 0) >= 90 ? '2px solid #16a34a20' : 'none'
            }}>
              <button
                onClick={() => handleRemove(job.id)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  background: '#ef4444',
                  border: 'none',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  zIndex: 10
                }}
              >
                <i className="fas fa-times"></i>
                Remove
              </button>

              <div style={{ marginRight: '100px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>{job.title}</h3>
                  <span className="badge" style={{ 
                    background: (job.match || job.matchScore || 0) >= 90 ? '#d4edda' : (job.match || job.matchScore || 0) >= 80 ? '#fff3cd' : '#f8d7da',
                    color: (job.match || job.matchScore || 0) >= 90 ? '#155724' : (job.match || job.matchScore || 0) >= 80 ? '#856404' : '#721c24',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-percent" style={{ marginRight: '5px', fontSize: '11px' }}></i>
                    {job.match || job.matchScore || 75}% Match
                  </span>
                </div>
                
                <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '10px' }}>
                  <i className="fas fa-building" style={{ marginRight: '5px' }}></i>
                  {job.department}
                </p>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  {job.skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag" style={{
                      background: '#E6F0FA',
                      color: '#1E3A5F',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>
                      <i className="fas fa-code" style={{ marginRight: '5px', fontSize: '10px' }}></i>
                      {skill}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ display: 'flex', gap: '20px', color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', flexWrap: 'wrap' }}>
                    <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i> {job.hours || '15 hrs/week'}</span>
                    <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i> {job.deadline || 'Soon'}</span>
                    <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px' }}></i> {job.salary || 'N/A'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={applying}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <i className="fas fa-paper-plane"></i>
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSavedJobs;
