import React, { useState } from 'react';
import Navbar from '../components/Navbar';

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
      courses: ['Physics 101', 'Modern Physics', 'Electromagnetism'],
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
      courses: ['Physics 101', 'Quantum Mechanics', 'Thermodynamics'],
      availability: '20 hrs/week',
      predictedSuccess: 95,
      strengths: ['Previous TA experience', 'Excellent grades'],
      weaknesses: ['Limited availability']
    },
    {
      id: 3,
      name: 'Omar Hassan',
      email: 'omar.hassan@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Physics',
      matchScore: 87,
      skills: {
        matched: ['Lab Work', 'Physics', 'Data Analysis'],
        missing: ['Teaching', 'Communication']
      },
      experience: 'Lab assistant for 1 year',
      gpa: '3.5',
      courses: ['Physics 101', 'Lab Techniques', 'Electronics'],
      availability: '12 hrs/week',
      predictedSuccess: 82,
      strengths: ['Strong lab skills', 'Detail-oriented'],
      weaknesses: ['No teaching experience']
    },
    {
      id: 4,
      name: 'Nour Ahmed',
      email: 'nour.ahmed@science.cu.edu.eg',
      year: '4th Year',
      department: 'Physics',
      matchScore: 85,
      skills: {
        matched: ['Teaching', 'Physics', 'Communication'],
        missing: ['Lab Work', 'Python']
      },
      experience: 'Math tutor for 2 years',
      gpa: '3.6',
      courses: ['Physics 101', 'Calculus', 'Linear Algebra'],
      availability: '15 hrs/week',
      predictedSuccess: 80,
      strengths: ['Strong teaching skills', 'Patient'],
      weaknesses: ['Limited lab experience']
    }
  ];

  const filteredMatches = matches.filter(m => m.matchScore >= matchThreshold);

  const getMatchColor = (score) => {
    if (score >= 90) return '#00C851';
    if (score >= 80) return '#ffbb33';
    return '#ff4444';
  };

  const aiInsights = {
    topSkills: ['Teaching', 'Lab Work', 'Physics', 'Communication'],
    avgMatchScore: 89,
    recommendedActions: [
      'Contact top 3 candidates this week',
      'Schedule interviews with Ahmed and Mariam',
      'Consider lowering hours requirement for more matches'
    ]
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
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

        {/* AI Insights Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '25px',
          color: 'white',
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-robot"></i>
              AI Insights
            </h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div>
                <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '5px' }}>Top Required Skills</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {aiInsights.topSkills.map(skill => (
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
                <p style={{ fontSize: '24px', fontWeight: '700' }}>{aiInsights.avgMatchScore}%</p>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>Recommended Actions</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {aiInsights.recommendedActions.map((action, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '13px'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#00C851' }}></i>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          flexWrap: 'wrap'
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
              <span style={{ color: '#666', fontSize: '12px' }}>0%</span>
              <span style={{ color: '#666', fontSize: '12px' }}>50%</span>
              <span style={{ color: '#666', fontSize: '12px' }}>100%</span>
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMatches.map(candidate => (
            <div key={candidate.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${getMatchColor(candidate.matchScore)}`
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
                    <span style={{ color: '#666', fontSize: '12px', marginLeft: '4px' }}>match</span>
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

              {/* Skills Match */}
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

              {/* AI Analysis */}
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

              {/* Actions */}
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
                  <i className="fas fa-chart-line" style={{ marginRight: '5px' }}></i>
                  Full Analysis
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
                  <i className="fas fa-user-plus" style={{ marginRight: '5px' }}></i>
                  Shortlist
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