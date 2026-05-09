// C:\Student-job-portal\Frontend\src\pages\StudentSkillsCV.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProfile, updateProfile, uploadCV, deleteCV, getAIMatching } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentSkillsCV = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [extractedData, setExtractedData] = useState(null);
  const [cvScore, setCvScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAIPopup, setShowAIPopup] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await getProfile();
      if (response.data) {
        const data = response.data;
        setSkills(data.skills || []);
        if (data.cvUrl) {
          setCvUrl(data.cvUrl);
          setCvName(data.cvName || 'CV uploaded');
          setCvScore(data.cvScore || null);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill)) {
      showMessage('⚠️ This skill already exists', 'error');
      return;
    }
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill('');
    await saveSkills(updatedSkills);
  };

  const removeSkill = async (skill) => {
    const updatedSkills = skills.filter(s => s !== skill);
    setSkills(updatedSkills);
    await saveSkills(updatedSkills);
  };

  const saveSkills = async (updatedSkills) => {
    try {
      await updateProfile({ skills: updatedSkills });
      if (updateUser) updateUser({ ...user, skills: updatedSkills });
      showMessage('✅ Skills saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving skills:', error);
      showMessage('❌ Failed to save skills', 'error');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      showMessage('Please upload a PDF file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMessage('File size must be less than 5MB', 'error');
      return;
    }
    
    setUploading(true);
    setCvFile(file);
    setCvName(file.name);
    showMessage('📄 Uploading and processing CV...', 'info');
    
    try {
      const response = await uploadCV(file);
      const data = response.data?.data || response.data;
      
      if (data) {
        setExtractedData(data);
        setCvUrl(data.cvUrl || '');
        setCvScore(data.cvScore || null);
        
        // Auto-fill skills from CV
        if (data.skills && data.skills.length > 0) {
          const newSkills = [...skills];
          data.skills.forEach(skill => {
            if (!newSkills.includes(skill)) {
              newSkills.push(skill);
            }
          });
          setSkills(newSkills);
          await saveSkills(newSkills);
        }
        
        // Auto-fill other fields
        if (data.name && !user?.name) {
          await updateProfile({ name: data.name });
          if (updateUser) updateUser({ ...user, name: data.name });
        }
        if (data.email && !user?.email) {
          await updateProfile({ email: data.email });
          if (updateUser) updateUser({ ...user, email: data.email });
        }
        if (data.phone && !user?.phone) {
          await updateProfile({ phone: data.phone });
          if (updateUser) updateUser({ ...user, phone: data.phone });
        }
        if (data.gpa && !user?.gpa) {
          await updateProfile({ gpa: data.gpa });
          if (updateUser) updateUser({ ...user, gpa: data.gpa });
        }
        
        showMessage('✅ CV processed successfully! Skills extracted.', 'success');
        
        // Get AI suggestions for missing skills
        if (data.skills && data.skills.length > 0) {
          await getAISuggestions(data.skills);
        }
      }
    } catch (error) {
      console.error('Error processing CV:', error);
      showMessage('❌ Failed to process CV. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!window.confirm('Are you sure you want to delete your CV?')) return;
    
    setLoading(true);
    try {
      await deleteCV();
      setCvUrl('');
      setCvName('');
      setCvFile(null);
      setExtractedData(null);
      setCvScore(null);
      showMessage('✅ CV deleted successfully', 'success');
    } catch (error) {
      showMessage('❌ Failed to delete CV', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestions = async (userSkills) => {
    try {
      const response = await getAIMatching('suggestions');
      const suggestions = response.data?.suggestions || [];
      setAiSuggestions(suggestions.filter(s => !userSkills.includes(s)).slice(0, 5));
    } catch (error) {
      console.log('AI suggestions not available');
    }
  };

  const handleViewCV = () => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: '#d4edda', color: '#155724', text: 'Excellent' };
    if (score >= 60) return { bg: '#fff3cd', color: '#856404', text: 'Good' };
    return { bg: '#f8d7da', color: '#721c24', text: 'Needs Improvement' };
  };

  const allSkills = [
    'JavaScript', 'React', 'Python', 'Java', 'C++', 'HTML/CSS', 'Node.js',
    'Express', 'MongoDB', 'SQL', 'TypeScript', 'Angular', 'Vue.js', 'Django',
    'Flask', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'PyTorch',
    'Teaching', 'Research', 'Lab Work', 'Communication', 'Leadership',
    'Problem Solving', 'Time Management', 'Team Work', 'Git', 'Docker',
    'AWS', 'Azure', 'Kubernetes', 'GraphQL', 'Next.js', 'TailwindCSS'
  ];

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .skill-card {
          animation: slideInUp 0.5s ease-out;
          transition: all 0.3s ease;
        }
        .cv-area {
          transition: all 0.3s ease;
        }
        .cv-area:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-code" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Skills & CV
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Showcase your skills and upload your CV for AI-powered analysis
              </p>
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            background: messageType === 'success' ? '#d4edda' : messageType === 'error' ? '#f8d7da' : '#cce5ff',
            color: messageType === 'success' ? '#155724' : messageType === 'error' ? '#721c24' : '#004085',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : messageType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            <span>{message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* ==================== LEFT COLUMN - SKILLS ==================== */}
          <div className="skill-card" style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '20px' }}>
              <i className="fas fa-star" style={{ marginRight: '10px', color: '#f59e0b' }}></i>
              Your Skills
            </h3>
            
            {/* Skills Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '30px', minHeight: '120px' }}>
              {skills.length === 0 ? (
                <p style={{ color: '#999', fontStyle: 'italic', padding: '20px', textAlign: 'center', width: '100%' }}>
                  No skills added yet. Add skills below or upload your CV!
                </p>
              ) : (
                skills.map((skill, index) => (
                  <div key={index} style={{
                    background: 'linear-gradient(135deg, #E6F0FA 0%, #d4e4f5 100%)',
                    padding: '8px 18px',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}>
                    <span style={{ color: '#1E3A5F', fontSize: '14px', fontWeight: '500' }}>{skill}</span>
                    <button 
                      onClick={() => removeSkill(skill)} 
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1E3A5F',
                        cursor: 'pointer',
                        fontSize: '14px',
                        opacity: 0.6,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Skill */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: darkMode ? '#94a3b8' : '#666', fontWeight: '500' }}>
                <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
                Add New Skill
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="e.g., Python, React, Data Analysis..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333',
                    outline: 'none'
                  }}
                />
                <button 
                  onClick={addSkill} 
                  style={{
                    padding: '12px 28px',
                    background: '#1E3A5F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Suggested Skills */}
            <div>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '12px', fontSize: '13px', fontWeight: '500' }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '6px', color: '#f59e0b' }}></i>
                Suggested Skills (based on job market):
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {allSkills
                  .filter(s => !skills.includes(s))
                  .slice(0, 20)
                  .map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSkills([...skills, skill]);
                        saveSkills([...skills, skill]);
                      }}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        border: `1px dashed ${darkMode ? '#818cf8' : '#1E3A5F'}`,
                        borderRadius: '30px',
                        color: darkMode ? '#818cf8' : '#1E3A5F',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1E3A5F';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.border = 'none';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = darkMode ? '#818cf8' : '#1E3A5F';
                        e.currentTarget.style.border = `1px dashed ${darkMode ? '#818cf8' : '#1E3A5F'}`;
                      }}
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions && aiSuggestions.length > 0 && (
              <div style={{ marginTop: '20px', padding: '15px', background: darkMode ? '#0f172a' : '#f8f9fa', borderRadius: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
                  <i className="fas fa-robot" style={{ marginRight: '6px', color: '#667eea' }}></i>
                  AI Recommendations:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {aiSuggestions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSkills([...skills, skill]);
                        saveSkills([...skills, skill]);
                      }}
                      style={{
                        padding: '4px 12px',
                        background: '#667eea20',
                        borderRadius: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#667eea'
                      }}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div style={{ marginTop: '20px', padding: '15px', background: darkMode ? '#0f172a' : '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                <strong>{skills.length}</strong> skills added • 
                {skills.length >= 10 ? ' ✅ Great profile!' : ` Add ${10 - skills.length} more to complete`}
              </p>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN - CV UPLOAD ==================== */}
          <div className="cv-area" style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '20px' }}>
              <i className="fas fa-file-pdf" style={{ marginRight: '10px', color: '#ef4444' }}></i>
              Upload CV
            </h3>

            {/* CV Score Display */}
            {cvScore && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: getScoreColor(cvScore).bg,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: getScoreColor(cvScore).color }}>
                  {cvScore}/100
                </div>
                <div style={{ fontWeight: '600', color: getScoreColor(cvScore).color }}>
                  {getScoreColor(cvScore).text} CV Score
                </div>
                <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Based on format, keywords, and completeness</p>
              </div>
            )}

            {/* Upload Area */}
            <div
              style={{
                border: `2px dashed ${darkMode ? '#475569' : '#ccc'}`,
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                background: darkMode ? '#0f172a' : '#fafafa',
                marginBottom: '20px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: uploading ? 0.7 : 1
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type === 'application/pdf') {
                  handleFileUpload({ target: { files: [file] } });
                }
              }}
              onClick={() => !uploading && document.getElementById('cv-upload').click()}
              onMouseEnter={(e) => {
                if (!uploading) {
                  e.currentTarget.style.borderColor = '#1E3A5F';
                  e.currentTarget.style.background = darkMode ? '#1e293b' : '#f0f4fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading) {
                  e.currentTarget.style.borderColor = darkMode ? '#475569' : '#ccc';
                  e.currentTarget.style.background = darkMode ? '#0f172a' : '#fafafa';
                }
              }}
            >
              <input type="file" id="cv-upload" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: '48px', color: '#1E3A5F', marginBottom: '15px' }}></i>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '10px' }}>
                {uploading ? 'Processing...' : 'Drag & drop or <span style="color:#1E3A5F;font-weight:600">browse</span>'}
              </p>
              <p style={{ color: '#999', fontSize: '14px' }}>PDF only, max 5MB</p>
            </div>

            {/* Loading Indicator */}
            {uploading && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid #f3f3f3', borderTop: '3px solid #1E3A5F', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '12px' }}>Analyzing your CV with AI...</p>
              </div>
            )}

            {/* Uploaded CV Info */}
            {cvName && !uploading && (
              <div style={{
                padding: '15px',
                background: darkMode ? '#0f172a' : '#e8f0fe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fas fa-file-pdf" style={{ color: '#ef4444', fontSize: '24px' }}></i>
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '2px', color: darkMode ? '#e2e8f0' : '#1E3A5F' }}>{cvName}</p>
                    <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>Uploaded successfully</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleViewCV}
                    style={{
                      padding: '6px 12px',
                      background: '#1E3A5F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                  <button
                    onClick={handleDeleteCV}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            )}

            {/* AI Extracted Data Preview */}
            {extractedData && !uploading && (
              <div style={{
                padding: '20px',
                background: '#d4edda',
                borderRadius: '12px',
                marginTop: '15px',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <i className="fas fa-robot" style={{ fontSize: '20px', color: '#155724' }}></i>
                  <h4 style={{ fontWeight: '600', color: '#155724' }}>AI Extracted Information</h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                  {extractedData.name && <div><strong>Name:</strong> {extractedData.name}</div>}
                  {extractedData.email && <div><strong>Email:</strong> {extractedData.email}</div>}
                  {extractedData.phone && <div><strong>Phone:</strong> {extractedData.phone}</div>}
                  {extractedData.gpa && <div><strong>GPA:</strong> {extractedData.gpa}</div>}
                  {extractedData.university && <div><strong>University:</strong> {extractedData.university}</div>}
                </div>
                {extractedData.skills && extractedData.skills.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Skills extracted:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {extractedData.skills.map((s, i) => (
                        <span key={i} style={{ background: '#15572420', padding: '2px 10px', borderRadius: '20px', fontSize: '11px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CV Tips */}
            <div style={{ marginTop: '25px' }}>
              <h4 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '16px', marginBottom: '12px' }}>
                <i className="fas fa-tips" style={{ marginRight: '8px' }}></i>
                CV Tips for Better Matching:
              </h4>
              <ul style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Keep it to 1-2 pages</li>
                <li>Highlight relevant coursework and projects</li>
                <li>Include your GPA if it's above 3.0</li>
                <li>List technical skills and software proficiency</li>
                <li>Use keywords matching the jobs you're applying for</li>
                <li>Add links to your GitHub/LinkedIn profiles</li>
              </ul>
            </div>

            {/* Save Button */}
            <button
              onClick={() => saveSkills(skills)}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #00C851, #00a844)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: uploading ? 'not-allowed' : 'pointer',
                marginTop: '25px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => !uploading && (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => !uploading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {uploading ? 'Processing...' : <><i className="fas fa-save"></i> Save Skills & CV</>}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default StudentSkillsCV;
