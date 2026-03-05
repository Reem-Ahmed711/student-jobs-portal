import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const EmployerApplicants = () => {
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  const jobs = [
    { id: 'all', name: 'All Jobs', count: 48 },
    { id: 'physics', name: 'Teaching Assistant - Physics', count: 24 },
    { id: 'quantum', name: 'Research Assistant - Quantum', count: 12 },
    { id: 'lab', name: 'Lab Assistant - General Physics', count: 12 }
  ];

  const applicants = [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Physics',
      job: 'Teaching Assistant - Physics',
      matchScore: 92,
      skills: ['Teaching', 'Lab Work', 'Communication', 'Python'],
      skillsMatch: '8/10',
      appliedDate: 'Feb 24, 2026',
      status: 'New',
      gpa: '3.7',
      experience: 'Peer tutor for 2 years',
      interviewDate: null
    },
    {
      id: 2,
      name: 'Sara Ibrahim',
      email: 'sara.ibrahim@science.cu.edu.eg',
      year: '4th Year',
      department: 'Chemistry',
      job: 'Research Assistant - Chemistry',
      matchScore: 88,
      skills: ['Research', 'Lab Work', 'Data Analysis', 'MATLAB'],
      skillsMatch: '7/9',
      appliedDate: 'Feb 23, 2026',
      status: 'Reviewed',
      gpa: '3.9',
      experience: 'Research intern at NRC',
      interviewDate: null
    },
    {
      id: 3,
      name: 'Omar Hassan',
      email: 'omar.hassan@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Biology',
      job: 'Lab Supervisor',
      matchScore: 85,
      skills: ['Lab Work', 'Safety', 'Organization', 'Leadership'],
      skillsMatch: '9/10',
      appliedDate: 'Feb 22, 2026',
      status: 'Contacted',
      gpa: '3.5',
      experience: 'Lab assistant for 1 year',
      interviewDate: 'Mar 5, 2026'
    },
    {
      id: 4,
      name: 'Nour Ahmed',
      email: 'nour.ahmed@science.cu.edu.eg',
      year: '4th Year',
      department: 'Mathematics',
      job: 'Teaching Assistant - Math',
      matchScore: 94,
      skills: ['Teaching', 'Mathematics', 'Tutoring', 'Statistics'],
      skillsMatch: '9/10',
      appliedDate: 'Feb 21, 2026',
      status: 'Shortlisted',
      gpa: '3.8',
      experience: 'Math tutor for 3 years',
      interviewDate: 'Mar 3, 2026'
    },
    {
      id: 5,
      name: 'Youssef Ali',
      email: 'youssef.ali@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Physics',
      job: 'Teaching Assistant - Physics',
      matchScore: 78,
      skills: ['Teaching', 'Physics', 'Communication'],
      skillsMatch: '6/10',
      appliedDate: 'Feb 20, 2026',
      status: 'New',
      gpa: '3.2',
      experience: 'No experience',
      interviewDate: null
    }
  ];

  const filteredApplicants = selectedJob === 'all' 
    ? applicants 
    : applicants.filter(a => {
        if (selectedJob === 'physics') return a.job.includes('Teaching Assistant - Physics');
        if (selectedJob === 'quantum') return a.job.includes('Research Assistant - Quantum');
        if (selectedJob === 'lab') return a.job.includes('Lab Assistant');
        return true;
      });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'date') return new Date(b.appliedDate) - new Date(a.appliedDate);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return { bg: '#fff3cd', color: '#856404' };
      case 'Reviewed': return { bg: '#d4edda', color: '#155724' };
      case 'Contacted': return { bg: '#cce5ff', color: '#004085' };
      case 'Shortlisted': return { bg: '#e2d5f1', color: '#4a1b6d' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Applicants Pool
          </h1>
          <p style={{ color: '#666' }}>Review and manage job applicants</p>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontSize: '14px' }}>
                Filter by Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '250px'
                }}
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.name} ({job.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontSize: '14px' }}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="match">Match Score</option>
                <option value="date">Application Date</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sortedApplicants.map(applicant => {
            const statusColors = getStatusColor(applicant.status);
            return (
              <div key={applicant.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: '#E6F0FA',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: '#0B2A4A'
                    }}>
                      {applicant.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{applicant.name}</h3>
                        <span style={{
                          padding: '2px 8px',
                          background: '#E6F0FA',
                          borderRadius: '20px',
                          fontSize: '11px',
                          color: '#0B2A4A'
                        }}>
                          {applicant.year}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{applicant.email}</p>
                      <p style={{ color: '#999', fontSize: '13px' }}>Applied for: {applicant.job}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        background: '#E6F0FA',
                        padding: '8px 16px',
                        borderRadius: '30px',
                        marginBottom: '5px'
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>{applicant.matchScore}%</span>
                        <span style={{ color: '#666', fontSize: '12px', marginLeft: '4px' }}>match</span>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: statusColors.bg,
                        color: statusColors.color
                      }}>
                        {applicant.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ color: '#0B2A4A', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Skills Match: {applicant.skillsMatch}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {applicant.skills.map((skill, index) => (
                      <span key={index} style={{
                        padding: '4px 12px',
                        background: '#f0f0f0',
                        borderRadius: '20px',
                        fontSize: '12px',
                        color: '#555'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '15px',
                  marginBottom: '15px',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>GPA</p>
                    <p style={{ color: '#0B2A4A', fontWeight: '600' }}>{applicant.gpa} / 5.0</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Applied</p>
                    <p style={{ color: '#0B2A4A', fontWeight: '600' }}>{applicant.appliedDate}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Experience</p>
                    <p style={{ color: '#0B2A4A', fontWeight: '600' }}>{applicant.experience}</p>
                  </div>
                </div>

                {applicant.interviewDate && (
                  <div style={{
                    padding: '10px',
                    background: '#d4edda',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <i className="fas fa-calendar-check" style={{ color: '#155724' }}></i>
                    <span style={{ color: '#155724', fontSize: '14px' }}>
                      Interview scheduled: {applicant.interviewDate}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#0B2A4A',
                    border: '1px solid #0B2A4A',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-user" style={{ marginRight: '5px' }}></i>
                    View Profile
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: '#00C851',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-check" style={{ marginRight: '5px' }}></i>
                    Shortlist
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: '#0B2A4A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>
                    Contact
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplicants;