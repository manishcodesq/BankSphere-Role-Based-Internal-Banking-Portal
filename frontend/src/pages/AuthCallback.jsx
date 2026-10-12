import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";
import { Landmark, AlertCircle } from "lucide-react";

export default function AuthCallback({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Google sign-in did not complete. Please try again.");
      return;
    }

    const completeSignIn = async () => {
      localStorage.setItem("token", token);
      try {
        const res = await API.get("/api/v1/users/me");
        if (res.data?.success) {
          onLogin(token, res.data.data);
          navigate("/", { replace: true });
        } else {
          localStorage.removeItem("token");
          setError("Could not load your profile after Google sign-in.");
        }
      } catch {
        localStorage.removeItem("token");
        setError("Session could not be established. Please sign in again.");
      }
    };

    completeSignIn();
  }, [searchParams, onLogin, navigate]);

  return (
    <div className="app-loader">
      <div className="brand-logo-container mb-4">
        <Landmark className="brand-icon" size={32} />
        <div className="brand-name">
          <span>Bank</span>
          <span className="brand-accent">Sphere</span>
        </div>
      </div>
      {error ? (
        <div className="oauth-error-pane">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/login", { replace: true })}
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <div className="loader-spinner"></div>
          <p>Completing secure Google sign-in...</p>
        </>
      )}
    </div>
  );
}
