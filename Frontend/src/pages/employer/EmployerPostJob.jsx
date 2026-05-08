// D:\student-jobs-portal\Frontend\src\pages\employer\EmployerPostJob.jsx

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { createJob } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EmployerPostJob = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    department: 'Physics',
    type: 'Part-Time',
    deadline: '',
    description: '',
    responsibilities: [],
    requirements: [],
    skills: [],
    hours: '15',
    duration: 'One Semester',
    compensationType: 'Paid',
    salaryMin: '',
    salaryMax: '',
    benefits: []
  });

  // State للمهارات المضافة
  const [newSkill, setNewSkill] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const allSkills = [
    'Teaching', 'Research', 'Lab Work', 'Data Analysis',
    'Communication', 'Python', 'MATLAB', 'Statistics',
    'JavaScript', 'React', 'Node.js', 'Database'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // إضافة مهارة
  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
  };

  // إضافة مسئولية
  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  // إضافة متطلب
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  // إضافة ميزة
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  // حذف عنصر
  const removeItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // ============== نشر الوظيفة ==============
  const handlePublish = async () => {
    // التحقق من الحقول المطلوبة
    if (!formData.title) {
      setError('Job title is required');
      return;
    }
    if (!formData.description) {
      setError('Job description is required');
      return;
    }
    if (!formData.deadline) {
      setError('Application deadline is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // تجهيز البيانات للإرسال
      const jobData = {
        title: formData.title,
        department: formData.department,
        type: formData.type,
        deadline: formData.deadline,
        description: formData.description,
        responsibilities: formData.responsibilities.filter(r => r.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        skills: formData.skills,
        hours: parseInt(formData.hours),
        duration: formData.duration,
        compensationType: formData.compensationType,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
        benefits: formData.benefits.filter(b => b.trim()),
        employerUid: user?.uid, // مهم جداً! ربط الوظيفة بـ employer
        status: 'pending',
        approved: false
      };

      console.log('📤 Publishing job:', jobData);

      const response = await createJob(jobData);
      console.log('✅ Job created:', response.data);

      if (response.data?.job || response.data?.message) {
        setSuccess('✅ Job posted successfully! It will be reviewed by admin.');
        
        // تأخير صغير ثم التوجيه
        setTimeout(() => {
          window.location.href = '/employer-my-jobs';
        }, 2000);
      } else {
        setError('❌ Failed to post job: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ Error posting job:', err);
      setError(err.response?.data?.error || err.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              gap: '5px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #0B2A4A',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#0B2A4A'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Create New Job Posting
          </h1>
          
          {/* رسائل الخطأ والنجاح */}
          {error && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '8px',
              borderLeft: '4px solid #721c24'
            }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          {success && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: '#d4edda',
              color: '#155724',
              borderRadius: '8px',
              borderLeft: '4px solid #155724'
            }}>
              <i className="fas fa-check-circle"></i> {success}
            </div>
          )}
          
          {/* Steps Indicator */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{
                  height: '4px',
                  background: s <= step ? '#0B2A4A' : '#e0e0e0',
                  borderRadius: '2px',
                  marginBottom: '8px'
                }} />
                <span style={{
                  color: s <= step ? '#0B2A4A' : '#999',
                  fontSize: '12px',
                  fontWeight: s <= step ? '600' : '400'
                }}>
                  {s === 1 ? 'Basic Details' : s === 2 ? 'Requirements' : s === 3 ? 'Skills' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          <div className="card" style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '25px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            animation: 'slideInUp 0.6s ease-out'
          }}>
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Basic Details
                </h3>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Teaching Assistant - Physics 101"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>Biology</option>
                    <option>Computer Science</option>
                    <option>Engineering</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Employment Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option>Part-Time</option>
                    <option>Full-Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the role, responsibilities, and what the position entails..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </>
            )}

            {/* Step 2: Requirements & Responsibilities */}
            {step === 2 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Requirements & Responsibilities
                </h3>

                {/* Responsibilities */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Responsibilities
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="e.g., Prepare course materials"
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={addResponsibility}
                      style={{
                        padding: '10px 20px',
                        background: '#0B2A4A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.responsibilities.map((item, index) => (
                      <span key={index} style={{
                        background: '#E6F0FA',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {item}
                        <button
                          onClick={() => removeItem('responsibilities', index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Requirements
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="e.g., Bachelor's degree in Physics"
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={addRequirement}
                      style={{
                        padding: '10px 20px',
                        background: '#0B2A4A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.requirements.map((item, index) => (
                      <span key={index} style={{
                        background: '#E6F0FA',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {item}
                        <button
                          onClick={() => removeItem('requirements', index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Skills & Schedule */}
            {step === 3 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Skills & Schedule
                </h3>

                {/* Skills */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Required Skills
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Type a skill"
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={() => addSkill(newSkill)}
                      style={{
                        padding: '10px 20px',
                        background: '#0B2A4A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                    {allSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          background: formData.skills.includes(skill) ? '#0B2A4A' : 'white',
                          color: formData.skills.includes(skill) ? 'white' : '#0B2A4A',
                          border: formData.skills.includes(skill) ? 'none' : '1px solid #0B2A4A',
                          cursor: 'pointer'
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  
                  {formData.skills.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <p style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Selected skills:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.skills.map((skill, index) => (
                          <span key={index} style={{
                            background: '#0B2A4A',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {skill}
                            <button
                              onClick={() => removeItem('skills', index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hours per week */}
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Hours per Week: {formData.hours}
                  </label>
                  <input
                    type="range"
                    name="hours"
                    min="0"
                    max="40"
                    value={formData.hours}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Duration */}
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option>One Semester</option>
                    <option>Two Semesters</option>
                    <option>Academic Year</option>
                    <option>Summer Only</option>
                  </select>
                </div>

                {/* Compensation */}
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Compensation Type
                  </label>
                  <select
                    name="compensationType"
                    value={formData.compensationType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Stipend</option>
                  </select>
                </div>

                {/* Benefits */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#0B2A4A', fontWeight: '500' }}>
                    Benefits
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="e.g., Flexible hours"
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={addBenefit}
                      style={{
                        padding: '10px 20px',
                        background: '#0B2A4A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.benefits.map((item, index) => (
                      <span key={index} style={{
                        background: '#E6F0FA',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {item}
                        <button
                          onClick={() => removeItem('benefits', index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Review & Publish */}
            {step === 4 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Review Your Job Posting
                </h3>
                
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Department:</strong> {formData.department}</p>
                  <p><strong>Type:</strong> {formData.type}</p>
                  <p><strong>Deadline:</strong> {formData.deadline}</p>
                  <p><strong>Hours/Week:</strong> {formData.hours}</p>
                  <p><strong>Duration:</strong> {formData.duration}</p>
                  <p><strong>Compensation:</strong> {formData.compensationType}</p>
                  <p><strong>Skills:</strong> {formData.skills.join(', ') || 'None'}</p>
                </div>
                
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <p><strong>Description:</strong></p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{formData.description.substring(0, 200)}...</p>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              {step > 1 && (
                <button 
                  onClick={prevStep} 
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid #0B2A4A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#0B2A4A'
                  }}
                >
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#0B2A4A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: loading ? '#ccc' : '#00C851',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Publishing...</>
                  ) : (
                    <><i className="fas fa-check"></i> Publish Job</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div>
            <div className="card" style={{ 
              position: 'sticky', 
              top: '30px', 
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              animation: 'slideInUp 0.7s ease-out'
            }}>
              <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                Live Preview
              </h3>
              
              <div style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h4 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                  {formData.title || 'Job Title'}
                </h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  {formData.department} Department
                </p>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {formData.type}
                  </span>
                  <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    Hours: {formData.hours}/week
                  </span>
                  <span className="badge" style={{ background: '#E6F0FA', color: '#0B2A4A', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {formData.duration}
                  </span>
                </div>

                {formData.skills.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ color: '#0B2A4A', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                      Required Skills:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {formData.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="skill-tag" style={{ fontSize: '11px', background: '#E6F0FA', padding: '4px 8px', borderRadius: '15px' }}>
                          {skill}
                        </span>
                      ))}
                      {formData.skills.length > 4 && (
                        <span className="skill-tag" style={{ fontSize: '11px' }}>
                          +{formData.skills.length - 4}
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