// Frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getPlatformStats, adminGetAllJobs, adminGetAllApplications, getAllEmployers, getAllStudents } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    placementRate: 0
  });
  const [weeklyData, setWeeklyData] = useState([
    { name: 'Sun', applications: 0, jobs: 0, users: 0 },
    { name: 'Mon', applications: 0, jobs: 0, users: 0 },
    { name: 'Tue', applications: 0, jobs: 0, users: 0 },
    { name: 'Wed', applications: 0, jobs: 0, users: 0 },
    { name: 'Thu', applications: 0, jobs: 0, users: 0 },
    { name: 'Fri', applications: 0, jobs: 0, users: 0 },
    { name: 'Sat', applications: 0, jobs: 0, users: 0 }
  ]);
  const [departmentData, setDepartmentData] = useState([]);
  const [applicationStatusData, setApplicationStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLast7Days = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(name => ({ name, date: new Date() }));
  };

  const getDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, jobsRes, appsRes, employersRes, studentsRes] = await Promise.all([
          getPlatformStats(),
          adminGetAllJobs(),
          adminGetAllApplications(),
          getAllEmployers(),
          getAllStudents()
        ]);
        
        const statsData = statsRes.data?.data || statsRes.data || {};
        const jobsData = jobsRes.data?.data || jobsRes.data || [];
        const appsData = appsRes.data?.data || appsRes.data || [];
        const employers = employersRes.data?.data || employersRes.data || [];
        const students = studentsRes.data?.data || studentsRes.data || [];
        
        const totalUsers = employers.length + students.length;
        const activeJobs = jobsData.filter(j => j.status === 'active' || j.approved === true).length;
        const totalApplications = appsData.length;
        const acceptedApplications = appsData.filter(a => a.status === 'accepted' || a.status === 'approved').length;
        const placementRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;
        
        setStats({
          totalUsers: totalUsers,
          activeJobs: activeJobs,
          totalApplications: totalApplications,
          placementRate: placementRate
        });

        const last7Days = getLast7Days();
        const weeklyApps = last7Days.map(day => ({ name: day.name, applications: 0, jobs: 0, users: 0 }));

        appsData.forEach(app => {
          const appDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.createdAt);
          const dayName = getDayName(appDate);
          const dayIndex = weeklyApps.findIndex(d => d.name === dayName);
          if (dayIndex !== -1) weeklyApps[dayIndex].applications++;
        });

        jobsData.forEach(job => {
          const jobDate = job.createdAt?.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
          const dayName = getDayName(jobDate);
          const dayIndex = weeklyApps.findIndex(d => d.name === dayName);
          if (dayIndex !== -1) weeklyApps[dayIndex].jobs++;
        });

        [...employers, ...students].forEach(user => {
          const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
          const dayName = getDayName(userDate);
          const dayIndex = weeklyApps.findIndex(d => d.name === dayName);
          if (dayIndex !== -1) weeklyApps[dayIndex].users++;
        });

        setWeeklyData(weeklyApps);

        const deptMap = new Map();
        jobsData.forEach(job => {
          const dept = job.department || 'Other';
          deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
        });
        setDepartmentData(Array.from(deptMap.entries()).map(([name, jobs]) => ({ name, jobs, applications: jobs * 5 })));

        const statusMap = new Map();
        appsData.forEach(app => {
          const status = app.status || 'pending';
          statusMap.set(status, (statusMap.get(status) || 0) + 1);
        });
        const statusColors = { pending: '#f59e0b', accepted: '#10b981', rejected: '#ef4444', reviewing: '#3b82f6' };
        setApplicationStatusData(Array.from(statusMap.entries()).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: statusColors[name] || '#6b7280'
        })));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '20px', minWidth: 0, overflowX: 'hidden' }}>
          <div className="spinner" style={{ margin: '50px auto' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginLeft: '250px', padding: '16px', width: 'calc(100% - 250px)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '20px', color: '#1E3A5F', fontWeight: '600', marginBottom: '2px' }}>Admin Dashboard</h1>
            <p style={{ color: '#666', fontSize: '12px' }}>Manage and monitor the faculty jobs portal</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '11px' }}><i className="fas fa-download" style={{ marginRight: '5px' }}></i>Export</button>
            <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '11px' }}><i className="fas fa-cog" style={{ marginRight: '5px' }}></i>Settings</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <StatCard number={stats.totalUsers} label="Total Users" icon="fa-users" change={3} />
          <StatCard number={stats.activeJobs} label="Active Jobs" icon="fa-briefcase" change={5} />
          <StatCard number={stats.totalApplications} label="Applications" icon="fa-file-alt" change={8} />
          <StatCard number={`${stats.placementRate}%`} label="Placement Rate" icon="fa-chart-line" change={2} />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div className="card" style={{ padding: '12px', background: '#fff', borderRadius: '10px' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '4px' }}></i>Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={9} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '9px' }} />
                <Line type="monotone" dataKey="applications" stroke="#1E3A5F" strokeWidth={2} />
                <Line type="monotone" dataKey="jobs" stroke="#2a4a7a" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#4a8ac4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: '12px', background: '#fff', borderRadius: '10px' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '4px' }}></i>Jobs by Department
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={9} angle={-35} textAnchor="end" height={50} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Bar dataKey="jobs" fill="#1E3A5F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ gridColumn: 'span 2', padding: '12px', background: '#fff', borderRadius: '10px' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              <i className="fas fa-chart-pie" style={{ marginRight: '4px' }}></i>Application Status
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={65}
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
      </div>
    </div>
  );
};

export default AdminDashboard;