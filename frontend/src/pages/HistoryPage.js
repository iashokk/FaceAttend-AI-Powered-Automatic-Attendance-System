import React, { useEffect, useState } from "react";
import api from "../api";

function HistoryPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | present | absent

  // Load classes
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

  // Load sessions for class
  const loadSessions = async (classId) => {
    if (!classId) return;
    try {
      const res = await api.get(`/sessions/by-class/${classId}`);
      setSessions(res.data);
      if (res.data.length > 0) {
        setSelectedSessionId(res.data[0].id.toString());
      } else {
        setSelectedSessionId("");
        setRecords([]);
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
      setError("Failed to load sessions.");
    }
  };

  // Load students for class
  const loadStudents = async (classId) => {
    if (!classId) return;
    try {
      const res = await api.get(`/students/by-class/${classId}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
      setError("Failed to load students.");
    }
  };

  // Load attendance for session
  const loadAttendance = async (sessionId) => {
    if (!sessionId) {
      setRecords([]);
      return;
    }
    try {
      const res = await api.get(`/attendance/sessions/${sessionId}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setError("Failed to load attendance records.");
    }
  };

  // Initial
  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When class changes → sessions + students
  useEffect(() => {
    if (selectedClassId) {
      loadSessions(selectedClassId);
      loadStudents(selectedClassId);
    }
  }, [selectedClassId]);

  // When session changes → records
  useEffect(() => {
    if (selectedSessionId) loadAttendance(selectedSessionId);
  }, [selectedSessionId]);

  // Map student_id → name, roll
  const studentMap = students.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const enrichedRecords = records.map((r) => {
    const s = studentMap[r.student_id];
    return {
      ...r,
      studentName: s ? s.name : `ID ${r.student_id}`,
      rollNumber: s ? s.roll_number : "-",
    };
  });

  // Apply filter
  const filteredRecords = enrichedRecords.filter((r) => {
    if (filterStatus === "Present") return r.status === "Present";
    if (filterStatus === "Absent") return r.status === "Absent";
    return true;
  });

  // Summary
  const total = enrichedRecords.length;
  const presentCount = enrichedRecords.filter((r) => r.status === "Present").length;
  const absentCount = enrichedRecords.filter((r) => r.status === "Absent").length;
  const percent =
    total > 0 ? Math.round((presentCount / total) * 100) : 0;

  const renderStatusBadge = (status) => {
    if (status === "Present")
      return <span className="badge badge-success">Present</span>;
    if (status === "Absent")
      return <span className="badge badge-warning">Absent</span>;
    return <span className="badge badge-muted">{status}</span>;
  };

  return (
    <>
      {/* Filters + Summary */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Attendance History</div>
            <div className="card-subtitle">
              Select class & session, then filter and review attendance.
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

            {/* Summary */}
            <div className="form-group">
              <label className="form-label">Summary</label>
              <div style={{ fontSize: 13 }}>
                <div>Total records: <b>{total}</b></div>
                <div>Present: <b>{presentCount}</b></div>
                <div>Absent: <b>{absentCount}</b></div>
                <div>Attendance %: <b>{percent}%</b></div>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="form-group">
              <label className="form-label">Filter</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className={
                    "btn btn-outline" +
                    (filterStatus === "all" ? " nav-link-active" : "")
                  }
                  style={{ fontSize: 11, padding: "4px 10px" }}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={
                    "btn btn-outline" +
                    (filterStatus === "Present" ? " nav-link-active" : "")
                  }
                  style={{ fontSize: 11, padding: "4px 10px" }}
                  onClick={() => setFilterStatus("Present")}
                >
                  Present only
                </button>
                <button
                  type="button"
                  className={
                    "btn btn-outline" +
                    (filterStatus === "Absent" ? " nav-link-active" : "")
                  }
                  style={{ fontSize: 11, padding: "4px 10px" }}
                  onClick={() => setFilterStatus("Absent")}
                >
                  Absent only
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-error" style={{ marginTop: 8 }}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Records table with student name + roll */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Session Records</div>
          <div className="card-subtitle">
            {filteredRecords.length === 0
              ? "No records for this filter."
              : `${filteredRecords.length} record(s) shown`}
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Status</th>
                  <th>Marked At</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{idx + 1}</td>
                    <td>{r.studentName}</td>
                    <td>{r.rollNumber}</td>
                    <td>{renderStatusBadge(r.status)}</td>
                    <td>
                      {r.marked_at
                        ? new Date(r.marked_at).toLocaleString()
                        : "-"}
                    </td>
                    <td>{r.source}</td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={6}>No records for this session/filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af" }}>
            Now you can quickly see who is present/absent for a session,
            filter by status, and read student names directly.
          </div>
        </div>
      </div>
    </>
  );
}

export default HistoryPage;
