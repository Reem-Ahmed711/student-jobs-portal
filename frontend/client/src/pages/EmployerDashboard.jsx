import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const EmployerDashboard = () => {
  const { user } = useAuth();

  const stats = {
    activeJobs: 6,
    totalApplicants: 48,
    positionsToFill: 4,
    avgMatchScore: 76
  };

  const activeJobs = [
    { id: 1, title: 'Teaching Assistant - Physics 101', applicants: 24, daysLeft: 5, match: 92 },
    { id: 2, title: 'Research Assistant - Quantum', applicants: 12, daysLeft: 8, match: 88 },
    { id: 3, title: 'Lab Assistant - General Physics', applicants: 18, daysLeft: 3, match: 85 }
  ];

  const recentApplicants = [
    { id: 1, name: 'Ahmed Mohamed', job: 'Teaching Assistant', match: 92, status: 'New' },
    { id: 2, name: 'Sara Ibrahim', job: 'Research Assistant', match: 88, status: 'Reviewed' },
    { id: 3, name: 'Omar Hassan', job: 'Lab Assistant', match: 85, status: 'Contacted' }
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginBottom: '5px' }}>
            Physics Department
          </h1>
          <p style={{ color: '#666' }}>Dr. Sarah Mahmoud, Head of Department</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard number={stats.activeJobs} label="Active Jobs" icon="fas fa-briefcase" />
          <StatCard number={stats.totalApplicants} label="Total Applicants" icon="fas fa-users" />
          <StatCard number={stats.positionsToFill} label="Positions to Fill" icon="fas fa-clock" />
          <StatCard number={`${stats.avgMatchScore}%`} label="Avg Match Score" icon="fas fa-chart-line" />
        </div>

        {/* Quick Action */}
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
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Need to hire someone?</h3>
            <p style={{ opacity: 0.9 }}>Create a new job posting in minutes</p>
          </div>
          <button style={{
            padding: '10px 24px',
            background: 'white',
            color: '#1E3A5F',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + Post New Job
          </button>
        </div>

        {/* Active Jobs */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#1E3A5F', fontSize: '18px', marginBottom: '20px' }}>Active Job Postings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {activeJobs.map(job => (
              <div key={job.id} style={{
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600' }}>{job.title}</h4>
                  <span style={{ color: '#666' }}>{job.applicants} applicants</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#999', fontSize: '14px' }}>{job.daysLeft} days left</span>
                  <span style={{
                    background: '#e8eef5',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#1E3A5F'
                  }}>
                    Top match: {job.match}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div>
          <h3 style={{ color: '#1E3A5F', fontSize: '18px', marginBottom: '20px' }}>Recent Applicants</h3>
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Job</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Match</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map(applicant => (
                  <tr key={applicant.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '15px' }}>{applicant.name}</td>
                    <td style={{ padding: '15px' }}>{applicant.job}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        background: '#e8eef5',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#1E3A5F'
                      }}>
                        {applicant.match}%
                      </span>
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
                  </tr>
                ))}
              </tbody>
            </table>
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

export default EmployerDashboard;