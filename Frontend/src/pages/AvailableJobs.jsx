// C:\Student-job-portal\Frontend\src\pages\AvailableJobs.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllJobs, applyForJob, getSavedJobs, saveJob, unsaveJob } from '../services/api';

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
  const itemsPerPage = 5;

  const departments = [
    { name: 'Computer Science', count: 28, code: 'CS' },
    { name: 'Physics', count: 24, code: 'Physics' },
    { name: 'Chemistry', count: 18, code: 'Chemistry' },
    { name: 'Mathematics', count: 12, code: 'Math' },
    { name: 'Biology', count: 15, code: 'Biology' },
    { name: 'Geology', count: 6, code: 'Geology' }
  ];

  const jobTypes = [
    'Teaching Assistant',
    'Research Assistant',
    'Lab Assistant',
    'Lab Supervisor',
    'Administrative'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobsResponse = await getAllJobs();
        let jobsData = [];
        if (jobsResponse.data && Array.isArray(jobsResponse.data)) {
          jobsData = jobsResponse.data;
        } else if (jobsResponse.data?.data && Array.isArray(jobsResponse.data.data)) {
          jobsData = jobsResponse.data.data;
        } else {
          jobsData = [];
        }
        
        setJobs(jobsData);
        setFilteredJobs(jobsData);

        try {
          const savedResponse = await getSavedJobs();
          if (savedResponse.data?.data && Array.isArray(savedResponse.data.data)) {
            setSavedJobs(savedResponse.data.data.map(job => job.id));
          } else if (Array.isArray(savedResponse.data)) {
            setSavedJobs(savedResponse.data.map(job => job.id));
          } else {
            setSavedJobs([]);
          }
        } catch (error) {
          console.log('Saved jobs not available');
          setSavedJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setFilteredJobs([]);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        filters.department.some(dept => job.department?.includes(dept))
      );
    }

    if (filters.jobType.length > 0) {
      result = result.filter(job => 
        filters.jobType.includes(job.type)
      );
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
    setFilters({
      department: [],
      jobType: [],
      hours: '',
      minGPA: ''
    });
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
    setApplying(true);
    try {
      await applyForJob({ jobId });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async (jobId, saved) => {
    try {
      if (saved) {
        await saveJob(jobId);
        setSavedJobs([...savedJobs, jobId]);
      } else {
        await unsaveJob(jobId);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
    }
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  if (loading) {
    return (
      <div style={{ display: 'flex', background: darkMode ? '#0f172a' : '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: darkMode ? '#0f172a' : '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ 
        marginLeft: '280px', 
        padding: '30px', 
        width: 'calc(100% - 280px)',
        background: darkMode ? '#0f172a' : '#f8fafc',
        color: darkMode ? '#e2e8f0' : '#334155'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: darkMode ? '#f1f5f9' : '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Available Part-Time Opportunities
          </h1>
          <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
            <i className="fas fa-graduation-cap" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
            {user?.department || 'All Departments'} • {filteredJobs.length} jobs found
          </p>
        </div>

        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '8px',
          padding: '10px 16px',
          marginBottom: '20px',
          border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
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
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: darkMode ? '#1e293b' : 'white',
            border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
            borderRadius: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
            color: darkMode ? '#e2e8f0' : '#1E3A5F'
          }}
        >
          <i className="fas fa-filter"></i>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div style={{ display: 'flex', gap: '30px' }}>
          {showFilters && (
            <div style={{ width: '280px', flexShrink: 0 }}>
              <div style={{
                background: darkMode ? '#1e293b' : 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '16px', fontWeight: '600' }}>Filter Jobs</h3>
                  <button
                    onClick={clearFilters}
                    style={{ background: 'none', border: 'none', color: darkMode ? '#60a5fa' : '#1E3A5F', fontSize: '14px', cursor: 'pointer' }}
                  >
                    Clear all
                  </button>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Department</h4>
                  {departments.map(dept => (
                    <label key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', color: darkMode ? '#cbd5e1' : '#333' }}>
                      <input
                        type="checkbox"
                        checked={filters.department.includes(dept.name)}
                        onChange={() => handleFilterChange('department', dept.name)}
                      />
                      <span style={{ fontSize: '14px' }}>{dept.name}</span>
                      <span style={{ color: darkMode ? '#64748b' : '#999', fontSize: '12px', marginLeft: 'auto' }}>({dept.count})</span>
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Job Type</h4>
                  {jobTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', color: darkMode ? '#cbd5e1' : '#333' }}>
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange('jobType', type)}
                      />
                      <span style={{ fontSize: '14px' }}>{type}</span>
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Hours per Week</h4>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={filters.hours || 0}
                    onChange={(e) => handleFilterChange('hours', e.target.value)}
                    style={{ width: '100%', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: darkMode ? '#94a3b8' : '#666', fontSize: '12px' }}>
                    <span>0</span>
                    <span>{filters.hours || 0} hours</span>
                    <span>30+</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fas fa-list" style={{ marginRight: '5px' }}></i>
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} jobs
              </p>
            </div>

            {filteredJobs.length === 0 ? (
              <div style={{
                background: darkMode ? '#1e293b' : 'white',
                borderRadius: '12px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-search" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
                <h3 style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>No jobs found</h3>
                <p style={{ color: darkMode ? '#64748b' : '#999', marginBottom: '20px' }}>
                  {searchTerm 
                    ? `No jobs matching "${searchTerm}"` 
                    : filters.department.length > 0 || filters.jobType.length > 0
                      ? 'No jobs match your filters' 
                      : 'Check back later for new opportunities'}
                </p>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '12px 24px',
                    background: '#1E3A5F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-redo-alt" style={{ marginRight: '8px' }}></i>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {currentItems.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={{ ...job, match: job.match || Math.floor(Math.random() * 30) + 70 }} 
                      onApply={handleApply}
                      onSave={handleSave}
                      isSaved={isJobSaved(job.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '30px'
                  }}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: darkMode ? '#1e293b' : 'white',
                        color: darkMode ? '#e2e8f0' : '#1E3A5F',
                        border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                        borderRadius: '8px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1
                      }}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          width: '40px',
                          height: '40px',
                          background: currentPage === page ? '#1E3A5F' : (darkMode ? '#1e293b' : 'white'),
                          color: currentPage === page ? 'white' : (darkMode ? '#e2e8f0' : '#1E3A5F'),
                          border: currentPage === page ? 'none' : `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    ))}
                    
                    {totalPages > 5 && <span style={{ color: darkMode ? '#94a3b8' : '#666' }}>...</span>}
                    
                    {totalPages > 5 && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        style={{
                          width: '40px',
                          height: '40px',
                          background: currentPage === totalPages ? '#1E3A5F' : (darkMode ? '#1e293b' : 'white'),
                          color: currentPage === totalPages ? 'white' : (darkMode ? '#e2e8f0' : '#1E3A5F'),
                          border: currentPage === totalPages ? 'none' : `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        {totalPages}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: darkMode ? '#1e293b' : 'white',
                        color: darkMode ? '#e2e8f0' : '#1E3A5F',
                        border: `1px solid ${darkMode ? '#334155' : '#ddd'}`,
                        borderRadius: '8px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.5 : 1
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
      </div>
    </div>
  );
};

export default AvailableJobs;
