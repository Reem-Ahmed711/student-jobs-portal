import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";

const EmployerApplicants = () => {
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  const jobs = [
    { id: 'all', name: 'All Jobs', count: 48 },
    { id: 'physics', name: 'Teaching Assistant - Physics', count: 24 },
    { id: 'quantum', name: 'Research Assistant - Quantum', count: 12 },
    { id: 'lab', name: 'Lab Assistant - General Physics', count: 12 }
  ];

const [applicants, setApplicants] = useState( [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@science.cu.edu.eg',
      year: '3rd Year',
      department: 'Physics',
      job: 'Teaching Assistant - Physics',
      matchScore: 92,
      skills: ['Teaching', 'Lab Work', 'Communication', 'Python'],
      skillsMatch: '8/10',
      appliedDate: 'Feb 24, 2026',
      status: 'New',
      gpa: '3.7',
      experience: 'Peer tutor for 2 years'
    },
    {
      id: 2,
      name: 'Sara Ibrahim',
      email: 'sara.ibrahim@science.cu.edu.eg',
      year: '4th Year',
      department: 'Chemistry',
      job: 'Research Assistant - Chemistry',
      matchScore: 88,
      skills: ['Research', 'Lab Work', 'Data Analysis', 'MATLAB'],
      skillsMatch: '7/9',
      appliedDate: 'Feb 23, 2026',
      status: 'Reviewed',
      gpa: '3.9',
      experience: 'Research intern at NRC'
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return { bg: '#fff3cd', color: '#856404' };
      case 'Reviewed': return { bg: '#d4edda', color: '#155724' };
      case 'Contacted': return { bg: '#cce5ff', color: '#004085' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };
const handleAccept = async (id) => {
  try {
    console.log("الـ ID اللي مبعوث للباك إند:", id);
    
    // تأكدي إن المسار ده هو اللي موجود في الـ Controllers في الباك إند
    const response = await axios.put(`/api/applications/${id}/accept`);

    if (response.status === 200) {
      // لو الرد تمام، بنشيل الشخص من القائمة في الـ Frontend
      setApplicants(prev => prev.filter(a => a.id !== id));
      alert("تم قبول المتقدم بنجاح!");
    }
  } catch (error) {
    console.error("حصل مشكلة في الربط:", error.response?.data || error.message);
    alert("faild to accept the imployee");
  }
};
  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Applicants Pool
          </h1>
          <p style={{ color: '#666' }}>Review and manage job applicants</p>
        </div>

        <div className="card" style={{ marginBottom: '30px', animation: 'slideInUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontSize: '14px' }}>
                Filter by Job
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '250px'
                }}
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.name} ({job.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontSize: '14px' }}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="match">Match Score</option>
                <option value="date">Application Date</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {applicants.map(applicant => {
            const statusColors = getStatusColor(applicant.status);
            return (
              <div key={applicant.id} className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: '#E6F0FA',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: '#0B2A4A'
                    }}>
                      {applicant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600' }}>{applicant.name}</h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>{applicant.email}</p>
                      <p style={{ color: '#999', fontSize: '13px' }}>Applied for: {applicant.job}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      background: '#E6F0FA',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#0B2A4A' }}>{applicant.matchScore}%</span>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: statusColors.bg,
                      color: statusColors.color
                    }}>
                      {applicant.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ color: '#0B2A4A', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Skills: {applicant.skillsMatch}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {applicant.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '15px',
                  marginBottom: '15px',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>GPA</p>
                    <p style={{ color: '#0B2A4A', fontWeight: '600' }}>{applicant.gpa} / 5.0</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Applied</p>
                    <p style={{ color: '#0B2A4A', fontWeight: '600' }}>{applicant.appliedDate}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>Experience</p>
                    <p style={{ color: '#0B2A4A', fontWeight: '600' }}>{applicant.experience}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline">
                    <i className="fas fa-user" style={{ marginRight: '5px' }}></i>
                    View Profile
                  </button>
                  <button
  className="btn btn-success"
  style={{ background: '#00C851' }}
  onClick={() => handleAccept(applicant.id)}
>
  <i className="fas fa-check" style={{ marginRight: '5px' }}></i>
  Accept
</button>
                  <button className="btn btn-primary">
                    <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>
                    Contact
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplicants;