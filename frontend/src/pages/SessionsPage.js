import React, { useEffect, useState } from "react";
import api from "../api";

function SessionsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
      if (res.data.length > 0 && !selectedClassId) {
        setSelectedClassId(res.data[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load classes", err);
      setError("Failed to load classes.");
    }
  };

  const loadSessions = async (classId) => {
    if (!classId) return;
    try {
      const res = await api.get(`/sessions/by-class/${classId}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to load sessions", err);
      setError("Failed to load sessions.");
    }
  };

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClassId) loadSessions(selectedClassId);
  }, [selectedClassId]);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/sessions", {
        class_id: Number(selectedClassId),
        title,
        date,
      });
      setTitle("");
      setDate("");
      loadSessions(selectedClassId);
    } catch (err) {
      console.error("Failed to create session", err);
      setError("Failed to create session.");
    }
  };

  return (
    <>
      {/* Create session card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Create Attendance Session</div>
            <div className="card-subtitle">
              Define a session (e.g. &ldquo;Morning Attendance&rdquo;, &ldquo;Lab&rdquo;).
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateSession} className="form-grid">
            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                className="form-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {classes.length === 0 && <option>No classes yet</option>}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Session Title</label>
              <input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Morning Attendance"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                + Create Session
              </button>
            </div>
          </form>
          {error && <div className="text-error" style={{ marginTop: 8 }}>{error}</div>}
        </div>
      </div>

      {/* Sessions list card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Sessions for Selected Class</div>
          <div className="card-subtitle">
            {sessions.length === 0
              ? "No sessions yet."
              : `${sessions.length} session(s) configured`}
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{idx + 1}</td>
                    <td>{s.title}</td>
                    <td>{s.date}</td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={3}>No sessions created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionsPage;
