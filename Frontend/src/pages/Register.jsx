// client/my-app/src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  'Computer Science',
  'Physics', 
  'Chemistry',
  'Biology',
  'Mathematics',
  'Geology',
  'Biophysics'
];

const YEARS = [
  '1st Year',
  '2nd Year', 
  '3rd Year',
  '4th Year',
  'Graduate'
];

// Computer Science Skills
const CS_SKILLS = [
  'Python',
  'JavaScript',
  'Java',
  'C++',
  'Data Structures',
  'Algorithms',
  'Machine Learning',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'Database Design',
  'Cloud Computing',
  'AI',
  'Cybersecurity',
  'Software Engineering',
  'UI/UX Design',
  'React',
  'Node.js',
  'Django',
  'Flask'
];

// General Skills
const GENERAL_SKILLS = [
  'Teaching',
  'Research',
  'Lab Work',
  'Data Analysis',
  'Communication',
  'Technical Writing',
  'Leadership',
  'Team Work',
  'Problem Solving',
  'Time Management'
];

const ROLES = [
  'Professor',
  'Lab Manager',
  'Head of Department',
  'Administrative Staff',
  'Teaching Staff'
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const queryParams = new URLSearchParams(window.location.search);
  const urlUserType = queryParams.get('type');
  const [userType, setUserType] = useState(urlUserType === 'employer' ? 'employer' : 'student');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [gpa, setGpa] = useState(3.5);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [formProgress, setFormProgress] = useState(0);

  const [formData, setFormData] = useState({
    // Student fields
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    academicYear: '',
    phone: '',
    
    // Employer fields
    institutionName: '',
    officialEmail: '',
    position: '',
    empDepartment: '',
    empPassword: '',
    empConfirmPassword: '',
  });

  // Calculate form progress
  useEffect(() => {
    let filled = 0;
    let total = 0;
    
    if (userType === 'student') {
      const fields = [
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword
      ];
      if (step === 2) {
        fields.push(
          formData.department,
          formData.academicYear
        );
      }
      total = step === 1 ? 4 : 6;
      filled = fields.filter(f => f && f.length > 0).length;
      
      // Add GPA and skills bonus
      if (step === 2) {
        if (gpa > 0) filled += 0.5;
        if (selectedSkills.length > 0) filled += 0.5;
        total += 1;
      }
    } else {
      const fields = [
        formData.institutionName,
        formData.officialEmail,
        formData.position,
        formData.phone,
        formData.empDepartment,
        formData.empPassword,
        formData.empConfirmPassword
      ];
      total = 7;
      filled = fields.filter(f => f && f.length > 0).length;
      
      // Add logo bonus
      if (logoFile) filled += 1;
      total += 1;
    }
    
    setFormProgress(Math.min(100, Math.round((filled / total) * 100)));
  }, [formData, userType, step, gpa, selectedSkills, logoFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength
    if (name === 'password' || name === 'empPassword') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 4) setPasswordStrength('Weak');
    else if (password.length < 8) setPasswordStrength('Medium');
    else {
      // Check for uppercase, number, special character
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*]/.test(password);
      
      if (hasUppercase && hasNumber && hasSpecial) {
        setPasswordStrength('Strong');
      } else {
        setPasswordStrength('Medium');
      }
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (userType === 'student') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        return;
      }
    } else {
      if (formData.empPassword !== formData.empConfirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.empPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!formData.officialEmail.includes('@cu.edu.eg')) {
        setError('Email must end with @cu.edu.eg');
        return;
      }
    }
    
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedTerms) { 
      setError('Please agree to terms and conditions'); 
      return; 
    }
    
    setLoading(true); 
    setError('');
    
    const payload = userType === 'student'
      ? {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: 'student',
          department: formData.department,
          year: formData.academicYear,
          gpa: gpa,
          skills: selectedSkills,
          phone: formData.phone || ''
        }
      : {
          name: formData.fullName || formData.institutionName,
          email: formData.officialEmail,
          password: formData.empPassword,
          role: 'employer',
          institution: formData.institutionName,
          position: formData.position,
          phone: formData.phone,
          department: formData.empDepartment
        };
    
    console.log('📤 Sending to backend:', payload);
    
    const result = await register(payload);
    console.log('📥 Response from backend:', result);
    
    setLoading(false);
    
    if (result.success) {
      console.log('✅ Registration successful! User role:', result.user?.role);
      
      alert(`Welcome ${result.user?.name}! Redirecting to dashboard...`);
      
      if (result.user?.role === 'student') {
        console.log(' Redirecting to student dashboard');
        navigate('/student-dashboard');
      } else if (result.user?.role === 'employer') {
        console.log('Redirecting to employer dashboard');
        navigate('/employer-dashboard');
      } else {
        console.log(' Unknown role, redirecting to login');
        navigate('/login');
      }
    } else {
      console.error(' Registration failed:', result.error);
      setError(result.error || 'Registration failed');
    }
  };

  const strengthColor = {
    Weak: '#ef4444',
    Medium: '#f59e0b',
    Strong: '#16a34a'
  };

  // Get skills based on selected department
  const getRecommendedSkills = () => {
    if (formData.department === 'Computer Science') {
      return CS_SKILLS.slice(0, 8);
    }
    return GENERAL_SKILLS.slice(0, 8);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: "'Segoe UI', sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .left-panel {
          animation: slideInLeft 0.6s ease-out;
        }
        .right-panel {
          animation: slideInRight 0.6s ease-out;
        }
        .progress-bar {
          transition: width 0.5s ease;
        }
        .skill-btn {
          transition: all 0.3s ease;
        }
        .skill-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(30,58,95,0.2);
        }
        .skill-btn.selected {
          animation: pulse 0.3s ease;
        }
        .input-field {
          transition: all 0.3s ease;
        }
        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(30,58,95,0.2);
        }
      `}</style>

      {/* Left panel - Info */}
      <div className="left-panel" style={{
        flex: '1',
        background: 'linear-gradient(135deg, rgba(30,58,95,0.95) 0%, rgba(60,100,150,0.9) 100%), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80") center/cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        
        <div style={{ maxWidth: '500px', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            marginBottom: '2rem',
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Join Cairo University's<br />Official Job Portal
          </h1>
          
          {[
            'Access exclusive on-campus opportunities',
            'Get matched with jobs that fit your skills',
            'Build your career while studying',
            'Connect with departments and faculty',
            'Computer Science students get priority matching'
          ].map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                animation: `slideInLeft ${0.6 + index * 0.2}s ease-out`
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                background: 'rgba(76, 175, 80, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-check" style={{ color: '#4CAF50', fontSize: '14px' }}></i>
              </div>
              <span style={{ opacity: 0.95 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="right-panel" style={{
        flex: '0.9',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            animation: 'fadeIn 0.8s ease-out'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 30px rgba(30,58,95,0.3)'
            }}>
              <i className="fas fa-user-plus" style={{ fontSize: '28px', color: 'white' }}></i>
            </div>
            <h2 style={{ 
              fontSize: '1.8rem', 
              color: '#1E3A5F', 
              fontWeight: '700',
              marginBottom: '0.25rem'
            }}>
              Create Account
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Step {step} of 2
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ 
            marginBottom: '2rem',
            animation: 'fadeIn 1s ease-out'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              color: '#666'
            }}>
              <span>Profile Completion</span>
              <span style={{ fontWeight: '600', color: '#1E3A5F' }}>{formProgress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: '#e0e0e0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div className="progress-bar" style={{
                width: `${formProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #1E3A5F 0%, #2a4a7a 100%)',
                borderRadius: '3px'
              }} />
            </div>
          </div>

          {/* Role toggle */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            background: '#f3f4f6',
            padding: '0.5rem',
            borderRadius: '50px',
            animation: 'fadeIn 1.2s ease-out'
          }}>
            {['student', 'employer'].map(type => (
              <button
                key={type}
                onClick={() => { setUserType(type); setStep(1); setError(''); }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '50px',
                  background: userType === type ? 'white' : 'transparent',
                  color: userType === type ? '#1E3A5F' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: userType === type ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <i className={`fas fa-${type === 'student' ? 'user-graduate' : 'building'}`}></i>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#dc2626',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              animation: 'slideInRight 0.3s ease-out'
            }}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={step === 1 ? handleNext : handleSubmit}>
            {/* STUDENT STEP 1 */}
            {userType === 'student' && step === 1 && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <InputField
                  label="Full Name"
                  name="fullName"
                  placeholder="Ahmed Mohamed"
                  icon="user"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="ahmed@science.cu.edu.eg"
                  icon="envelope"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  Use your @science.cu.edu.eg email
                </p>

                <InputField
                  label="Phone (Optional)"
                  type="tel"
                  name="phone"
                  placeholder="+20 123 456 7890"
                  icon="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <PasswordField
                  label="Password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  strength={passwordStrength}
                  strengthColor={strengthColor}
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  icon="lock"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* STUDENT STEP 2 */}
            {userType === 'student' && step === 2 && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <SelectField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={DEPARTMENTS}
                  placeholder="Select your department"
                  required
                />

                <SelectField
                  label="Academic Year"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  options={YEARS}
                  placeholder="Select your year"
                  required
                />

                <div className="input-group">
                  <label className="input-label">GPA (out of 5.0): {gpa.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.01"
                    value={gpa}
                    onChange={e => setGpa(parseFloat(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: '#1E3A5F',
                      height: '6px',
                      borderRadius: '3px'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>0.0</span>
                    <span style={{ fontSize: '0.8rem', color: '#1E3A5F', fontWeight: '600' }}>
                      {gpa >= 3.5 ? 'Excellent' : gpa >= 3.0 ? 'Good' : gpa >= 2.0 ? 'Satisfactory' : 'Needs Improvement'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>5.0</span>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Skills (Select multiple)</label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {(formData.department === 'Computer Science' ? CS_SKILLS : GENERAL_SKILLS).map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`skill-btn ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                        style={{
                          padding: '0.6rem 1.2rem',
                          borderRadius: '30px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          border: selectedSkills.includes(skill) ? '2px solid #1E3A5F' : '2px solid #e5e7eb',
                          background: selectedSkills.includes(skill) ? '#1E3A5F' : 'white',
                          color: selectedSkills.includes(skill) ? 'white' : '#374151',
                          fontWeight: '500'
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Selected: {selectedSkills.length} skills
                  </p>
                </div>

                <div className="input-group">
                  <label className="input-label">Upload CV (Optional)</label>
                  <div
                    style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      background: '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => document.getElementById('cv-upload').click()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1E3A5F';
                      e.currentTarget.style.background = '#f0f4fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.background = '#f9fafb';
                    }}
                  >
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '0.5rem', display: 'block' }}></i>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                      {cvFile ? cvFile.name : 'Drag & drop or click to browse'}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
                      PDF only, max 5MB
                    </p>
                    <input 
                      id="cv-upload" 
                      type="file" 
                      accept=".pdf" 
                      style={{ display: 'none' }} 
                      onChange={e => setCvFile(e.target.files[0])} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* EMPLOYER STEP 1 */}
            {userType === 'employer' && step === 1 && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <InputField
                  label="Your Institution/Department Name"
                  name="institutionName"
                  placeholder="Computer Science Department"
                  icon="building"
                  value={formData.institutionName}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Official Email"
                  type="email"
                  name="officialEmail"
                  placeholder="cs@cu.edu.eg"
                  icon="envelope"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  required
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  Must end with @cu.edu.eg • You'll receive verification email
                </p>

                <SelectField
                  label="Position/Role"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  options={ROLES}
                  placeholder="Select your role"
                  required
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="+20 123 456 7890"
                  icon="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <SelectField
                  label="Department for Job Posting"
                  name="empDepartment"
                  value={formData.empDepartment}
                  onChange={handleChange}
                  options={DEPARTMENTS}
                  placeholder="Select department where you want to post jobs"
                  required
                />

                <PasswordField
                  label="Password"
                  name="empPassword"
                  placeholder="Create a strong password"
                  value={formData.empPassword}
                  onChange={handleChange}
                  strength={passwordStrength}
                  strengthColor={strengthColor}
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  name="empConfirmPassword"
                  placeholder="Re-enter password"
                  icon="lock"
                  value={formData.empConfirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* EMPLOYER STEP 2 */}
            {userType === 'employer' && step === 2 && (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{
                  background: '#e8f0fe',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: '2rem', color: '#1E3A5F', marginBottom: '0.5rem' }}></i>
                  <p style={{ color: '#1E3A5F', fontSize: '0.95rem', margin: 0 }}>
                    Your account will be verified by the admin before activation.
                  </p>
                </div>

                <div className="input-group">
                  <label className="input-label">Upload Company Logo (Optional)</label>
                  <div
                    style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      background: '#f9fafb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => document.getElementById('logo-upload').click()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1E3A5F';
                      e.currentTarget.style.background = '#f0f4fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.background = '#f9fafb';
                    }}
                  >
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '0.5rem', display: 'block' }}></i>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                      {logoFile ? logoFile.name : 'Upload company logo'}
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
                      PNG, JPG up to 2MB
                    </p>
                    <input 
                      id="logo-upload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={e => setLogoFile(e.target.files[0])} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            {(step === 2 || userType === 'employer') && (
              <div style={{ 
                marginBottom: '1.5rem',
                animation: 'fadeIn 0.7s ease-out'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  color: '#374151'
                }}>
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={e => setAgreedTerms(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#1E3A5F'
                    }}
                  />
                  <span>I agree to the <Link to="/terms" style={{ color: '#1E3A5F', fontWeight: '600' }}>terms and conditions</Link></span>
                </label>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              animation: 'fadeIn 0.9s ease-out'
            }}>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'white',
                    color: '#1E3A5F',
                    border: '2px solid #1E3A5F',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f4fa';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  flex: step === 2 ? 1 : 1,
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(30,58,95,0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(30,58,95,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(30,58,95,0.3)';
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  step === 1 ? 'Next Step →' : 'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Login link */}
          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#6b7280',
            animation: 'fadeIn 1.1s ease-out'
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#1E3A5F',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2a4a7a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A5F'}
            >
              Sign in
            </Link>
          </p>

          {/* Back to home */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.85rem',
            animation: 'fadeIn 1.3s ease-out'
          }}>
            <Link
              to="/"
              style={{
                color: '#9ca3af',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1E3A5F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


const InputField = ({ label, type = 'text', name, placeholder, icon, value, onChange, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <i className={`fas fa-${icon}`} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: isFocused ? '#1E3A5F' : '#9ca3af',
            fontSize: '1rem',
            transition: 'color 0.3s ease',
            zIndex: 1
          }} />
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="input-field"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: `1rem 1rem 1rem ${icon ? '3rem' : '1rem'}`,
            border: '2px solid',
            borderColor: isFocused ? '#1E3A5F' : '#e5e7eb',
            borderRadius: '10px',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            background: isFocused ? 'white' : '#f9fafb',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
};

const PasswordField = ({ label, name, placeholder, value, onChange, strength, strengthColor }) => {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <i className="fas fa-lock" style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: isFocused ? '#1E3A5F' : '#9ca3af',
          fontSize: '1rem',
          transition: 'color 0.3s ease',
          zIndex: 1
        }} />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="input-field"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: '1rem 3rem 1rem 3rem',
            border: '2px solid',
            borderColor: isFocused ? '#1E3A5F' : '#e5e7eb',
            borderRadius: '10px',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            background: isFocused ? 'white' : '#f9fafb',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isFocused ? '#1E3A5F' : '#9ca3af',
            fontSize: '1rem',
            padding: '0.5rem',
            transition: 'color 0.3s ease'
          }}
        >
          <i className={`fas fa-eye${show ? '-slash' : ''}`}></i>
        </button>
      </div>
      {strength && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
            {['Weak', 'Medium', 'Strong'].map((s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: strengthColor[strength] && ['Weak', 'Medium', 'Strong'].indexOf(strength) >= i ? strengthColor[strength] : '#e5e7eb',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.75rem', 
            color: strengthColor[strength],
            fontWeight: '500'
          }}>
            {strength}
          </p>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, options, placeholder, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: '1rem 2.5rem 1rem 1rem',
            border: '2px solid',
            borderColor: isFocused ? '#1E3A5F' : '#e5e7eb',
            borderRadius: '10px',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            background: isFocused ? 'white' : '#f9fafb',
            color: value ? '#374151' : '#9ca3af',
            appearance: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <i className="fas fa-chevron-down" style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: isFocused ? '#1E3A5F' : '#9ca3af',
          fontSize: '0.9rem',
          pointerEvents: 'none',
          transition: 'color 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default Register;
