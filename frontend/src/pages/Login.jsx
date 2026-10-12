import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API, { googleAuthUrl } from "../api/api";
import { Lock, Mail, AlertCircle, ArrowRight, Landmark } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "google_auth_failed") {
      setError("Google sign-in was cancelled or failed. Please try again.");
    }
  }, [searchParams]);

  const handleGoogleSignIn = () => {
    window.location.href = googleAuthUrl;
  };

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

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

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
           A secure, role-based digital banking platform engineered for modern financial operations with enterprise-grade authentication and intuitive user experiences.
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
                <strong>Enterprise Banking</strong>
                <p>Manage deposits, withdrawals, transfers, and transaction history securely.
</p>
              </div>
            </div>
            <div className="info-feature-item">
              <div className="feature-icon-box">✓</div>
              <div>
                <strong>Multi-Role Platform</strong>
                <p>Dedicated dashboards for Customers, Employees, Managers, and Administrators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
