import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const StudentSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      department: 'Physics Department',
      hours: '15 hrs/week',
      deadline: '3 days left',
      salary: '2000 EGP/mo',
      savedDate: 'Feb 20, 2026',
      match: '92%',
      skills: ['Teaching', 'Lab Work', 'Communication']
    },
    {
      id: 2,
      title: 'Research Assistant - Quantum',
      department: 'Physics Department',
      hours: '20 hrs/week',
      deadline: '5 days left',
      salary: '2500 EGP/mo',
      savedDate: 'Feb 18, 2026',
      match: '88%',
      skills: ['Research', 'Data Analysis', 'Python']
    },
    {
      id: 3,
      title: 'Lab Assistant - General Physics',
      department: 'Physics Department',
      hours: '12 hrs/week',
      deadline: '7 days left',
      salary: '1800 EGP/mo',
      savedDate: 'Feb 15, 2026',
      match: '85%',
      skills: ['Lab Work', 'Safety', 'Organization']
    },
    {
      id: 4,
      title: 'Teaching Assistant - Calculus I',
      department: 'Mathematics Department',
      hours: '15 hrs/week',
      deadline: '4 days left',
      salary: '2000 EGP/mo',
      savedDate: 'Feb 10, 2026',
      match: '82%',
      skills: ['Teaching', 'Mathematics', 'Tutoring']
    }
  ]);

  const removeJob = (id) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Saved Jobs
          </h1>
          <p style={{ color: '#666' }}>You have {savedJobs.length} saved jobs</p>
        </div>

        {savedJobs.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-bookmark" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No saved jobs yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Start exploring and save jobs you're interested in</p>
            <button style={{
              padding: '12px 24px',
              background: '#0B2A4A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Browse Available Jobs
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {savedJobs.map(job => (
              <div key={job.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <button
                  onClick={() => removeJob(job.id)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: '#ff4444',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>

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

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '14px', flexWrap: 'wrap' }}>
                    <span><i className="far fa-clock" style={{ marginRight: '5px' }}></i>{job.hours}</span>
                    <span><i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>{job.deadline}</span>
                    <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px' }}></i>{job.salary}</span>
                    <span><i className="far fa-bookmark" style={{ marginRight: '5px' }}></i>Saved: {job.savedDate}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{
                      padding: '8px 20px',
                      background: '#0B2A4A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      Apply Now
                    </button>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSavedJobs;