import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const EmployerAIMatching = () => {
  const [selectedJob, setSelectedJob] = useState('physics');
  const [matchThreshold, setMatchThreshold] = useState(70);

  const jobs = [
    { id: 'physics', name: 'Teaching Assistant - Physics 101', applicants: 24 },
    { id: 'quantum', name: 'Research Assistant - Quantum', applicants: 12 },
    { id: 'lab', name: 'Lab Assistant - General Physics', applicants: 18 }
  ];

  const matches = [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Physics',
      matchScore: 94,
      skills: {
        matched: ['Teaching', 'Lab Work', 'Communication', 'Physics'],
        missing: ['Python']
      },
      experience: 'Peer tutor for 2 years',
      gpa: '3.7',
      availability: '15 hrs/week',
      predictedSuccess: 92,
      strengths: ['Excellent communication', 'Strong fundamentals'],
      weaknesses: ['No research experience']
    },
    {
      id: 2,
      name: 'Mariam Ali',
      email: 'mariam.ali@science.cu.edu.eg',
      year: '4th Year',
      department: 'Physics',
      matchScore: 91,
      skills: {
        matched: ['Teaching', 'Physics', 'Communication', 'Lab Work'],
        missing: []
      },
      experience: 'Teaching assistant for 1 semester',
      gpa: '3.9',
      availability: '20 hrs/week',
      predictedSuccess: 95,
      strengths: ['Previous TA experience', 'Excellent grades'],
      weaknesses: ['Limited availability']
    }
  ];

  const filteredMatches = matches.filter(m => m.matchScore >= matchThreshold);

  const getMatchColor = (score) => {
    if (score >= 90) return '#00C851';
    if (score >= 80) return '#ffbb33';
    return '#ff4444';
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600' }}>AI Matching</h1>
            <span style={{
              background: '#0B2A4A',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              BETA
            </span>
          </div>
          <p style={{ color: '#666' }}>Intelligent candidate matching powered by AI</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '25px',
          color: 'white',
          marginBottom: '30px',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-robot"></i>
            AI Insights
          </h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '5px' }}>Top Required Skills</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Teaching', 'Lab Work', 'Physics', 'Communication'].map(skill => (
                  <span key={skill} style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '5px' }}>Avg Match Score</p>
              <p style={{ fontSize: '24px', fontWeight: '700' }}>89%</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.7s ease-out'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontSize: '14px' }}>
              Select Job
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
                  {job.name} ({job.applicants} applicants)
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontSize: '14px' }}>
              Match Threshold: {matchThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={matchThreshold}
              onChange={(e) => setMatchThreshold(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMatches.map(candidate => (
            <div key={candidate.id} className="card" style={{
              borderLeft: `4px solid ${getMatchColor(candidate.matchScore)}`,
              animation: 'slideInUp 0.8s ease-out'
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
                    <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{candidate.name}</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>{candidate.email}</p>
                    <p style={{ color: '#999', fontSize: '13px' }}>GPA: {candidate.gpa} • Available: {candidate.availability}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: '#E6F0FA',
                    padding: '8px 16px',
                    borderRadius: '30px',
                    marginBottom: '5px'
                  }}>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: getMatchColor(candidate.matchScore) }}>
                      {candidate.matchScore}%
                    </span>
                  </div>
                  <span style={{
                    background: '#f0f0f0',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '11px'
                  }}>
                    {candidate.predictedSuccess}% predicted success
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {candidate.skills.matched.map((skill, index) => (
                    <span key={index} style={{
                      padding: '4px 12px',
                      background: '#d4edda',
                      color: '#155724',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>
                      {skill} ✓
                    </span>
                  ))}
                  {candidate.skills.missing.map((skill, index) => (
                    <span key={index} style={{
                      padding: '4px 12px',
                      background: '#f8d7da',
                      color: '#721c24',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>
                      {skill} ✗
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '15px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ color: '#0B2A4A', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    <i className="fas fa-star" style={{ color: '#ffbb33', marginRight: '5px' }}></i>
                    Strengths
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '13px' }}>
                    {candidate.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ color: '#0B2A4A', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#ffbb33', marginRight: '5px' }}></i>
                    Areas to Consider
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '13px' }}>
                    {candidate.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline">
                  <i className="fas fa-chart-line" style={{ marginRight: '5px' }}></i>
                  Full Analysis
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-user-plus" style={{ marginRight: '5px' }}></i>
                  Shortlist
                </button>
                <button className="btn btn-success" style={{ background: '#00C851' }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                  Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerAIMatching;