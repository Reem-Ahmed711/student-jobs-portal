export const allJobs = [
  // ===== Computer Science Jobs =====
  {
    id: 7,
    title: 'Teaching Assistant - Web Development',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '15 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    match: 94,
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js'],
    description: 'Help students with web development labs. Assist in teaching HTML, CSS, JavaScript, and React. Grade assignments and provide feedback.',
    requirements: ['GPA > 3.2', 'Completed Web Development course with A', 'Strong knowledge of React and Node.js'],
    postedBy: 'Dr. Ahmed Hassan',
    postedDate: '2024-02-25',
    applicants: 18,
    type: 'Teaching Assistant',
    location: 'CS Building, Lab 204',
    duration: 'One Semester',
    icon: 'fa-laptop-code'
  },
  {
    id: 8,
    title: 'Research Assistant - Machine Learning',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '20 hrs/week',
    deadline: '10 days left',
    salary: '3500 EGP/mo',
    match: 96,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
    description: 'Join the AI research lab to work on cutting-edge machine learning projects. Help with data preprocessing, model training, and research paper writing.',
    requirements: ['GPA > 3.5', 'Completed Machine Learning course', 'Experience with Python and TensorFlow'],
    postedBy: 'Prof. Mohamed Ali',
    postedDate: '2024-02-24',
    applicants: 12,
    type: 'Research Assistant',
    location: 'AI Research Lab, Building 3',
    duration: 'Academic Year',
    icon: 'fa-robot'
  },
  {
    id: 9,
    title: 'Lab Assistant - CS Labs',
    department: 'Computer Science Department',
    departmentCode: 'CS',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '2000 EGP/mo',
    match: 88,
    skills: ['Python', 'Java', 'Problem Solving', 'Teaching'],
    description: 'Assist students during lab sessions for programming courses. Help with debugging, explain concepts, and maintain lab equipment.',
    requirements: ['GPA > 3.0', 'Strong programming skills in Python and Java', 'Patient and good at explaining'],
    postedBy: 'Dr. Sara Ibrahim',
    postedDate: '2024-02-23',
    applicants: 15,
    type: 'Lab Assistant',
    location: 'CS Building, Labs 101-105',
    duration: 'One Semester',
    icon: 'fa-code'
  },

  // ===== Physics Jobs =====
  {
    id: 1,
    title: 'Teaching Assistant - Physics 101',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '15 hrs/week',
    deadline: '3 days left',
    salary: '2000 EGP/mo',
    match: 92,
    skills: ['Teaching', 'Lab Work', 'Communication'],
    description: 'Help professor with Physics 101 labs and tutorials. Assist students during lab sessions and grade assignments.',
    requirements: ['GPA > 3.0', 'Completed Physics 101 with A', 'Good communication skills'],
    postedBy: 'Dr. Sarah Ahmed',
    postedDate: '2024-02-20',
    applicants: 24,
    type: 'Teaching Assistant',
    location: 'Physics Building, Room 203',
    duration: 'One Semester',
    icon: 'fa-atom'
  },
  {
    id: 2,
    title: 'Research Assistant - Quantum',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '20 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    match: 88,
    skills: ['Research', 'Data Analysis', 'Python'],
    description: 'Assist in quantum mechanics research projects. Help with data collection and analysis.',
    requirements: ['GPA > 3.5', 'Research experience', 'Python programming'],
    postedBy: 'Prof. Mohamed Ali',
    postedDate: '2024-02-18',
    applicants: 12,
    type: 'Research Assistant',
    location: 'Research Center, Lab 305',
    duration: 'Academic Year',
    icon: 'fa-quantum'
  },
  {
    id: 3,
    title: 'Lab Assistant - General Physics',
    department: 'Physics Department',
    departmentCode: 'Physics',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '1800 EGP/mo',
    match: 85,
    skills: ['Lab Work', 'Safety', 'Organization'],
    description: 'Prepare and maintain physics laboratory equipment. Assist students during lab sessions.',
    requirements: ['GPA > 2.8', 'Lab safety certification', 'Attention to detail'],
    postedBy: 'Dr. Ahmed Hassan',
    postedDate: '2024-02-15',
    applicants: 18,
    type: 'Lab Assistant',
    location: 'Physics Building, Lab 101',
    duration: 'One Semester',
    icon: 'fa-flask'
  },

  // ===== Chemistry Jobs =====
  {
    id: 10,
    title: 'Lab Assistant - Organic Chemistry',
    department: 'Chemistry Department',
    departmentCode: 'Chemistry',
    hours: '15 hrs/week',
    deadline: '4 days left',
    salary: '2200 EGP/mo',
    match: 89,
    skills: ['Lab Work', 'Safety', 'Organic Chemistry'],
    description: 'Assist in organic chemistry labs. Help students with experiments and maintain lab equipment.',
    requirements: ['GPA > 3.0', 'Completed Organic Chemistry', 'Lab safety certified'],
    postedBy: 'Dr. Mona Said',
    postedDate: '2024-02-22',
    applicants: 14,
    type: 'Lab Assistant',
    location: 'Chemistry Building, Lab 302',
    duration: 'One Semester',
    icon: 'fa-vial'
  },
  {
    id: 11,
    title: 'Research Assistant - Analytical Chemistry',
    department: 'Chemistry Department',
    departmentCode: 'Chemistry',
    hours: '18 hrs/week',
    deadline: '6 days left',
    salary: '2800 EGP/mo',
    match: 91,
    skills: ['Research', 'Data Analysis', 'Lab Techniques'],
    description: 'Help with analytical chemistry research. Assist in experiments and data analysis.',
    requirements: ['GPA > 3.3', 'Research experience', 'Analytical chemistry background'],
    postedBy: 'Prof. Hala Ibrahim',
    postedDate: '2024-02-21',
    applicants: 8,
    type: 'Research Assistant',
    location: 'Chemistry Research Lab',
    duration: 'Academic Year',
    icon: 'fa-flask'
  },

  // ===== Mathematics Jobs =====
  {
    id: 12,
    title: 'Teaching Assistant - Calculus',
    department: 'Mathematics Department',
    departmentCode: 'Math',
    hours: '15 hrs/week',
    deadline: '5 days left',
    salary: '2000 EGP/mo',
    match: 87,
    skills: ['Teaching', 'Mathematics', 'Tutoring'],
    description: 'Assist in calculus tutorials and grading. Help students with problem-solving.',
    requirements: ['GPA > 3.0', 'Completed Calculus I-III', 'Teaching experience'],
    postedBy: 'Prof. Mahmoud Reda',
    postedDate: '2024-02-19',
    applicants: 32,
    type: 'Teaching Assistant',
    location: 'Math Building',
    duration: 'One Semester',
    icon: 'fa-square-root-alt'
  },
  {
    id: 13,
    title: 'Research Assistant - Statistics',
    department: 'Mathematics Department',
    departmentCode: 'Math',
    hours: '16 hrs/week',
    deadline: '8 days left',
    salary: '2400 EGP/mo',
    match: 84,
    skills: ['Statistics', 'Data Analysis', 'Research'],
    description: 'Help with statistical analysis for research projects. Assist in data collection and interpretation.',
    requirements: ['GPA > 3.2', 'Statistics background', 'Data analysis experience'],
    postedBy: 'Dr. Amr Hassan',
    postedDate: '2024-02-17',
    applicants: 10,
    type: 'Research Assistant',
    location: 'Statistics Lab',
    duration: 'One Semester',
    icon: 'fa-chart-line'
  },

  // ===== Biology Jobs =====
  {
    id: 14,
    title: 'Lab Assistant - Biology Lab',
    department: 'Biology Department',
    departmentCode: 'Biology',
    hours: '14 hrs/week',
    deadline: '6 days left',
    salary: '2100 EGP/mo',
    match: 86,
    skills: ['Lab Work', 'Microscopy', 'Safety'],
    description: 'Assist in biology labs. Prepare slides, maintain equipment, and help students.',
    requirements: ['GPA > 2.8', 'Biology major', 'Lab experience'],
    postedBy: 'Dr. Noha Adel',
    postedDate: '2024-02-20',
    applicants: 16,
    type: 'Lab Assistant',
    location: 'Biology Building',
    duration: 'One Semester',
    icon: 'fa-dna'
  },

  // ===== Geology Jobs =====
  {
    id: 15,
    title: 'Lab Assistant - Geology Field Work',
    department: 'Geology Department',
    departmentCode: 'Geology',
    hours: '12 hrs/week',
    deadline: '8 days left',
    salary: '1800 EGP/mo',
    match: 75,
    skills: ['Field Work', 'Lab Work', 'Physical Fitness'],
    description: 'Assist in geology field trips and lab work. Help with sample collection.',
    requirements: ['Physical fitness', 'Interest in geology', 'Team player'],
    postedBy: 'Dr. Hala Said',
    postedDate: '2024-02-21',
    applicants: 6,
    type: 'Lab Assistant',
    location: 'Geology Department',
    duration: 'One Semester',
    icon: 'fa-mountain'
  }
];

