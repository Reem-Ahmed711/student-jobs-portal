// ===== MOCK DATA FOR THE APPLICATION =====

export const mockJobs = [
  {
    id: 1,
    title: 'Teaching Assistant - Physics 101',
    department: 'Physics Department',
    hours: '15 hrs/week',
    deadline: '3 days left',
    salary: '2000 EGP/mo',
    match: 92,
    skills: ['Teaching', 'Lab Work', 'Communication'],
    description: 'Help professor with Physics 101 labs and tutorials. Assist students during lab sessions and grade assignments.',
    requirements: ['GPA > 3.0', 'Completed Physics 101 with A', 'Good communication skills'],
    postedBy: 'Dr. Mohamed Hamdy',
    postedDate: '2026-02-20',
    applicants: 24,
    type: 'Teaching Assistant',
    location: 'Physics Building, Room 203',
    duration: 'One Semester'
  },
  {
    id: 2,
    title: 'Research Assistant - Quantum',
    department: 'Physics Department',
    hours: '20 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    match: 88,
    skills: ['Research', 'Data Analysis', 'Python'],
    description: 'Assist in quantum mechanics research projects. Help with data collection and analysis.',
    requirements: ['GPA > 3.5', 'Research experience', 'Python programming'],
    postedBy: 'Prof. Mohamed Ali',
    postedDate: '2026-02-18',
    applicants: 12,
    type: 'Research Assistant',
    location: 'Research Center, Lab 305',
    duration: 'Academic Year'
  },
  {
    id: 3,
    title: 'Lab Assistant - General Physics',
    department: 'Physics Department',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '1800 EGP/mo',
    match: 85,
    skills: ['Lab Work', 'Safety', 'Organization'],
    description: 'Prepare and maintain physics laboratory equipment. Assist students during lab sessions.',
    requirements: ['GPA > 2.8', 'Lab safety certification', 'Attention to detail'],
    postedBy: 'Dr. Ahmed Hassan',
    postedDate: '2026-02-15',
    applicants: 18,
    type: 'Lab Assistant',
    location: 'Physics Building, Lab 101',
    duration: 'One Semester'
  },
  {
    id: 4,
    title: 'Data Analyst - Biophysics Research',
    department: 'Biophysics Department',
    hours: '10 hrs/week',
    deadline: '4 days left',
    salary: '2200 EGP/mo',
    match: 90,
    skills: ['Data Analysis', 'Python', 'Research'],
    description: 'Analyze biophysics research data. Help create visualizations and reports.',
    requirements: ['GPA > 3.2', 'Python/R experience', 'Statistics knowledge'],
    postedBy: 'Dr. Mona Ibrahim',
    postedDate: '2024-02-22',
    applicants: 8,
    type: 'Research Assistant',
    location: 'Biophysics Lab',
    duration: '6 Months'
  },
  {
    id: 5,
    title: 'Teaching Assistant - Calculus',
    department: 'Mathematics Department',
    hours: '15 hrs/week',
    deadline: '6 days left',
    salary: '2000 EGP/mo',
    match: 78,
    skills: ['Teaching', 'Mathematics', 'Tutoring'],
    description: 'Assist in calculus tutorials and grading. Help students with problem-solving.',
    requirements: ['GPA > 3.0', 'Completed Calculus I-III', 'Teaching experience'],
    postedBy: 'Prof. Mahmoud Reda',
    postedDate: '2024-02-19',
    applicants: 32,
    type: 'Teaching Assistant',
    location: 'Math Building',
    duration: 'One Semester'
  },
  {
    id: 6,
    title: 'Lab Assistant - Geology Field Work',
    department: 'Geology Department',
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
    duration: 'One Semester'
    }, {
    id: 7,
    title: 'Teaching Assistant - Web Development',
    department: 'Computer Science Department',
    hours: '15 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    match: 94,
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Teaching'],
    description: 'Help students with web development labs. Assist in teaching HTML, CSS, JavaScript, and React. Grade assignments and provide feedback.',
    requirements: [
        'GPA > 3.2',
        'Completed Web Development course with A',
        'Strong knowledge of React and Node.js',
        'Good communication skills'
    ],
    postedBy: 'Dr. Hassan Ayad',
    postedDate: '2026-02-25',
    applicants: 18,
    type: 'Teaching Assistant',
    location: 'CS Building, Lab 204',
    duration: 'One Semester'
    },{
    id: 8,
    title: 'Research Assistant - Machine Learning',
    department: 'Computer Science Department',
    hours: '20 hrs/week',
    deadline: '10 days left',
    salary: '3500 EGP/mo',
    match: 96,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Research'],
    description: 'Join the AI research lab to work on cutting-edge machine learning projects. Help with data preprocessing, model training, and research paper writing.',
    requirements: [
        'GPA > 3.5',
        'Completed Machine Learning course',
        'Experience with Python and TensorFlow/PyTorch',
        'Good at mathematics and statistics',
        'Previous research experience is a plus'
    ],
    postedBy: 'Prof. Mohamed Elgyar',
    postedDate: '2026-02-24',
    applicants: 12,
    type: 'Research Assistant',
    location: 'AI Research Lab, Building 3',
    duration: 'Academic Year'
    },{
    id: 9,
    title: 'Lab Assistant - CS Labs',
    department: 'Computer Science Department',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '2000 EGP/mo',
    match: 88,
    skills: ['Python', 'Java', 'Problem Solving', 'Teaching', 'Communication'],
    description: 'Assist students during lab sessions for programming courses. Help with debugging, explain concepts, and maintain lab equipment.',
    requirements: [
        'GPA > 3.0',
        'Strong programming skills in Python and Java',
        'Patient and good at explaining',
        'Can work with students of different levels',
        'Previous tutoring experience is a plus'
    ],
    postedBy: 'Dr. Rasha Shahen',
    postedDate: '2026-02-23',
    applicants: 15,
    type: 'Lab Assistant',
    location: 'CS Building, Labs 101-105',
    duration: 'One Semester'
}
];

