import React from "react";
import CustomerDashboard from "./CustomerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard({ user, onLogout }) {
  const normalizedRole = user?.role?.trim().toLowerCase();
  switch (normalizedRole) {
    case "admin":
      return <AdminDashboard user={user} onLogout={onLogout} />;
    case "manager":
      return <ManagerDashboard user={user} onLogout={onLogout} />;
    case "employee":
      return <EmployeeDashboard user={user} onLogout={onLogout} />;
    default:
      return <CustomerDashboard user={user} onLogout={onLogout} />;
  }
}
