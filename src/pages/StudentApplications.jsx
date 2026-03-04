import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const StudentApplications = () => {
  const [filter, setFilter] = useState('all');

  const applications = [
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      department: 'Physics',
      appliedDate: 'Feb 20, 2026',
      status: 'Pending',
      match: '92%',
      company: 'Physics Department',
      location: 'Science Building',
      type: 'Part-Time',
      duration: 'One Semester',
      salary: '2000 EGP/mo'
    },
    {
      id: 2,
      title: 'Research Assistant - Organic Chemistry',
      department: 'Chemistry',
      appliedDate: 'Feb 18, 2026',
      status: 'Interview',
      interviewDate: 'Mar 5, 2026 - 2:00 PM',
      interviewLocation: 'Chemistry Dept Room 305',
      match: '88%',
      company: 'Chemistry Department',
      location: 'Chemistry Building',
      type: 'Part-Time',
      duration: 'Academic Year',
      salary: '2500 EGP/mo'
    },
    {
      id: 3,
      title: 'Lab Supervisor - Biology Lab',
      department: 'Biology',
      appliedDate: 'Feb 15, 2026',
      status: 'Accepted',
      startDate: 'Mar 10, 2026',
      match: '95%',
      company: 'Biology Department',
      location: 'Life Sciences Building',
      type: 'Part-Time',
      duration: 'One Semester',
      salary: '3000 EGP/mo'
    },
    {
      id: 4,
      title: 'Teaching Assistant - Calculus I',
      department: 'Mathematics',
      appliedDate: 'Feb 10, 2026',
      status: 'Rejected',
      match: '65%',
      company: 'Mathematics Department',
      location: 'Math Building',
      type: 'Part-Time',
      duration: 'One Semester',
      salary: '2000 EGP/mo'
    },
    {
      id: 5,
      title: 'Data Analyst - Biophysics Research',
      department: 'Biophysics',
      appliedDate: 'Feb 22, 2026',
      status: 'Under Review',
      match: '90%',
      company: 'Biophysics Department',
      location: 'Research Center',
      type: 'Part-Time',
      duration: '6 Months',
      salary: '2200 EGP/mo'
    }
  ];

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === filter.toLowerCase());

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#fff3cd', color: '#856404' };
      case 'Interview': return { bg: '#d4edda', color: '#155724' };
      case 'Accepted': return { bg: '#cce5ff', color: '#004085' };
      case 'Rejected': return { bg: '#f8d7da', color: '#721c24' };
      case 'Under Review': return { bg: '#e2d5f1', color: '#4a1b6d' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    accepted: applications.filter(a => a.status === 'Accepted').length
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            My Applications
          </h1>
          <p style={{ color: '#666' }}>Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatsCard number={stats.total} label="Total Applications" color="#0B2A4A" />
          <StatsCard number={stats.pending} label="Pending" color="#ffbb33" />
          <StatsCard number={stats.interview} label="Interview" color="#00C851" />
          <StatsCard number={stats.accepted} label="Accepted" color="#0077B5" />
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#0B2A4A', fontWeight: '500' }}>Filter by:</span>
            {['all', 'pending', 'interview', 'accepted', 'rejected'].map(status => (
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

        {/* Applications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredApplications.map(app => {
            const statusColors = getStatusColor(app.status);
            return (
              <div key={app.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600' }}>{app.title}</h3>
                      <span style={{
                        background: '#E6F0FA',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#0B2A4A'
                      }}>
                        {app.match} Match
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{app.department} • {app.company}</p>
                    <p style={{ color: '#999', fontSize: '13px', marginBottom: '5px' }}>{app.location}</p>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '30px',
                    fontSize: '13px',
                    fontWeight: '500',
                    background: statusColors.bg,
                    color: statusColors.color
                  }}>
                    {app.status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '15px',
                  color: '#666',
                  fontSize: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i>{app.type}</span>
                  <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>Applied: {app.appliedDate}</span>
                  <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px' }}></i>{app.salary}</span>
                  <span><i className="far fa-hourglass" style={{ marginRight: '5px' }}></i>{app.duration}</span>
                </div>

                {app.status === 'Interview' && (
                  <div style={{
                    background: '#d4edda',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <i className="fas fa-calendar-check" style={{ color: '#155724', marginRight: '8px' }}></i>
                      <strong>Interview Scheduled:</strong> {app.interviewDate}
                    </div>
                    <span style={{ color: '#155724', fontSize: '13px' }}>{app.interviewLocation}</span>
                  </div>
                )}

                {app.status === 'Accepted' && (
                  <div style={{
                    background: '#cce5ff',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}>
                    <i className="fas fa-check-circle" style={{ color: '#004085', marginRight: '8px' }}></i>
                    <strong>Congratulations!</strong> Start date: {app.startDate}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#0B2A4A',
                    border: '1px solid #0B2A4A',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    View Details
                  </button>
                  {app.status === 'Pending' && (
                    <button style={{
                      padding: '8px 16px',
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      Withdraw
                    </button>
                  )}
                  {app.status === 'Interview' && (
                    <button style={{
                      padding: '8px 16px',
                      background: '#00C851',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      Confirm Interview
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '30px'
        }}>
          {[1, 2, 3].map(page => (
            <button
              key={page}
              style={{
                width: '40px',
                height: '40px',
                background: page === 1 ? '#0B2A4A' : 'white',
                color: page === 1 ? 'white' : '#666',
                border: page === 1 ? 'none' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ number, label, color }) => (
  <div style={{
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ fontSize: '28px', color: color, marginBottom: '5px' }}>{number}</h3>
    <p style={{ color: '#666' }}>{label}</p>
  </div>
);

export default StudentApplications;