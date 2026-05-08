// D:\student-jobs-portal\Frontend\src\pages\employer\EmployerMyJobs.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getEmployerJobs } from '../../services/api';

const EmployerMyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    // فلترة الوظائف حسب الحالة
    let result = [...jobs];
    
    if (filter !== 'all') {
      if (filter === 'active') {
        result = result.filter(job => job.status === 'active' || job.status === 'Active');
      } else if (filter === 'pending') {
        result = result.filter(job => job.status === 'pending' || job.status === 'Pending');
      } else if (filter === 'urgent') {
        result = result.filter(job => job.status === 'urgent' || job.status === 'Urgent');
      } else if (filter === 'closed') {
        result = result.filter(job => job.status === 'closed' || job.status === 'Closed');
      }
    }
    
    setFilteredJobs(result);
  }, [filter, jobs]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getEmployerJobs();
      console.log('Jobs response:', response);
      
      // استخراج البيانات من الـ response بشكل صحيح
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
      
      // تنسيق البيانات للعرض
      const formattedJobs = jobsData.map(job => ({
        id: job.id,
        title: job.title || 'Untitled Job',
        department: job.department || job.category || 'N/A',
        postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-GB') : 'N/A',
        deadline: job.deadline ? new Date(job.deadline).toLocaleDateString('en-GB') : 'Not set',
        applicants: job.applicantsCount || job.applicationsCount || 0,
        status: getJobStatus(job),
        matchScore: job.topMatchScore || job.matchScore || 75,
        views: job.views || 0,
        description: job.description || '',
        type: job.type || 'Part-Time',
        location: job.location || 'On Campus'
      }));
      
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getJobStatus = (job) => {
    // تحديد حالة الوظيفة بناءً على البيانات من الباكند
    if (job.status === 'active' || job.approved === true) {
      return 'Active';
    }
    if (job.status === 'closed') {
      return 'Closed';
    }
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return 'Expired';
    }
    if (job.isUrgent === true || job.priority === 'high') {
      return 'Urgent';
    }
    return 'Pending';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { bg: '#d4edda', color: '#155724' };
      case 'Urgent': return { bg: '#fff3cd', color: '#856404' };
      case 'Expired': return { bg: '#f8d7da', color: '#721c24' };
      case 'Closed': return { bg: '#e2e3e5', color: '#383d41' };
      default: return { bg: '#cce5ff', color: '#004085' };
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Urgent': return 'warning';
      case 'Expired': return 'danger';
      case 'Closed': return 'secondary';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="spinner"></div>
            <p style={{ marginLeft: '15px', color: '#666' }}>Loading your jobs...</p>
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
              My Job Postings
            </h1>
            <p style={{ color: '#666' }}>Manage and track all your job listings</p>
          </div>
          <button
            onClick={() => window.location.href = '/employer-post-job'}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0B2A4A',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-plus"></i>
            Post New Job
          </button>
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
              onClick={fetchJobs}
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

        {/* Filter Bar */}
        <div className="card" style={{ 
          marginBottom: '30px', 
          animation: 'slideInUp 0.6s ease-out',
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#0B2A4A', fontWeight: '500' }}>Filter by:</span>
            {['all', 'active', 'pending', 'urgent', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                  background: filter === status ? '#0B2A4A' : 'transparent',
                  color: filter === status ? 'white' : '#0B2A4A',
                  border: filter === status ? 'none' : '1px solid #0B2A4A',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                {status === 'all' ? 'All Jobs' : 
                 status === 'active' ? 'Active' :
                 status === 'pending' ? 'Pending Approval' :
                 status === 'urgent' ? 'Urgent' : 'Closed'}
                {status !== 'all' && (
                  <span style={{
                    marginLeft: '8px',
                    background: filter === status ? 'rgba(255,255,255,0.2)' : '#E6F0FA',
                    padding: '2px 6px',
                    borderRadius: '20px',
                    fontSize: '11px'
                  }}>
                    {filteredJobs.filter(j => {
                      if (status === 'active') return j.status === 'Active';
                      if (status === 'pending') return j.status === 'Pending';
                      if (status === 'urgent') return j.status === 'Urgent';
                      if (status === 'closed') return j.status === 'Closed';
                      return false;
                    }).length}
                  </span>
                )}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={fetchJobs}
              style={{
                padding: '8px 16px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '60px',
            background: 'white',
            borderRadius: '12px',
            animation: 'slideInUp 0.7s ease-out'
          }}>
            <i className="fas fa-briefcase" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No jobs found</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              {filter !== 'all' 
                ? `You don't have any ${filter} jobs at the moment.` 
                : "You haven't posted any jobs yet."}
            </p>
            <button
              onClick={() => window.location.href = '/employer-post-job'}
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                background: '#0B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-plus"></i> Post Your First Job
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredJobs.map((job, index) => {
              const statusColors = getStatusColor(job.status);
              const daysLeft = job.deadline !== 'Not set' 
                ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                : null;
              
              return (
                <div 
                  key={job.id} 
                  className="card" 
                  style={{ 
                    animation: `slideInUp ${0.7 + index * 0.05}s ease-out`,
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: job.status === 'Urgent' ? '4px solid #f59e0b' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                        {job.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                        {job.department} Department • {job.type}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', color: '#999', fontSize: '13px', flexWrap: 'wrap' }}>
                        <span><i className="far fa-calendar-alt"></i> Posted: {job.postedDate}</span>
                        {daysLeft !== null && daysLeft > 0 && (
                          <span><i className="far fa-clock"></i> {daysLeft} days left</span>
                        )}
                        {daysLeft !== null && daysLeft <= 0 && (
                          <span><i className="fas fa-exclamation-circle"></i> Deadline passed</span>
                        )}
                        <span><i className="far fa-eye"></i> {job.views} views</span>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        background: '#E6F0FA',
                        padding: '8px 16px',
                        borderRadius: '30px',
                        marginBottom: '8px',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>{job.applicants}</span>
                        <span style={{ color: '#666', fontSize: '12px', marginLeft: '4px' }}>applicants</span>
                      </div>
                      <span className={`badge badge-${getStatusBadgeClass(job.status)}`} style={{
                        background: statusColors.bg,
                        color: statusColors.color,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {job.status}
                      </span>
                    </div>
                  </div>

                  {/* Match Score Bar - فقط للوظائف النشطة */}
                  {job.status === 'Active' && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>Top Match Score</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0B2A4A' }}>{job.matchScore}%</span>
                      </div>
                      <div className="progress-bar" style={{
                        background: '#e0e0e0',
                        borderRadius: '10px',
                        height: '8px',
                        overflow: 'hidden'
                      }}>
                        <div className="progress-fill" style={{ 
                          width: `${job.matchScore}%`, 
                          background: '#0B2A4A',
                          height: '100%',
                          borderRadius: '10px'
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.href = `/employer-job-analytics?id=${job.id}`}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid #0B2A4A',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#0B2A4A'
                      }}
                    >
                      <i className="fas fa-chart-bar"></i> Analytics
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.href = `/employer-edit-job?id=${job.id}`}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid #0B2A4A',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        color: '#0B2A4A'
                      }}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = `/employer-applicants?jobId=${job.id}`}
                      style={{
                        padding: '8px 16px',
                        background: '#0B2A4A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-users"></i> View Applicants ({job.applicants})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {jobs.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'white', 
            borderRadius: '8px', 
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666' }}>
              Total Jobs: <strong>{jobs.length}</strong> | 
              Active: <strong>{jobs.filter(j => j.status === 'Active').length}</strong> |
              Pending: <strong>{jobs.filter(j => j.status === 'Pending').length}</strong> |
              Total Applicants: <strong>{jobs.reduce((sum, j) => sum + (j.applicants || 0), 0)}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerMyJobs;