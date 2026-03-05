import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const AvailableJobs = () => {
  const [filters, setFilters] = useState({
    department: [],
    jobType: [],
    hours: '',
    minGPA: ''
  });

  const [showFilters, setShowFilters] = useState(true);

  const jobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      department: 'Physics Department',
      type: 'Teaching Assistant',
      hours: '12 hrs/week',
      deadline: 'Apr 15',
      salary: '2000 EGP/mo',
      match: '92%',
      skills: ['Teaching', 'Lab Work', 'Communication'],
      description: 'Help professor with Physics 101 labs and tutorials'
    },
    {
      id: 2,
      title: 'Research Assistant - Organic Chemistry',
      department: 'Chemistry Department',
      type: 'Research Assistant',
      hours: '15 hrs/week',
      deadline: 'Apr 20',
      salary: '2500 EGP/mo',
      match: '88%',
      skills: ['Research', 'Lab Work', 'Data Analysis'],
      description: 'Assist in organic chemistry research projects'
    },
    {
      id: 3,
      title: 'Lab Assistant - General Physics',
      department: 'Physics Department',
      type: 'Lab Assistant',
      hours: '12 hrs/week',
      deadline: 'Apr 18',
      salary: '1800 EGP/mo',
      match: '85%',
      skills: ['Lab Work', 'Safety', 'Organization'],
      description: 'Prepare and maintain physics laboratory equipment'
    },
    {
      id: 4,
      title: 'Data Analyst - Biophysics Research',
      department: 'Biophysics Department',
      type: 'Research Assistant',
      hours: '10 hrs/week',
      deadline: 'Apr 25',
      salary: '2200 EGP/mo',
      match: '90%',
      skills: ['Data Analysis', 'Python', 'Research'],
      description: 'Analyze biophysics research data'
    },
    {
      id: 5,
      title: 'Teaching Assistant - Calculus',
      department: 'Mathematics Department',
      type: 'Teaching Assistant',
      hours: '15 hrs/week',
      deadline: 'Apr 18',
      salary: '2000 EGP/mo',
      match: '78%',
      skills: ['Teaching', 'Mathematics', 'Tutoring'],
      description: 'Assist in calculus tutorials and grading'
    },
    {
      id: 6,
      title: 'Lab Assistant - Geology Field Work',
      department: 'Geology Department',
      type: 'Lab Assistant',
      hours: '12 hrs/week',
      deadline: 'Apr 22',
      salary: '1800 EGP/mo',
      match: '75%',
      skills: ['Field Work', 'Lab Work', 'Physical Fitness'],
      description: 'Assist in geology field trips and lab work'
    }
  ];

  const departments = [
    { name: 'Physics', count: 24 },
    { name: 'Chemistry', count: 18 },
    { name: 'Mathematics', count: 12 },
    { name: 'Biology', count: 15 },
    { name: 'Geology', count: 6 }
  ];

  const jobTypes = [
    'Teaching Assistant',
    'Research Assistant',
    'Lab Supervisor',
    'Administrative',
    'Technical Support'
  ];

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
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Available Part-Time Opportunities
          </h1>
          <p style={{ color: '#666' }}>Discover jobs matching your skills and interests</p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
            color: '#0B2A4A'
          }}
        >
          <i className="fas fa-filter"></i>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div style={{ display: 'flex', gap: '30px' }}>
          {/* Filters Sidebar */}
          {showFilters && (
            <div style={{ width: '280px', flexShrink: 0 }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>Filter Jobs</h3>
                  <button
                    onClick={clearFilters}
                    style={{ background: 'none', border: 'none', color: '#0B2A4A', fontSize: '14px', cursor: 'pointer' }}
                  >
                    Clear all
                  </button>
                </div>

                {/* Department Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#0B2A4A', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Department</h4>
                  {departments.map(dept => (
                    <label key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.department.includes(dept.name)}
                        onChange={() => handleFilterChange('department', dept.name)}
                      />
                      <span style={{ color: '#333', fontSize: '14px' }}>{dept.name}</span>
                      <span style={{ color: '#999', fontSize: '12px', marginLeft: 'auto' }}>({dept.count})</span>
                    </label>
                  ))}
                </div>

                {/* Job Type Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#0B2A4A', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Job Type</h4>
                  {jobTypes.map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange('jobType', type)}
                      />
                      <span style={{ color: '#333', fontSize: '14px' }}>{type}</span>
                    </label>
                  ))}
                </div>

                {/* Hours Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#0B2A4A', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Hours per Week</h4>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={filters.hours || 0}
                    onChange={(e) => handleFilterChange('hours', e.target.value)}
                    style={{ width: '100%', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '12px' }}>
                    <span>0</span>
                    <span>{filters.hours || 0} hours</span>
                    <span>30+</span>
                  </div>
                </div>

                {/* GPA Filter */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#0B2A4A', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Minimum GPA</h4>
                  <select
                    value={filters.minGPA}
                    onChange={(e) => handleFilterChange('minGPA', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Any GPA</option>
                    <option value="2.0">2.0+</option>
                    <option value="2.5">2.5+</option>
                    <option value="3.0">3.0+</option>
                    <option value="3.5">3.5+</option>
                    <option value="4.0">4.0+</option>
                  </select>
                </div>

                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0B2A4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ color: '#666' }}>Showing {jobs.length} jobs</p>
              <select style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}>
                <option>Sort by: Match</option>
                <option>Sort by: Deadline</option>
                <option>Sort by: Salary</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
          <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600' }}>{job.title}</h3>
          <span style={{
            background: '#E6F0FA',
            padding: '4px 8px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#0B2A4A'
          }}>
            {job.match} Match
          </span>
        </div>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{job.department}</p>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '12px' }}>
          {job.skills.map((skill, index) => (
            <span key={index} style={{
              background: '#f0f0f0',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#555'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '14px' }}>
        <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i>{job.hours}</span>
        <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>{job.deadline}</span>
        <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px' }}></i>{job.salary}</span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{
          padding: '8px 20px',
          background: 'white',
          color: '#0B2A4A',
          border: '1px solid #0B2A4A',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          View Details
        </button>
        <button style={{
          padding: '8px 20px',
          background: '#0B2A4A',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Apply
        </button>
      </div>
    </div>
  </div>
);

export default AvailableJobs;