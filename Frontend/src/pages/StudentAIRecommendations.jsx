// C:\Student-job-portal\Frontend\src\pages\StudentAIRecommendations.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRecommendedJobsForStudent, applyForJob, saveJob, unsaveJob, getSavedJobs } from '../services/api';

const StudentAIRecommendations = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    fetchSavedJobs();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await getRecommendedJobsForStudent();
      setRecommendations(response.data?.data || []);
      setStudentInfo(response.data?.student || null);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await getSavedJobs();
      setSavedJobs(response.data?.data || []);
    } catch (error) {
      console.log('Saved jobs not available');
    }
  };

  const handleSave = async (jobId) => {
    const isSaved = savedJobs.some(j => j.id === jobId);
    try {
      if (!isSaved) {
        await saveJob(jobId);
        setSavedJobs([...savedJobs, { id: jobId }]);
      } else {
        await unsaveJob(jobId);
        setSavedJobs(savedJobs.filter(j => j.id !== jobId));
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await applyForJob({ jobId });
      alert('✅ Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply');
    }
  };

  const isJobSaved = (jobId) => savedJobs.some(j => j.id === jobId);

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
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{
              width: '55px',
              height: '55px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-robot" style={{ fontSize: '28px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                AI-Powered Job Matches
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Personalized recommendations based on your profile
              </p>
            </div>
          </div>
        </div>

        {/* Student Profile Info */}
        {studentInfo && (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '30px',
            animation: 'slideInUp 0.5s ease-out',
            border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
          }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                  Your Profile
                </h3>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                  Department: <strong>{studentInfo.department || 'Not set'}</strong>
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                  Skills: <strong>{studentInfo.skillsCount} skills added</strong>
                </p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                  GPA: <strong>{studentInfo.gpa || 'Not set'}</strong>
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/student-profile'}
                style={{
                  padding: '8px 20px',
                  background: '#1E3A5F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Update Profile <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        {recommendations.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.6s ease-out'
          }}>
            <i className="fas fa-robot" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>
              No recommendations yet
            </h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '20px' }}>
              Complete your profile with skills and department to get AI-powered job matches
            </p>
            <button
              onClick={() => window.location.href = '/student-profile'}
              style={{
                padding: '12px 28px',
                background: '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer'
              }}
            >
              Complete Profile
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
                Found <strong>{recommendations.length}</strong> jobs tailored for you
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendations.map((job, idx) => (
                <div key={job.id} style={{ position: 'relative' }}>
                  {idx === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '20px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '4px 18px',
                      borderRadius: '30px',
                      fontSize: '11px',
                      fontWeight: '600',
                      zIndex: 1,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                    }}>
                      <i className="fas fa-crown"></i> Your Best Match
                    </div>
                  )}
                  <JobCard
                    key={job.id}
                    job={{
                      ...job,
                      match: job.matchScore || job.match || 85
                    }}
                    onApply={handleApply}
                    onSave={handleSave}
                    isSaved={isJobSaved(job.id)}
                    showFullDetails
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentAIRecommendations;
