import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { mockEmployerJobs, mockApplicants } from '../../utils/mockData';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    positionsToFill: 0,
    avgMatchScore: 0
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        activeJobs: 6,
        totalApplicants: 48,
        positionsToFill: 4,
        avgMatchScore: 76
      });
      setRecentApplicants(mockApplicants.slice(0, 4));
      setActiveJobs(mockEmployerJobs);
      setLoading(false);
    }, 1000);
  }, []);

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
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600' }}>Physics Department</h1>
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
          <p style={{ color: '#666' }}>Welcome back, {user?.name || 'Dr. Sarah Mahmoud'}!</p>
        </div>

        <div className="stats-grid">
          <StatCard number={stats.activeJobs} label="Active Jobs" icon="fa-briefcase" change={12} />
          <StatCard number={stats.totalApplicants} label="Total Applicants" icon="fa-users" change={8} />
          <StatCard number={stats.positionsToFill} label="Positions to Fill" icon="fa-clock" />
          <StatCard number={`${stats.avgMatchScore}%`} label="Avg Match Score" icon="fa-chart-line" subtext="Quality applicants" />
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          borderRadius: '12px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Need to hire someone?</h3>
            <p style={{ opacity: 0.9 }}>Create a new job posting in minutes</p>
          </div>
          <button
            onClick={() => window.location.href = '/employer-post-job'}
            className="btn"
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#1E3A5F',
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>Recent Applicants - Top Matched</h3>
              <button 
                onClick={() => window.location.href = '/employer-applicants'}
                style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontWeight: '500' }}
              >
                View All →
              </button>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Applied for</th>
                    <th>Match</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map((applicant, index) => (
                    <tr key={applicant.id}>
                      <td>
                        <div>
                          <p style={{ fontWeight: '500', marginBottom: '2px' }}>{applicant.name}</p>
                          <p style={{ color: '#666', fontSize: '13px' }}>{applicant.year}</p>
                        </div>
                      </td>
                      <td>
                        <p style={{ marginBottom: '2px' }}>{applicant.job}</p>
                        <p style={{ color: '#666', fontSize: '13px' }}>{applicant.department}</p>
                      </td>
                      <td>
                        <div>
                          <span className="badge badge-success" style={{ background: '#E6F0FA', color: '#1E3A5F' }}>
                            {applicant.matchScore}%
                          </span>
                          <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Skills: {applicant.skillsMatch}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${applicant.status.toLowerCase()}`}>
                          {applicant.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}>
                          View
                        </button>
                        <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px', background: '#00C851' }}>
                          Accept
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>Active Job Postings</h3>
              <button 
                onClick={() => window.location.href = '/employer-my-jobs'}
                style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontWeight: '500' }}
              >
                Manage →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeJobs.map(job => (
                <div key={job.id} className="card" style={{
                  padding: '20px',
                  border: job.status === 'Urgent' ? '2px solid #ef4444' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h4 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600' }}>{job.title}</h4>
                    <span className={`badge badge-${job.status.toLowerCase()}`}>
                      {job.applicants} applicants
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        <i className="far fa-clock" style={{ marginRight: '4px' }}></i>
                        {job.daysLeft} days left
                      </span>
                      <span className="badge" style={{ background: '#E6F0FA', color: '#1E3A5F' }}>
                        Top match: {job.matchScore}%
                      </span>
                    </div>
                    
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(job.applicants / 30) * 100}%` }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>
                      View Applicants
                    </button>
                    <button className="btn btn-outline" style={{ padding: '8px 16px' }}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ animation: 'slideInUp 0.9s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>Last 30 Days</h3>
            <button 
              onClick={() => window.location.href = '/employer-hiring-history'}
              style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontWeight: '500' }}
            >
              View Full History →
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Avg Match Score</p>
              <p style={{ fontSize: '24px', color: '#1E3A5F', fontWeight: '600' }}>76%</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Quality applicants</p>
              <p style={{ fontSize: '24px', color: '#1E3A5F', fontWeight: '600' }}>100%</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Hiring Rate</p>
              <p style={{ fontSize: '24px', color: '#1E3A5F', fontWeight: '600' }}>67%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;