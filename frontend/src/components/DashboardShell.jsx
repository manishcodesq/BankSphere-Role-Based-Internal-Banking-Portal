import React from "react";
import { Landmark, LogOut, UserCircle } from "lucide-react";

const ROLE_LABELS = {
  customer: "Customer",
  employee: "Employee",
  manager: "Manager",
  admin: "Administrator",
};

export default function DashboardShell({ user, onLogout, children, subtitle }) {
  return (
    <div className="dashboard-layout">
      <header className="navbar">
        <div className="nav-container">
          <div className="brand-logo-container">
            <Landmark className="brand-icon" size={24} />
            <div className="brand-name font-small">
              <span>Bank</span>
              <span className="brand-accent">Sphere</span>
              <div className="brand-arc mini"></div>
            </div>
          </div>
          <div className="user-controls">
            <span className={`role-badge role-${user.role?.trim().toLowerCase()}`}>
              {ROLE_LABELS[user.role?.trim().toLowerCase()] || user.role}
            </span>
            <div className="user-profile">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="profile-avatar" />
              ) : (
                <UserCircle size={20} className="profile-icon" />
              )}
              <span>{user.name.toUpperCase()}</span>
            </div>
            <button className="btn-logout" onClick={onLogout} title="Sign Out">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        {subtitle && (
          <div className="dashboard-page-header">
            <h1>{subtitle}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
