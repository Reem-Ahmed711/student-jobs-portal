import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    placementRate: 0
  });
  const [loading, setLoading] = useState(true);

  const weeklyData = [
    { name: 'Sunday', applications: 45, jobs: 12, users: 23 },
    { name: 'Monday', applications: 52, jobs: 15, users: 28 },
    { name: 'Tuesday', applications: 38, jobs: 10, users: 19 },
    { name: 'Wednesday', applications: 65, jobs: 18, users: 32 },
    { name: 'Thursday', applications: 58, jobs: 14, users: 27 },
    { name: 'Friday', applications: 42, jobs: 11, users: 21 },
    { name: 'Saturday', applications: 37, jobs: 9, users: 18 }
  ];

  const departmentData = [
    { name: 'Physics', jobs: 24, applications: 156, color: '#1E3A5F' },
    { name: 'Chemistry', jobs: 18, applications: 142, color: '#2a4a7a' },
    { name: 'Biology', jobs: 12, applications: 98, color: '#3a6a9f' },
    { name: 'Mathematics', jobs: 15, applications: 112, color: '#4a8ac4' },
    { name: 'Computer Science', jobs: 28, applications: 234, color: '#0B2A4A' },
    { name: 'Geology', jobs: 8, applications: 54, color: '#6a9fb5' },
    { name: 'Biochemistry', jobs: 10, applications: 78, color: '#8ab0d9' },
    
  ];

  const applicationStatusData = [
    { name: 'Pending', value: 35, color: '#f59e0b' },
    { name: 'Under Review', value: 25, color: '#3b82f6' },
    { name: 'Interview', value: 20, color: '#8b5cf6' },
    { name: 'Accepted', value: 15, color: '#10b981' },
    { name: 'Rejected', value: 5, color: '#ef4444' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1245,
        activeJobs: 82,
        totalApplications: 892,
        placementRate: 67
      });
      setLoading(false);
    }, 1000);
  }, []);

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
      department: 'Computer Science',
      requestedDate: 'Feb 22, 2026'
    }
  ];

  const pendingJobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Calculus',
      department: 'Mathematics',
      postedBy: 'Dr. Ahmed Hassan',
      date: 'Feb 24, 2026'
    },
    {
      id: 2,
      title: 'Lab Assistant - Organic Chem',
      department: 'Chemistry',
      postedBy: 'Dr. Sara Mahmoud',
      date: 'Feb 23, 2026'
    },
    {
      id: 3,
      title: 'Research Assistant - AI',
      department: 'Computer Science',
      postedBy: 'Dr. Mohamed Ali',
      date: 'Feb 22, 2026'
    }
  ];

  // التقارير المبلغ عنها
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

  // دالة لتحديد لون الأولوية
  const getPriorityColor = (priority) => {
    return priority === 'HIGH' ? '#ff4444' : '#ffbb33';
  };

  // عرض شاشة التحميل
  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div className="spinner" style={{ margin: '100px auto' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* ===== Header ===== */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#666' }}>Manage and monitor the faculty jobs portal</p>
          </div>
          
          {/* أزرار سريعة */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline">
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              Export Report
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-cog" style={{ marginRight: '8px' }}></i>
              Settings
            </button>
          </div>
        </div>

        {/* ===== Search Bar ===== */}
        <div className="card" style={{ 
          padding: '15px 20px',
          marginBottom: '30px',
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
              fontSize: '14px',
              background: 'transparent'
            }}
          />
          <span style={{ color: '#999', fontSize: '13px' }}>⌘ K</span>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="stats-grid" style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <StatCard number={stats.totalUsers} label="Total Users" icon="fa-users" change={3} />
          <StatCard number={stats.activeJobs} label="Active Jobs" icon="fa-briefcase" change={5} />
          <StatCard number={stats.totalApplications} label="Applications" icon="fa-file-alt" change={8} />
          <StatCard number={`${stats.placementRate}%`} label="Placement Rate" icon="fa-chart-line" change={2} />
        </div>

        {/* ===== System Health ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          animation: 'slideInUp 0.7s ease-out'
        }}>
          <div>
            <p style={{ opacity: 0.9, fontSize: '13px', marginBottom: '5px' }}>
              <i className="fas fa-database" style={{ marginRight: '8px' }}></i>
              Database Backup
            </p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>Last: 2 hours ago</p>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              Run Backup
            </button>
          </div>
          <div>
            <p style={{ opacity: 0.9, fontSize: '13px', marginBottom: '5px' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
              Performance
            </p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>Excellent</p>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              View Details
            </button>
          </div>
          <div>
            <p style={{ opacity: 0.9, fontSize: '13px', marginBottom: '5px' }}>
              <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
              Email Queue
            </p>
            <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>45 pending</p>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              Process
            </button>
          </div>
        </div>

        {/* ===== Charts Section ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Weekly Activity Line Chart */}
          <div className="card" style={{ animation: 'slideInUp 0.8s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#1E3A5F" strokeWidth={2} />
                <Line type="monotone" dataKey="jobs" stroke="#2a4a7a" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#4a8ac4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution Bar Chart */}
          <div className="card" style={{ animation: 'slideInUp 0.9s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
              Jobs by Department
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#1E3A5F" />
                <Bar dataKey="applications" fill="#4a8ac4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Application Status Pie Chart */}
          <div className="card" style={{ gridColumn: 'span 2', animation: 'slideInUp 1s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              <i className="fas fa-chart-pie" style={{ marginRight: '8px' }}></i>
              Application Status Distribution
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ===== Pending Items Grid ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Pending Verifications */}
          <div className="card" style={{ animation: 'slideInUp 1.1s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              <i className="fas fa-user-clock" style={{ marginRight: '8px' }}></i>
              Pending User Verifications
            </h3>
            {pendingVerifications.map(user => (
              <div key={user.id} style={{
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>{user.name}</p>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>{user.email}</p>
                  <p style={{ color: '#999', fontSize: '12px' }}>{user.role} • {user.department}</p>
                </div>
                <div>
                  <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}>
                    Verify
                  </button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Job Approvals */}
          <div className="card" style={{ animation: 'slideInUp 1.2s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
              <i className="fas fa-briefcase-clock" style={{ marginRight: '8px' }}></i>
              Pending Job Approvals
            </h3>
            {pendingJobs.map(job => (
              <div key={job.id} style={{
                padding: '15px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>{job.title}</p>
                  <p style={{ color: '#666', fontSize: '13px', marginBottom: '2px' }}>{job.department}</p>
                  <p style={{ color: '#999', fontSize: '12px' }}>{job.postedBy} • {job.date}</p>
                </div>
                <div>
                  <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}>
                    Approve
                  </button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Content */}
        <div className="card" style={{ animation: 'slideInUp 1.3s ease-out' }}>
          <h3 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            <i className="fas fa-flag" style={{ marginRight: '8px' }}></i>
            Flagged Content / Reports
          </h3>
          {reports.map((report, index) => (
            <div key={report.id} style={{
              padding: '15px',
              borderBottom: index < reports.length - 1 ? '1px solid #e0e0e0' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
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
                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
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

export default AdminDashboard;
