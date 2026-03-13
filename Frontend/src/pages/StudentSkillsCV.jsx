import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { mockSkills } from '../utils/mockData';

const StudentSkillsCV = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState(user?.skills || [
    'Teaching',
    'Research',
    'Lab Work',
    'Data Analysis',
    'Communication',
    'Technical Writing'
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState('CV_Reem_Ahmed.pdf');

  const allSkills = [
   'Teaching',
  'Research',
  'Lab Work',
  'Data Analysis',
  'Communication',
  'Technical Writing',
  'Python',
  'Java',
  'JavaScript',
  'React',
  'Node.js',
  'HTML/CSS',
  'SQL',
  'Algorithms',
  'Object-Oriented Programming',
  'Git/ Version Control',
  'Front-end Development',
  'Back-end Development',
  'Android Development',
  'iOS Development',
  'Machine Learning',
  'AI',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'TensorFlow',
  'PyTorch',
  'C++',
  'Cybersecurity',
  'Cloud Computing',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Agile Methodologies',
  'MATLAB',
  'Statistics',
  'Organic Chemistry',
  'Physics Lab',
  'Biology Lab'
  ];

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setCvName(file.name);
    } else {
      alert('Please upload a PDF file');
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Skills & CV
          </h1>
          <p style={{ color: '#666' }}>Showcase your skills and experience to employers</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left Column - Skills */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                Your Skills
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#E6F0FA',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ color: '#0B2A4A', fontSize: '14px' }}>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0B2A4A',
                        cursor: 'pointer',
                        fontSize: '12px',
                        opacity: '0.6'
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#0B2A4A', fontWeight: '500' }}>
                  Add New Skill
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., Python"
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={addSkill}
                    style={{
                      padding: '10px 20px',
                      background: '#0B2A4A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Suggested Skills:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allSkills.filter(s => !skills.includes(s)).slice(0, 8).map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSkills([...skills, skill]);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'white',
                        border: '1px dashed #0B2A4A',
                        borderRadius: '30px',
                        color: '#0B2A4A',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - CV Upload */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                Upload CV
              </h3>

              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  background: '#fafafa',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type === 'application/pdf') {
                    setCvFile(file);
                    setCvName(file.name);
                  }
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" style={{ cursor: 'pointer' }}>
                  <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#0B2A4A', marginBottom: '15px' }}></i>
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    Drag & drop or <span style={{ color: '#0B2A4A', fontWeight: '600' }}>browse</span>
                  </p>
                  <p style={{ color: '#999', fontSize: '14px' }}>PDF only, max 5MB</p>
                </label>
              </div>

              {cvFile && (
                <div style={{
                  padding: '15px',
                  background: '#e8f0fe',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-file-pdf" style={{ color: '#ff4444', fontSize: '20px' }}></i>
                    <div>
                      <p style={{ color: '#0B2A4A', fontWeight: '500', marginBottom: '2px' }}>{cvName}</p>
                      <p style={{ color: '#666', fontSize: '12px' }}>Uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCvFile(null)}
                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#0B2A4A', fontSize: '16px', marginBottom: '10px' }}>CV Tips:</h4>
                <ul style={{ color: '#666', fontSize: '14px', paddingLeft: '20px' }}>
                  <li>Keep it to 1-2 pages</li>
                  <li>Highlight relevant coursework and projects</li>
                  <li>Include your GPA if it's above 3.0</li>
                  <li>List technical skills and software proficiency</li>
                </ul>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#00C851',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSkillsCV;