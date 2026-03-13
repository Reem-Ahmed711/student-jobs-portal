import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

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
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { bg: '#d4edda', color: '#155724' };
      case 'Urgent': return { bg: '#fff3cd', color: '#856404' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
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
              gap: '8px'
            }}
          >
            <i className="fas fa-plus"></i>
            Post New Job
          </button>
        </div>

        <div className="card" style={{ marginBottom: '30px', animation: 'slideInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#0B2A4A', fontWeight: '500' }}>Filter by:</span>
            {['all', 'active', 'urgent', 'filled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {jobs.map(job => {
            const statusColors = getStatusColor(job.status);
            return (
              <div key={job.id} className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>{job.title}</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{job.department} Department</p>
                    <div style={{ display: 'flex', gap: '20px', color: '#999', fontSize: '13px' }}>
                      <span><i className="far fa-calendar-alt"></i> Posted: {job.postedDate}</span>
                      <span><i className="far fa-clock"></i> Deadline: {job.deadline}</span>
                      <span><i className="far fa-eye"></i> {job.views} views</span>
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
                    <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A' }}>
                      Top match: {job.matchScore}%
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(job.applicants / 40) * 100}%` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline">
                    <i className="fas fa-chart-bar"></i> Analytics
                  </button>
                  <button className="btn btn-outline">
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-users"></i> View Applicants
                  </button>
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