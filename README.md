<div align="center">
  
  #  Cairo University Student Jobs Portal

  ![Version](https://img.shields.io/badge/version-2.0.0-blue)
  ![React](https://img.shields.io/badge/React-19.2.4-61dafb)
  ![Node](https://img.shields.io/badge/Node.js-18.x-339933)
  ![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28)
  ![React Native](https://img.shields.io/badge/React%20Native-0.72-61dafb)
  ![License](https://img.shields.io/badge/license-MIT-green)

  **A comprehensive job portal connecting Cairo University students with part-time opportunities across all faculties**

  [ Live Demo](#) • [ Documentation](#) • [ Mobile App](#) • [ Report Bug](#)

</div>

---

##  Table of Contents
- [ Project Overview](#-project-overview)
- [ Tech Stack](#️-tech-stack)
- [ Project Structure](#-project-structure)
- [ Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Mobile App Setup](#mobile-app-setup)
- [ User Roles & Features](#-user-roles--features)
- [ Screenshots](#-screenshots)
- [ Environment Variables](#-environment-variables)
- [ Team Members](#-team-members)
- [ License](#-license)

---

##  Project Overview

**Student Jobs Portal** is a full-stack platform designed exclusively for Cairo University students and faculty departments. It bridges the gap between students seeking part-time opportunities and departments looking for teaching/research assistants.

###  Key Objectives
-  Connect students with on-campus job opportunities
-  Streamline the application and hiring process
-  Provide AI-powered job matching based on skills and GPA
-  Offer role-specific dashboards for students, employers, and admins
-  Cross-platform support (Web + Mobile)

---

##  Tech Stack

### **Frontend (Web)**
```json
{
  "framework": "React 19.2.4",
  "routing": "React Router DOM 7.13.1",
  "httpClient": "Axios 1.13.6",
  "styling": "Custom CSS with CSS Variables",
  "charts": "Recharts 3.7.0",
  "icons": "Font Awesome + 1000+ Custom SVGs",
  "stateManagement": "Context API",
  "authentication": "JWT with localStorage"
}
```

### **Backend**
```json
{
  "runtime": "Node.js 18.x",
  "framework": "Express 5.2.1",
  "database": "Firebase Firestore",
  "authentication": "Firebase Auth",
  "storage": "Firebase Storage",
  "realTime": "Firebase Realtime Database"
}
```

### **Mobile App**
```json
{
  "framework": "React Native 0.72",
  "navigation": "React Navigation 6.x",
  "httpClient": "Axios",
  "stateManagement": "Context API",
  "storage": "AsyncStorage"
}
```

---

##  Project Structure

```
student-jobs-portal/
│
├── backend/                          # Node.js + Express Server
│   ├── src/
│   │   ├── auth/                    # Authentication logic
│   │   ├── config/                   # Firebase config
│   │   ├── jobs/                     # Jobs CRUD operations
│   │   ├── middleware/               # Auth middleware
│   │   ├── profiles/                  # User profiles
│   │   └── routes/                    # API routes
│   ├── index.js                       # Server entry point
│   ├── package.json
│   └── .gitignore
│
├── frontend/                          # React Web Application
│   ├── public/
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   ├── pages/                      # All pages by role
│   │   ├── context/                    # Auth context
│   │   ├── services/                    # API calls
│   │   ├── styles/                      # Global CSS
│   │   ├── utils/                       # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .gitignore
│
├── mobileApp/                          # React Native Mobile App
│   ├── app-backend/                    # Mobile backend logic
│   ├── frontEnd/                        # Mobile frontend
│   └── package.json
│
├── .gitignore                           # Global gitignore
├── README.md                            # Project documentation
└── LICENSE                               # MIT License
```

---

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Android Studio / Xcode (for mobile)

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Reem-Ahmed711/student-jobs-portal.git
cd student-jobs-portal/backend

# Install dependencies
npm install

# Create .env file and add your Firebase config
# (See Environment Variables section)

# Start the server
npm start
```


---

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```


---

### Mobile App Setup

```bash
# Navigate to mobileApp directory
cd ../mobileApp

# Install dependencies
npm install

# For iOS
cd ios && pod install && cd ..
npx react-native run-ios

# For Android
npx react-native run-android
```

---

##  User Roles & Features

###  **Students**
| Feature | Description |
|---------|-------------|
| **Smart Dashboard** | Real-time statistics on applications and saved jobs |
| **Job Search** | Advanced filtering by department, type, hours, and skills |
| **AI Matching** | Personalized job recommendations based on skills and GPA |
| **Application Tracking** | Monitor application status (Pending, Interview, Accepted) |
| **Profile Management** | Upload CV, manage skills, update personal info |
| **Saved Jobs** | Bookmark interesting positions for later |

###  **Employers (Faculty Departments)**
| Feature | Description |
|---------|-------------|
| **Department Dashboard** | Overview of active jobs and applicants |
| **Job Posting** | Multi-step form with live preview |
| **Applicant Review** | View, filter, and shortlist candidates |
| **AI Candidate Matching** | Smart recommendations based on job requirements |
| **Hiring History** | Track all hiring activities |
| **Interview Scheduling** | Manage interview timelines |

###  **Admins**
| Feature | Description |
|---------|-------------|
| **Platform Analytics** | Comprehensive statistics with interactive charts |
| **User Management** | Manage students, employers, and permissions |
| **Job Moderation** | Approve or reject job postings |
| **Content Moderation** | Handle reports and inappropriate content |
| **System Monitoring** | Track platform performance |

---

##  Screenshots

| Platform | Page | Preview |
|----------|------|---------|
| Web | Login Page | ![Login](https://via.placeholder.com/300x200?text=Login) |
| Web | Student Dashboard | ![Dashboard](https://via.placeholder.com/300x200?text=Dashboard) |
| Web | Available Jobs | ![Jobs](https://via.placeholder.com/300x200?text=Jobs) |
| Mobile | Home Screen | ![Mobile](https://via.placeholder.com/300x200?text=Mobile) |

*Screenshots will be added soon*

---

##  Environment Variables

### Backend (.env)
```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_DATABASE_URL=your_database_url
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
```

### Mobile App (.env)
```env
API_URL=http://localhost:5000
FIREBASE_API_KEY=your_api_key
```

---

##  Team Members

| Name | Role | Specialization | Responsibilities |
|------|------|----------------|------------------|
| **Reem Ahmed** | Frontend Developer | Web Frontend | Student/Employer/Admin Pages, Job Features, UI/UX |
| **Sara Mahmoud** | Frontend Developer | Mobile Frontend | Mobile App Screens, Navigation |
| **Dina Ebrahim** | Backend Developer | Backend & Firebase | Authentication, Jobs API, Security |
| **Fatma Abdelmotagly** | Backend Developer | Backend & Mobile API | User Profiles, Mobile Backend Logic |

---

##  Project Statistics

| Metric | Count |
|--------|-------|
| **Total Pages** | 25+ |
| **API Endpoints** | 30+ |
| **React Components** | 15+ |
| **SVG Icons** | 1000+ |
| **Team Members** | 4 |
| **Commits** | 56+ |

---

##  Key Achievements

 Full-stack application with React + Node.js + Firebase  
 Role-based authentication and authorization  
 Responsive design for all devices  
 AI-powered job matching algorithm  
 Real-time application tracking  
 Cross-platform support (Web + Mobile)  
 1000+ custom SVG icons  
 Comprehensive error handling  
 Production-ready code structure  

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- **Cairo University** – For inspiring this project and providing real-world requirements
- **Faculty of Science** – For supporting student innovation
- **Firebase** – For amazing backend infrastructure
- **React Community** – For incredible tools and libraries
- **All Team Members** – For dedication and hard work

---

<div align="center">
  
  ##  Show Your Support
  
  If you find this project helpful, please give it a !

  <br>
  
  **Made with  by Cairo University Students**
  
 [![GitHub](https://img.shields.io/badge/GitHub-Reem--Ahmed711-181717?style=for-the-badge&logo=github)](https://github.com/Reem-Ahmed711)
[![GitHub](https://img.shields.io/badge/GitHub-Dina--Ebrahim-181717?style=for-the-badge&logo=github)](https://github.com/Dina-Ebrahim)
[![GitHub](https://img.shields.io/badge/GitHub-FatmaAbdelmotagly-181717?style=for-the-badge&logo=github)](https://github.com/FatmaAbdelmotagly)
[![GitHub](https://img.shields.io/badge/GitHub-Sara--Mahmoud1-181717?style=for-the-badge&logo=github)](https://github.com/Sara-Mahmoud1)

  <br>
  
  ###  Contact
  
  For any inquiries, please reach out to any team member.

</div>
