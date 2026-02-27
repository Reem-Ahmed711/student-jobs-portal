import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/main.css';
const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [step, setStep] = useState(1);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      setStep(2);
    } else {
      if (role === 'student') {
        navigate('/student-profile');
      } else {
        navigate('/admin-profile');
      }
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return null;
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

  const strength = getPasswordStrength();

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Your Account</h1>
          <p className="step">Step {step} of 2</p>
        </div>

        <div className="role-toggle">
          <button
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleChange('student')}
          >
            Student
          </button>
          <button
            className={`role-btn ${role === 'employer' ? 'active' : ''}`}
            onClick={() => handleRoleChange('employer')}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleNext}>
          {step === 1 ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Reem Ahmed"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@sci.cu.edu.eg"
                  required
                />
                <small style={{ color: 'var(--text-gray)', fontSize: '0.8rem' }}>
                  Use your @sci.cu.edu.eg email
                </small>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                />
                {strength && (
                  <div className="password-strength">
                    <div 
                      className="strength-bar" 
                      style={{ 
                        width: strength === 'Weak' ? '33%' : strength === 'Medium' ? '66%' : '100%',
                        background: strength === 'Weak' ? '#ff4444' : strength === 'Medium' ? '#ffbb33' : '#00C851'
                      }}
                    />
                    <span 
                      className="strength-text"
                      style={{ 
                        color: strength === 'Weak' ? '#ff4444' : strength === 'Medium' ? '#ffbb33' : '#00C851'
                      }}
                    >
                      {strength}
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <small style={{ color: 'red', fontSize: '0.8rem' }}>
                     Passwords do not match
                  </small>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <small style={{ color: 'green', fontSize: '0.8rem' }}>
                    ✓ Passwords match
                  </small>
                )}
              </div>
            </>
          ) : (
            <>
              {role === 'student' && (
                <>
                  <div className="form-group">
                    <label>Department</label>
                    <select className="form-group input" style={{ width: '100%', padding: '0.75rem' }}>
                      <option>Select your department</option>
                      <option>Computer Science</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>Zoology</option>
                      <option>Botany</option>
                      <option>Geology</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Academic Year</label>
                    <select className="form-group input" style={{ width: '100%', padding: '0.75rem' }}>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduate</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>GPA (optional)</label>
                    <input type="number" step="0.01" min="0" max="5" placeholder="3.5" />
                  </div>

                  <div className="form-group">
                    <label>Skills</label>
                    <input type="text" placeholder="e.g., Teaching, Research, Lab Work" />
                  </div>
                </>
              )}

              {role === 'employer' && (
                <>
                  <div className="form-group">
                    <label>Department/Institution</label>
                    <input type="text" placeholder="Mathmatics Department" />
                  </div>

                  <div className="form-group">
                    <label>Position/Role</label>
                    <select className="form-group input" style={{ width: '100%', padding: '0.75rem' }}>
                      <option>Department Head</option>
                      <option>Professor</option>
                      <option>Lab Manager</option>
                      <option>HR Representative</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+20 1XX XXX XXXX" />
                  </div>
                </>
              )}
            </>
          )}

          <button type="submit" className="next-btn">
            {step === 1 ? 'Next Step →' : 'Create Account'}
          </button>

           <button type="button" className="back-btn" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        </form>

        <p className="login-link">
          Already have an account ? <Link to="/"> Sign in here </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;