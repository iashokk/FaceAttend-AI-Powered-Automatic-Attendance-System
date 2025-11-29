import React, { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Get all classes
      const classesRes = await api.get("/classes");
      const classes = classesRes.data || [];
      setTotalClasses(classes.length);

      if (classes.length === 0) {
        setTotalStudents(0);
        setSessionsToday(0);
        setLoading(false);
        return;
      }

      // 2. Prepare calls for students + sessions per class
      const studentPromises = classes.map((c) =>
        api.get(`/students/by-class/${c.id}`)
      );
      const sessionPromises = classes.map((c) =>
        api.get(`/sessions/by-class/${c.id}`)
      );

      const [studentsResults, sessionsResults] = await Promise.all([
        Promise.all(studentPromises),
        Promise.all(sessionPromises),
      ]);

      // 3. Total students across all classes
      let studentCount = 0;
      studentsResults.forEach((res) => {
        if (Array.isArray(res.data)) {
          studentCount += res.data.length;
        }
      });
      setTotalStudents(studentCount);

      // 4. Sessions for "today"
      const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      let todaySessionsCount = 0;
      sessionsResults.forEach((res) => {
        (res.data || []).forEach((s) => {
          if (s.date === todayStr) {
            todaySessionsCount += 1;
          }
        });
      });
      setSessionsToday(todaySessionsCount);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setError("Unable to load stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const displayValue = (value) => {
    if (loading) return "…";
    return value;
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Overview</div>
            <div className="card-subtitle">
              Quick stats for your attendance system.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: 11, padding: "4px 10px" }}
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <div className="card-body">
          {error && (
            <div className="text-error" style={{ marginBottom: 10 }}>
              {error}
            </div>
          )}
          <div className="form-grid">
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ fontSize: 14 }}>
                Classes
              </div>
              <div style={{ fontSize: 24, marginTop: 4 }}>
                {displayValue(totalClasses)}
              </div>
              <div className="card-subtitle">Total classes configured</div>
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ fontSize: 14 }}>
                Students
              </div>
              <div style={{ fontSize: 24, marginTop: 4 }}>
                {displayValue(totalStudents)}
              </div>
              <div className="card-subtitle">Total enrolled students</div>
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ fontSize: 14 }}>
                Sessions Today
              </div>
              <div style={{ fontSize: 24, marginTop: 4 }}>
                {displayValue(sessionsToday)}
              </div>
              <div className="card-subtitle">
                Attendance sessions planned for today
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
