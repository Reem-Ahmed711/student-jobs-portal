// D:\student-jobs-portal\Frontend\src\pages\employer\EmployerDashboard.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { getEmployerDashboard, getEmployerJobs } from '../../services/api';

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
  const [error, setError] = useState(null);

  // ============== جلب كل بيانات الداشبورد ==============
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("🔵 Fetching dashboard data...");
        
        // 1️⃣ جلب الـ Dashboard الكامل من الباك اند
        const dashboardResponse = await getEmployerDashboard();
        console.log("📊 Dashboard response:", dashboardResponse.data);
        
        // استخراج البيانات من الـ response
        const dashboardData = dashboardResponse.data?.data || dashboardResponse.data || {};
        const profile = dashboardData.profile || {};
        const jobs = dashboardData.jobs || [];
        const statsData = dashboardData.stats || {};
        
        console.log("📋 Jobs from API:", jobs);
        console.log("📈 Stats from API:", statsData);
        
        // 2️⃣ تحديث الإحصائيات
        setStats({
          activeJobs: statsData.totalJobs || 0,
          totalApplicants: statsData.totalApplications || 0,
          positionsToFill: statsData.pending || 0,
          // حساب متوسط نسبة المطابقة (مؤقتاً 0 لحد ما نضيفها للباك اند)
          avgMatchScore: statsData.accepted && statsData.totalApplications 
            ? Math.round((statsData.accepted / statsData.totalApplications) * 100)
            : 0
        });
        
        // 3️⃣ تنسيق الوظائف النشطة للعرض
        const formattedJobs = jobs.map(job => ({
          id: job.id,
          title: job.title || 'Untitled',
          department: job.department || 'General',
          applicants: job.applicantsCount || 0,
          daysLeft: calculateDaysLeft(job.deadline),
          matchScore: job.topMatchScore || 75,
          status: getJobStatus(job)
        }));
        
        setActiveJobs(formattedJobs);
        
        // 4️⃣ جلب الـ recent applicants (منفصل حالياً)
        // هنضيفها بعدين، دلوقتي هنستخدم بيانات تجريبية مؤقتة
        setRecentApplicants([
          {
            id: '1',
            name: 'Ahmed Ali',
            year: '4th Year',
            job: 'Teaching Assistant',
            department: 'Physics',
            matchScore: 92,
            skillsMatch: '8/10',
            status: 'pending',
            appliedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Mona Hassan',
            year: '3rd Year',
            job: 'Research Assistant',
            department: 'Chemistry',
            matchScore: 88,
            skillsMatch: '7/10',
            status: 'pending',
            appliedAt: new Date().toISOString()
          }
        ]);
        
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // ============== دوال مساعدة ==============
  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 30;
    
    // التعامل مع Firebase Timestamp أو string
    let deadlineDate;
    if (deadline && typeof deadline.toDate === 'function') {
      // Firebase Timestamp
      deadlineDate = deadline.toDate();
    } else {
      // String date
      deadlineDate = new Date(deadline);
    }
    
    const days = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  const getJobStatus = (job) => {
    if (job.status === 'active') return 'Active';
    if (job.status === 'urgent') return 'Urgent';
    if (job.deadline && new Date(job.deadline) < new Date()) return 'Expired';
    if (job.status === 'closed') return 'Closed';
    return 'Active';
  };
  
  const handleAccept = async (applicantId) => {
    // هنضيفها بعدين مع rejectApplication
    alert('Feature coming soon!');
  };
  
  // ============== عرض حالة التحميل ==============
  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginLeft: '15px', color: '#666' }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // ============== عرض حالة الخطأ ==============
  if (error) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
            <h3>Error loading dashboard</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: '#721c24',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // ============== الـ UI الرئيسي ==============
  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600' }}>
              {user?.companyName || 'Employer Dashboard'}
            </h1>
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
          <p style={{ color: '#666' }}>Welcome back, {user?.name || 'Employer'}!</p>
        </div>

        {/* Stats Cards - بأرقام حقيقية من Firebase */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard 
            number={stats.activeJobs} 
            label="Active Jobs" 
            icon="fa-briefcase" 
          />
          <StatCard 
            number={stats.totalApplicants} 
            label="Total Applicants" 
            icon="fa-users" 
          />
          <StatCard 
            number={stats.positionsToFill} 
            label="Pending Review" 
            icon="fa-clock" 
          />
          <StatCard 
            number={`${stats.avgMatchScore}%`} 
            label="Hiring Rate" 
            icon="fa-chart-line" 
            subtext="Quality applicants"
          />
        </div>

        {/* Call to Action Banner */}
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

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Recent Applicants Column */}
          <div style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>Recent Applicants</h3>
              <button 
                onClick={() => window.location.href = '/employer-applicants'}
                style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontWeight: '500' }}
              >
                View All →
              </button>
            </div>
            
            <div className="table-container" style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Applicant</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Applied for</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Match</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        No applicants yet
                      </td>
                    </tr>
                  ) : (
                    recentApplicants.map((applicant) => (
                      <tr key={applicant.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '12px' }}>
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '2px' }}>{applicant.name}</p>
                            <p style={{ color: '#666', fontSize: '13px' }}>{applicant.year}</p>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <p style={{ marginBottom: '2px' }}>{applicant.job}</p>
                          <p style={{ color: '#666', fontSize: '13px' }}>{applicant.department}</p>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: '#E6F0FA',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1E3A5F'
                          }}>
                            {applicant.matchScore}%
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}
                            onClick={() => window.location.href = `/employer-applicants?jobId=${applicant.jobId}`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Jobs Column */}
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
              {activeJobs.length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  <i className="fas fa-briefcase" style={{ fontSize: '36px', marginBottom: '10px' }}></i>
                  <p>No active jobs yet</p>
                  <button 
                    onClick={() => window.location.href = '/employer-post-job'}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: '#1E3A5F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                activeJobs.map(job => (
                  <div key={job.id} className="card" style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderLeft: job.status === 'Urgent' ? '4px solid #f59e0b' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <h4 style={{ color: '#1E3A5F', fontSize: '16px', fontWeight: '600' }}>{job.title}</h4>
                      <span style={{
                        background: '#E6F0FA',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#1E3A5F'
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
                          fontSize: '11px',
                          color: '#1E3A5F'
                        }}>
                          Top match: {job.matchScore}%
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: '8px' }}
                        onClick={() => window.location.href = `/employer-applicants?jobId=${job.id}`}
                      >
                        View Applicants
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '8px 16px' }}
                        onClick={() => window.location.href = `/employer-edit-job?id=${job.id}`}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;