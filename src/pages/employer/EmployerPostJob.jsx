import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const EmployerPostJob = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Basic Details
    title: '',
    department: 'Physics',
    type: 'Part-Time',
    deadline: '',
    description: '',
    // Step 2 - Requirements
    responsibilities: [''],
    requirements: [''],
    skills: [],
    // Step 3 - Schedule & Compensation
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
    'Communication', 'Technical Writing', 'Python', 'MATLAB',
    'Statistics', 'Machine Learning', 'Organic Chemistry',
    'Physics Lab', 'Biology Lab', 'Field Work', 'Safety'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...formData.responsibilities];
    newResponsibilities[index] = value;
    setFormData(prev => ({ ...prev, responsibilities: newResponsibilities }));
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const removeResponsibility = (index) => {
    const newResponsibilities = formData.responsibilities.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, responsibilities: newResponsibilities }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleBenefitChange = (benefit) => {
    if (formData.benefits.includes(benefit)) {
      setFormData(prev => ({
        ...prev,
        benefits: prev.benefits.filter(b => b !== benefit)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefit]
      }));
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: 'none',
              color: '#0B2A4A',
              cursor: 'pointer',
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
          
          {/* Steps */}
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
          {/* Form */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {step === 1 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Basic Details
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
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
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <p style={{ color: '#999', fontSize: '13px', marginTop: '5px' }}>
                    Common titles: Teaching Assistant, Research Assistant, Lab Assistant
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>Biology</option>
                    <option>Geology</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Employment Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option>Part-Time</option>
                    <option>Full-Time</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the role and what the position entails..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Responsibilities
                </h3>

                {formData.responsibilities.map((resp, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                      placeholder={`Responsibility ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        onClick={() => removeResponsibility(index)}
                        style={{
                          padding: '10px',
                          background: 'none',
                          border: '1px solid #ff4444',
                          borderRadius: '6px',
                          color: '#ff4444',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addResponsibility}
                  style={{
                    padding: '10px',
                    background: 'none',
                    border: '1px dashed #0B2A4A',
                    borderRadius: '6px',
                    color: '#0B2A4A',
                    cursor: 'pointer',
                    width: '100%',
                    marginBottom: '30px'
                  }}
                >
                  + Add Another Responsibility
                </button>

                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Requirements
                </h3>

                {formData.requirements.map((req, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        onClick={() => removeRequirement(index)}
                        style={{
                          padding: '10px',
                          background: 'none',
                          border: '1px solid #ff4444',
                          borderRadius: '6px',
                          color: '#ff4444',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRequirement}
                  style={{
                    padding: '10px',
                    background: 'none',
                    border: '1px dashed #0B2A4A',
                    borderRadius: '6px',
                    color: '#0B2A4A',
                    cursor: 'pointer',
                    width: '100%',
                    marginBottom: '30px'
                  }}
                >
                  + Add Another Requirement
                </button>

                <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  Skills Needed
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '8px 16px',
                        background: selectedSkills.includes(skill) ? '#0B2A4A' : 'white',
                        color: selectedSkills.includes(skill) ? 'white' : '#0B2A4A',
                        border: selectedSkills.includes(skill) ? 'none' : '1px solid #0B2A4A',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontSize: '13px'
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Hours per Week
                  </label>
                  <input
                    type="range"
                    name="hours"
                    min="0"
                    max="30"
                    value={formData.hours}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>0</span>
                    <span style={{ color: '#0B2A4A', fontWeight: '600' }}>{formData.hours} hours</span>
                    <span style={{ color: '#666' }}>30+</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Compensation Type *
                  </label>
                  <select
                    name="compensationType"
                    value={formData.compensationType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
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

                {formData.compensationType === 'Paid' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                      Salary Range (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="Min (EGP)"
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="Max (EGP)"
                        style={{
                          flex: 1,
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                    Benefits (Optional)
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.benefits.includes('Flexible Schedule')}
                        onChange={() => handleBenefitChange('Flexible Schedule')}
                      />
                      Flexible Schedule
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.benefits.includes('Remote Work Options')}
                        onChange={() => handleBenefitChange('Remote Work Options')}
                      />
                      Remote Work Options
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.benefits.includes('Training Provided')}
                        onChange={() => handleBenefitChange('Training Provided')}
                      />
                      Training Provided
                    </label>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              {step > 1 && (
                <button
                  onClick={prevStep}
                  style={{
                    padding: '12px 24px',
                    background: 'white',
                    color: '#0B2A4A',
                    border: '1px solid #0B2A4A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px'
                  }}
                >
                  Previous
                </button>
              )}
              <button
                onClick={step < 3 ? nextStep : () => console.log('Publish', formData)}
                style={{
                  padding: '12px 24px',
                  background: '#0B2A4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  flex: 1
                }}
              >
                {step < 3 ? 'Next Step →' : 'Publish Job'}
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '30px'
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
                  {formData.title || 'Teaching Assistant - Physics 101'}
                </h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  {formData.department} Department
                </p>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: '#E6F0FA',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#0B2A4A'
                  }}>
                    {formData.type}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    background: '#E6F0FA',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#0B2A4A'
                  }}>
                    Hours: {formData.hours} hrs/week
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    background: '#E6F0FA',
                    borderRadius: '20px',
                    fontSize: '12px',
                    color: '#0B2A4A'
                  }}>
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
                        <span key={skill} style={{
                          padding: '2px 8px',
                          background: '#f0f0f0',
                          borderRadius: '20px',
                          fontSize: '11px'
                        }}>
                          {skill}
                        </span>
                      ))}
                      {selectedSkills.length > 3 && (
                        <span style={{
                          padding: '2px 8px',
                          background: '#f0f0f0',
                          borderRadius: '20px',
                          fontSize: '11px'
                        }}>
                          +{selectedSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <p style={{ color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
                  This is how your job posting will appear to students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerPostJob;
