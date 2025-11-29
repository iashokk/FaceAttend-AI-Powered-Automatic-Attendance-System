import React, { useEffect, useState } from "react";
import api from "../api";

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to load classes", err);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/classes", { name, description });
      setName("");
      setDescription("");
      loadClasses();
    } catch (err) {
      console.error("Failed to create class", err);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Create Class</div>
            <div className="card-subtitle">
              Add a new class (like CSE - A, ECE - 3rd Year, etc).
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreate} className="form-grid">
            <div className="form-group">
              <label className="form-label">Class Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="CSE - A"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="3rd year section"
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                + Add Class
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Existing Classes</div>
          <div className="card-subtitle">
            {classes.length === 0 ? "No classes added yet." : `${classes.length} class(es)`}
          </div>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Class Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c, idx) => (
                  <tr key={c.id}>
                    <td>{idx + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.description || "-"}</td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan={3}>No classes yet.</td>
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

export default ClassesPage;
