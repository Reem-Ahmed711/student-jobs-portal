
// C:\Student-job-portal\Frontend\src\pages\AvailableJobs.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllJobs, applyForJob, getSavedJobs, saveJob, unsaveJob, getRecommendedJobsForStudent } from '../services/api';

const AvailableJobs = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [filters, setFilters] = useState({
    department: [],
    jobType: [],
    hours: '',
    minGPA: ''
  });
  const [showFilters, setShowFilters] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applying, setApplying] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // AI Recommendations States
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const itemsPerPage = 6;

  const departments = [
    { name: 'Computer Science', count: 0, code: 'CS', icon: 'fa-laptop-code', color: '#1E3A5F' },
    { name: 'Physics', count: 0, code: 'Physics', icon: 'fa-atom', color: '#4a8ac4' },
    { name: 'Chemistry', count: 0, code: 'Chemistry', icon: 'fa-flask', color: '#10b981' },
    { name: 'Mathematics', count: 0, code: 'Math', icon: 'fa-square-root-alt', color: '#f59e0b' },
    { name: 'Biology', count: 0, code: 'Biology', icon: 'fa-dna', color: '#ef4444' },
    { name: 'Geology', count: 0, code: 'Geology', icon: 'fa-mountain', color: '#8b5cf6' }
  ];

  const jobTypes = [
    'Teaching Assistant', 'Research Assistant', 'Lab Assistant', 
    'Lab Supervisor', 'Administrative', 'Internship'
  ];

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fetch all jobs
  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  // Fetch AI recommendations (only for students)
  useEffect(() => {
    if (user && user.role === 'student') {
      fetchAIRecommendations();
    }
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getAllJobs();
      let jobsData = [];
      
      if (Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        jobsData = response.data.data;
      } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
        jobsData = response.data.jobs;
      } else {
        jobsData = [];
      }
      
      const activeJobs = jobsData.filter(job => 
        job.status !== 'closed' && job.status !== 'rejected'
      );
      
      const deptCounts = {};
      activeJobs.forEach(job => {
        const dept = job.departmentCode || job.department;
        if (dept) deptCounts[dept] = (deptCounts[dept] || 0) + 1;
      });
      departments.forEach(dept => {
        dept.count = deptCounts[dept.code] || deptCounts[dept.name] || 0;
      });
      
      const jobsWithMatch = activeJobs.map(job => ({
        ...job,
        match: job.match || Math.floor(Math.random() * 25) + 70
      }));
      
      setJobs(jobsWithMatch);
      setFilteredJobs(jobsWithMatch);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await getSavedJobs();
      let savedData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        savedData = response.data.data;
      } else if (Array.isArray(response.data)) {
        savedData = response.data;
      }
      setSavedJobs(savedData.map(job => job.id));
    } catch (error) {
      console.log('Saved jobs not available');
    }
  };

  const fetchAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const response = await getRecommendedJobsForStudent();
      const recommended = response.data?.data || [];
      setAiRecommendations(recommended);
    } catch (error) {
      console.log('AI recommendations not available:', error);
      // Mock data for testing if backend not ready
      const mockRecommendations = jobs
        .filter(job => job.department === user?.department)
        .slice(0, 3)
        .map(job => ({
          ...job,
          matchScore: Math.floor(Math.random() * 20) + 75
        }));
      setAiRecommendations(mockRecommendations);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    let result = [...jobs];

    if (searchTerm) {
      result = result.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.department.length > 0) {
      result = result.filter(job => 
        filters.department.some(dept => 
          job.department?.includes(dept) || job.departmentCode === dept
        )
      );
    }

    if (filters.jobType.length > 0) {
      result = result.filter(job => filters.jobType.includes(job.type));
    }

    if (filters.hours) {
      const hoursNum = parseInt(filters.hours);
      result = result.filter(job => {
        const jobHours = parseInt(job.hours);
        return jobHours <= hoursNum;
      });
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [filters, searchTerm, jobs]);

  const handleFilterChange = (type, value) => {
    if (type === 'department' || type === 'jobType') {
      setFilters(prev => ({
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value]
      }));
    } else {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({ department: [], jobType: [], hours: '', minGPA: '' });
    setSearchTerm('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApply = async (jobId) => {
    if (!user) {
      showToast('Please login to apply', 'error');
      return;
    }
    
    setApplying(true);
    try {
      await applyForJob({ jobId });
      showToast('✅ Application submitted successfully!', 'success');
      
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, applicantsCount: (job.applicantsCount || 0) + 1 } : job
      ));
    } catch (error) {
      console.error('Error applying for job:', error);
      showToast(error.response?.data?.error || 'Failed to apply', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async (jobId, saved) => {
    if (!user) {
      showToast('Please login to save jobs', 'error');
      return;
    }
    
    try {
      if (!saved) {
        await saveJob(jobId);
        setSavedJobs([...savedJobs, jobId]);
        showToast('✅ Job saved!', 'success');
      } else {
        await unsaveJob(jobId);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        showToast('✅ Job removed from saved', 'success');
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      showToast('Failed to save job', 'error');
    }
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .filter-section {
          animation: slideInUp 0.5s ease-out;
          transition: all 0.3s ease;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-briefcase" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Available Opportunities
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Find the perfect part-time job that matches your skills
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{filteredJobs.length} Active Jobs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-building" style={{ fontSize: '12px', color: '#1E3A5F' }}></i>
              <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{departments.filter(d => d.count > 0).length} Departments</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-users" style={{ fontSize: '12px', color: '#1E3A5F' }}></i>
              <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Posted by verified employers</span>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {toast.message}
          </div>
        )}

        {/* 🤖 AI RECOMMENDATIONS SECTION - For Students Only */}
        {user && user.role === 'student' && (
          <div style={{ marginBottom: '30px', animation: 'slideInUp 0.45s ease-out' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-robot" style={{ fontSize: '22px', color: 'white' }}></i>
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                    <i className="fas fa-star" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
                    AI-Powered Recommendations
                  </h2>
                  <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                    {user?.skills?.length > 0 
                      ? `Based on your ${user.skills.length} skills and ${user.department || 'department'}`
                      : 'Complete your profile to get personalized matches'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/student-ai-recommendations'}
                style={{
                  padding: '8px 22px',
                  background: 'transparent',
                  border: `1px solid ${darkMode ? '#818cf8' : '#667eea'}`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  color: darkMode ? '#818cf8' : '#667eea',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? '#818cf8' : '#667eea';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#818cf8' : '#667eea';
                }}
              >
                View All AI Matches <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            {loadingAI ? (
              <div style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                borderRadius: '20px', 
                padding: '50px', 
                textAlign: 'center' 
              }}>
                <div className="spinner" style={{ width: '35px', height: '35px', margin: '0 auto', border: '3px solid #f3f3f3', borderTop: '3px solid #667eea', borderRadius: '50%' }}></div>
                <p style={{ marginTop: '15px', color: darkMode ? '#94a3b8' : '#666' }}>Analyzing your profile for best matches...</p>
              </div>
            ) : aiRecommendations.length === 0 ? (
              <div style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                borderRadius: '20px', 
                padding: '40px', 
                textAlign: 'center',
                border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
              }}>
                <i className="fas fa-robot" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#333' }}>No recommendations yet</h3>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666', marginBottom: '15px' }}>
                  {user?.skills?.length === 0 
                    ? 'Add skills to your profile to get AI-powered job matches'
                    : 'Complete your profile information for better recommendations'}
                </p>
                <button
                  onClick={() => window.location.href = '/student-profile'}
                  style={{
                    padding: '10px 24px',
                    background: '#1E3A5F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Complete Profile <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {aiRecommendations.slice(0, 3).map((job, idx) => (
                  <div key={job.id} style={{ position: 'relative' }}>
                    {idx === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '20px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '4px 16px',
                        borderRadius: '30px',
                        fontSize: '11px',
                        fontWeight: '600',
                        zIndex: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}>
                        <i className="fas fa-crown"></i> Best Match
                      </div>
                    )}
                    <JobCard 
                      key={job.id} 
                      job={{ 
                        ...job, 
                        matchScore: job.matchScore || job.match || 85,
                        match: job.matchScore || job.match || 85
                      }} 
                      onApply={handleApply}
                      onSave={handleSave}
                      isSaved={isJobSaved(job.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '16px',
          padding: '12px 20px',
          marginBottom: '20px',
          border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.3s ease'
        }}>
          <i className="fas fa-search" style={{ color: darkMode ? '#64748b' : '#999' }}></i>
          <input
            type="text"
            placeholder="Search by title, department, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              background: 'transparent',
              color: darkMode ? '#e2e8f0' : '#333'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: darkMode ? '#64748b' : '#999', cursor: 'pointer' }}
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            background: darkMode ? '#1e293b' : 'white',
            border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`,
            borderRadius: '40px',
            marginBottom: '20px',
            cursor: 'pointer',
            color: darkMode ? '#e2e8f0' : '#1E3A5F',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
        >
          <i className={`fas fa-${showFilters ? 'eye-slash' : 'filter'}`}></i>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div style={{ display: 'flex', gap: '30px' }}>
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="filter-section" style={{ width: '280px', flexShrink: 0 }}>
              <div style={{
                background: darkMode ? '#1e293b' : 'white',
                borderRadius: '20px',
                padding: '20px',
                position: 'sticky',
                top: '30px',
                border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                    <i className="fas fa-sliders-h" style={{ marginRight: '8px' }}></i>
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: darkMode ? '#60a5fa' : '#1E3A5F',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className="fas fa-redo-alt"></i> Clear all
                  </button>
                </div>

                {/* Department Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#cbd5e1' : '#1E3A5F' }}>
                    <i className="fas fa-building"></i> Department
                  </h4>
                  {departments.map(dept => (
                    <label key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.department.includes(dept.name)}
                        onChange={() => handleFilterChange('department', dept.name)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: darkMode ? '#cbd5e1' : '#333', flex: 1 }}>{dept.name}</span>
                      <span style={{ fontSize: '12px', color: dept.color, fontWeight: '600' }}>{dept.count}</span>
                    </label>
                  ))}
                </div>

                {/* Job Type Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#cbd5e1' : '#1E3A5F' }}>
                    <i className="fas fa-briefcase"></i> Job Type
                  </h4>
                  {jobTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange('jobType', type)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: darkMode ? '#cbd5e1' : '#333' }}>{type}</span>
                    </label>
                  ))}
                </div>

                {/* Hours per Week Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#cbd5e1' : '#1E3A5F' }}>
                    <i className="fas fa-clock"></i> Max Hours/Week
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={filters.hours || 0}
                    onChange={(e) => handleFilterChange('hours', e.target.value)}
                    style={{ width: '100%', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
                    <span>0 hrs</span>
                    <span style={{ fontWeight: '600', color: '#1E3A5F' }}>{filters.hours || 0} hrs</span>
                    <span>30+ hrs</span>
                  </div>
                </div>

                {/* Results Summary */}
                <div style={{
                  padding: '12px',
                  background: darkMode ? '#0f172a' : '#f8f9fa',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                    Found <strong style={{ color: '#1E3A5F' }}>{filteredJobs.length}</strong> jobs matching your criteria
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div style={{ flex: 1 }}>
            {filteredJobs.length === 0 ? (
              <div style={{
                background: darkMode ? '#1e293b' : 'white',
                borderRadius: '20px',
                padding: '60px',
                textAlign: 'center',
                animation: 'slideInUp 0.5s ease-out'
              }}>
                <i className="fas fa-search" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
                <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>No jobs found</h3>
                <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '20px' }}>
                  {searchTerm 
                    ? `No results matching "${searchTerm}"` 
                    : filters.department.length > 0 || filters.jobType.length > 0
                      ? 'Try adjusting your filters to see more opportunities'
                      : 'New jobs are added regularly. Check back soon!'}
                </p>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '12px 28px',
                    background: '#1E3A5F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-redo-alt"></i> Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666' }}>
                    <i className="fas fa-list" style={{ marginRight: '5px' }}></i>
                    Showing <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredJobs.length)}</strong> of <strong>{filteredJobs.length}</strong> jobs
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select style={{
                      padding: '8px 12px',
                      border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                      borderRadius: '8px',
                      background: darkMode ? '#1e293b' : 'white',
                      color: darkMode ? '#e2e8f0' : '#333',
                      fontSize: '13px'
                    }}>
                      <option>Sort by: Relevance</option>
                      <option>Sort by: Newest</option>
                      <option>Sort by: Deadline</option>
                    </select>
                  </div>
                </div>

                {/* Jobs Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {currentItems.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={{ 
                        ...job, 
                        match: job.match || Math.floor(Math.random() * 25) + 70,
                        applicantsCount: job.applicantsCount || job.applicants || 0
                      }} 
                      onApply={handleApply}
                      onSave={handleSave}
                      isSaved={isJobSaved(job.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '30px',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 14px',
                        background: darkMode ? '#1e293b' : 'white',
                        border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                        borderRadius: '10px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        color: darkMode ? '#e2e8f0' : '#333'
                      }}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            minWidth: '36px',
                            height: '36px',
                            padding: '0 8px',
                            background: currentPage === pageNum ? '#1E3A5F' : (darkMode ? '#1e293b' : 'white'),
                            color: currentPage === pageNum ? 'white' : (darkMode ? '#e2e8f0' : '#333'),
                            border: currentPage === pageNum ? 'none' : `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: currentPage === pageNum ? '600' : '400'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '8px 14px',
                        background: darkMode ? '#1e293b' : 'white',
                        border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                        borderRadius: '10px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        color: darkMode ? '#e2e8f0' : '#333'
                      }}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AvailableJobs;
