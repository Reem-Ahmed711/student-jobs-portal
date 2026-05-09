// C:\Student-job-portal\Frontend\src\pages\StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getStudentStats, getMyApplications, getAllJobs, getSavedJobs } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
    profileCompletion: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // تعيين التحية حسب الوقت
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // جلب الإحصائيات
        const statsRes = await getStudentStats();
        const statsData = statsRes.data?.data || statsRes.data || {};
        setStats({
          totalApplications: statsData.totalApplications || 0,
          pendingReview: statsData.pendingReview || 0,
          interviewsScheduled: statsData.interviewsScheduled || 0,
          savedJobs: statsData.savedJobs || 0,
          profileCompletion: statsData.profileCompletion || 55
        });

        // جلب الوظائف الموصى بها
        const jobsRes = await getAllJobs();
        let allJobsData = jobsRes.data?.data || jobsRes.data || [];
        
        const userDept = user?.department;
        let recommended = allJobsData;
        if (userDept && allJobsData.length > 0) {
          recommended = allJobsData.filter(job => job.department === userDept);
          if (recommended.length === 0) recommended = allJobsData.slice(0, 3);
        }
        
        // إضافة match score مؤقت إذا لم يوجد
        recommended = recommended.map(job => ({
          ...job,
          match: job.match || Math.floor(Math.random() * 25) + 70
        }));
        setRecommendedJobs(recommended.slice(0, 3));

        // جلب آخر التقديمات
        const appsRes = await getMyApplications();
        let appsData = appsRes.data?.data || appsRes.data || [];
        appsData = appsData.map(app => ({
          ...app,
          match: app.match || Math.floor(Math.random() * 25) + 70
        }));
        setRecentApplications(appsData.slice(0, 4));
        
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const StatCard = ({ number, label, icon, color, trend }) => (
    <div className="stat-card" style={{
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          background: `${color}15`,
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          <i className={`fas ${icon}`} style={{ fontSize: '22px' }}></i>
        </div>
        {trend && (
          <span style={{ color: trend > 0 ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: '500', background: `${trend > 0 ? '#10b981' : '#ef4444'}10`, padding: '4px 8px', borderRadius: '20px' }}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '5px' }}>
        {number}
      </h3>
      <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>{label}</p>
    </div>
  );

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
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .welcome-card {
          animation: slideInUp 0.5s ease-out;
        }
        .stat-card {
          animation: slideInUp 0.6s ease-out;
        }
        .job-card {
          transition: all 0.3s ease;
          animation: slideInUp 0.7s ease-out;
        }
        .job-card:hover {
          transform: translateX(5px);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section - محسنة */}
        <div className="welcome-card" style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          borderRadius: '24px',
          padding: '30px',
          marginBottom: '30px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '50%'
          }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>{greeting} 👋</p>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
              </h1>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>
                  <i className="fas fa-graduation-cap" style={{ marginRight: '6px' }}></i>
                  {user?.department || 'Computer Science'}
                </span>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                  {user?.year || '3rd Year'}
                </span>
                {user?.gpa && (
                  <span style={{ fontSize: '13px', opacity: 0.9 }}>
                    <i className="fas fa-star" style={{ marginRight: '6px' }}></i>
                    GPA: {user.gpa}
                  </span>
                )}
              </div>
            </div>
            <Link to="/available-jobs">
              <button style={{
                background: 'white',
                color: '#1E3A5F',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '40px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}>
                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                Browse Jobs
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - محسنة */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard number={stats.totalApplications} label="Total Applications" icon="fa-file-alt" color="#1E3A5F" trend={12} />
          <StatCard number={stats.pendingReview} label="Under Review" icon="fa-clock" color="#f59e0b" />
          <StatCard number={stats.interviewsScheduled} label="Interviews" icon="fa-calendar-check" color="#10b981" trend={8} />
          <StatCard number={stats.savedJobs} label="Saved Jobs" icon="fa-bookmark" color="#8b5cf6" />
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Recommended Jobs - محسنة */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                <i className="fas fa-star" style={{ marginRight: '10px', color: '#f59e0b' }}></i>
                Recommended for You
              </h2>
              <Link to="/available-jobs" style={{ color: '#1E3A5F', fontSize: '13px', textDecoration: 'none' }}>
                View all <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recommendedJobs.length === 0 ? (
                <div className="card" style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  background: darkMode ? '#1e293b' : 'white',
                  borderRadius: '16px'
                }}>
                  <i className="fas fa-briefcase" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                  <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>No jobs available at the moment</p>
                  <Link to="/available-jobs">
                    <button className="btn btn-primary" style={{ marginTop: '15px', padding: '8px 20px' }}>Browse Jobs</button>
                  </Link>
                </div>
              ) : (
                recommendedJobs.map((job, idx) => (
                  <div key={job.id} className="job-card" style={{
                    background: darkMode ? '#1e293b' : 'white',
                    borderRadius: '16px',
                    padding: '18px',
                    transition: 'transform 0.2s ease',
                    borderLeft: idx === 0 ? '4px solid #10b981' : 'none',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                    {idx === 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '20px',
                        background: '#10b981',
                        color: 'white',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        Best Match
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '4px' }}>
                        {job.title}
                      </h3>
                      <span className="badge" style={{
                        background: job.match >= 90 ? '#d4edda' : job.match >= 80 ? '#fff3cd' : '#f8d7da',
                        color: job.match >= 90 ? '#155724' : job.match >= 80 ? '#856404' : '#721c24',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {job.match}% Match
                      </span>
                    </div>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px', marginBottom: '8px' }}>
                      <i className="fas fa-building" style={{ marginRight: '5px' }}></i>
                      {job.department}
                    </p>
                    <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px', marginBottom: '12px' }}>
                      <i className="fas fa-clock" style={{ marginRight: '5px' }}></i>
                      {job.hours || 'Flexible'} • {job.salary || 'Negotiable'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
                      {(job.skills || []).slice(0, 3).map((skill, i) => (
                        <span key={i} className="skill-tag" style={{
                          background: darkMode ? '#334155' : '#E8F0FE',
                          color: darkMode ? '#e2e8f0' : '#1E3A5F',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link to={`/job/${job.id}`}>
                      <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
                        View Details <i className="fas fa-arrow-right"></i>
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications - محسنة */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                <i className="fas fa-history" style={{ marginRight: '10px' }}></i>
                Recent Applications
              </h2>
              <Link to="/student-applications" style={{ color: '#1E3A5F', fontSize: '13px', textDecoration: 'none' }}>
                View all <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentApplications.length === 0 ? (
                <div className="card" style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  background: darkMode ? '#1e293b' : 'white',
                  borderRadius: '16px'
                }}>
                  <i className="fas fa-file-alt" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                  <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>No applications yet</p>
                  <Link to="/available-jobs">
                    <button className="btn btn-primary" style={{ marginTop: '15px', padding: '8px 20px' }}>
                      Start Applying
                    </button>
                  </Link>
                </div>
              ) : (
                recentApplications.map(app => {
                  const statusConfig = {
                    pending: { bg: '#fff3cd', color: '#856404', icon: 'fa-clock', text: 'Pending' },
                    interview: { bg: '#cce5ff', color: '#004085', icon: 'fa-calendar', text: 'Interview' },
                    shortlisted: { bg: '#e2d5f1', color: '#4a1b6d', icon: 'fa-star', text: 'Shortlisted' },
                    accepted: { bg: '#d4edda', color: '#155724', icon: 'fa-check', text: 'Accepted' },
                    rejected: { bg: '#f8d7da', color: '#721c24', icon: 'fa-times', text: 'Not Selected' }
                  };
                  const status = statusConfig[app.status?.toLowerCase()] || statusConfig.pending;
                  
                  return (
                    <div key={app.id} className="card" style={{
                      background: darkMode ? '#1e293b' : 'white',
                      borderRadius: '12px',
                      padding: '15px',
                      transition: 'transform 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '4px' }}>
                            {app.jobTitle}
                          </h4>
                          <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '12px' }}>
                            <i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge" style={{
                            background: status.bg,
                            color: status.color,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <i className={`fas ${status.icon}`} style={{ fontSize: '10px' }}></i>
                            {status.text}
                          </span>
                          {app.match && (
                            <p style={{ fontSize: '11px', color: '#10b981', marginTop: '5px' }}>{app.match}% Match</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion - محسنة */}
        <div className="card" style={{
          marginTop: '30px',
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '20px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '4px' }}>
                <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                Profile Completion
              </h3>
              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>Complete your profile to get better job matches</p>
            </div>
            <span style={{ fontWeight: '700', fontSize: '24px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.profileCompletion}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: darkMode ? '#334155' : '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${stats.profileCompletion}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #1E3A5F, #2a4a7a)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          {stats.profileCompletion < 100 && (
            <Link to="/student-settings">
              <button style={{
                marginTop: '15px',
                background: 'none',
                border: '1px solid #1E3A5F',
                color: '#1E3A5F',
                padding: '8px 20px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1E3A5F';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#1E3A5F';
              }}>
                Complete your profile <i className="fas fa-arrow-right"></i>
              </button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
