import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();

  const stats = {
    activeJobs: 6,
    totalApplicants: 48,
    positionsToFill: 4,
    avgMatchScore: 76
  };

  const recentApplicants = [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      year: '3rd Year',
      job: 'Teaching Assistant - Physics',
      matchScore: 92,
      skillsMatch: '8/10',
      appliedDate: 'Feb 24',
      status: 'New',
      department: 'Physics'
    },
    {
      id: 2,
      name: 'Sara Ibrahim',
      year: '4th Year',
      job: 'Research Assistant - Chemistry',
      matchScore: 88,
      skillsMatch: '7/9',
      appliedDate: 'Feb 23',
      status: 'Reviewed',
      department: 'Chemistry'
    },
    {
      id: 3,
      name: 'Omar Hassan',
      year: '3rd Year',
      job: 'Lab Supervisor',
      matchScore: 85,
      skillsMatch: '9/10',
      appliedDate: 'Feb 22',
      status: 'Contacted',
      department: 'Biology'
    },
    {
      id: 4,
      name: 'Nour Ahmed',
      year: '4th Year',
      job: 'Teaching Assistant - Math',
      matchScore: 94,
      skillsMatch: '9/10',
      appliedDate: 'Feb 21',
      status: 'New',
      department: 'Mathematics'
    }
  ];

  const activeJobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      applicants: 24,
      daysLeft: 5,
      status: 'Active',
      matchScore: 92
    },
    {
      id: 2,
      title: 'Research Assistant - Quantum',
      applicants: 12,
      daysLeft: 8,
      status: 'Active',
      matchScore: 88
    },
    {
      id: 3,
      title: 'Lab Assistant - General Physics',
      applicants: 18,
      daysLeft: 3,
      status: 'Urgent',
      matchScore: 85
    }
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600' }}>Physics Department</h1>
            <span style={{
              background: '#00C851',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Verified
            </span>
          </div>
          <p style={{ color: '#666' }}>Dr. Sarah Mahmoud, Head of Department</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard
            number={stats.activeJobs}
            label="Active Jobs"
            change="+2 this week"
            icon="fas fa-briefcase"
          />
          <StatCard
            number={stats.totalApplicants}
            label="Total Applicants"
            change="+12 this week"
            icon="fas fa-users"
          />
          <StatCard
            number={stats.positionsToFill}
            label="Positions to Fill"
            icon="fas fa-clock"
          />
          <StatCard
            number={`${stats.avgMatchScore}%`}
            label="Avg Match Score"
            subtext="Quality applicants"
            icon="fas fa-chart-line"
          />
        </div>

        {/* Quick Action */}
        <div style={{
          background: 'linear-gradient(135deg, #0B2A4A 0%, #1e4a7a 100%)',
          borderRadius: '12px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Need to hire someone?</h3>
            <p style={{ opacity: 0.9 }}>Create a new job posting in minutes</p>
          </div>
          <button
            onClick={() => window.location.href = '/employer-post-job'}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#0B2A4A',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Post New Job
          </button>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Recent Applicants */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600' }}>Recent Applicants - Top Matched</h3>
              <button style={{ background: 'none', border: 'none', color: '#0B2A4A', cursor: 'pointer' }}>
                View All →
              </button>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Applicant</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Applied for</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Match</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map((applicant, index) => (
                    <tr key={applicant.id} style={{ borderBottom: index < recentApplicants.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                      <td style={{ padding: '15px' }}>
                        <div>
                          <p style={{ fontWeight: '500', marginBottom: '2px' }}>{applicant.name}</p>
                          <p style={{ color: '#666', fontSize: '13px' }}>{applicant.year}</p>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <p style={{ marginBottom: '2px' }}>{applicant.job}</p>
                        <p style={{ color: '#666', fontSize: '13px' }}>{applicant.department}</p>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div>
                          <span style={{
                            background: '#E6F0FA',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#0B2A4A'
                          }}>
                            {applicant.matchScore}%
                          </span>
                          <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Skills: {applicant.skillsMatch}</p>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          background: applicant.status === 'New' ? '#fff3cd' : 
                                     applicant.status === 'Reviewed' ? '#d4edda' : '#e2d5f1',
                          color: applicant.status === 'New' ? '#856404' : 
                                 applicant.status === 'Reviewed' ? '#155724' : '#4a1b6d'
                        }}>
                          {applicant.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button style={{
                          padding: '6px 12px',
                          background: '#0B2A4A',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginRight: '8px'
                        }}>
                          View
                        </button>
                        <button style={{
                          padding: '6px 12px',
                          background: '#00C851',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}>
                          Accept
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Jobs */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600' }}>Active Job Postings</h3>
              <button style={{ background: 'none', border: 'none', color: '#0B2A4A', cursor: 'pointer' }}>
                Manage →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeJobs.map(job => (
                <div key={job.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: job.status === 'Urgent' ? '2px solid #ff4444' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h4 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{job.title}</h4>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: job.status === 'Active' ? '#d4edda' : '#fff3cd',
                      color: job.status === 'Active' ? '#155724' : '#856404'
                    }}>
                      {job.applicants} applicants
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        <i className="far fa-clock" style={{ marginRight: '4px' }}></i>
                        {job.daysLeft} days left
                      </span>
                      <span style={{
                        background: '#E6F0FA',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#0B2A4A'
                      }}>
                        Top match: {job.matchScore}%
                      </span>
                    </div>
                    
                    <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(job.applicants / 30) * 100}%`,
                        height: '100%',
                        background: '#0B2A4A',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{
                      padding: '8px 16px',
                      background: '#0B2A4A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      flex: 1
                    }}>
                      View Applicants
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#0B2A4A',
                      border: '1px solid #0B2A4A',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiring History Preview */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600' }}>Last 30 Days</h3>
            <button style={{ background: 'none', border: 'none', color: '#0B2A4A', cursor: 'pointer' }}>
              View Full History →
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Avg Match Score</p>
              <p style={{ fontSize: '24px', color: '#0B2A4A', fontWeight: '600' }}>76%</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Quality applicants</p>
              <p style={{ fontSize: '24px', color: '#0B2A4A', fontWeight: '600' }}>100%</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Hiring Rate</p>
              <p style={{ fontSize: '24px', color: '#0B2A4A', fontWeight: '600' }}>67%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label, change, subtext, icon }) => (
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
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '2px' }}>{label}</p>
      {change && <small style={{ color: '#00C851', fontSize: '12px' }}>{change}</small>}
      {subtext && <small style={{ color: '#666', fontSize: '12px' }}>{subtext}</small>}
    </div>
  </div>
);

export default EmployerDashboard;