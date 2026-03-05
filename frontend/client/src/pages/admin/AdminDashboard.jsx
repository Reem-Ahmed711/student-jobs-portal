import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const stats = {
    totalUsers: 1245,
    newUsers: 45,
    activeJobs: 82,
    newJobs: 12,
    totalApplications: 892,
    newApplications: 124,
    placementRate: 67
  };

  const departmentStats = [
    { dept: 'Physics', jobs: 24, applications: 156, hires: 18 },
    { dept: 'Chemistry', jobs: 18, applications: 142, hires: 12 },
    { dept: 'Biology', jobs: 12, applications: 98, hires: 8 },
    { dept: 'Mathematics', jobs: 15, applications: 112, hires: 10 },
    { dept: 'Geology', jobs: 6, applications: 45, hires: 4 }
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'Dr. Ahmed Hassan',
      email: 'a.hassan@cu.edu.eg',
      role: 'Professor',
      department: 'Chemistry',
      requestedDate: 'Feb 24, 2026'
    },
    {
      id: 2,
      name: 'Dr. Sara Mahmoud',
      email: 's.mahmoud@cu.edu.eg',
      role: 'Lab Manager',
      department: 'Physics',
      requestedDate: 'Feb 23, 2026'
    },
    {
      id: 3,
      name: 'Dr. Mohamed Ali',
      email: 'm.ali@cu.edu.eg',
      role: 'Department Head',
      department: 'Biology',
      requestedDate: 'Feb 22, 2026'
    }
  ];

  const pendingJobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Calculus',
      department: 'Mathematics',
      postedBy: 'Dr. Ahmed Hassan',
      date: 'Feb 24, 2026',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Lab Assistant - Organic Chem',
      department: 'Chemistry',
      postedBy: 'Dr. Sara Mahmoud',
      date: 'Feb 23, 2026',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Research Assistant - Biophysics',
      department: 'Physics',
      postedBy: 'Dr. Mohamed Ali',
      date: 'Feb 22, 2026',
      status: 'pending'
    }
  ];

  const reports = [
    {
      id: 1,
      type: 'Inappropriate job description',
      reportedBy: 'Student',
      date: 'Feb 24, 2026',
      priority: 'HIGH'
    },
    {
      id: 2,
      type: 'Spam application',
      reportedBy: 'Employer',
      date: 'Feb 22, 2026',
      priority: 'LOW'
    }
  ];

  const getPriorityColor = (priority) => {
    return priority === 'HIGH' ? '#ff4444' : '#ffbb33';
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
              Admin Control Panel
            </h1>
            <p style={{ color: '#666' }}>Manage and monitor the faculty jobs portal</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              padding: '10px 20px',
              background: 'white',
              color: '#0B2A4A',
              border: '1px solid #0B2A4A',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              Export Report
            </button>
            <button style={{
              padding: '10px 20px',
              background: '#0B2A4A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              <i className="fas fa-cog" style={{ marginRight: '8px' }}></i>
              Settings
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '15px 20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <i className="fas fa-search" style={{ color: '#999' }}></i>
          <input
            type="text"
            placeholder="Search users, jobs, applications..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <span style={{ color: '#999', fontSize: '13px' }}>⌘ K</span>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <AdminStatCard
            number={stats.totalUsers}
            label="Total Users"
            subtext={`Students: 1120 | Employers: 125`}
            change={`+${stats.newUsers} this week`}
            icon="fas fa-users"
          />
          <AdminStatCard
            number={stats.activeJobs}
            label="Active Jobs"
            subtext={`+${stats.newJobs} this week`}
            icon="fas fa-briefcase"
          />
          <AdminStatCard
            number={stats.totalApplications}
            label="Applications"
            subtext={`+${stats.newApplications} this week`}
            icon="fas fa-file-alt"
          />
          <AdminStatCard
            number={`${stats.placementRate}%`}
            label="Placement Rate"
            subtext="+5% this month"
            icon="fas fa-chart-line"
          />
        </div>

        {/* System Health */}
        <div style={{
          background: 'linear-gradient(135deg, #0B2A4A 0%, #1e4a7a 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px'
        }}>
          <div>
            <p style={{ opacity: 0.9, fontSize: '13px', marginBottom: '5px' }}>Database Backup</p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>Last: 2 hours ago</p>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Run Backup
            </button>
          </div>
          <div>
            <p style={{ opacity: 0.9, fontSize: '13px', marginBottom: '5px' }}>Performance</p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>Excellent</p>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              View Details
            </button>
          </div>
          <div>
            <p style={{ opacity: 0.9, fontSize: '13px', marginBottom: '5px' }}>Email Queue</p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>45 pending</p>
            <button style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Process
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Pending Verifications */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              Pending User Verifications
            </h3>
            {pendingVerifications.map(user => (
              <div key={user.id} style={{
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>{user.name}</p>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>{user.email}</p>
                  <p style={{ color: '#999', fontSize: '12px' }}>{user.role} • {user.department}</p>
                </div>
                <div>
                  <button style={{
                    padding: '6px 12px',
                    background: '#00C851',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginRight: '8px'
                  }}>
                    Verify
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Job Approvals */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              Pending Job Approvals
            </h3>
            {pendingJobs.map(job => (
              <div key={job.id} style={{
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>{job.title}</p>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>{job.department}</p>
                  <p style={{ color: '#999', fontSize: '12px' }}>{job.postedBy} • {job.date}</p>
                </div>
                <div>
                  <button style={{
                    padding: '6px 12px',
                    background: '#00C851',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginRight: '8px'
                  }}>
                    Approve
                  </button>
                  <button style={{
                    padding: '6px 12px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Content */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            Flagged Content / Reports
          </h3>
          {reports.map((report, index) => (
            <div key={report.id} style={{
              padding: '15px',
              borderBottom: index < reports.length - 1 ? '1px solid #e0e0e0' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontWeight: '500', marginBottom: '4px' }}>{report.type}</p>
                <p style={{ color: '#666', fontSize: '13px' }}>
                  Reported by {report.reportedBy} • {report.date}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{
                  padding: '4px 8px',
                  background: getPriorityColor(report.priority),
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {report.priority}
                </span>
                <button style={{
                  padding: '6px 12px',
                  background: '#0B2A4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ number, label, subtext, change, icon }) => (
  <div style={{
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      background: '#E6F0FA',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0B2A4A',
      fontSize: '20px'
    }}>
      <i className={icon}></i>
    </div>
    <div>
      <h3 style={{ fontSize: '24px', color: '#0B2A4A', marginBottom: '2px' }}>{number}</h3>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>{label}</p>
      <p style={{ color: '#999', fontSize: '12px', marginBottom: '2px' }}>{subtext}</p>
      {change && <small style={{ color: '#00C851', fontSize: '11px' }}>{change}</small>}
    </div>
  </div>
);

export default AdminDashboard;