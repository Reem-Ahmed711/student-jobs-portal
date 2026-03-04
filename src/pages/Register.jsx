import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SKILLS = ['Teaching', 'Research', 'Lab Work', 'Data Analysis', 'Communication', 'Technical Writing', 'Python', 'MATLAB'];
const DEPARTMENTS = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Geology', 'Biophysics'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];
const ROLES = ['Professor', 'Lab Manager', 'Head of Department', 'Administrative Staff', 'Teaching Staff'];

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
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [gpa, setGpa] = useState(3.5);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    department: '', academicYear: '', phone: '',
    institutionName: '', officialEmail: '', position: '', empDepartment: '',
    empPassword: '', empConfirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password' || name === 'empPassword') {
      if (value.length < 6) setPasswordStrength('Weak');
      else if (value.length < 10) setPasswordStrength('Medium');
      else setPasswordStrength('Strong');
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (userType === 'student') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else {
      if (formData.empPassword !== formData.empConfirmPassword) {
        setError('Passwords do not match');
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
          skills: selectedSkills
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
    
    const result = await register(payload);
    setLoading(false);
    
    if (result.success) {
      console.log('Registration successful, user:', result.user);
      if (userType === 'student') {
          if (userType === 'student') {
            navigate('/student-dashboard');
          } else {
            navigate('/employer-dashboard');
          }      } else {
        navigate('/employer-dashboard');
      }
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const strengthColor = { Weak: '#ef4444', Medium: '#f59e0b', Strong: '#16a34a' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 44%', position: 'sticky', top: 0, height: '100vh',
        background: 'linear-gradient(rgba(11,42,74,0.72), rgba(11,42,74,0.72)), url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cairo_University_Faculty_of_Science_Entrance.jpg/1280px-Cairo_University_Faculty_of_Science_Entrance.jpg") center/cover no-repeat',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', color: 'white',
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', lineHeight: '1.25', marginBottom: '24px' }}>
          Join Cairo University's<br />Official Job Portal
        </h1>
        {['Access exclusive on-campus opportunities', 'Get matched with jobs that fit your skills', 'Build your career while studying', 'Connect with departments and faculty'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
            <i className="fas fa-check" style={{ marginTop: '3px', color: '#7dd3fc' }}></i>
            <span style={{ fontSize: '15px', opacity: 0.92 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#f5f6fa', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 40px' }}>
        <div style={{ width: '100%', maxWidth: '540px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '20px' }}>

            <h2 style={{ color: '#1E3A5F', fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Create Your Account</h2>

            {/* Progress bar */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Step {step} of 2</p>
              <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: step === 1 ? '50%' : '100%', background: '#1E3A5F', borderRadius: '99px', transition: 'width 0.3s' }}></div>
              </div>
            </div>

            {/* Toggle student/employer */}
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
              {['student', 'employer'].map(type => (
                <button key={type} onClick={() => { setUserType(type); setStep(1); setError(''); }}
                  style={{
                    flex: 1, padding: '9px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                    background: userType === type ? 'white' : 'transparent',
                    color: userType === type ? '#1E3A5F' : '#6b7280',
                    boxShadow: userType === type ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                  <i className={`fas fa-${type === 'student' ? 'user-graduate' : 'building'}`}></i>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#dc2626', fontSize: '14px' }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>{error}
              </div>
            )}

            {/* STUDENT STEP 1 */}
            {userType === 'student' && step === 1 && (
              <form onSubmit={handleNext}>
                <Field label="Full Name" name="fullName" placeholder="Ahmed Mohamed" icon="user" value={formData.fullName} onChange={handleChange} required />
                <Field label="Email" name="email" type="email" placeholder="Use university email" icon="envelope" value={formData.email} onChange={handleChange} required />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '-10px', marginBottom: '14px' }}>Use your @science.cu.edu.eg email</p>
                <PasswordField label="Password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} strength={passwordStrength} strengthColor={strengthColor} />
                <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter password" icon="lock" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit" style={primaryBtnStyle}>Next Step →</button>
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                  Already have an account? <Link to="/login" style={{ color: '#1E3A5F', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
                </p>
              </form>
            )}

            {/* STUDENT STEP 2 */}
            {userType === 'student' && step === 2 && (
              <form onSubmit={handleSubmit}>
                <SelectField label="Department" name="department" value={formData.department} onChange={handleChange} options={DEPARTMENTS} placeholder="Select your department" required />
                <SelectField label="Academic Year" name="academicYear" value={formData.academicYear} onChange={handleChange} options={YEARS} placeholder="Select your year" required />

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>GPA: {gpa}</label>
                  <input type="range" min="0" max="4" step="0.1" value={gpa} onChange={e => setGpa(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#1E3A5F' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SKILLS.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
                          border: `1.5px solid ${selectedSkills.includes(skill) ? '#1E3A5F' : '#e5e7eb'}`,
                          background: selectedSkills.includes(skill) ? '#1E3A5F' : 'white',
                          color: selectedSkills.includes(skill) ? 'white' : '#374151',
                        }}>{skill}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Upload CV</label>
                  <div style={{
                    border: '2px dashed #d1d5db', borderRadius: '8px', padding: '28px', textAlign: 'center',
                    background: '#f9fafb', cursor: 'pointer',
                  }} onClick={() => document.getElementById('cv-upload').click()}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '28px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}></i>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{cvFile ? cvFile.name : 'Drag & drop or browse'}</p>
                    <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '12px' }}>PDF only, max 5MB</p>
                    <input id="cv-upload" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setCvFile(e.target.files[0])} />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
                  <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} />
                  I agree to the terms and conditions
                </label>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} style={outlineBtnStyle}>← Back</button>
                  <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, flex: 1 }}>
                    {loading ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Creating...</> : 'Create Account'}
                  </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                  Already have an account? <Link to="/login" style={{ color: '#1E3A5F', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
                </p>
              </form>
            )}

            {/* EMPLOYER STEP 1 */}
            {userType === 'employer' && step === 1 && (
              <form onSubmit={handleNext}>
                <Field label="Institution/Department Name" name="institutionName" placeholder="Physics Department" icon="building" value={formData.institutionName} onChange={handleChange} required />
                <div style={{ marginBottom: '4px' }}>
                  <Field label="Official Email" name="officialEmail" type="email" placeholder="Must end with @cu.edu.eg" icon="envelope" value={formData.officialEmail} onChange={handleChange} required />
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '-10px', marginBottom: '14px' }}>You'll receive verification email</p>
                <SelectField label="Position/Role" name="position" value={formData.position} onChange={handleChange} options={ROLES} placeholder="Select your role" required />
                <Field label="Phone Number" name="phone" type="tel" placeholder="+20 123 456 7890" icon="phone" value={formData.phone} onChange={handleChange} required />
                <SelectField label="Department" name="empDepartment" value={formData.empDepartment} onChange={handleChange} options={DEPARTMENTS} placeholder="Select department" required />
                <PasswordField label="Password" name="empPassword" placeholder="Create a strong password" value={formData.empPassword} onChange={handleChange} strength={passwordStrength} strengthColor={strengthColor} />
                <Field label="Confirm Password" name="empConfirmPassword" type="password" placeholder="Re-enter password" icon="lock" value={formData.empConfirmPassword} onChange={handleChange} required />
                <button type="submit" style={primaryBtnStyle}>Next Step →</button>
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                  Already have an account? <Link to="/login" style={{ color: '#1E3A5F', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
                </p>
              </form>
            )}

            {/* EMPLOYER STEP 2 */}
            {userType === 'employer' && step === 2 && (
              <form onSubmit={handleSubmit}>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                  Your account will be verified by the admin before activation.
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
                  <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} />
                  I agree to the terms and conditions
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} style={outlineBtnStyle}>← Back</button>
                  <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, flex: 1 }}>
                    {loading ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Creating...</> : 'Create Account'}
                  </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                  Already have an account? <Link to="/login" style={{ color: '#1E3A5F', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
                </p>
              </form>
            )}
          </div>

          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
            ← <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

/* Reusable sub-components */
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' };

const Field = ({ label, name, type = 'text', placeholder, icon, value, onChange, required }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && <i className={`fas fa-${icon}`} style={{ position: 'absolute', left: '12px', color: '#9ca3af', fontSize: '14px' }}></i>}
      <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required}
        style={{ width: '100%', padding: `11px 12px 11px ${icon ? '36px' : '12px'}`, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#374151', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  </div>
);

const PasswordField = ({ label, name, placeholder, value, onChange, strength, strengthColor }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <i className="fas fa-lock" style={{ position: 'absolute', left: '12px', color: '#9ca3af', fontSize: '14px' }}></i>
        <input type={show ? 'text' : 'password'} name={name} placeholder={placeholder} value={value} onChange={onChange} required
          style={{ width: '100%', padding: '11px 40px 11px 36px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: '#374151', outline: 'none', boxSizing: 'border-box' }} />
        <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <i className={`fas fa-eye${show ? '-slash' : ''}`}></i>
        </button>
      </div>
      {strength && (
        <div style={{ marginTop: '6px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            {['Weak', 'Medium', 'Strong'].map((s, i) => (
              <div key={s} style={{ flex: 1, height: '4px', borderRadius: '99px', background: strengthColor[strength] && ['Weak', 'Medium', 'Strong'].indexOf(strength) >= i ? strengthColor[strength] : '#e5e7eb' }}></div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: strengthColor[strength] }}>{strength}</p>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, options, placeholder, required }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={labelStyle}>{label}</label>
    <div style={{ position: 'relative' }}>
      <select name={name} value={value} onChange={onChange} required={required}
        style={{ width: '100%', padding: '11px 36px 11px 12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', color: value ? '#374151' : '#9ca3af', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <i className="fas fa-chevron-down" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '12px', pointerEvents: 'none' }}></i>
    </div>
  </div>
);

const primaryBtnStyle = {
  width: '100%', padding: '13px', background: '#1E3A5F', color: 'white',
  border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
};
const outlineBtnStyle = {
  padding: '13px 20px', background: 'white', color: '#374151',
  border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
};

export default Register;