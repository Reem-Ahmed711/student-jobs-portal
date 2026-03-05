import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = {
    totalApplications: 12,
    pendingReview: 5,
    interviewsScheduled: 2,
    savedJobs: 7
  };

  const recommendedJobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      department: 'Physics Department',
      hours: '15 hrs/week',
      deadline: '3 days left',
      match: '92%'
    },
    {
      id: 2,
      title: 'Research Assistant - Quantum',
      department: 'Physics Department',
      hours: '20 hrs/week',
      deadline: '5 days left',
      match: '88%'
    }
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Welcome Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          borderRadius: '12px',
          padding: '25px',
          color: 'white',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 🎉
            </h2>
            <p style={{ opacity: 0.9 }}>You have 2 new job recommendations based on your skills</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            Complete Profile (80%)
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard number={stats.totalApplications} label="Total Applications" icon="fas fa-file-alt" />
          <StatCard number={stats.pendingReview} label="Pending Review" icon="fas fa-clock" />
          <StatCard number={stats.interviewsScheduled} label="Interviews" icon="fas fa-calendar-check" />
          <StatCard number={stats.savedJobs} label="Saved Jobs" icon="fas fa-bookmark" />
        </div>

        {/* Recommended Jobs */}
        <div>
          <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Recommended For You
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recommendedJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label, icon }) => (
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
      width: '48px', height: '48px',
      background: '#e8eef5',
      borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#1E3A5F', fontSize: '20px'
    }}>
      <i className={icon}></i>
    </div>
    <div>
      <h3 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '2px' }}>{number}</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>{label}</p>
    </div>
  </div>
);

const JobCard = ({ job }) => (
  <div style={{
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <h4 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600' }}>{job.title}</h4>
        <span style={{
          background: '#e8eef5',
          padding: '4px 8px',
          borderRadius: '20px',
          fontSize: '12px',
          color: '#1E3A5F'
        }}>
          {job.match} Match
        </span>
      </div>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{job.department}</p>
      <div style={{ display: 'flex', gap: '20px', color: '#999', fontSize: '13px' }}>
        <span><i className="far fa-clock"></i> {job.hours}</span>
        <span><i className="far fa-calendar-alt"></i> {job.deadline}</span>
      </div>
    </div>
    <button style={{
      padding: '8px 20px',
      background: '#1E3A5F',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '20px'
    }}>
      Apply
    </button>
  </div>
);

export default StudentDashboard;