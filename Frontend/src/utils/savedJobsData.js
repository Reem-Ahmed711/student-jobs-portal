export const allSavedJobs = [
  {
    id: 3,
    title: 'Teaching Assistant - Web Development',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '15 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    savedDate: 'Feb 25, 2026',
    match: 94,
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js']
  },
  {
    id: 4,
    title: 'Research Assistant - Machine Learning',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '20 hrs/week',
    deadline: '10 days left',
    salary: '3500 EGP/mo',
    savedDate: 'Feb 24, 2026',
    match: 96,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis']
  },
  {
    id: 5,
    title: 'Lab Assistant - CS Labs',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '2000 EGP/mo',
    savedDate: 'Feb 23, 2026',
    match: 88,
    skills: ['Python', 'Java', 'Problem Solving', 'Teaching']
  },
  {
    id: 1,
    title: 'Teaching Assistant - Physics 101',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '15 hrs/week',
    deadline: '3 days left',
    salary: '2000 EGP/mo',
    savedDate: 'Feb 20, 2026',
    match: 92,
    skills: ['Teaching', 'Lab Work', 'Communication']
  },
  {
    id: 2,
    title: 'Research Assistant - Quantum',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '20 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    savedDate: 'Feb 18, 2026',
    match: 88,
    skills: ['Research', 'Data Analysis', 'Python']
  }
];

export const getUserSavedJobs = (user) => {
  if (!user?.department) return allSavedJobs;
  
  const userDept = user.department;
  
  if (userDept.includes('Computer')) {
    return allSavedJobs.filter(job => job.departmentCode === 'CS');
  } else if (userDept.includes('Physics')) {
    return allSavedJobs.filter(job => job.departmentCode === 'Physics');
  } else if (userDept.includes('Chemistry')) {
    return allSavedJobs.filter(job => job.departmentCode === 'Chemistry');
  } else if (userDept.includes('Math')) {
    return allSavedJobs.filter(job => job.departmentCode === 'Math');
  } else if (userDept.includes('Biology')) {
    return allSavedJobs.filter(job => job.departmentCode === 'Biology');
  } else if (userDept.includes('Geology')) {
    return allSavedJobs.filter(job => job.departmentCode === 'Geology');
  }
  
  return allSavedJobs;
};