// src/services/cvParser.js
import axios from 'axios';

export const extractCVData = async (file) => {
  console.log('📁 Processing CV via Backend:', file.name);
  
  return new Promise(async (resolve, reject) => {
    if (!file || file.type !== 'application/pdf') {
      reject(new Error('Please upload a PDF file'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('File size must be less than 5MB'));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await axios.post('http://localhost:5000/api/extract-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000 
      });

      console.log('✅ Backend response:', response.data);
      
      const data = response.data;
      
      const extracted = {
        name: data.name || data.data?.name || '',
        email: data.email || data.data?.email || '',
        phone: data.phone || data.data?.phone || '',
        skills: data.skills || data.data?.skills || [],
        gpa: data.gpa || data.data?.gpa || null,
        university: data.university || data.data?.university || '',
        degree: data.degree || data.data?.degree || ''
      };
      
      console.log(' Extracted data:', extracted);
      resolve(extracted);
      
    } catch (error) {
      console.error(' Backend error:', error);
      
      console.warn(' Using fallback demo data');
      const demoData = {
        name: "Ahmed Mohamed",
        email: "ahmed@cu.edu.eg",
        phone: "01012345678",
        skills: ["JavaScript", "React", "Python", "Node.js"],
        gpa: 3.7,
        university: "Cairo University",
        degree: "Bachelor"
      };
      
      reject(new Error('Failed to process CV. Please try again.'));
    
    }
  });
};


export const extractCVDataLocal = async (file) => {
  console.log('📁 Processing CV locally (DEMO):', file.name);
  
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/pdf') {
      reject(new Error('Please upload a PDF file'));
      return;
    }

    setTimeout(() => {
      const demoData = {
        name: "Ahmed Mohamed",
        email: "ahmed@cu.edu.eg",
        phone: "01012345678",
        skills: ["JavaScript", "React", "Python", "Node.js"],
        gpa: 3.7,
        university: "Cairo University",
        degree: "Bachelor of Computer Science"
      };
      console.log('Demo extraction complete:', demoData);
      resolve(demoData);
    }, 1500);
  });
};

const cvParser = { extractCVData, extractCVDataLocal };
export default cvParser;
