import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const EmployerPostJob = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Physics',
    type: 'Part-Time',
    deadline: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    skills: [],
    hours: '15',
    duration: 'One Semester',
    compensationType: 'Paid',
    salaryMin: '',
    salaryMax: '',
    benefits: []
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  const allSkills = [
    'Teaching', 'Research', 'Lab Work', 'Data Analysis',
    'Communication', 'Python', 'MATLAB', 'Statistics'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline"
            style={{
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Create New Job Posting
          </h1>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{
                  height: '4px',
                  background: s <= step ? '#0B2A4A' : '#e0e0e0',
                  borderRadius: '2px',
                  marginBottom: '8px'
                }} />
                <span style={{
                  color: s <= step ? '#0B2A4A' : '#999',
                  fontSize: '14px',
                  fontWeight: s <= step ? '600' : '400'
                }}>
                  Step {s}: {s === 1 ? 'Details' : s === 2 ? 'Requirements' : 'Preview'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div className="card" style={{ animation: 'slideInUp 0.6s ease-out' }}>
            {step === 1 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Basic Details
                </h3>

                <div className="input-group">
                  <label className="input-label">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Teaching Assistant - Physics 101"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>Biology</option>
                    <option>Geology</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Employment Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>Part-Time</option>
                    <option>Full-Time</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Application Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Job Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the role and what the position entails..."
                    className="input-field"
                    style={{ paddingLeft: '1rem', resize: 'vertical' }}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Skills Needed
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        if (selectedSkills.includes(skill)) {
                          setSelectedSkills(selectedSkills.filter(s => s !== skill));
                        } else {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      className={`skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                      style={{
                        background: selectedSkills.includes(skill) ? '#0B2A4A' : 'white',
                        color: selectedSkills.includes(skill) ? 'white' : '#0B2A4A',
                        border: selectedSkills.includes(skill) ? 'none' : '1px solid #0B2A4A'
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Schedule & Compensation
                </h3>

                <div className="input-group">
                  <label className="input-label">Hours per Week</label>
                  <input
                    type="range"
                    name="hours"
                    min="0"
                    max="30"
                    value={formData.hours}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>0</span>
                    <span style={{ color: '#0B2A4A', fontWeight: '600' }}>{formData.hours} hours</span>
                    <span>30+</span>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>One Semester</option>
                    <option>Two Semesters</option>
                    <option>Academic Year</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Compensation Type *</label>
                  <select
                    name="compensationType"
                    value={formData.compensationType}
                    onChange={handleChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Stipend</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              {step > 1 && (
                <button onClick={prevStep} className="btn btn-outline" style={{ flex: 1 }}>
                  Previous
                </button>
              )}
              <button
                onClick={step < 3 ? nextStep : () => alert('Job Posted Successfully!')}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {step < 3 ? 'Next Step →' : 'Publish Job'}
              </button>
            </div>
          </div>

          <div>
            <div className="card" style={{ position: 'sticky', top: '30px', animation: 'slideInUp 0.7s ease-out' }}>
              <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                Live Preview
              </h3>
              
              <div style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h4 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  {formData.title || 'Teaching Assistant - Physics 101'}
                </h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  {formData.department} Department
                </p>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A' }}>
                    {formData.type}
                  </span>
                  <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A' }}>
                    Hours: {formData.hours} hrs/week
                  </span>
                  <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A' }}>
                    {formData.duration}
                  </span>
                </div>

                {selectedSkills.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ color: '#0B2A4A', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                      Required Skills:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {selectedSkills.slice(0, 3).map(skill => (
                        <span key={skill} className="skill-tag" style={{ fontSize: '11px' }}>{skill}</span>
                      ))}
                      {selectedSkills.length > 3 && (
                        <span className="skill-tag" style={{ fontSize: '11px' }}>
                          +{selectedSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPostJob;