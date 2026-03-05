// pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
// import { Link } from 'react-router-dom'; // لو هتستخدمي روابط داخلية

const StudentProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'applications', 'saved', 'skills', 'settings'

  // بيانات تجريبية للعرض
  const [stats] = useState({
    totalApplications: 12,
    pendingReview: 5,
    interviewsScheduled: 2,
    savedJobs: 7,
  });

  const [recommendedJobs] = useState([
    { id: 1, title: 'Teaching Assistant - Physics 101', department: 'Physics Department', hours: '15 hrs/week', deadline: '3 days left', match: '92%' },
    { id: 2, title: 'Research Assistant - Quantum', department: 'Physics Department', hours: '20 hrs/week', deadline: '5 days left', match: '88%' },
    { id: 3, title: 'Lab Assistant - General Physics', department: 'Physics Department', hours: '12 hrs/week', deadline: '7 days left', match: '85%' },
  ]);

  const [recentApplications] = useState([
    { id: 1, title: 'Teaching Assistant - Physics 101', department: 'Physics', date: 'Feb 20, 2026', status: 'Pending' },
    { id: 2, title: 'Research Assistant - Organic Chemistry', department: 'Chemistry', date: 'Feb 18, 2026', status: 'Interview' },
    { id: 3, title: 'Lab Supervisor - Biology Lab', department: 'Biology', date: 'Feb 15, 2026', status: 'Accepted' },
  ]);

  if (!user) {
    return <div>Loading...</div>; // or redirect to login
  }

  const userName = user?.name || 'Marium Ahmed';
  const userDepartment = user?.department || 'Physics';
  const userYear = user?.year || '3rd Year';
  const userGpa = user?.gpa || '3.5';
  const userSkills = user?.skills || ['Teaching', 'Research', 'Lab Work', 'Data Analysis', 'Communication', 'Technical Writing'];

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Navbar userType="student" />
      
      <div style={{ marginLeft: '250px', padding: '30px', width: 'calc(100% - 250px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#0B2A4A', fontSize: '20px', fontWeight: '500' }}>Science Faculty</h2>
        </div>

        {/* Profile Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#0B2A4A', marginBottom: '5px' }}>{userName}</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>{userDepartment} {userYear} • Member since Sep 2023</p>
          </div>
          <div style={{
            background: '#E6F0FA',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#0B2A4A',
            fontWeight: '600'
          }}>
            Complete Profile (80%)
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '25px',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px',
          flexWrap: 'wrap'
        }}>
          {['Dashboard', 'Applications History', 'Saved Jobs', 'Skills & CV', 'Settings', 'Notifications'].map(tab => {
            const tabKey = tab.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                style={{
                  background: 'none',
                  color: activeTab === tabKey ? '#0B2A4A' : '#666',
                  border: 'none',
                  borderBottom: activeTab === tabKey ? '3px solid #0B2A4A' : 'none',
                  fontSize: '16px',
                  fontWeight: activeTab === tabKey ? '600' : '400',
                  cursor: 'pointer',
                  padding: '5px 0'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Card */}
            <div style={{
              padding: '25px',
              background: 'linear-gradient(135deg, #0B2A4A 0%, #1e4a7a 100%)',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>Welcome back, {userName.split(' ')[0]}! 🎉</h2>
                <p style={{ opacity: 0.9 }}>You have {recommendedJobs.length} new job recommendations based on your skills</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <StatCard number={stats.totalApplications} label="Total Applications" change="+8% this month" changeColor="#00C851" />
              <StatCard number={stats.pendingReview} label="Pending Review" subtext="Awaiting response" subtextColor="#ffbb33" />
              <StatCard number={stats.interviewsScheduled} label="Interviews Scheduled" subtext="Next: Tomorrow" subtextColor="#0077B5" />
              <StatCard number={stats.savedJobs} label="Saved Jobs" subtext="Ready to apply" subtextColor="#00C851" />
            </div>

            {/* Recommended Jobs */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '20px', fontSize: '20px' }}>Recommended For You</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {recommendedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>

            {/* Recent Applications Table */}
            <div>
              <h3 style={{ color: '#0B2A4A', marginBottom: '20px', fontSize: '20px' }}>Recent Applications</h3>
              <div style={{
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                overflowX: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Job Title</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Department</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Applied Date</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Status</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '15px' }}>{app.title}</td>
                        <td style={{ padding: '15px' }}>{app.department}</td>
                        <td style={{ padding: '15px' }}>{app.date}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: app.status === 'Pending' ? '#fff3cd' : app.status === 'Interview' ? '#d4edda' : '#cce5ff',
                            color: app.status === 'Pending' ? '#856404' : app.status === 'Interview' ? '#155724' : '#004085',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <button style={{ background: 'none', border: 'none', color: '#0B2A4A', cursor: 'pointer', textDecoration: 'underline' }}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Skills & CV Tab */}
        {activeTab === 'skills-&-cv' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#0B2A4A', marginBottom: '20px', fontSize: '20px' }}>Skills & CV</h3>
            
            {/* Skills Section */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#0B2A4A', marginBottom: '15px' }}>Your Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {userSkills.map((skill, index) => (
                  <span key={index} style={{
                    background: '#E6F0FA',
                    color: '#0B2A4A',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
              <button style={{ marginTop: '15px', padding: '8px 16px', background: 'none', border: '1px solid #0B2A4A', borderRadius: '6px', color: '#0B2A4A', cursor: 'pointer' }}>
                + Add New Skill
              </button>
            </div>

            {/* CV Upload Section */}
            <div>
              <h4 style={{ color: '#0B2A4A', marginBottom: '15px' }}>Upload CV</h4>
              <div style={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                background: '#fafafa'
              }}>
                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '40px', color: '#0B2A4A', marginBottom: '10px' }}></i>
                <p style={{ color: '#666', marginBottom: '10px' }}>Drag & drop or <span style={{ color: '#0B2A4A', fontWeight: '600', cursor: 'pointer' }}>browse</span></p>
                <p style={{ color: '#999', fontSize: '14px' }}>PDF only, max 5MB</p>
              </div>
              <p style={{ marginTop: '10px', color: '#00C851' }}>CV_Reem_Ahmed.pdf uploaded</p>
            </div>
          </div>
        )}

        {/* هنا هتضيفي باقي التبويبات بنفس الطريقة: Applications History, Saved Jobs, Settings, Notifications */}

      </div>
    </div>
  );
};

