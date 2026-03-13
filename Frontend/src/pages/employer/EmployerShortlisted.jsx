import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

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
      skills: ['Teaching', 'Mathematics', 'Tutoring'],
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
      gpa: '3.9'
    }
  ];

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
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Shortlisted Candidates
          </h1>
          <p style={{ color: '#666' }}>Track candidates in your hiring pipeline</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          {stages.map(stage => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`btn ${selectedStage === stage.id ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '12px 24px',
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
                fontSize: '12px',
                color: selectedStage === stage.id ? 'white' : '#0B2A4A'
              }}>
                {stage.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {shortlisted.map(candidate => {
            const stageColors = getStageColor(candidate.stage);
            return (
              <div key={candidate.id} className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
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
                      <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{candidate.name}</h3>
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
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  
                  <div style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <p style={{ color: '#0B2A4A', fontSize: '14px', marginBottom: '5px' }}>
                      <strong>Feedback:</strong> {candidate.feedback || 'No feedback yet'}
                    </p>
                    {candidate.interviewDate && (
                      <p style={{ color: '#00C851', fontSize: '13px' }}>
                        <i className="fas fa-calendar-check"></i>
                        Interview: {candidate.interviewDate}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline">
                    <i className="fas fa-calendar-alt"></i> Schedule Interview
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-file-alt"></i> Send Offer
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