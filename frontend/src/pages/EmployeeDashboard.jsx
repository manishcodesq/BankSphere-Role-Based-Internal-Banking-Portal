import React, { useCallback, useEffect, useState } from "react";
import API from "../api/api";
import DashboardShell from "../components/DashboardShell";
import { RefreshCw, Users } from "lucide-react";

export default function EmployeeDashboard({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [accountsRes, customersRes] = await Promise.all([
        API.get("/api/v1/employee/accounts"),
        API.get("/api/v1/employee/customers"),
      ]);
      if (accountsRes.data?.success) {
        setAccounts(accountsRes.data.data || []);
      }
      if (customersRes.data?.success) {
        setCustomers(customersRes.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employee workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DashboardShell user={user} onLogout={onLogout} subtitle="Employee Workspace">
      {loading ? (
        <div className="loader-block">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading customer records...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-banner mb-4">{error}</div>}

          <div className="staff-stats-row">
            <div className="staff-stat-card">
              <span>Total accounts</span>
              <strong>{accounts.length}</strong>
            </div>
            <div className="staff-stat-card">
              <span>Registered customers</span>
              <strong>{customers.length}</strong>
            </div>
          </div>

          <section className="staff-panel">
            <div className="staff-panel-header">
              <Users size={22} />
              <h2>Account registry</h2>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Account #</th>
                    <th>Holder</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc._id}>
                      <td>{acc.accountNumber}</td>
                      <td>{acc.userId?.name?.toUpperCase()}</td>
                      <td>{acc.accountType}</td>
                      <td>
                        <span className={`status-pill status-${acc.status?.toLowerCase()}`}>
                          {acc.status}
                        </span>
                      </td>
                      <td>₹ {acc.balance?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