export const getRecommendedJobs = (user, limit = 3) => {
  if (!user?.department) return allJobs.slice(0, limit);

  const userDept = user.department;
  let filtered = [];

  if (userDept.includes('Computer')) {
    filtered = allJobs.filter(job => job.departmentCode === 'CS');
  } else if (userDept.includes('Physics')) {
    filtered = allJobs.filter(job => job.departmentCode === 'Physics');
  } else if (userDept.includes('Chemistry')) {
    filtered = allJobs.filter(job => job.departmentCode === 'Chemistry');
  } else if (userDept.includes('Math')) {
    filtered = allJobs.filter(job => job.departmentCode === 'Math');
  } else if (userDept.includes('Biology')) {
    filtered = allJobs.filter(job => job.departmentCode === 'Biology');
  } else if (userDept.includes('Geology')) {
    filtered = allJobs.filter(job => job.departmentCode === 'Geology');
  } else {
    return allJobs.slice(0, limit);
  }

  return filtered.slice(0, limit);
};

export const getAllJobs = () => allJobs;

export const getJobsByDepartment = (departmentCode) => {
  return allJobs.filter(job => job.departmentCode === departmentCode);
};

export const getDepartmentStats = () => {
  const stats = {};
  allJobs.forEach(job => {
    if (!stats[job.departmentCode]) {
      stats[job.departmentCode] = {
        name: job.department,
        code: job.departmentCode,
        count: 0,
        icon: job.icon
      };
    }
    stats[job.departmentCode].count++;
  });
  return Object.values(stats);
};