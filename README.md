<div align="center">

![StudyHub Banner](https://img.shields.io/badge/StudyHub-AI%20Powered%20LMS-blueviolet?style=for-the-badge)

![React](https://img.shields.io/badge/React-19-blue?style=flat-square\&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange?style=flat-square\&logo=firebase)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-green?style=flat-square\&logo=google)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square\&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-success?style=flat-square)

### 🌐 Live Demo

🔗 [https://gcp-dusky.vercel.app](https://gcp-dusky.vercel.app)

### 💻 GitHub Repository

🔗 [https://github.com/albertlivingstan/gcp.git](https://github.com/albertlivingstan/gcp.git)

</div>

---

# ✨ About StudyHub

**StudyHub** is a modern **AI-powered Learning Management System (LMS)** built specifically for engineering students.
The platform combines:

✅ Real-time communication
✅ AI-assisted learning
✅ Gamified student engagement
✅ Modern responsive UI
✅ Cloud-powered backend services

The goal of StudyHub is to make learning smarter, faster, and more interactive using the power of Artificial Intelligence and modern web technologies.

---

# 🎯 Key Features

## 🤖 AI Tutor Integration

* Instant doubt clarification using **Gemini AI**
* Smart academic assistance
* Interactive AI-powered responses

## 💬 Real-Time Multimedia Chat

* Student collaboration system
* Real-time messaging
* Multimedia sharing support

## 📈 Gamified Progress Tracking

* Learning achievements
* Student performance tracking
* Motivation through progress systems

## 🔐 Authentication & Security

* Firebase Authentication
* Secure cloud database integration
* Protected user sessions

## 📱 Responsive Modern UI

* Mobile-friendly interface
* Clean and modern design
* Optimized user experience

---
High-Level System Architecture
The following diagram illustrates how the frontend React application, the custom real-time messaging server, Firebase infrastructure, and Generative AI services interact:
<img width="1535" height="419" alt="Screenshot 2026-06-01 at 10 23 42 PM" src="https://github.com/user-attachments/assets/6e410c95-1254-4c99-b468-8d0de4bb9522" />



# 🛠️ Tech Stack

| Technology | Purpose                  |
| ---------- | ------------------------ |
| React      | Frontend Framework       |
| Vite       | Fast Build Tool          |
| Firebase   | Backend & Authentication |
| Gemini AI  | AI Tutor Integration     |
| JavaScript | Application Logic        |
| Vercel     | Deployment Platform      |

---

# ⚡ Project Architecture

```bash
gcp/
├── package.json                   # Client dependencies (React 19, Tailwind v4, Lucide, Framer Motion)
├── vite.config.js                 # Vite bundler configuration & PWA Plugin
├── 24CS2019_DevOps_Lab.html       # [Standalone] DevOps interactive lab interface
├── gcp_lab_revision_site.html     # [Standalone] GCP console and CLI revision guide
├── server/                        # Real-Time WebSocket Server
│   ├── package.json               # Server metadata (Express 5, Socket.IO 4)
│   └── index.js                   # Main Node.js socket server entry point
└── src/                           # Client React Source
    ├── main.jsx                   # Application entry point & DOM Mounting
    ├── App.jsx                    # Central route orchestration & Theme controller
    ├── firebase.js                # Firebase configuration & service initialization
    ├── index.css                  # Tailwinds directives & globally managed style systems
    ├── components/                # Reusable presentation and utility modules
    │   ├── layout/
    │   │   └── SmartHubLayout.jsx # Master Layout wrapper for the Premium Smart Hub Dashboard
    │   ├── ChatBox.jsx            # Gemini integration widget with system templates
    │   ├── LiveChat.jsx           # Live peer chat workspace (attaches to socket)
    │   ├── InstallPopup.jsx       # PWA add-to-home prompt controller
    │   └── SplashScreen.jsx       # Introductory visual sequence
    ├── context/
    │   └── AuthContext.jsx        # Google OAuth callback management, domain filters, and profiles
    ├── data/
    │   └── mockData.js            # Offline-fallback datasets (Subjects, PPTs, Big Questions)
    ├── pages/                     # Routed page canvases
    │   ├── Home.jsx               # Navigation catalog showcasing subjects & standalone labs
    │   ├── SubjectPage.jsx        # Core view containing materials, video playlist, and scratchpads
    │   ├── TrendsPage.jsx         # Study statistics and tracking page
    │   ├── admin/                 # Material uploading, approval and teacher portals
    │   │   ├── AdminDashboard.jsx
    │   │   └── AdminLogin.jsx
    │   ├── student/               # Smart Hub portals
    │   │   ├── StudentDashboard.jsx
    │   │   ├── SubjectsHub.jsx    # Managed subjects viewport
    │   │   ├── QuizSystem.jsx     # Gamified MCQs & dynamic score tracking
    │   │   ├── MarksPortal.jsx    # Grades tracking panel
    │   │   └── AITutor.jsx        # Direct dedicated chatbot canvas
    │   └── teacher/
    │       └── TeacherDashboard.jsx
    └── utils/
        └── cn.js                  # CSS class-merging helper (clsx + tailwind-merge)
```

---

# 🚀 Getting Started

## 📥 Clone the Repository

```bash
git clone https://github.com/albertlivingstan/gcp.git
```

## 📂 Navigate to Project

```bash
cd gcp
```

## 📦 Install Dependencies

```bash
npm install
```

## ▶️ Start Development Server

```bash
npm run dev
```

---

# 🔥 Firebase Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

# 🤖 Gemini AI Setup

Add your Gemini API key inside `.env`:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

# 📸 Screenshots

## 🏠 Dashboard

*Add your screenshot here*

## 💬 AI Chat

*Add your screenshot here*

## 📊 Progress Tracking

*Add your screenshot here*

---

# 🎥 Project Demo

📹 Add your demo video link here

```md
[Watch Demo](YOUR_VIDEO_LINK)
```

---

# 🌟 Future Enhancements

* 📚 Personalized AI Study Plans
* 🧠 Smart Quiz Generator
* 🎥 Live Video Classes
* 🏆 Leaderboards & Rewards
* 📊 Advanced Analytics Dashboard

---

# 📈 Learning Outcomes

This project helped me improve my skills in:

✅ Full Stack Development
✅ React Ecosystem
✅ Firebase Integration
✅ AI Integration in Web Apps
✅ Real-Time Systems
✅ UI/UX Design
✅ Cloud Deployment

---

# 🤝 Contributing

Contributions are welcome!

```bash
Fork → Clone → Create Branch → Commit → Push → Pull Request
```

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Developer

### Albert Livingstan

🔗 LinkedIn: https://www.linkedin.com/posts/albert-livingstan-g_react-firebase-ai-ugcPost-7467245104680931331-cNMU/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEXLttIBmxrwBidLCsac_9-ityJgCER6myU

---

<div align="center">

## ⭐ If you like this project, give it a star on GitHub ⭐

### 🚀 StudyHub — Smart Learning Powered by AI

</div>
