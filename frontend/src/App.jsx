import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import API from "./api/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/api/v1/users/me");
      if (res.data && res.data.success) {
        setUser(res.data.data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await API.post("/api/v1/users/logout");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="app-loader">
        <div className="loader-spinner"></div>
        <p>Connecting securely to BankSphere...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Dashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}