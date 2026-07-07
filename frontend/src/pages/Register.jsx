import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { User, Mail, Lock, AlertCircle, ArrowRight, Landmark, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/api/v1/users/register", { name, email, password });
      if (res.data && res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Registration failed. Email or name may already be registered."
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
          <h2>Create Online Account</h2>
          <p>Register for secure online banking services</p>
        </div>

        {success ? (
          <div className="success-pane">
            <CheckCircle2 size={48} className="success-icon" />
            <h3>Registration Successful!</h3>
            <p>Your online banking profile has been created.</p>
            <p className="redirect-note">Redirecting you to login page in 3 seconds...</p>
            <button onClick={() => navigate("/login")} className="btn-primary auth-submit">
              Go to Login Immediately
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="error-banner">
                <AlertCircle size={18} className="error-icon" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a strong password"
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
                    Register Account <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an online profile?{" "}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
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
