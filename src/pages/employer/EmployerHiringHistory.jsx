import React, { useState } from 'react';
import Navbar from '../components/Navbar';

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
    },
    {
      id: 3,
      name: 'Nour Hassan',
      position: 'Lab Assistant - Biology',
      hiredDate: 'Feb 5, 2026',
      department: 'Biology',
      matchScore: 85,
      timeToHire: 16,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Youssef Ibrahim',
      position: 'Teaching Assistant - Math',
      hiredDate: 'Jan 28, 2026',
      department: 'Mathematics',
      matchScore: 90,
      timeToHire: 12,
      status: 'Completed'
    }
  ];

  const monthlyData = [
    { month: 'Jan', applicants: 45, hires: 3, avgMatch: 74 },
    { month: 'Feb', applicants: 52, hires: 4, avgMatch: 78 },
    { month: 'Mar', applicants: 38, hires: 2, avgMatch: 76 }
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Hiring History
          </h1>
          <p style={{ color: '#666' }}>Track your hiring performance and analytics</p>
        </div>

        {/* Time Range Filter */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px'
        }}>
          {['30days', '90days', 'year', 'all'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 16px',
                background: timeRange === range ? '#0B2A4A' : 'white',
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
          marginBottom: '30px'
        }}>
          <HistoryStatCard number={stats.totalHires} label="Total Hires" />
          <HistoryStatCard number={stats.totalApplicants} label="Total Applicants" />
          <HistoryStatCard number={`${stats.avgTimeToHire}d`} label="Avg Time to Hire" />
          <HistoryStatCard number={`${stats.avgMatchScore}%`} label="Avg Match Score" />
          <HistoryStatCard number={`${stats.offerAcceptanceRate}%`} label="Offer Acceptance" />
        </div>

        {/* Monthly Trends */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            Monthly Trends
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {monthlyData.map(data => (
              <div key={data.month} style={{ textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>{data.month}</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '10px' }}>
                  <div>
                    <div style={{
                      width: '40px',
                      height: `${data.applicants}px`,
                      maxHeight: '60px',
                      background: '#E6F0FA',
                      borderRadius: '4px',
                      margin: '0 auto 5px'
                    }} />
                    <p style={{ fontSize: '12px', color: '#666' }}>{data.applicants} apps</p>
                  </div>
                  <div>
                    <div style={{
                      width: '40px',
                      height: `${data.hires * 15}px`,
                      maxHeight: '60px',
                      background: '#0B2A4A',
                      borderRadius: '4px',
                      margin: '0 auto 5px'
                    }} />
                    <p style={{ fontSize: '12px', color: '#666' }}>{data.hires} hires</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#00C851' }}>Match: {data.avgMatch}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Hires */}
        <div>
          <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
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
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Candidate</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Position</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Department</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Hired Date</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Match Score</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Time to Hire</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Status</th>
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
                          color: '#0B2A4A'
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
                        color: '#0B2A4A'
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

const HistoryStatCard = ({ number, label }) => (
  <div style={{
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }}>
    <h3 style={{ fontSize: '24px', color: '#0B2A4A', marginBottom: '5px' }}>{number}</h3>
    <p style={{ color: '#666', fontSize: '13px' }}>{label}</p>
  </div>
);

export default EmployerHiringHistory;