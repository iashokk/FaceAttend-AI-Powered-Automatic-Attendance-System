# 📸 FaceAttend – AI Powered Automatic Attendance System

🚀 Face Recognition Attendance | FastAPI Backend | React PWA Frontend | SQLite | Offline Processing

Upload a group photo → System automatically detects faces → Matches students → Marks Present/Absent for the entire class.

## 🌟 Overview

FaceAttend is a modern, intelligent attendance management system built using Python FastAPI, React, and face-recognition AI. It allows teachers to:

- Add students and register their face
- Create multiple attendance sessions per day (Morning/Afternoon/Evening)
- Upload a group photo to auto-mark attendance
- Instantly view daily attendance in a clean matrix view
- Works on Laptop + Mobile as a PWA
- Completely offline face recognition (no cloud APIs)

**Perfect for:** 🎓 College Projects | 🧪 Research | 🏫 Schools | 🏛️ Institutes | 🧑‍🏭 Company Training Programs

## 🏗️ System Architecture

```
┌─────────────────────────┐
│        Frontend         │
│  React + PWA + Axios    │
└────────────┬────────────┘
             │ JSON API
┌────────────▼────────────┐
│      Backend (FastAPI)   │
│  - Auth / CRUD / Sessions│
└────────────┬────────────┘
             │ SQLite DB
┌────────────▼────────────┐
│  Face Recognition (cv2) │
│  - Embeddings & Matching│
└─────────────────────────┘
```

## 🔥 Key Features

- **Class & Student Management** - Create classes, add students with registered faces
- **AI Attendance Marking** - Auto-detect faces in group photos and mark attendance
- **Session Handling** - Multiple sessions per day (Morning/Afternoon/Evening)
- **Daily Matrix View** - Teacher-friendly table format with presence summary
- **PWA Support** - Installable on mobile/desktop
- **Offline Processing** - No internet required for face recognition

## 🛠️ Tech Stack

**Frontend:** React, Axios, PWA, Custom CSS  
**Backend:** FastAPI, SQLAlchemy, SQLite, face_recognition, OpenCV  
**Other:** JWT Authentication, REST APIs

## 📦 Installation

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
API: `http://localhost:8000` | Docs: `http://localhost:8000/docs`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend: `http://localhost:3000`

## 🧪 How to Use

1. **Register/Login** - Create teacher account at localhost:3000
2. **Create Class** - Add a new class (e.g., "CSE - A")
3. **Add Students** - Upload student photos for face registration
4. **Create Sessions** - Set up Morning/Afternoon/Evening sessions
5. **Mark Attendance** - Upload group photo → AI marks present/absent
6. **View History** - Check daily matrix with attendance summary

## 📁 Project Structure

```
/
├── backend/
│   ├── app/ (routers, services, models, schemas)
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   ├── src/ (pages, components, API calls)
│   └── package.json
└── README.md
```

## 🙌 Contributors

- **Ashok** – Lead Developer
- **ChatGPT** – Architecture & Development Assistance

## 📄 License

MIT License – Free for academic and commercial use.

## ⭐ Support

If you like this project, please star the repo and share it with your friends!
