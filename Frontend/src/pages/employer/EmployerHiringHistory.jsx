// D:\student-jobs-portal\Frontend\src\pages\employer\EmployerHiringHistory.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getHiringHistory, getEmployerStats } from '../../services/api';

const EmployerHiringHistory = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [hiringHistory, setHiringHistory] = useState([]);
  const [stats, setStats] = useState({
    totalHires: 0,
    totalApplicants: 0,
    avgTimeToHire: 0,
    avgMatchScore: 0,
    offerAcceptanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ============== دوال مساعدة للتواريخ ==============
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    try {
      let d;
      if (typeof date.toDate === 'function') {
        d = date.toDate();
      } else if (date && typeof date === 'object' && date.seconds) {
        d = new Date(date.seconds * 1000);
      } else {
        d = new Date(date);
      }
      
      if (isNaN(d.getTime())) return 'N/A';
      
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // فلترة البيانات حسب الفترة الزمنية
  const filterByTimeRange = (data) => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(timeRange) {
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(item => {
      let itemDate;
      if (item.hiredDate?.toDate) {
        itemDate = item.hiredDate.toDate();
      } else if (item.hiredDate && typeof item.hiredDate === 'object' && item.hiredDate.seconds) {
        itemDate = new Date(item.hiredDate.seconds * 1000);
      } else {
        itemDate = new Date(item.hiredDate);
      }
      return itemDate >= cutoffDate;
    });
  };

  // ============== جلب البيانات ==============
  useEffect(() => {
    fetchHiringData();
  }, []);

  const fetchHiringData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log("🔵 Fetching hiring history...");
      
      // جلب hiring history
      const historyResponse = await getHiringHistory();
      console.log("📊 Hiring history response:", historyResponse.data);
      
      let historyData = [];
      if (historyResponse.data?.success && Array.isArray(historyResponse.data?.data)) {
        historyData = historyResponse.data.data;
      } else if (Array.isArray(historyResponse.data)) {
        historyData = historyResponse.data;
      } else if (historyResponse.data?.hiringHistory && Array.isArray(historyResponse.data?.hiringHistory)) {
        historyData = historyResponse.data.hiringHistory;
      }
      
      setHiringHistory(historyData);
      
      // جلب الإحصائيات العامة
      const statsResponse = await getEmployerStats();
      console.log("📈 Stats response:", statsResponse.data);
      
      const statsData = statsResponse.data?.data || statsResponse.data || {};
      
      // حساب الإحصائيات من hiring history
      const totalHires = historyData.length;
      const avgTimeToHire = historyData.length > 0 
        ? Math.round(historyData.reduce((sum, h) => sum + (h.timeToHire || 0), 0) / historyData.length)
        : 0;
      const avgMatchScore = historyData.length > 0
        ? Math.round(historyData.reduce((sum, h) => sum + (h.matchScore || 0), 0) / historyData.length)
        : 0;
      
      setStats({
        totalHires: totalHires,
        totalApplicants: statsData.totalApplications || 0,
        avgTimeToHire: avgTimeToHire,
        avgMatchScore: avgMatchScore,
        offerAcceptanceRate: statsData.totalApplications > 0 
          ? Math.round((totalHires / statsData.totalApplications) * 100)
          : 0
      });
      
    } catch (err) {
      console.error("❌ Error fetching hiring history:", err);
      setError(err.response?.data?.message || 'Failed to load hiring history');
    } finally {
      setLoading(false);
    }
  };

  // تطبيق الفلترة على البيانات
  const filteredHistory = filterByTimeRange(hiringHistory);

  const StatCard = ({ number, label, icon, subtext }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        background: '#E6F0FA',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px'
      }}>
        <i className={`fas ${icon}`} style={{ fontSize: '20px', color: '#1E3A5F' }}></i>
      </div>
      <h3 style={{ fontSize: '24px', color: '#1E3A5F', fontWeight: '700', marginBottom: '5px' }}>
        {number}
      </h3>
      <p style={{ color: '#666', fontSize: '13px', marginBottom: subtext ? '4px' : '0' }}>
        {label}
      </p>
      {subtext && (
        <p style={{ color: '#999', fontSize: '11px' }}>{subtext}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginLeft: '15px', color: '#666' }}>Loading hiring history...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span><i className="fas fa-exclamation-triangle"></i> {error}</span>
            <button 
              onClick={fetchHiringData}
              style={{
                background: '#721c24',
                color: 'white',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Time Range Filter */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          animation: 'slideInUp 0.6s ease-out',
          flexWrap: 'wrap'
        }}>
          {[
            { value: '30days', label: 'Last 30 Days' },
            { value: '90days', label: 'Last 90 Days' },
            { value: 'year', label: 'This Year' },
            { value: 'all', label: 'All Time' }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              style={{
                padding: '8px 20px',
                background: timeRange === range.value ? '#1E3A5F' : 'white',
                color: timeRange === range.value ? 'white' : '#666',
                border: timeRange === range.value ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: timeRange === range.value ? '600' : '400'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
          animation: 'slideInUp 0.7s ease-out'
        }}>
          <StatCard 
            number={stats.totalHires} 
            label="Total Hires" 
            icon="fa-users"
            subtext="Candidates hired"
          />
          <StatCard 
            number={stats.totalApplicants} 
            label="Total Applicants" 
            icon="fa-file-alt"
            subtext="All time"
          />
          <StatCard 
            number={`${stats.avgTimeToHire}d`} 
            label="Avg Time to Hire" 
            icon="fa-clock"
            subtext="From application to offer"
          />
          <StatCard 
            number={`${stats.avgMatchScore}%`} 
            label="Avg Match Score" 
            icon="fa-chart-line"
            subtext="Candidate quality"
          />
          <StatCard 
            number={`${stats.offerAcceptanceRate}%`} 
            label="Offer Acceptance" 
            icon="fa-check-circle"
            subtext="Hires / Applicants"
          />
        </div>

        {/* Hiring History Table */}
        <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
          <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'Hire Found' : 'Hires Found'}
          </h3>
          
          {filteredHistory.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <i className="fas fa-history" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No hiring history yet</h3>
              <p style={{ color: '#999' }}>
                {timeRange === 'all' 
                  ? "You haven't hired anyone yet" 
                  : "No hires in this time period"}
              </p>
              <button 
                onClick={() => window.location.href = '/employer-post-job'}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: '#1E3A5F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-plus"></i> Post a Job
              </button>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
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
                  {filteredHistory.map((hire, index) => (
                    <tr key={hire.id} style={{ borderBottom: index < filteredHistory.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
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
                            fontWeight: '600',
                            color: '#1E3A5F'
                          }}>
                            {hire.candidateName?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '2px' }}>{hire.candidateName}</p>
                            <p style={{ color: '#666', fontSize: '12px' }}>{hire.candidateEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <p style={{ fontWeight: '500', marginBottom: '2px' }}>{hire.position}</p>
                      </td>
                      <td style={{ padding: '15px' }}>{hire.department}</td>
                      <td style={{ padding: '15px' }}>{formatDate(hire.hiredDate)}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          background: '#E6F0FA',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#1E3A5F'
                        }}>
                          {hire.matchScore}%
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          color: hire.timeToHire <= 14 ? '#00C851' : hire.timeToHire <= 30 ? '#f59e0b' : '#ff4444',
                          fontWeight: '500'
                        }}>
                          {hire.timeToHire} days
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          background: '#d4edda',
                          color: '#155724'
                        }}>
                          <i className="fas fa-check-circle" style={{ fontSize: '10px', marginRight: '4px' }}></i>
                          {hire.status}
                            </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Section - Top Performer & Fastest Hire */}
        {filteredHistory.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '5px', opacity: 0.9 }}>🏆 Top Performer</h4>
                <p style={{ fontSize: '20px', fontWeight: '600' }}>
                  {filteredHistory.reduce((max, h) => (h.matchScore || 0) > (max.matchScore || 0) ? h : max, filteredHistory[0])?.candidateName || 'N/A'}
                </p>
                <p style={{ fontSize: '13px', opacity: 0.8 }}>
                  Highest match score: {Math.max(...filteredHistory.map(h => h.matchScore || 0))}%
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '5px', opacity: 0.9 }}>⚡ Fastest Hire</h4>
                <p style={{ fontSize: '20px', fontWeight: '600' }}>
                  {filteredHistory.reduce((min, h) => (h.timeToHire || 999) < (min.timeToHire || 999) ? h : min, filteredHistory[0])?.candidateName || 'N/A'}
                </p>
                <p style={{ fontSize: '13px', opacity: 0.8 }}>
                  Hired in {Math.min(...filteredHistory.map(h => h.timeToHire || 999))} days
                </p>
              </div>
              <div>
                <button 
                  onClick={() => window.location.href = '/employer-post-job'}
                  style={{
                    padding: '10px 20px',
                    background: 'white',
                    color: '#1E3A5F',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <i className="fas fa-plus"></i> Post New Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerHiringHistory;