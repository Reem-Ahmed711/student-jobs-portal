// C:\Student-job-portal\Frontend\src\pages\employer\EmployerApplicants.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { acceptApplication, getEmployerJobs, getJobApplicants } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const EmployerApplicants = () => {
  const { darkMode } = useTheme();
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getEmployerJobs();
      console.log('Jobs response:', response.data);
      
      let jobsData = [];
      if (response.data?.success && Array.isArray(response.data?.data)) {
        jobsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data?.data)) {
        jobsData = response.data.data;
      } else {
        jobsData = [];
      }
      
      setJobs(jobsData);
      
      // Fetch applicants for all jobs
      if (jobsData.length > 0) {
        fetchAllApplicants(jobsData);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const fetchAllApplicants = async (jobsList) => {
    const allApplicants = [];
    
    for (const job of jobsList) {
      try {
        const response = await getJobApplicants(job.id);
        console.log(`Applicants for ${job.title}:`, response.data);
        
        let applicantsData = [];
        if (response.data?.success && Array.isArray(response.data?.data)) {
          applicantsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          applicantsData = response.data;
        } else if (response.data?.applicants && Array.isArray(response.data?.applicants)) {
          applicantsData = response.data.applicants;
        } else {
          applicantsData = [];
        }
        
        applicantsData.forEach(app => {
          allApplicants.push({
            ...app,
            jobTitle: job.title,
            jobId: job.id
          });
        });
      } catch (error) {
        console.error(`Error fetching applicants for job ${job.id}:`, error);
      }
    }
    
    setApplicants(allApplicants);
    setLoading(false);
  };

  const handleAccept = async (applicationId) => {
    setAcceptingId(applicationId);
    try {
      console.log("Accepting applicant with ID:", applicationId);
      const response = await acceptApplication(applicationId);
      
      if (response.data?.success) {
        setApplicants(prev => prev.filter(a => a.id !== applicationId));
        alert("✅ Applicant accepted successfully!");
      } else {
        alert("❌ Failed to accept applicant: " + (response.data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error accepting applicant:", error);
      alert("❌ Failed to accept applicant. Please try again.");
    } finally {
      setAcceptingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'new': return { bg: '#fff3cd', color: '#856404' };
      case 'reviewed': return { bg: '#d4edda', color: '#155724' };
      case 'accepted': return { bg: '#cce5ff', color: '#004085' };
      case 'rejected': return { bg: '#f8d7da', color: '#721c24' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const filteredApplicants = selectedJob === 'all' 
    ? applicants 
    : applicants.filter(a => a.jobId === selectedJob);

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'date') return new Date(b.appliedAt) - new Date(a.appliedAt);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

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
        <h1 style={{ fontSize: '28px', color: darkMode ? '#f1f5f9' : '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
          Applicants Pool
        </h1>
        <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>Review and manage job applicants</p>
      </div>

      {/* Filters */}
      <div style={{ 
        background: darkMode ? '#1e293b' : 'white', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '14px' }}>
              Filter by Job
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
              <option value="all">All Jobs ({applicants.length})</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} ({applicants.filter(a => a.jobId === job.id).length})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '14px' }}>
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                borderRadius: '8px',
                fontSize: '14px',
                background: darkMode ? '#0f172a' : 'white',
                color: darkMode ? '#e2e8f0' : '#333'
              }}
            >
              <option value="match">Match Score</option>
              <option value="date">Application Date</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants List */}
      {sortedApplicants.length === 0 ? (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center' 
        }}>
          <i className="fas fa-users" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
          <h3 style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>No applicants found</h3>
          <p style={{ color: darkMode ? '#64748b' : '#999' }}>
            {selectedJob === 'all' 
              ? "You haven't received any applications yet" 
              : "No applications for this job yet"}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sortedApplicants.map(applicant => {
            const statusColors = getStatusColor(applicant.status);
            return (
              <div key={applicant.id} style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                borderRadius: '12px', 
                padding: '20px' 
              }}>
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
                      {applicant.applicant?.name?.charAt(0) || applicant.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 style={{ color: darkMode ? '#f1f5f9' : '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>
                        {applicant.applicant?.name || applicant.name || 'Unknown'}
                      </h3>
                      <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '4px' }}>
                        {applicant.applicant?.email || applicant.email || ''}
                      </p>
                      <p style={{ color: darkMode ? '#64748b' : '#999', fontSize: '13px' }}>
                        Applied for: {applicant.jobTitle}
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
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>
                        {applicant.matchScore || applicant.match || 75}%
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: statusColors.bg,
                      color: statusColors.color
                    }}>
                      {applicant.status || 'New'}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Skills: {applicant.skillsMatch || `${(applicant.applicant?.skills || []).length}/10`}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(applicant.applicant?.skills || applicant.skills || []).slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-tag" style={{
                        background: '#E6F0FA',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#0B2A4A'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '15px',
                  marginBottom: '15px',
                  padding: '15px',
                  background: darkMode ? '#0f172a' : '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '12px', marginBottom: '4px' }}>GPA</p>
                    <p style={{ color: darkMode ? '#e2e8f0' : '#0B2A4A', fontWeight: '600' }}>
                      {applicant.applicant?.gpa || applicant.gpa || 'N/A'} / 5.0
                    </p>
                  </div>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '12px', marginBottom: '4px' }}>Applied</p>
                    <p style={{ color: darkMode ? '#e2e8f0' : '#0B2A4A', fontWeight: '600' }}>
                      {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '12px', marginBottom: '4px' }}>Experience</p>
                    <p style={{ color: darkMode ? '#e2e8f0' : '#0B2A4A', fontWeight: '600' }}>
                      {applicant.experience || applicant.applicant?.experience || 'N/A'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline">
                    <i className="fas fa-user" style={{ marginRight: '5px' }}></i>
                    View Profile
                  </button>
                  <button
                    className="btn btn-success"
                    style={{ background: '#00C851' }}
                    onClick={() => handleAccept(applicant.id)}
                    disabled={acceptingId === applicant.id}
                  >
                    {acceptingId === applicant.id ? (
                      <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                    ) : (
                      <><i className="fas fa-check"></i> Accept</>
                    )}
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>
                    Contact
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerApplicants;
