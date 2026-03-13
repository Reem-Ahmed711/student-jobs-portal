// client/my-app/src/pages/StudentSavedJobs.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getSavedJobs, unsaveJob, applyForJob } from '../services/api';

const StudentSavedJobs = () => {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [applying, setApplying] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const response = await getSavedJobs();
        setSavedJobs(response.data || []);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        // بيانات وهمية في حالة الخطأ
        setSavedJobs([
          {
            id: 1,
            title: 'Teaching Assistant - Physics 101',
            department: 'Physics Department',
            departmentCode: 'Physics',
            hours: '15 hrs/week',
            deadline: '3 days left',
            salary: '2000 EGP/mo',
            savedDate: 'Feb 20, 2026',
            match: 92,
            skills: ['Teaching', 'Lab Work', 'Communication']
          },
          {
            id: 2,
            title: 'Research Assistant - Quantum',
            department: 'Physics Department',
            departmentCode: 'Physics',
            hours: '20 hrs/week',
            deadline: '5 days left',
            salary: '2500 EGP/mo',
            savedDate: 'Feb 18, 2026',
            match: 88,
            skills: ['Research', 'Data Analysis', 'Python']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savedJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(savedJobs.length / itemsPerPage);

  const handleRemove = async (jobId) => {
    try {
      await unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error removing saved job:', error);
      alert('Failed to remove job. Please try again.');
    }
  };

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      await applyForJob({ jobId });
      alert('Application submitted successfully!');
      // بعد التقديم، ممكن نشيلها من المحفوظات أو نخليها
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const StatCard = ({ number, label, icon, color }) => (
    <div className="stat-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '1.5rem'
      }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h3 style={{ fontSize: '1.8rem', color: '#1E3A5F', marginBottom: '0.25rem' }}>{number}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>{label}</p>
      </div>
    </div>
  );

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
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            <i className="fas fa-bookmark" style={{ marginRight: '10px' }}></i>
            Saved Jobs
          </h1>
          <p style={{ color: '#666' }}>
            <i className="fas fa-graduation-cap" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
            {user?.department || 'All Departments'} • {savedJobs.length} saved jobs
          </p>
        </div>

        <div className="stats-grid" style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <StatCard number={savedJobs.length} label="Total Saved" icon="fa-bookmark" color="#1E3A5F" />
          <StatCard number={savedJobs.filter(j => j.match >= 90).length} label="High Match (>90%)" icon="fa-star" color="#16a34a" />
          <StatCard number={savedJobs.length} label="Ready to Apply" icon="fa-paper-plane" color="#0077B5" />
          <StatCard number={savedJobs.filter(j => j.deadline?.includes('days left')).length} label="Active" icon="fa-clock" color="#f59e0b" />
        </div>

        {savedJobs.length === 0 ? (
          <div className="card" style={{
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.7s ease-out'
          }}>
            <i className="fas fa-bookmark" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No saved jobs yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Start exploring and save jobs you're interested in</p>
            <button 
              onClick={() => window.location.href = '/available-jobs'}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
              Browse Available Jobs
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentItems.map(job => (
                <div key={job.id} className="card" style={{ 
                  position: 'relative',
                  animation: 'slideInUp 0.7s ease-out',
                  border: job.match >= 90 ? '2px solid #16a34a20' : 'none'
                }}>
                  <button
                    onClick={() => handleRemove(job.id)}
                    className="btn btn-danger"
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      background: '#ff4444',
                      border: 'none',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      zIndex: 10
                    }}
                  >
                    <i className="fas fa-times"></i>
                    Remove
                  </button>

                  <div style={{ marginRight: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>{job.title}</h3>
                      <span className="badge" style={{ 
                        background: job.match >= 90 ? '#d4edda' : job.match >= 80 ? '#fff3cd' : '#f8d7da',
                        color: job.match >= 90 ? '#155724' : job.match >= 80 ? '#856404' : '#721c24',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-percent" style={{ marginRight: '5px', fontSize: '11px' }}></i>
                        {job.match}% Match
                      </span>
                      <span className="badge" style={{ background: '#E6F0FA', color: '#1E3A5F' }}>
                        <i className="fas fa-building" style={{ marginRight: '5px' }}></i>
                        {job.departmentCode}
                      </span>
                      {job.match >= 90 && (
                        <span className="badge" style={{ background: '#16a34a', color: 'white' }}>
                          <i className="fas fa-star" style={{ marginRight: '5px' }}></i>
                          Top Match
                        </span>
                      )}
                    </div>
                    
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                      <i className="fas fa-building" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
                      {job.department}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                      {job.skills?.map((skill, index) => (
                        <span key={index} className="skill-tag" style={{
                          background: '#E6F0FA',
                          color: '#1E3A5F',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          <i className="fas fa-code" style={{ marginRight: '5px', fontSize: '10px' }}></i>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '15px'
                    }}>
                      <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '14px', flexWrap: 'wrap' }}>
                        <span>
                          <i className="far fa-clock" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
                          {job.hours}
                        </span>
                        <span>
                          <i className="far fa-calendar-alt" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
                          {job.deadline}
                        </span>
                        <span>
                          <i className="fas fa-money-bill-alt" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
                          {job.salary}
                        </span>
                        <span>
                          <i className="far fa-bookmark" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
                          Saved: {job.savedDate}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleApply(job.id)}
                          disabled={applying}
                          className="btn btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <i className="fas fa-paper-plane"></i>
                          {applying ? 'Applying...' : 'Apply Now'}
                        </button>
                        <button 
                          className="btn btn-outline"
                          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <i className="fas fa-eye"></i>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '30px',
                animation: 'slideInUp 0.9s ease-out'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: '0',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      padding: '0',
                      fontWeight: currentPage === page ? '600' : '400'
                    }}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: '0',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentSavedJobs;