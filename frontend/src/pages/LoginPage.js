import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../api";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      const token = res.data.access_token;
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Login failed. Check email/password.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-title">Welcome back 👋</div>
        <div className="auth-sub">
          Login to manage your classes and face attendance.
        </div>

        <form onSubmit={handleSubmit} className="form-grid" style={{ marginBottom: 10 }}>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-error" style={{ gridColumn: "1 / -1" }}>
              {error}
            </div>
          )}
          <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Login
            </button>
          </div>
        </form>

        <div style={{ fontSize: 12 }}>
          New here?{" "}
          <Link to="/register" className="link-inline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
