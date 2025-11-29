// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
// import RegisterPage from "./pages/RegisterPage";
// import LoginPage from "./pages/LoginPage";
// import Dashboard from "./pages/Dashboard";
// import ClassesPage from "./pages/ClassesPage";
// import StudentsPage from "./pages/StudentsPage";
// import SessionsPage from "./pages/SessionsPage";
// import AttendancePage from "./pages/AttendancePage";
// import HistoryPage from "./pages/HistoryPage";
// import "./App.css";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// }

// function App() {
//   return (
//     <Router>
//       <div>
//         <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
//           <Link to="/" style={{ marginRight: "20px" }}>Home</Link>
//           <Link to="/classes" style={{ marginRight: "10px" }}>Classes</Link>
//           <Link to="/students" style={{ marginRight: "10px" }}>Students</Link>
//           <Link to="/sessions" style={{ marginRight: "10px" }}>Sessions</Link>
//           <Link to="/attendance" style={{ marginRight: "10px" }}>Attendance</Link>
//           <Link to="/history" style={{ marginRight: "10px" }}>History</Link>
//         </header>

//         <main style={{ padding: "20px" }}>
//           <Routes>
//             <Route path="/register" element={<RegisterPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route
//               path="/"
//               element={
//                 <PrivateRoute>
//                   <Dashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/classes"
//               element={
//                 <PrivateRoute>
//                   <ClassesPage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/students"
//               element={
//                 <PrivateRoute>
//                   <StudentsPage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/sessions"
//               element={
//                 <PrivateRoute>
//                   <SessionsPage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/attendance"
//               element={
//                 <PrivateRoute>
//                   <AttendancePage />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/history"
//               element={
//                 <PrivateRoute>
//                   <HistoryPage />
//                 </PrivateRoute>
//               }
//             />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ClassesPage from "./pages/ClassesPage";
import StudentsPage from "./pages/StudentsPage";
import SessionsPage from "./pages/SessionsPage";
import AttendancePage from "./pages/AttendancePage";
import HistoryPage from "./pages/HistoryPage";
import { setAuthToken } from "./api";
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/login");
  };

  // For topbar title based on route
  const routeTitleMap = {
    "/": "Dashboard",
    "/classes": "Classes",
    "/students": "Students",
    "/sessions": "Sessions",
    "/attendance": "Attendance",
    "/history": "History",
  };
  const title = routeTitleMap[location.pathname] || "Face Attendance";

  return (
    <div className="app-root">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="logo-block">
          <div className="logo-mark">FA</div>
          <div>
            <div className="logo-text-main">FaceAttend</div>
            <div className="logo-text-sub">Smart Attendance System</div>
          </div>
        </div>

        <div>
          <div className="nav-section-title">Navigation</div>
          <nav className="app-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              <span className="icon">🏠</span>
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/classes"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              <span className="icon">🏫</span>
              <span>Classes</span>
            </NavLink>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              <span className="icon">👥</span>
              <span>Students</span>
            </NavLink>
            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              <span className="icon">📅</span>
              <span>Sessions</span>
            </NavLink>
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              <span className="icon">📸</span>
              <span>Mark Attendance</span>
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              <span className="icon">📊</span>
              <span>History</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          {token && (
            <button className="btn-logout" onClick={handleLogout}>
              <span>⏏</span>
              <span>Logout</span>
            </button>
          )}
          <div style={{ marginTop: 6 }}>Final Year Project · 2025</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="app-main">
        <div className="app-topbar">
          <div>
            <div className="app-topbar-title">{title}</div>
            <div className="app-topbar-sub">
              Manage classes, students and attendance via face recognition.
            </div>
          </div>
          <div className="chip-pill">PWA · Python + FastAPI · React</div>
        </div>

        <div>{children}</div>
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <PrivateRoute>
            <Layout>
              <ClassesPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute>
            <Layout>
              <StudentsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <PrivateRoute>
            <Layout>
              <SessionsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Layout>
              <AttendancePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <Layout>
              <HistoryPage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
