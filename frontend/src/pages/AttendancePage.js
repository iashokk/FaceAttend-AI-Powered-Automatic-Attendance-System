import React, { useEffect, useState } from "react";
import api from "../api";

function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
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
      if (res.data.length > 0) {
        setSelectedSessionId(res.data[0].id.toString());
      } else {
        setSelectedSessionId("");
      }
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

  const handleUploadPhoto = async (file) => {
    if (!file || !selectedSessionId) {
      setError("Please select a session and choose a photo.");
      return;
    }
    setError("");
    setResult(null);
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(
        `/attendance/sessions/${selectedSessionId}/photo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      console.error("Failed to upload group photo", err);
      setError(
        err?.response?.data?.detail || "Failed to process group photo. Try a clearer image."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Selection card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Mark Attendance from Group Photo</div>
            <div className="card-subtitle">
              Select class & session, then upload a group photo to auto-mark present students.
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
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
              <label className="form-label">Session</label>
              <select
                className="form-select"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {s.date}
                  </option>
                ))}
                {sessions.length === 0 && <option>No sessions yet</option>}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Group Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-file"
                onChange={(e) => handleUploadPhoto(e.target.files[0])}
                disabled={uploading}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              {uploading && <span style={{ fontSize: 12 }}>Uploading & processing...</span>}
            </div>
          </div>
          {error && <div className="text-error" style={{ marginTop: 8 }}>{error}</div>}
        </div>
      </div>

      {/* Result card */}
      {result && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Detection Result</div>
            <div className="card-subtitle">
              Faces detected in group photo vs students matched in database.
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div>
                <div className="form-label">Faces Detected</div>
                <div style={{ fontSize: 22 }}>{result.faces_detected ?? "-"}</div>
              </div>
              <div>
                <div className="form-label">Students Marked Present</div>
                <div style={{ fontSize: 22 }}>{result.students_marked_count ?? "-"}</div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="form-label">Present Students</div>
              {(!result.marked_present || result.marked_present.length === 0) && (
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  No registered students were matched from this photo.
                </div>
              )}
              {result.marked_present && result.marked_present.length > 0 && (
                <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 13 }}>
                  {result.marked_present.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AttendancePage;
