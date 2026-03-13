import React, { useState } from 'react';
import Navbar from '../../components/Navbar';  // 👈 نقطتين مش واحدة!

const EmployerHiringHistory = () => {
  const [timeRange, setTimeRange] = useState('30days');

  const stats = {
    totalHires: 8,
    totalApplicants: 124,
    avgTimeToHire: 18,
    avgMatchScore: 76,
    offerAcceptanceRate: 75
  };

  const hires = [
    {
      id: 1,
      name: 'Fatma Ahmed',
      position: 'Teaching Assistant - Physics',
      hiredDate: 'Feb 15, 2026',
      department: 'Physics',
      matchScore: 92,
      timeToHire: 14,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Mohamed Ali',
      position: 'Research Assistant - Chemistry',
      hiredDate: 'Feb 10, 2026',
      department: 'Chemistry',
      matchScore: 88,
      timeToHire: 21,
      status: 'Active'
    }
  ];

  const StatCard = ({ number, label, icon }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-content">
        <h3>{number}</h3>
        <p>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Hiring History
          </h1>
          <p style={{ color: '#666' }}>Track your hiring performance and analytics</p>
        </div>

        {/* Time Range Filter */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          {['30days', '90days', 'year', 'all'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 16px',
                background: timeRange === range ? '#1E3A5F' : 'white',
                color: timeRange === range ? 'white' : '#666',
                border: timeRange === range ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                textTransform: 'capitalize'
              }}
            >
              {range === '30days' ? 'Last 30 Days' : 
               range === '90days' ? 'Last 90 Days' :
               range === 'year' ? 'This Year' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '20px',
          marginBottom: '30px',
          animation: 'slideInUp 0.7s ease-out'
        }}>
          <StatCard number={stats.totalHires} label="Total Hires" icon="fa-users" />
          <StatCard number={stats.totalApplicants} label="Total Applicants" icon="fa-file-alt" />
          <StatCard number={`${stats.avgTimeToHire}d`} label="Avg Time to Hire" icon="fa-clock" />
          <StatCard number={`${stats.avgMatchScore}%`} label="Avg Match Score" icon="fa-chart-line" />
          <StatCard number={`${stats.offerAcceptanceRate}%`} label="Offer Acceptance" icon="fa-check-circle" />
        </div>

        {/* Recent Hires */}
        <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
          <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Recent Hires
          </h3>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Candidate</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Position</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Department</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Hired Date</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Match Score</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Time to Hire</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#1E3A5F' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {hires.map((hire, index) => (
                  <tr key={hire.id} style={{ borderBottom: index < hires.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          background: '#E6F0FA',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          color: '#1E3A5F'
                        }}>
                          {hire.name.charAt(0)}
                        </div>
                        {hire.name}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>{hire.position}</td>
                    <td style={{ padding: '15px' }}>{hire.department}</td>
                    <td style={{ padding: '15px' }}>{hire.hiredDate}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        background: '#E6F0FA',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1E3A5F'
                      }}>
                        {hire.matchScore}%
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>{hire.timeToHire} days</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: hire.status === 'Active' ? '#d4edda' : '#e2e3e5',
                        color: hire.status === 'Active' ? '#155724' : '#383d41'
                      }}>
                        {hire.status}
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

export default EmployerHiringHistory;