// === مكونات مساعدة (StatCard, JobCard) ===
const StatCard = ({ number, label, change, changeColor, subtext, subtextColor }) => (
  <div style={{
    padding: '20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ fontSize: '28px', color: '#0B2A4A', marginBottom: '5px' }}>{number}</h3>
    <p style={{ color: '#666', marginBottom: '5px' }}>{label}</p>
    {change && <small style={{ color: changeColor }}>{change}</small>}
    {subtext && <small style={{ color: subtextColor }}>{subtext}</small>}
  </div>
);

const JobCard = ({ job }) => (
  <div style={{
    padding: '20px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
      <h4 style={{ color: '#0B2A4A', fontSize: '18px' }}>{job.title}</h4>
      <span style={{ background: '#E6F0FA', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#0B2A4A' }}>
        {job.match}
      </span>
    </div>
    <p style={{ color: '#666', marginBottom: '5px' }}>{job.department}</p>
    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', color: '#666', fontSize: '14px' }}>
      <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i>{job.hours}</span>
      <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>{job.deadline}</span>
    </div>
    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
      <button style={{
        padding: '8px 20px',
        background: '#0B2A4A',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        flex: 1
      }}>
        Quick Apply
      </button>
      <button style={{
        padding: '8px 20px',
        background: 'white',
        color: '#0B2A4A',
        border: '1px solid #0B2A4A',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
      }}>
        <i className="far fa-bookmark"></i>
      </button>
    </div>
  </div>
);

export default StudentProfile;