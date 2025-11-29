import React, { useEffect, useState } from "react";
import api from "../api";

function StudentsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [uploadingFor, setUploadingFor] = useState(null);
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

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/students", {
        name: studentName,
        roll_number: rollNumber,
        class_id: Number(selectedClassId),
      });
      setStudentName("");
      setRollNumber("");
      loadStudents(selectedClassId);
    } catch (err) {
      console.error("Failed to create student", err);
      setError("Failed to create student.");
    }
  };

  const handleFaceUpload = async (studentId, file) => {
    if (!file) return;
    setError("");
    try {
      setUploadingFor(studentId);
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/faces/students/${studentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Face uploaded & encoding saved");
    } catch (err) {
      console.error("Failed to upload face", err);
      setError("Face upload failed. Try another clear front-facing photo.");
    } finally {
      setUploadingFor(null);
    }
  };

  return (
    <>
      {/* Top card: class selection + add student */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Manage Students</div>
            <div className="card-subtitle">
              Choose a class, add students and register their faces.
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateStudent} className="form-grid">
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
              <label className="form-label">Student Name</label>
              <input
                className="form-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                className="form-input"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g., 21CS001"
                required
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                + Add Student
              </button>
            </div>
          </form>

          {error && <div className="text-error" style={{ marginTop: 8 }}>{error}</div>}
        </div>
      </div>

      {/* Students table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Students in Selected Class</div>
          <div className="card-subtitle">
            {students.length === 0
              ? "No students added yet."
              : `${students.length} student(s)`}
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Face Registration</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{idx + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.roll_number}</td>
                    <td>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-file"
                        onChange={(e) =>
                          handleFaceUpload(s.id, e.target.files[0])
                        }
                        disabled={uploadingFor === s.id}
                      />
                      {uploadingFor === s.id && (
                        <span style={{ marginLeft: 8, fontSize: 12 }}>
                          Uploading...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4}>No students yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af" }}>
            Tip: Upload clear, front-facing images for best recognition accuracy.
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentsPage;
