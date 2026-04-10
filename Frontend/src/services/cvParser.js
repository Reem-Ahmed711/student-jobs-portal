// src/services/cvParser.js
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const extractCVData = async (file) => {
  console.log('📁 Processing CV:', file.name);
  
  return new Promise(async (resolve, reject) => {
    if (!file || file.type !== 'application/pdf') {
      reject(new Error('Please upload a PDF file'));
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      console.log('📝 Full text extracted, length:', fullText.length);
      console.log('📝 First 500 chars:', fullText.substring(0, 500));
      
      const extracted = {
        name: extractNameAdvanced(fullText),
        email: extractEmailAdvanced(fullText),
        phone: extractPhoneAdvanced(fullText),
        skills: extractSkillsAdvanced(fullText),
        gpa: extractGPAAdvanced(fullText),
        university: extractUniversityAdvanced(fullText),
        degree: extractDegreeAdvanced(fullText)
      };
      
      console.log(' Extracted data:', extracted);
      
      if (!extracted.name && !extracted.email && extracted.skills.length === 0) {
        const lines = fullText.split('\n');
        for (let line of lines) {
          if (line.includes('@') && !extracted.email) {
            const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (emailMatch) extracted.email = emailMatch[1];
          }
          if (!extracted.phone) {
            const phoneMatch = line.match(/(\d{3}[-.]?\d{3}[-.]?\d{4})/);
            if (phoneMatch) extracted.phone = phoneMatch[1];
          }
          if (!extracted.name && line.trim().length > 3 && line.trim().length < 50 && /^[A-Za-z\s]+$/.test(line.trim())) {
            extracted.name = line.trim();
          }
        }
      }
      
      resolve(extracted);
      
    } catch (error) {
      console.error(' Error:', error);
      reject(error);
    }
  });
};

const extractNameAdvanced = (text) => {
  const patterns = [
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
    /Name[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)\s*\n/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  const lines = text.split('\n');
  for (let line of lines.slice(0, 10)) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 50 && /^[A-Za-z\s]+$/.test(trimmed) && 
        !trimmed.includes('@') && !trimmed.includes('http')) {
      return trimmed;
    }
  }
  
  return '';
};

const extractEmailAdvanced = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex);
  return emails && emails.length > 0 ? emails[0] : '';
};

const extractPhoneAdvanced = (text) => {
  const patterns = [
    /(\+\d{1,3}[-.]?\d{3}[-.]?\d{3}[-.]?\d{4})/,
    /(\d{3}[-.]?\d{3}[-.]?\d{4})/,
    /(01[0125][0-9]{8})/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return '';
};

const extractSkillsAdvanced = (text) => {
  const skillsList = [
    'JavaScript', 'React', 'Python', 'Java', 'C++', 'HTML', 'CSS', 
    'Node.js', 'Machine Learning', 'SQL', 'MongoDB', 'Git', 
    'Customer Service', 'Communication', 'Leadership', 'Sales',
    'Quality Assurance', 'Stock Management', 'Marketing'
  ];
  
  const found = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of skillsList) {
    if (lowerText.includes(skill.toLowerCase())) {
      found.push(skill);
    }
  }
  
  return found;
};

const extractGPAAdvanced = (text) => {
  const match = text.match(/GPA[:\s]*(\d+\.?\d*)/i);
  if (match && match[1]) {
    const gpa = parseFloat(match[1]);
    if (gpa > 0 && gpa <= 5) return gpa;
  }
  return null;
};

const extractUniversityAdvanced = (text) => {
  const universities = ['Oregon State', 'Cairo University', 'Alexandria University'];
  for (const uni of universities) {
    if (text.includes(uni)) return uni;
  }
  return '';
};

const extractDegreeAdvanced = (text) => {
  if (text.includes('Bachelor')) return 'Bachelor';
  if (text.includes('Master')) return 'Master';
  if (text.includes('PhD')) return 'PhD';
  return '';
};

export default { extractCVData };