import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teacher");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Registration failed.";
      setError(msg);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-title">Create account ✨</div>
        <div className="auth-sub">
          Setup your teacher/admin account for the attendance portal.
        </div>

        <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: 10 }}>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-error" style={{ gridColumn: "1 / -1" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="text-success" style={{ gridColumn: "1 / -1" }}>
              {success}
            </div>
          )}

          <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Register
            </button>
          </div>
        </form>

        <div style={{ fontSize: 12 }}>
          Already have an account?{" "}
          <Link to="/login" className="link-inline">
            Login instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
