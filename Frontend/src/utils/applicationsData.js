export const allApplications = [
  {
    id: 4,
    jobId: 7,
    jobTitle: 'Teaching Assistant - Web Development',
    company: 'Computer Science Department',
    departmentCode: 'CS',
    location: 'CS Building, Lab 204',
    appliedDate: 'Feb 25, 2026',
    status: 'Under Review',
    match: 94,
    type: 'Part-Time',
    salary: '2500 EGP/mo',
    interviewDate: null
  },
  {
    id: 5,
    jobId: 8,
    jobTitle: 'Research Assistant - Machine Learning',
    company: 'Computer Science Department',
    departmentCode: 'CS',
    location: 'AI Research Lab',
    appliedDate: 'Feb 24, 2026',
    status: 'Interview',
    match: 96,
    type: 'Part-Time',
    salary: '3500 EGP/mo',
    interviewDate: 'Mar 10, 2026 - 11:00 AM'
  },
  {
    id: 6,
    jobId: 9,
    jobTitle: 'Lab Assistant - CS Labs',
    company: 'Computer Science Department',
    departmentCode: 'CS',
    location: 'CS Building, Labs 101-105',
    appliedDate: 'Feb 23, 2026',
    status: 'Pending',
    match: 88,
    type: 'Part-Time',
    salary: '2000 EGP/mo',
    interviewDate: null
  },
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Teaching Assistant - Physics 101',
    company: 'Physics Department',
    departmentCode: 'Physics',
    location: 'Physics Building, Room 203',
    appliedDate: 'Feb 20, 2026',
    status: 'Pending',
    match: 92,
    type: 'Part-Time',
    salary: '2000 EGP/mo',
    interviewDate: null
  },
  {
    id: 2,
    jobId: 2,
    jobTitle: 'Research Assistant - Quantum',
    company: 'Physics Department',
    departmentCode: 'Physics',
    location: 'Research Center, Lab 305',
    appliedDate: 'Feb 18, 2026',
    status: 'Interview',
    match: 88,
    type: 'Part-Time',
    salary: '2500 EGP/mo',
    interviewDate: 'Mar 5, 2026 - 2:00 PM'
  },
  {
    id: 3,
    jobId: 3,
    jobTitle: 'Lab Assistant - General Physics',
    company: 'Physics Department',
    departmentCode: 'Physics',
    location: 'Physics Building, Lab 101',
    appliedDate: 'Feb 15, 2026',
    status: 'Accepted',
    match: 85,
    type: 'Part-Time',
    salary: '1800 EGP/mo',
    interviewDate: 'Feb 28, 2026'
  }
];

export const getUserApplications = (user) => {
  if (!user?.department) return allApplications;
  
  const userDept = user.department;
  
  if (userDept.includes('Computer')) {
    return allApplications.filter(app => app.departmentCode === 'CS');
  } else if (userDept.includes('Physics')) {
    return allApplications.filter(app => app.departmentCode === 'Physics');
  } else if (userDept.includes('Chemistry')) {
    return allApplications.filter(app => app.departmentCode === 'Chemistry');
  } else if (userDept.includes('Math')) {
    return allApplications.filter(app => app.departmentCode === 'Math');
  } else if (userDept.includes('Biology')) {
    return allApplications.filter(app => app.departmentCode === 'Biology');
  } else if (userDept.includes('Geology')) {
    return allApplications.filter(app => app.departmentCode === 'Geology');
  }
  
  return allApplications;
};