import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { Lock, Mail, AlertCircle, ArrowRight, Landmark } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/api/v1/users/login", { email, password });
      if (res.data && res.data.success) {
        const { accessToken, user } = res.data.data;
        onLogin(accessToken, user);
        navigate("/");
      } else {
        setError(res.data.message || "Failed to login");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid credentials, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo-container">
            <Landmark className="brand-icon" size={32} />
            <div className="brand-name">
              <span>Bank</span>
              <span className="brand-accent">Sphere</span>
              <div className="brand-arc"></div>
            </div>
          </div>
          <h2>Sign In to Online Banking</h2>
          <p>Access your accounts securely</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Secure Login <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an online account?{" "}
            <Link to="/register" className="auth-link">
              Register now
            </Link>
          </p>
        </div>
      </div>
      <div className="auth-info-pane">
        <div className="info-pane-content">
          <h3>Welcome to BankSphere</h3>
          <p>
            Experience our next-generation digital banking platform. Designed with
            world-class security and intuitive navigation.
          </p>
          <div className="info-features">
            <div className="info-feature-item">
              <div className="feature-icon-box">✓</div>
              <div>
                <strong>Secure Transfers</strong>
                <p>Move funds instantly using our encrypted channel.</p>
              </div>
            </div>
            <div className="info-feature-item">
              <div className="feature-icon-box">✓</div>
              <div>
                <strong>Flexible Accounts</strong>
                <p>Choose between Savings or Current account types.</p>
              </div>
            </div>
            <div className="info-feature-item">
              <div className="feature-icon-box">✓</div>
              <div>
                <strong>Citi-grade Experience</strong>
                <p>A corporate theme that represents integrity and trust.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
