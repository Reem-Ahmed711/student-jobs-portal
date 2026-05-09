// C:\Student-job-portal\Frontend\src\pages\employer\EmployerPostJob.jsx
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { createJob } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [formData, setFormData] = useState({
    title: '',
    department: 'Computer Science',
    type: 'Part-Time',
    deadline: '',
    description: '',
    requirements: [],
    skills: [],
    hours: '15',
    duration: 'One Semester',
    compensationType: 'Paid',
    salary: '',
    location: ''
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [requirements, setRequirements] = useState(['']);

  const allSkills = [
    'Teaching', 'Research', 'Lab Work', 'Data Analysis', 'Communication',
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js',
    'Machine Learning', 'AI', 'Statistics', 'MATLAB', 'HTML/CSS',
    'SQL', 'Git', 'Problem Solving', 'Leadership', 'Team Work',
    'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask', 'TensorFlow'
  ];

  const departments = ['Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Geology'];
  const jobTypes = ['Part-Time', 'Full-Time', 'Contract', 'Internship', 'Volunteer'];
  const durations = ['One Semester', 'Two Semesters', 'Academic Year', 'Summer Only'];
  const compensations = ['Paid', 'Unpaid', 'Stipend', 'Volunteer'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addRequirement = () => setRequirements([...requirements, '']);
  const updateRequirement = (idx, val) => {
    const newReqs = [...requirements];
    newReqs[idx] = val;
    setRequirements(newReqs);
    setFormData(prev => ({ ...prev, requirements: newReqs.filter(r => r.trim()) }));
  };
  const removeRequirement = (idx) => {
    const newReqs = requirements.filter((_, i) => i !== idx);
    setRequirements(newReqs);
    setFormData(prev => ({ ...prev, requirements: newReqs.filter(r => r.trim()) }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage('❌ Please enter a job title');
      setMessageType('error');
      return false;
    }
    if (!formData.deadline) {
      setMessage('❌ Please select a deadline');
      setMessageType('error');
      return false;
    }
    if (!formData.description.trim()) {
      setMessage('❌ Please enter a job description');
      setMessageType('error');
      return false;
    }
    if (selectedSkills.length === 0) {
      setMessage('⚠️ Please select at least one required skill');
      setMessageType('error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');

    try {
      const jobData = {
        title: formData.title,
        department: formData.department,
        type: formData.type,
        deadline: formData.deadline,
        location: formData.location,
        description: formData.description,
        requirements: requirements.filter(r => r.trim()),
        skills: selectedSkills,
        hours: formData.hours,
        duration: formData.duration,
        compensationType: formData.compensationType,
        salary: formData.salary,
        employerUid: user?.uid,
        postedBy: user?.name || user?.email || 'Employer',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicantsCount: 0,
        views: 0
      };
      
      await createJob(jobData);
      setMessage('✅ Job posted successfully! Students can now see and apply.');
      setMessageType('success');
      
      setTimeout(() => navigate('/employer-my-jobs'), 2000);
    } catch (error) {
      console.error('Error posting job:', error);
      setMessage('❌ Failed to post job. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.title.trim()) {
      setMessage('❌ Please enter a job title');
      setMessageType('error');
      return;
    }
    if (step === 1 && !formData.deadline) {
      setMessage('❌ Please select a deadline');
      setMessageType('error');
      return;
    }
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    color: 'white'
  };

  const cardStyle = {
    background: darkMode ? '#1e293b' : 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`,
    borderRadius: '12px',
    fontSize: '14px',
    background: darkMode ? '#0f172a' : 'white',
    color: darkMode ? '#e2e8f0' : '#333',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: darkMode ? '#94a3b8' : '#666'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: darkMode ? '#f1f5f9' : '#1E3A5F',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${darkMode ? '#334155' : '#E6F0FA'}`
  };

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animated-card {
          animation: slideInUp 0.5s ease-out;
        }
        .skill-btn {
          transition: all 0.2s ease;
        }
        .skill-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <button 
            onClick={() => navigate('/employer-dashboard')} 
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '30px',
              padding: '8px 20px',
              color: 'white',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-plus-circle" style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '5px' }}>
                Create New Job Posting
              </h1>
              <p style={{ opacity: 0.9 }}>Fill out the details to post a new opportunity</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ 
                  height: '4px', 
                  background: s <= step ? 'white' : 'rgba(255,255,255,0.3)', 
                  borderRadius: '2px', 
                  marginBottom: '8px',
                  transition: 'background 0.3s ease'
                }} />
                <span style={{ 
                  fontSize: '13px', 
                  opacity: s <= step ? 1 : 0.6,
                  fontWeight: s <= step ? '600' : '400'
                }}>
                  Step {s}: {s === 1 ? 'Basic Details' : 'Requirements & Submit'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            background: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
          </div>
        )}

        {/* Main Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div className="animated-card" style={cardStyle}>
            {step === 1 && (
              <>
                <h3 style={sectionTitleStyle}>
                  <i className="fas fa-info-circle" style={{ marginRight: '10px' }}></i>
                  Basic Details
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Job Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g., Teaching Assistant - Physics 101" 
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Department *</label>
                    <select name="department" value={formData.department} onChange={handleChange} style={inputStyle}>
                      {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Employment Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                      {jobTypes.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Application Deadline *</label>
                    <input 
                      type="date" 
                      name="deadline" 
                      value={formData.deadline} 
                      onChange={handleChange} 
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      placeholder="Building, Room number" 
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Job Description *</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows="5" 
                    placeholder="Describe the role, responsibilities, and what the candidate will do..." 
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Salary (Optional)</label>
                    <input 
                      type="text" 
                      name="salary" 
                      value={formData.salary} 
                      onChange={handleChange} 
                      placeholder="e.g., 2000 EGP/mo" 
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Hours per Week</label>
                    <input 
                      type="range" 
                      name="hours" 
                      min="0" 
                      max="30" 
                      value={formData.hours} 
                      onChange={handleChange} 
                      style={{ width: '100%', marginTop: '10px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
                      <span>0</span>
                      <span style={{ fontWeight: '600', color: '#1E3A5F' }}>{formData.hours} hours</span>
                      <span>30+</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={sectionTitleStyle}>
                  <i className="fas fa-tasks" style={{ marginRight: '10px' }}></i>
                  Requirements & Skills
                </h3>

                <div style={{ marginBottom: '25px' }}>
                  <label style={labelStyle}>Required Skills *</label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px', 
                    marginBottom: '15px',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    padding: '15px',
                    background: darkMode ? '#0f172a' : '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        className="skill-btn"
                        onClick={() => {
                          if (selectedSkills.includes(skill)) {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          } else {
                            setSelectedSkills([...selectedSkills, skill]);
                          }
                        }}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '30px',
                          background: selectedSkills.includes(skill) ? '#1E3A5F' : (darkMode ? '#1e293b' : 'white'),
                          color: selectedSkills.includes(skill) ? 'white' : '#1E3A5F',
                          border: selectedSkills.includes(skill) ? 'none' : `1px solid ${darkMode ? '#475569' : '#1E3A5F'}`,
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
                    <i className="fas fa-info-circle"></i> Selected: {selectedSkills.length} skills
                  </p>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={labelStyle}>Requirements</label>
                  {requirements.map((req, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateRequirement(idx, e.target.value)}
                        placeholder={`Requirement ${idx + 1}`}
                        style={{ flex: 1, ...inputStyle }}
                      />
                      {requirements.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeRequirement(idx)} 
                          style={{ padding: '12px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addRequirement} 
                    style={{
                      marginTop: '10px',
                      padding: '10px 20px',
                      background: darkMode ? '#334155' : '#E6F0FA',
                      color: '#1E3A5F',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fas fa-plus"></i> Add Requirement
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Duration</label>
                    <select name="duration" value={formData.duration} onChange={handleChange} style={inputStyle}>
                      {durations.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Compensation Type</label>
                    <select name="compensationType" value={formData.compensationType} onChange={handleChange} style={inputStyle}>
                      {compensations.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              {step > 1 && (
                <button onClick={prevStep} style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${darkMode ? '#475569' : '#1E3A5F'}`, borderRadius: '12px', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#1E3A5F', fontWeight: '500' }}>
                  ← Previous
                </button>
              )}
              <button
                onClick={step < 2 ? nextStep : handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Publishing...</>
                ) : (
                  step < 2 ? 'Next Step →' : 'Publish Job'
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="animated-card" style={{ ...cardStyle, position: 'sticky', top: '30px' }}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-eye" style={{ marginRight: '10px' }}></i>
              Live Preview
            </h3>
            
            <div style={{ 
              border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, 
              borderRadius: '16px', 
              padding: '20px',
              background: darkMode ? '#0f172a' : '#fff'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '10px' }}>
                {formData.title || 'Job Title'}
              </h4>
              
              <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666', marginBottom: '15px' }}>
                <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                {formData.department} Department
              </p>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <span style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '4px 12px', borderRadius: '30px', fontSize: '12px' }}>{formData.type}</span>
                <span style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '4px 12px', borderRadius: '30px', fontSize: '12px' }}>Hours: {formData.hours}/week</span>
                <span style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '4px 12px', borderRadius: '30px', fontSize: '12px' }}>{formData.duration}</span>
              </div>

              {formData.salary && (
                <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                  <strong>Salary:</strong> {formData.salary}
                </p>
              )}

              {formData.location && (
                <p style={{ fontSize: '14px', marginBottom: '15px' }}>
                  <strong>Location:</strong> {formData.location}
                </p>
              )}

              {formData.deadline && (
                <p style={{ fontSize: '14px', marginBottom: '15px', color: '#ef4444' }}>
                  <strong>Deadline:</strong> {new Date(formData.deadline).toLocaleDateString()}
                </p>
              )}

              {selectedSkills.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Required Skills:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedSkills.slice(0, 6).map(skill => (
                      <span key={skill} style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>{skill}</span>
                    ))}
                    {selectedSkills.length > 6 && (
                      <span style={{ fontSize: '11px', color: '#999' }}>+{selectedSkills.length - 6}</span>
                    )}
                  </div>
                </div>
              )}

              {formData.description && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Description:</p>
                  <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666', lineHeight: '1.5' }}>
                    {formData.description.length > 120 
                      ? formData.description.substring(0, 120) + '...' 
                      : formData.description}
                  </p>
                </div>
              )}

              <div style={{ 
                marginTop: '15px', 
                paddingTop: '15px', 
                borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`,
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#999' }}>
                  <i className="fas fa-globe"></i> Will be visible to all students
                </span>
              </div>
            </div>

            {/* Tips */}
            <div style={{ marginTop: '20px', padding: '15px', background: darkMode ? '#0f172a' : '#f8f9fa', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-lightbulb" style={{ color: '#f59e0b' }}></i>
                <strong>Pro Tip:</strong> Add clear requirements and competitive salary to attract more qualified candidates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployerPostJob;
