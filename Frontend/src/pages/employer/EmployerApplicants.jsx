// D:\student-jobs-portal\Frontend\src\pages\employer\EmployerApplicants.jsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getEmployerJobs, getJobApplicants, acceptApplication, rejectApplication } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const EmployerApplicants = () => {
  const { darkMode } = useTheme();
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // للمعرفة أي طلب قيد المعالجة
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
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
      setError('Failed to load jobs. Please refresh the page.');
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
        // التعامل مع هيكل البيانات من الباك اند
        if (response.data?.success && Array.isArray(response.data?.data)) {
          applicantsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          applicantsData = response.data;
        } else if (response.data?.applicants && Array.isArray(response.data?.applicants)) {
          applicantsData = response.data.applicants;
        } else {
          applicantsData = [];
        }
        
        // إضافة معلومات الوظيفة لكل متقدم
        applicantsData.forEach(app => {
          allApplicants.push({
            applicationId: app.applicationId || app.id,
            status: app.status || 'pending',
            appliedAt: app.appliedAt,
            student: app.student || {},
            jobTitle: job.title,
            jobId: job.id,
            matchScore: app.matchScore || Math.floor(Math.random() * 30) + 65 // مؤقت
          });
        });
      } catch (error) {
        console.error(`Error fetching applicants for job ${job.id}:`, error);
      }
    }
    
    // ترتيب حسب تاريخ التقديم (الأحدث أولاً)
    allApplicants.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    
    setApplicants(allApplicants);
    setLoading(false);
  };

  // ============== قبول المتقدم ==============
  const handleAccept = async (applicationId) => {
    setProcessingId(applicationId);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log("✅ Accepting application:", applicationId);
      const response = await acceptApplication(applicationId);
      
      if (response.data?.success) {
        // تحديث حالة المتقدم في الـ UI
        setApplicants(prev => 
          prev.map(app => 
            app.applicationId === applicationId 
              ? { ...app, status: 'accepted' } 
              : app
          )
        );
        setSuccessMessage('✅ Application accepted successfully!');
        
        // إخفاء رسالة النجاح بعد 3 ثواني
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data?.message || 'Failed to accept application');
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      setError(error.response?.data?.message || 'Failed to accept application. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // ============== رفض المتقدم ==============
  const handleReject = async (applicationId) => {
    setProcessingId(applicationId);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log("❌ Rejecting application:", applicationId);
      const response = await rejectApplication(applicationId);
      
      if (response.data?.success) {
        // تحديث حالة المتقدم في الـ UI
        setApplicants(prev => 
          prev.map(app => 
            app.applicationId === applicationId 
              ? { ...app, status: 'rejected' } 
              : app
          )
        );
        setSuccessMessage('❌ Application rejected');
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data?.message || 'Failed to reject application');
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      setError(error.response?.data?.message || 'Failed to reject application. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { bg: '#fff3cd', color: '#856404', text: 'Pending' };
      case 'accepted':
        return { bg: '#d4edda', color: '#155724', text: 'Accepted' };
      case 'rejected':
        return { bg: '#f8d7da', color: '#721c24', text: 'Rejected' };
      case 'reviewed':
        return { bg: '#cce5ff', color: '#004085', text: 'Reviewed' };
      default:
        return { bg: '#e2e3e5', color: '#383d41', text: status || 'New' };
    }
  };

  // فلترة المتقدمين حسب الوظيفة
  const filteredApplicants = selectedJob === 'all' 
    ? applicants 
    : applicants.filter(a => a.jobId === selectedJob);

  // ترتيب المتقدمين
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'date') return new Date(b.appliedAt) - new Date(a.appliedAt);
    if (sortBy === 'name') return (a.student?.name || '').localeCompare(b.student?.name || '');
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

      {/* رسائل الخطأ والنجاح */}
      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          borderLeft: '4px solid #721c24'
        }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {successMessage && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '8px',
          borderLeft: '4px solid #155724'
        }}>
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}

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
          {sortedApplicants.map((applicant) => {
            const statusColors = getStatusColor(applicant.status);
            const isProcessing = processingId === applicant.applicationId;
            const isAccepted = applicant.status === 'accepted';
            const isRejected = applicant.status === 'rejected';
            const isPending = applicant.status === 'pending';
            
            return (
              <div key={applicant.applicationId} style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                borderRadius: '12px', 
                padding: '20px',
                opacity: isAccepted || isRejected ? 0.8 : 1,
                borderLeft: isAccepted ? '4px solid #00C851' : isRejected ? '4px solid #ff4444' : 'none'
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
                      {applicant.student?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 style={{ color: darkMode ? '#f1f5f9' : '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>
                        {applicant.student?.name || 'Unknown'}
                      </h3>
                      <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '4px' }}>
                        {applicant.student?.email || ''}
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
                        {applicant.matchScore}%
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: statusColors.bg,
                      color: statusColors.color
                    }}>
                      <i className={`fas ${applicant.status === 'accepted' ? 'fa-check-circle' : applicant.status === 'rejected' ? 'fa-times-circle' : 'fa-clock'}`}></i>
                      {' '}{statusColors.text}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ color: darkMode ? '#94a3b8' : '#0B2A4A', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Skills: 
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(applicant.student?.skills || []).slice(0, 5).map((skill, index) => (
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
                    {(applicant.student?.skills || []).length === 0 && (
                      <span style={{ color: '#999', fontSize: '12px' }}>No skills listed</span>
                    )}
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
                      {applicant.student?.gpa || 'N/A'} / 4.0
                    </p>
                  </div>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '12px', marginBottom: '4px' }}>University</p>
                    <p style={{ color: darkMode ? '#e2e8f0' : '#0B2A4A', fontWeight: '600' }}>
                      {applicant.student?.university || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '12px', marginBottom: '4px' }}>Applied</p>
                    <p style={{ color: darkMode ? '#e2e8f0' : '#0B2A4A', fontWeight: '600' }}>
                      {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-outline"
                    onClick={() => window.open(applicant.student?.cv, '_blank')}
                    disabled={!applicant.student?.cv}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid #0B2A4A',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#0B2A4A'
                    }}
                  >
                    <i className="fas fa-download" style={{ marginRight: '5px' }}></i>
                    View CV
                  </button>
                  
                  {/* Accept Button - يظهر فقط للطلبات المعلقة */}
                  {isPending && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleAccept(applicant.applicationId)}
                      disabled={isProcessing}
                      style={{
                        padding: '8px 16px',
                        background: '#00C851',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.7 : 1
                      }}
                    >
                      {isProcessing ? (
                        <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                      ) : (
                        <><i className="fas fa-check"></i> Accept</>
                      )}
                    </button>
                  )}
                  
                  {/* Reject Button - يظهر فقط للطلبات المعلقة */}
                  {isPending && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(applicant.applicationId)}
                      disabled={isProcessing}
                      style={{
                        padding: '8px 16px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.7 : 1
                      }}
                    >
                      {isProcessing ? (
                        <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                      ) : (
                        <><i className="fas fa-times"></i> Reject</>
                      )}
                    </button>
                  )}
                  
                  {/* Message Button - يظهر للجميع */}
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = `mailto:${applicant.student?.email}`}
                    style={{
                      padding: '8px 16px',
                      background: '#0B2A4A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>
                    Contact
                  </button>
                </div>
                
                {/* عرض رسالة للمتقدمين المقبولين أو المرفوضين */}
                {isAccepted && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    background: '#d4edda',
                    color: '#155724',
                    borderRadius: '8px',
                    fontSize: '13px',
                    textAlign: 'center'
                  }}>
                    <i className="fas fa-check-circle"></i> This applicant has been accepted
                  </div>
                )}
                
                {isRejected && (
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    background: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '8px',
                    fontSize: '13px',
                    textAlign: 'center'
                  }}>
                    <i className="fas fa-times-circle"></i> This application has been rejected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerApplicants;