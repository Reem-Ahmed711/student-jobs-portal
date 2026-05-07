// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRecommendedJobs, getStudentStats } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
    profileCompletion: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch real stats from backend
        const statsResponse = await getStudentStats();
        if (statsResponse.data?.success) {
          setStats(statsResponse.data.data);
        } else if (statsResponse.data) {
          setStats(statsResponse.data);
        }

        // Fetch real job recommendations
        const jobsResponse = await getRecommendedJobs();
        if (jobsResponse.data?.success) {
          setRecommendedJobs(jobsResponse.data.data);
        } else if (Array.isArray(jobsResponse.data)) {
          setRecommendedJobs(jobsResponse.data);
        } else if (jobsResponse.data?.data) {
          setRecommendedJobs(jobsResponse.data.data);
        } else {
          setRecommendedJobs([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback data
        setStats({
          totalApplications: 0,
          pendingReview: 0,
          interviewsScheduled: 0,
          savedJobs: 0,
          profileCompletion: 0
        });
        setRecommendedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApply = (jobId) => {
    window.location.href = `/available-jobs?apply=${jobId}`;
  };

  const handleSave = (jobId, saved) => {
    console.log('Job saved status:', jobId, saved);
  };

  const departmentJobs = [
    { name: 'Computer Science', code: 'CS', count: 28, icon: 'fa-laptop-code' },
    { name: 'Physics', code: 'Physics', count: 24, icon: 'fa-atom' },
    { name: 'Chemistry', code: 'Chemistry', count: 18, icon: 'fa-flask' },
    { name: 'Mathematics', code: 'Math', count: 12, icon: 'fa-square-root-alt' },
    { name: 'Biology', code: 'Biology', count: 15, icon: 'fa-dna' },
    { name: 'Geology', code: 'Geology', count: 6, icon: 'fa-mountain' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
        borderRadius: '12px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        animation: 'slideInUp 0.5s ease-out'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 🎉
          </h2>
          <p style={{ opacity: 0.9 }}>
            {user?.department ? `Showing jobs for ${user.department}` : 'Find your perfect job today'}
          </p>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 20px',
          borderRadius: '30px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Complete Profile ({stats.profileCompletion || 0}%)
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ animation: 'slideInUp 0.6s ease-out' }}>
        <StatCard number={stats.totalApplications || 0} label="Total Applications" icon="fa-file-alt" change={8} />
        <StatCard number={stats.pendingReview || 0} label="Pending Review" icon="fa-clock" subtext="Awaiting response" />
        <StatCard number={stats.interviewsScheduled || 0} label="Interviews" icon="fa-calendar-check" subtext="Next: Tomorrow" />
        <StatCard number={stats.savedJobs || 0} label="Saved Jobs" icon="fa-bookmark" subtext="Ready to apply" />
      </div>

      {/* Recommended Jobs Section */}
      <div style={{ marginBottom: '30px', animation: 'slideInUp 0.7s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>
            <i className="fas fa-star" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
            Recommended For You
          </h3>
          <button 
            onClick={() => window.location.href = '/available-jobs'}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#1E3A5F', 
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            View All <i className="fas fa-arrow-right" style={{ marginLeft: '5px', fontSize: '12px' }}></i>
          </button>
        </div>
        
        {recommendedJobs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recommendedJobs.slice(0, 3).map(job => (
              <JobCard 
                key={job.id} 
                job={{ ...job, match: job.matchScore || job.match || 75 }} 
                onApply={handleApply}
                onSave={handleSave}
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            borderRadius: '12px', 
            padding: '40px', 
            textAlign: 'center' 
          }}>
            <i className="fas fa-search" style={{ fontSize: '40px', color: '#ccc', marginBottom: '15px' }}></i>
            <h4 style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>No recommendations yet</h4>
            <p style={{ color: darkMode ? '#64748b' : '#999' }}>Complete your profile to get personalized job recommendations</p>
          </div>
        )}
      </div>

      {/* Jobs by Department */}
      <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
        <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
          Jobs by Department
        </h3>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {departmentJobs.map(dept => (
            <div 
              key={dept.code} 
              className="stat-card" 
              style={{ 
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: darkMode ? '#1e293b' : 'white'
              }}
              onClick={() => window.location.href = `/available-jobs?department=${dept.code}`}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#E6F0FA',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1E3A5F'
                }}>
                  <i className={`fas ${dept.icon}`}></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{dept.name}</h4>
                  <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>{dept.count} jobs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