export const mockApplications = [
  {
    id: 1,
    jobId: 1,
    jobTitle: 'Teaching Assistant - Physics 101',
    company: 'Physics Department',
    appliedDate: 'Feb 20, 2026',
    status: 'Pending',
    match: 92,
    interviewDate: null,
    location: 'Physics Building',
    salary: '2000 EGP/mo',
    type: 'Part-Time'
  },
  {
    id: 2,
    jobId: 2,
    jobTitle: 'Research Assistant - Quantum',
    company: 'Physics Department',
    appliedDate: 'Feb 18, 2026',
    status: 'Interview',
    match: 88,
    interviewDate: 'Mar 5, 2026 - 2:00 PM',
    location: 'Research Center',
    salary: '2500 EGP/mo',
    type: 'Part-Time'
  },
  {
    id: 3,
    jobId: 3,
    jobTitle: 'Lab Assistant - General Physics',
    company: 'Physics Department',
    appliedDate: 'Feb 15, 2026',
    status: 'Accepted',
    match: 85,
    interviewDate: 'Feb 28, 2026',
    location: 'Physics Building',
    salary: '1800 EGP/mo',
    type: 'Part-Time'
  },
  {
    id: 4,
    jobId: 4,
    jobTitle: 'Data Analyst - Biophysics Research',
    company: 'Biophysics Department',
    appliedDate: 'Feb 22, 2026',
    status: 'Under Review',
    match: 90,
    interviewDate: null,
    location: 'Biophysics Lab',
    salary: '2200 EGP/mo',
    type: 'Part-Time'
  },{
  id: 4,
  jobId: 7,
  jobTitle: 'Teaching Assistant - Web Development',
  company: 'Computer Science Department',
  appliedDate: 'Feb 25, 2026',
  status: 'Under Review',
  match: 94,
  interviewDate: null,
  location: 'CS Building, Lab 204',
  salary: '2500 EGP/mo',
  type: 'Part-Time'
},{
  id: 5,
  jobId: 8,
  jobTitle: 'Research Assistant - Machine Learning',
  company: 'Computer Science Department',
  appliedDate: 'Feb 24, 2026',
  status: 'Interview',
  match: 96,
  interviewDate: 'Mar 10, 2026 - 11:00 AM',
  location: 'AI Research Lab',
  salary: '3500 EGP/mo',
  type: 'Part-Time'
},{
  id: 6,
  jobId: 9,
  jobTitle: 'Lab Assistant - CS Labs',
  company: 'Computer Science Department',
  appliedDate: 'Feb 23, 2026',
  status: 'Pending',
  match: 88,
  interviewDate: null,
  location: 'CS Building, Labs 101-105',
  salary: '2000 EGP/mo',
  type: 'Part-Time'
}
];

export const mockNotifications = [
  {
    id: 1,
    type: 'application',
    title: 'Application Viewed',
    message: 'Your application for Teaching Assistant - Physics has been viewed by the department',
    time: '2 hours ago',
    read: false,
    urgent: false,
    date: 'Today'
  },
  {
    id: 2,
    type: 'job_match',
    title: 'New Job Match',
    message: 'New job posted: Research Assistant in Chemistry (95% match with your skills)',
    time: '5 hours ago',
    read: false,
    urgent: false,
    date: 'Today'
  },
  {
    id: 3,
    type: 'interview',
    title: 'Interview Invitation',
    message: 'Dr. Ahmed invited you for an interview for Lab Assistant position',
    time: '8 hours ago',
    read: false,
    urgent: true,
    date: 'Today'
  },
  {
    id: 4,
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Physics Department regarding your application',
    time: 'Yesterday',
    read: true,
    urgent: false,
    date: 'Yesterday'
  },
  {
    id: 5,
    type: 'application',
    title: 'Application Accepted',
    message: 'Congratulations! Your application for Research Assistant has been accepted',
    time: '2 days ago',
    read: true,
    urgent: false,
    date: 'This Week'
  }
];

export const mockStats = {
  student: {
    totalApplications: 12,
    pendingReview: 5,
    interviewsScheduled: 2,
    savedJobs: 7,
    profileCompletion: 80
  },
  employer: {
    activeJobs: 6,
    totalApplicants: 48,
    positionsToFill: 4,
    avgMatchScore: 76
  },
  admin: {
    totalUsers: 1245,
    activeJobs: 82,
    totalApplications: 892,
    placementRate: 67
  }
};

export const mockEmployerJobs = [
  {
    id: 1,
    title: 'Teaching Assistant - Physics 101',
    department: 'Physics',
    postedDate: 'Feb 15, 2026',
    deadline: 'Mar 15, 2026',
    applicants: 24,
    status: 'Active',
    matchScore: 92,
    views: 156
  },
  {
    id: 2,
    title: 'Research Assistant - Quantum',
    department: 'Physics',
    postedDate: 'Feb 10, 2026',
    deadline: 'Mar 20, 2026',
    applicants: 12,
    status: 'Active',
    matchScore: 88,
    views: 98
  },
  {
    id: 3,
    title: 'Lab Assistant - General Physics',
    department: 'Physics',
    postedDate: 'Feb 18, 2026',
    deadline: 'Mar 10, 2026',
    applicants: 18,
    status: 'Urgent',
    matchScore: 85,
    views: 134
 },{   
    id: 4,
    title: 'Teaching Assistant - Web Development',
    department: 'Computer Science',
    postedDate: 'Feb 25, 2026',
    deadline: 'Mar 25, 2026',
    applicants: 15,
    status: 'Active',
    matchScore: 94,
    views: 89
},{
    id: 5,
    title: 'Research Assistant - Machine Learning',
    department: 'Computer Science',
    postedDate: 'Feb 24, 2026',
    deadline: 'Mar 30, 2026',
    applicants: 8,
    status: 'Active',
    matchScore: 96,
    views: 67
},{
    id: 6,
    title: 'Lab Assistant - CS Labs',
    department: 'Computer Science',
    postedDate: 'Feb 23, 2026',
    deadline: 'Mar 20, 2026',
    applicants: 12,
    status: 'Urgent',
    matchScore: 88,
    views: 112
    }
];

export const mockApplicants = [
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
  },
  {
    id: 3,
    name: 'Omar Hassan',
    email: 'omar.hassan@science.cu.edu.eg',
    year: '3rd Year',
    department: 'Biology',
    job: 'Lab Supervisor',
    matchScore: 85,
    skills: ['Lab Work', 'Safety', 'Organization', 'Leadership'],
    skillsMatch: '9/10',
    appliedDate: 'Feb 22, 2026',
    status: 'Contacted',
    gpa: '3.5',
    experience: 'Lab assistant for 1 year'
  },{
    id: 4,
    name: 'Reem Ahmed',
    email: 'reem.ahmed@science.cu.edu.eg',
    year: '4th Year',
    department: 'Computer Science',
    job: 'Teaching Assistant - Web Development',
    matchScore: 94,
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js', 'Teaching'],
    skillsMatch: '9/10',
    appliedDate: 'Feb 25, 2026',
    status: 'New',
    gpa: '3.8',
    experience: 'Peer tutor for 2 years, Built 3 full-stack projects'
},{
  id: 5,
    name: 'Sara Mahmoud',
    email: 'sara.mahmoud@science.cu.edu.eg',
    year: '4th Year',
    department: 'Computer Science',
    job: 'Research Assistant - Machine Learning',
    matchScore: 96,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'Research'],
    skillsMatch: '10/10',
    appliedDate: 'Feb 24, 2026',
    status: 'Interview',
    gpa: '3.9',
    experience: 'Research intern at AI lab, Published paper on ML'
},{
    id: 6,
    name: 'Dina Ibrahim',
    email: 'dina.ibrahim@science.cu.edu.eg',
    year: '3rd Year',
    department: 'Computer Science',
    job: 'Lab Assistant - CS Labs',
    matchScore: 88,
    skills: ['Python', 'Java', 'Problem Solving', 'Communication', 'Team Work'],
    skillsMatch: '8/10',
    appliedDate: 'Feb 23, 2026',
    status: 'Reviewed',
    gpa: '3.6',
    experience: 'Lab assistant for 1 year, Coding club member'
    }
];

export const mockSavedJobs = [
  {
    id: 1,
    title: 'Teaching Assistant - Physics 101',
    department: 'Physics Department',
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
    hours: '20 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    savedDate: 'Feb 18, 2026',
    match: 88,
    skills: ['Research', 'Data Analysis', 'Python']
  },{
    id: 3,
    title: 'Teaching Assistant - Web Development',
    department: 'Computer Science Department',
    hours: '15 hrs/week',
    deadline: '5 days left',
    salary: '2500 EGP/mo',
    savedDate: 'Feb 25, 2026',
    match: 94,
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js']
},{
    id: 4,
    title: 'Research Assistant - Machine Learning',
    department: 'Computer Science Department',
    hours: '20 hrs/week',
    deadline: '10 days left',
    salary: '3500 EGP/mo',
    savedDate: 'Feb 24, 2026',
    match: 96,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis']
},{
    id: 5,
    title: 'Lab Assistant - CS Labs',
    department: 'Computer Science Department',
    hours: '12 hrs/week',
    deadline: '7 days left',
    salary: '2000 EGP/mo',
    savedDate: 'Feb 23, 2026',
    match: 88,
    skills: ['Python', 'Java', 'Problem Solving', 'Teaching']
}
];

export const mockSkills = [
  'Teaching',
  'Research',
  'Lab Work',
  'Data Analysis',
  'Communication',
  'Technical Writing',
  'Python',
  'Java',
  'JavaScript',
  'React',
  'Node.js',
  'HTML/CSS',
  'SQL',
  'Algorithms',
  'Object-Oriented Programming',
  'Git/ Version Control',
  'Front-end Development',
  'Back-end Development',
  'Android Development',
  'iOS Development',
  'Machine Learning',
  'AI',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'TensorFlow',
  'PyTorch',
  'C++',
  'Cybersecurity',
  'Cloud Computing',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Agile Methodologies',
  'MATLAB',
  'Statistics',
  'Organic Chemistry',
  'Physics Lab',
  'Biology Lab'
];