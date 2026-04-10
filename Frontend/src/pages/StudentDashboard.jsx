// client/my-app/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getRecommendedJobs, getStudentStats } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  
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
        const statsResponse = await getStudentStats();
        setStats(statsResponse.data || {
          totalApplications: 12,
          pendingReview: 5,
          interviewsScheduled: 2,
          savedJobs: 7,
          profileCompletion: 80
        });

        const jobsResponse = await getRecommendedJobs();
        setRecommendedJobs(jobsResponse.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalApplications: 12,
          pendingReview: 5,
          interviewsScheduled: 2,
          savedJobs: 7,
          profileCompletion: 80
        });
        
        setRecommendedJobs([
          {
            id: 1,
            title: 'Teaching Assistant - Physics 101',
            department: 'Physics Department',
            hours: '15 hrs/week',
            deadline: '3 days left',
            salary: '2000 EGP/mo',
            match: 92,
            skills: ['Teaching', 'Lab Work', 'Communication']
          },
          {
            id: 2,
            title: 'Research Assistant - Quantum',
            department: 'Physics Department',
            hours: '20 hrs/week',
            deadline: '5 days left',
            salary: '2500 EGP/mo',
            match: 88,
            skills: ['Research', 'Data Analysis', 'Python']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleApply = (jobId) => {
    console.log('Applying for job:', jobId);
    window.location.href = `/apply/${jobId}`;
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
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          borderRadius: '12px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 🎉
            </h2>
            <p style={{ opacity: 0.9 }}>
              Showing jobs for <strong>{user?.department || 'your department'}</strong>
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Complete Profile ({stats.profileCompletion}%)
          </div>
        </div>

        <div className="stats-grid" style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <StatCard number={stats.totalApplications} label="Total Applications" icon="fa-file-alt" change={8} />
          <StatCard number={stats.pendingReview} label="Pending Review" icon="fa-clock" subtext="Awaiting response" />
          <StatCard number={stats.interviewsScheduled} label="Interviews" icon="fa-calendar-check" subtext="Next: Tomorrow" />
          <StatCard number={stats.savedJobs} label="Saved Jobs" icon="fa-bookmark" subtext="Ready to apply" />
        </div>

        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.7s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>
              <i className="fas fa-star" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
              Recommended For You
              {user?.department && (
                <span style={{
                  marginLeft: '10px',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#666'
                }}>
                  ({user.department})
                </span>
              )}
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
              {recommendedJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onApply={handleApply}
                  onSave={handleSave}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-search" style={{ fontSize: '40px', color: '#ccc', marginBottom: '15px' }}></i>
              <h4 style={{ color: '#666', marginBottom: '10px' }}>No jobs found for your department</h4>
              <p style={{ color: '#999' }}>Check back later or browse all available jobs</p>
            </div>
          )}
        </div>

        <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>
              <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
              Jobs by Department
            </h3>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {departmentJobs.map(dept => (
              <div key={dept.code} className="stat-card" style={{ 
                padding: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => window.location.href = `/available-jobs?dept=${dept.code}`}
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
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1E3A5F' }}>{dept.name}</h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>{dept.count} jobs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;