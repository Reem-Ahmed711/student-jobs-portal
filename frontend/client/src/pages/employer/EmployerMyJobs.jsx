import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const EmployerMyJobs = () => {
  const [filter, setFilter] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      department: 'Physics',
      postedDate: 'Feb 15, 2026',
      deadline: 'Mar 15, 2026',
      applicants: 24,
      status: 'Active',
      matchScore: 92,
      views: 156
    },
    {
      id: 2,
      title: 'Research Assistant - Quantum',
      department: 'Physics',
      postedDate: 'Feb 10, 2026',
      deadline: 'Mar 20, 2026',
      applicants: 12,
      status: 'Active',
      matchScore: 88,
      views: 98
    },
    {
      id: 3,
      title: 'Lab Assistant - General Physics',
      department: 'Physics',
      postedDate: 'Feb 18, 2026',
      deadline: 'Mar 10, 2026',
      applicants: 18,
      status: 'Urgent',
      matchScore: 85,
      views: 134
    },
    {
      id: 4,
      title: 'Teaching Assistant - Calculus I',
      department: 'Mathematics',
      postedDate: 'Feb 5, 2026',
      deadline: 'Mar 5, 2026',
      applicants: 32,
      status: 'Filled',
      matchScore: 78,
      views: 245
    },
    {
      id: 5,
      title: 'Research Assistant - Organic Chemistry',
      department: 'Chemistry',
      postedDate: 'Feb 12, 2026',
      deadline: 'Mar 12, 2026',
      applicants: 15,
      status: 'Active',
      matchScore: 86,
      views: 112
    }
  ];

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status.toLowerCase() === filter.toLowerCase());

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { bg: '#d4edda', color: '#155724' };
      case 'Urgent': return { bg: '#fff3cd', color: '#856404' };
      case 'Filled': return { bg: '#cce5ff', color: '#004085' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
              My Job Postings
            </h1>
            <p style={{ color: '#666' }}>Manage and track all your job listings</p>
          </div>
          <button
            onClick={() => window.location.href = '/employer-post-job'}
            style={{
              padding: '12px 24px',
              background: '#0B2A4A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-plus"></i>
            Post New Job
          </button>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#0B2A4A', fontWeight: '500' }}>Filter by:</span>
            {['all', 'active', 'urgent', 'filled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '8px 16px',
                  background: filter === status ? '#0B2A4A' : 'white',
                  color: filter === status ? 'white' : '#666',
                  border: filter === status ? 'none' : '1px solid #ddd',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredJobs.map(job => {
            const statusColors = getStatusColor(job.status);
            return (
              <div key={job.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600' }}>{job.title}</h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: statusColors.bg,
                        color: statusColors.color
                      }}>
                        {job.status}
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{job.department} Department</p>
                    <div style={{ display: 'flex', gap: '20px', color: '#999', fontSize: '13px' }}>
                      <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>Posted: {job.postedDate}</span>
                      <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i>Deadline: {job.deadline}</span>
                      <span><i className="far fa-eye" style={{ marginRight: '5px' }}></i>{job.views} views</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      background: '#E6F0FA',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>{job.applicants}</span>
                      <span style={{ color: '#666', fontSize: '12px', marginLeft: '4px' }}>applicants</span>
                    </div>
                    <span style={{
                      background: '#E6F0FA',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      color: '#0B2A4A'
                    }}>
                      Top match: {job.matchScore}%
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(job.applicants / 40) * 100}%`,
                      height: '100%',
                      background: '#0B2A4A',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#0B2A4A',
                    border: '1px solid #0B2A4A',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-chart-bar" style={{ marginRight: '5px' }}></i>
                    Analytics
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#0B2A4A',
                    border: '1px solid #0B2A4A',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-edit" style={{ marginRight: '5px' }}></i>
                    Edit
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: '#0B2A4A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-users" style={{ marginRight: '5px' }}></i>
                    View Applicants
                  </button>
                  {job.status !== 'Filled' && (
                    <button style={{
                      padding: '8px 16px',
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerMyJobs;