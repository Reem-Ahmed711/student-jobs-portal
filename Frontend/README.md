# 🎓 Student Jobs Portal - Frontend

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.4-61dafb)
![React Router](https://img.shields.io/badge/React%20Router-7.13.1-CA4245)
![Axios](https://img.shields.io/badge/Axios-1.13.6-671ddf)
![License](https://img.shields.io/badge/license-MIT-green)

**A comprehensive job portal for Cairo University students to find part-time opportunities with role-based interfaces for Students, Employers, and Admins.**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📸 Screenshots](#-screenshots)
- [👥 User Roles](#-user-roles)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 👨‍🎓 For Students
| Feature | Description |
|---------|-------------|
| **Smart Dashboard** | Real-time statistics on applications, interviews, and saved jobs |
| **Advanced Job Search** | Filter by department, job type, hours, and skills |
| **Match Percentage** | AI-powered job matching based on student skills and GPA |
| **Application Tracking** | Track application status (Pending, Interview, Accepted, Rejected) |
| **Saved Jobs** | Bookmark jobs and apply later |
| **Profile Management** | Update skills, upload CV, and manage personal information |

### 👔 For Employers
| Feature | Description |
|---------|-------------|
| **Employer Dashboard** | Overview of active jobs and applicants |
| **Job Posting** | Multi-step form with live preview |
| **Applicant Management** | Review, shortlist, and contact applicants |
| **AI Matching** | Smart candidate recommendations based on job requirements |
| **Hiring History** | Track all hiring activities and statistics |

### 👑 For Admins
| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Comprehensive analytics with interactive charts |
| **User Management** | Manage students, employers, and permissions |
| **Job Moderation** | Approve or reject job postings |
| **System Monitoring** | Track platform usage and performance |

### 🎨 UI/UX Highlights
- **Responsive Design** – Works flawlessly on desktop, tablet, and mobile
- **Dark/Light Theme** – Eye-friendly color scheme with Cairo University colors
- **Smooth Animations** – Fade, slide, and hover effects for better UX
- **Empty States** – Beautiful illustrations when no data is available
- **Loading Skeletons** – Professional loading indicators

---

## 🛠️ Tech Stack

```javascript
const techStack = {
  framework: 'React 19.2.4',
  routing: 'React Router DOM 7.13.1',
  httpClient: 'Axios 1.13.6',
  styling: 'Custom CSS with CSS Variables',
  charts: 'Recharts 3.7.0',
  icons: 'Font Awesome + 1000+ Custom SVGs',
  stateManagement: 'Context API + useReducer',
  authentication: 'JWT with localStorage',
  buildTool: 'Create React App'
};
```

---

## 📁 Project Structure

```
frontend/
├── public/                  # Static files
│   ├── index.html          # Main HTML file
│   └── favicon.ico         # Site icon
│
├── src/                     # Source code
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx      # Dynamic navigation
│   │   ├── JobCard.jsx     # Job display card
│   │   ├── StatCard.jsx    # Statistics card
│   │   ├── LoadingSpinner.jsx
│   │   └── ProfileCard.jsx
│   │
│   ├── pages/               # All pages by role
│   │   ├── student/        # Student pages
│   │   ├── employer/       # Employer pages
│   │   ├── admin/          # Admin pages
│   │   ├── login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── NotFound.jsx
│   │
│   ├── context/             # Context providers
│   │   └── AuthContext.js  # Authentication management
│   │
│   ├── services/            # API services
│   │   └── api.js          # All backend calls
│   │
│   ├── styles/              # CSS files
│   │   └── main.css        # Global styles
│   │
│   ├── utils/               # Helper functions
│   │   ├── mockData.js     # Mock data for testing
│   │   ├── jobsData.js     # Job utilities
│   │   └── applicationsData.js
│   │
│   ├── App.js               # Main component
│   └── index.js             # Entry point
│
└── package.json              # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Reem-Ahmed711/student-jobs-portal.git
   cd student-jobs-portal/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Starts development server with hot reload |
| `npm test` | Launches test runner |
| `npm run build` | Creates production build in `build/` folder |
| `npm run eject` | Ejects from Create React App (one-way) |

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| **Login Page** | Beautiful split-screen design with social login options |
| **Student Dashboard** | Personal statistics and job recommendations |
| **Available Jobs** | Advanced filtering and search with match indicators |
| **Employer Dashboard** | Job posting analytics and applicant tracking |
| **Admin Dashboard** | Platform statistics with interactive charts |

*Screenshots will be added soon*

---

## 👥 User Roles

### 🎓 Student
- Browse and search for jobs
- Apply for positions
- Save jobs for later
- Track application status
- Manage profile and skills
- Upload CV

### 💼 Employer
- Post new job opportunities
- Manage job listings
- Review applications
- Shortlist candidates
- Schedule interviews
- Track hiring history

### 👑 Admin
- Monitor platform activity
- Manage users and permissions
- Moderate job postings
- View system analytics
- Handle reports and issues

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Cairo University** – For inspiring this project
- **React Community** – For amazing tools and libraries
- **Font Awesome** – For beautiful icons
- **All Contributors** – Who helped make this project better

---

<div align="center">

**Made with ❤️ by Reem Ahmed & Team**  
Cairo University - Faculty of Science

[![GitHub](https://img.shields.io/badge/GitHub-Reem--Ahmed711-181717?style=for-the-badge&logo=github)](https://github.com/Reem-Ahmed711)

</div>
