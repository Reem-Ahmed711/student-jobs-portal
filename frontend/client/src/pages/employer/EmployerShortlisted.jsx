import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const EmployerShortlisted = () => {
  const [selectedStage, setSelectedStage] = useState('all');

  const stages = [
    { id: 'all', name: 'All Stages', count: 8 },
    { id: 'interview', name: 'Interview', count: 3 },
    { id: 'review', name: 'Under Review', count: 3 },
    { id: 'offered', name: 'Offer Sent', count: 2 }
  ];

  const shortlisted = [
    {
      id: 1,
      name: 'Nour Ahmed',
      email: 'nour.ahmed@science.cu.edu.eg',
      year: '4th Year',
      department: 'Mathematics',
      job: 'Teaching Assistant - Calculus',
      matchScore: 94,
      skills: ['Teaching', 'Mathematics', 'Tutoring', 'Statistics'],
      stage: 'Interview',
      interviewDate: 'Mar 3, 2026 - 2:00 PM',
      feedback: 'Strong candidate, excellent communication',
      gpa: '3.8'
    },
    {
      id: 2,
      name: 'Sara Ibrahim',
      email: 'sara.ibrahim@science.cu.edu.eg',
      year: '4th Year',
      department: 'Chemistry',
      job: 'Research Assistant - Chemistry',
      matchScore: 88,
      skills: ['Research', 'Lab Work', 'Data Analysis'],
      stage: 'Under Review',
      interviewDate: null,
      feedback: 'Good research experience',
      gpa: '3.9'
    },
    {
      id: 3,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Physics',
      job: 'Teaching Assistant - Physics',
      matchScore: 92,
      skills: ['Teaching', 'Lab Work', 'Communication'],
      stage: 'Interview',
      interviewDate: 'Mar 4, 2026 - 11:00 AM',
      feedback: 'Great teaching experience',
      gpa: '3.7'
    },
    {
      id: 4,
      name: 'Mariam Ali',
      email: 'mariam.ali@science.cu.edu.eg',
      year: '4th Year',
      department: 'Physics',
      job: 'Research Assistant - Quantum',
      matchScore: 90,
      skills: ['Research', 'Python', 'Data Analysis'],
      stage: 'Offer Sent',
      interviewDate: 'Feb 28, 2026',
      feedback: 'Perfect fit for the role',
      gpa: '3.9'
    }
  ];

  const filteredShortlisted = selectedStage === 'all' 
    ? shortlisted 
    : shortlisted.filter(s => s.stage.toLowerCase() === selectedStage.toLowerCase());

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Interview': return { bg: '#d4edda', color: '#155724' };
      case 'Under Review': return { bg: '#fff3cd', color: '#856404' };
      case 'Offer Sent': return { bg: '#cce5ff', color: '#004085' };
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
            Shortlisted Candidates
          </h1>
          <p style={{ color: '#666' }}>Track candidates in your hiring pipeline</p>
        </div>

        {/* Stage Filters */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {stages.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              style={{
                padding: '12px 24px',
                background: selectedStage === stage.id ? '#0B2A4A' : 'white',
                color: selectedStage === stage.id ? 'white' : '#666',
                border: selectedStage === stage.id ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {stage.name}
              <span style={{
                background: selectedStage === stage.id ? 'rgba(255,255,255,0.2)' : '#E6F0FA',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                {stage.count}
              </span>
            </button>
          ))}
        </div>

        {/* Candidates List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredShortlisted.map(candidate => {
            const stageColors = getStageColor(candidate.stage);
            return (
              <div key={candidate.id} style={{
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
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{candidate.name}</h3>
                        <span style={{
                          padding: '2px 8px',
                          background: '#E6F0FA',
                          borderRadius: '20px',
                          fontSize: '11px',
                          color: '#0B2A4A'
                        }}>
                          {candidate.year}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{candidate.email}</p>
                      <p style={{ color: '#999', fontSize: '13px' }}>{candidate.job} • GPA: {candidate.gpa}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      background: '#E6F0FA',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>{candidate.matchScore}%</span>
                      <span style={{ color: '#666', fontSize: '12px', marginLeft: '4px' }}>match</span>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: stageColors.bg,
                      color: stageColors.color
                    }}>
                      {candidate.stage}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {candidate.skills.map((skill, index) => (
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
                  
                  <div style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <p style={{ color: '#0B2A4A', fontSize: '14px', marginBottom: '5px' }}>
                      <strong>Feedback:</strong> {candidate.feedback}
                    </p>
                    {candidate.interviewDate && (
                      <p style={{ color: '#00C851', fontSize: '13px' }}>
                        <i className="fas fa-calendar-check" style={{ marginRight: '5px' }}></i>
                        Interview: {candidate.interviewDate}
                      </p>
                    )}
                  </div>
                </div>

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
                    <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                    Schedule Interview
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
                    <i className="fas fa-file-alt" style={{ marginRight: '5px' }}></i>
                    Send Offer
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-times"></i>
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

export default EmployerShortlisted;