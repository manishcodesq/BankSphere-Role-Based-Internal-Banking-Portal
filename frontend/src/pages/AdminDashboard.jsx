import React, { useCallback, useEffect, useState } from "react";
import API from "../api/api";
import DashboardShell from "../components/DashboardShell";
import { RefreshCw, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const ROLES = ["customer", "employee", "manager", "admin"];

export default function AdminDashboard({ user, onLogout }) {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [pendingRes, usersRes] = await Promise.all([
        API.get("/api/v1/admin/accounts/pending"),
        API.get("/api/v1/admin/users"),
      ]);
      if (pendingRes.data?.success) {
        setPendingAccounts(pendingRes.data.data || []);
      }
      if (usersRes.data?.success) {
        setUsers(usersRes.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAccountAction = async (accountId, action) => {
    setActionId(accountId);
    try {
      await API.patch(`/api/v1/admin/accounts/${accountId}/${action}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    } finally {
      setActionId(null);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setActionId(userId);
    try {
      await API.patch(`/api/v1/admin/users/${userId}/role`, { role });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update role.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardShell user={user} onLogout={onLogout} subtitle="Administration Console">
      {loading ? (
        <div className="loader-block">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading platform controls...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-banner mb-4">{error}</div>}

          <section className="staff-panel">
            <div className="staff-panel-header">
              <ShieldCheck size={22} />
              <h2>Pending account approvals</h2>
            </div>
            {pendingAccounts.length === 0 ? (
              <p className="staff-empty">No accounts awaiting approval.</p>
            ) : (
              <div className="staff-table-wrap">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAccounts.map((acc) => (
                      <tr key={acc._id}>
                        <td>{acc.accountNumber}</td>
                        <td>{acc.userId?.name?.toUpperCase()}</td>
                        <td>{acc.accountType}</td>
                        <td className="staff-actions">
                          <button
                            type="button"
                            className="btn-approve"
                            disabled={actionId === acc._id}
                            onClick={() => handleAccountAction(acc._id, "approve")}
                          >
                            <CheckCircle2 size={16} /> Approve
                          </button>
                          <button
                            type="button"
                            className="btn-reject"
                            disabled={actionId === acc._id}
                            onClick={() => handleAccountAction(acc._id, "reject")}
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="staff-panel">
            <div className="staff-panel-header">
              <h2>User roles</h2>
            </div>
            <div className="staff-table-wrap">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name.toUpperCase()}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          className="role-select"
                          value={u.role?.trim().toLowerCase()}
                          disabled={u._id === user._id || actionId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
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
