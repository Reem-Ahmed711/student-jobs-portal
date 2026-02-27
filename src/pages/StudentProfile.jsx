import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/main.css';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Student Data
  const [studentData, setStudentData] = useState({
    name: 'Reem Ahmed',
    department: 'Computer Science',
    year: '3rd Year',
    memberSince: 'Sep 2023',
    about: "I'm a 3rd year Computer Science student passionate about algorithms, data structures, and software development. I have experience in teaching and research, and I'm looking for opportunities to gain more hands-on experience while studying.",
    email: 'reem.ahmed@science.cu.edu.eg',
    phone: '+20 123 456 7890',
    linkedin: 'linkedin.com/in/reem-ahmed',
    github: 'github.com/reem-ahmed',
    gpa: '3.7',
    education: 'Cairo University - Faculty of Science',
    skills: ['Teaching', 'Research', 'Python', 'JavaScript', 'Data Analysis', 'Communication'],
    availability: 'Available 15 hrs/week (Sun-Thu afternoons)'
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value
    });
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setStudentData({
      ...studentData,
      skills: skillsArray
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const recommendedJobs = [
    {
      id: 1,
      title: 'Teaching Assistant - Data Structures',
      department: 'Computer Science Department',
      hours: '15 hrs/week',
      deadline: '3 days left'
    },
    {
      id: 2,
      title: 'Research Assistant - Machine Learning',
      department: 'Computer Science Department',
      hours: '20 hrs/week',
      deadline: '5 days left'
    },
    {
      id: 3,
      title: 'Tutor - Calculus I',
      department: 'Mathematics Department',
      hours: '12 hrs/week',
      deadline: '2 days left'
    },
    {
      id: 4,
      title: 'Lab Assistant - Linear Algebra',
      department: 'Mathematics Department',
      hours: '10 hrs/week',
      deadline: '4 days left'
    }
  ];

  const recentApplications = [
    {
      id: 1,
      title: 'Teaching Assistant - Data Structures',
      department: 'Computer Science',
      date: 'Feb 20, 2026',
      status: 'Pending'
    },
    {
      id: 2,
      title: 'Research Assistant - Machine Learning',
      department: 'Computer Science',
      date: 'Feb 18, 2026',
      status: 'Interview'
    },
    {
      id: 3,
      title: 'Tutor - Calculus I',
      department: 'Mathematics',
      date: 'Feb 15, 2026',
      status: 'Accepted'
    }
  ];

  return (
    <div style={{ display: 'flex', background: '#f5f7fb', minHeight: '100vh' }}>
      <Navbar userType="student" />
      
      <div style={{ 
        marginLeft: '250px', 
        padding: '30px',
        width: 'calc(100% - 250px)'
      }}>
        {/* Science Faculty Header */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#0B2A4A', fontSize: '20px', fontWeight: '500' }}>Faculty of Science </h2>
        </div>

        {/* Profile Header with Image Upload */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#0B2A4A', marginBottom: '5px' }}>{studentData.name}</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>{studentData.department} {studentData.year} • Member since {studentData.memberSince}</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="profile" 
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
              ) : (
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: '#E6F0FA',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  color: '#0B2A4A',
                  cursor: 'pointer'
                }}>
                  <i className="fas fa-user"></i>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
                title="Upload profile picture"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '25px',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px'
        }}>
          {['Dashboard', 'Available Jobs', 'My Applications', 'Profile', 'Notifications', 'Saved Jobs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
              style={{
                background: 'none',
                color: activeTab === tab.toLowerCase().replace(' ', '') ? '#0B2A4A' : '#666',
                border: 'none',
                borderBottom: activeTab === tab.toLowerCase().replace(' ', '') ? '3px solid #0B2A4A' : 'none',
                fontSize: '16px',
                fontWeight: activeTab === tab.toLowerCase().replace(' ', '') ? '600' : '400',
                cursor: 'pointer',
                padding: '5px 0'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            {/* Welcome Card */}
            <div style={{
              padding: '25px',
              background: 'linear-gradient(135deg, #0B2A4A 0%, #1e4a7a 100%)',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>Welcome back, Reem! 🎉</h2>
                <p style={{ opacity: 0.9 }}>You have 5 new job recommendations based on your skills</p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px'
              }}>
                <span>Complete Profile (80%)</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '28px', color: '#0B2A4A', marginBottom: '5px' }}>12</h3>
                <p style={{ color: '#666' }}>Total Applications</p>
                <small style={{ color: '#00C851' }}>+8% this month</small>
              </div>

              <div style={{
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '28px', color: '#0B2A4A', marginBottom: '5px' }}>5</h3>
                <p style={{ color: '#666' }}>Pending Review</p>
                <small style={{ color: '#ffbb33' }}>Awaiting response</small>
              </div>

              <div style={{
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '28px', color: '#0B2A4A', marginBottom: '5px' }}>2</h3>
                <p style={{ color: '#666' }}>Interviews Scheduled</p>
                <small style={{ color: '#0077B5' }}>Next: Tomorrow</small>
              </div>

              <div style={{
                padding: '20px',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ fontSize: '28px', color: '#0B2A4A', marginBottom: '5px' }}>7</h3>
                <p style={{ color: '#666' }}>Saved Jobs</p>
                <small style={{ color: '#00C851' }}>Ready to apply</small>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '20px', fontSize: '20px' }}>Recommended For You</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                {recommendedJobs.map(job => (
                  <div key={job.id} style={{
                    padding: '20px',
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <h4 style={{ color: '#0B2A4A', marginBottom: '10px', fontSize: '18px' }}>{job.title}</h4>
                    <p style={{ color: '#666', marginBottom: '5px' }}>{job.department}</p>
                    <p style={{ color: '#666', marginBottom: '5px' }}>{job.hours}</p>
                    <p style={{ color: '#ff4444', marginBottom: '15px', fontSize: '14px' }}>{job.deadline}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{
                        padding: '8px 20px',
                        background: '#0B2A4A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        Quick Apply
                      </button>
                      <button style={{
                        padding: '8px 20px',
                        background: 'white',
                        color: '#0B2A4A',
                        border: '1px solid #0B2A4A',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div>
              <h3 style={{ color: '#0B2A4A', marginBottom: '20px', fontSize: '20px' }}>Recent Applications</h3>
              <div style={{
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Job Title</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Department</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Applied Date</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#0B2A4A' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '15px' }}>{app.title}</td>
                        <td style={{ padding: '15px' }}>{app.department}</td>
                        <td style={{ padding: '15px' }}>{app.date}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: app.status === 'Pending' ? '#fff3cd' : app.status === 'Interview' ? '#d4edda' : '#cce5ff',
                            color: app.status === 'Pending' ? '#856404' : app.status === 'Interview' ? '#155724' : '#004085',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '30px'
          }}>
            {/* Edit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 20px',
                    background: '#0B2A4A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  style={{
                    padding: '8px 20px',
                    background: '#00C851',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className="fas fa-save"></i> Save Changes
                </button>
              )}
            </div>

            {/* Profile Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                {!isEditing ? (
                  <>
                    <h2 style={{ color: '#0B2A4A', fontSize: '24px', marginBottom: '5px' }}>{studentData.name}</h2>
                    <p style={{ color: '#666' }}>{studentData.department}, {studentData.year} • Member since {studentData.memberSince}</p>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={studentData.name}
                      onChange={handleInputChange}
                      style={{
                        fontSize: '24px',
                        padding: '5px',
                        marginBottom: '5px',
                        width: '300px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <div>
                      <input
                        type="text"
                        name="department"
                        value={studentData.department}
                        onChange={handleInputChange}
                        style={{
                          padding: '5px',
                          width: '200px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                      <input
                        type="text"
                        name="year"
                        value={studentData.year}
                        onChange={handleInputChange}
                        style={{
                          padding: '5px',
                          width: '150px',
                          marginLeft: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div style={{
                background: '#E6F0FA',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#0B2A4A',
                fontWeight: '600'
              }}>
                85% Complete
              </div>
            </div>

            {/* About Me */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '15px', fontSize: '18px' }}>About Me</h3>
              {!isEditing ? (
                <p style={{ color: '#666', lineHeight: '1.6' }}>{studentData.about}</p>
              ) : (
                <textarea
                  name="about"
                  value={studentData.about}
                  onChange={handleInputChange}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'inherit'
                  }}
                />
              )}
            </div>

            {/* Contact Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '15px', fontSize: '18px' }}>Contact Information</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {!isEditing ? (
                  <>
                    <p><i className="fas fa-envelope" style={{ width: '25px', color: '#0B2A4A' }}></i> {studentData.email}</p>
                    <p><i className="fas fa-phone" style={{ width: '25px', color: '#0B2A4A' }}></i> {studentData.phone}</p>
                    <p><i className="fab fa-linkedin" style={{ width: '25px', color: '#0B2A4A' }}></i> {studentData.linkedin}</p>
                    <p><i className="fab fa-github" style={{ width: '25px', color: '#0B2A4A' }}></i> {studentData.github}</p>
                  </>
                ) : (
                  <>
                    <div><i className="fas fa-envelope" style={{ width: '25px', color: '#0B2A4A' }}></i> <input type="email" name="email" value={studentData.email} onChange={handleInputChange} style={{ padding: '5px', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div><i className="fas fa-phone" style={{ width: '25px', color: '#0B2A4A' }}></i> <input type="text" name="phone" value={studentData.phone} onChange={handleInputChange} style={{ padding: '5px', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div><i className="fab fa-linkedin" style={{ width: '25px', color: '#0B2A4A' }}></i> <input type="text" name="linkedin" value={studentData.linkedin} onChange={handleInputChange} style={{ padding: '5px', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div><i className="fab fa-github" style={{ width: '25px', color: '#0B2A4A' }}></i> <input type="text" name="github" value={studentData.github} onChange={handleInputChange} style={{ padding: '5px', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                  </>
                )}
              </div>
            </div>

            {/* Education */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '15px', fontSize: '18px' }}>Education</h3>
              {!isEditing ? (
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <h4 style={{ color: '#0B2A4A', marginBottom: '5px' }}>{studentData.education}</h4>
                  <p style={{ color: '#666' }}>{studentData.department} • {studentData.year}</p>
                  <p style={{ color: '#666' }}>GPA: <strong>{studentData.gpa} / 5.0</strong></p>
                </div>
              ) : (
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <input type="text" name="education" value={studentData.education} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
                  <input type="text" name="gpa" value={studentData.gpa} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="GPA (out of 5.0)" />
                </div>
              )}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '15px', fontSize: '18px' }}>Skills</h3>
              {!isEditing ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {studentData.skills.map((skill, index) => (
                    <span key={index} style={{
                      background: '#E6F0FA',
                      color: '#0B2A4A',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={studentData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  placeholder="Enter skills separated by commas"
                />
              )}
            </div>

            {/* Availability */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0B2A4A', marginBottom: '15px', fontSize: '18px' }}>Availability</h3>
              {!isEditing ? (
                <p style={{ color: '#666' }}>{studentData.availability}</p>
              ) : (
                <input
                  type="text"
                  name="availability"
                  value={studentData.availability}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;