import React, { useCallback, useEffect, useState } from "react";
import API from "../api/api";
import DashboardShell from "../components/DashboardShell";
import { RefreshCw, Users } from "lucide-react";

const MANAGER_ROLES = ["customer", "employee"];

export default function ManagerDashboard({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [accountsRes, usersRes] = await Promise.all([
        API.get("/api/v1/employee/accounts"),
        API.get("/api/v1/manager/users"),
      ]);
      if (accountsRes.data?.success) {
        setAccounts(accountsRes.data.data || []);
      }
      if (usersRes.data?.success) {
        setUsers(usersRes.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load manager workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRoleChange = async (userId, role) => {
    setActionId(userId);
    try {
      await API.patch(`/api/v1/manager/users/${userId}/role`, { role });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update role.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardShell user={user} onLogout={onLogout} subtitle="Manager Workspace">
      {loading ? (
        <div className="loader-block">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading branch operations...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-banner mb-4">{error}</div>}

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

          <section className="staff-panel">
            <div className="staff-panel-header">
              <h2>Team role assignment</h2>
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
                        {["manager", "admin"].includes(u.role?.trim().toLowerCase()) || u._id === user._id ? (
                          <span className={`role-badge role-${u.role?.trim().toLowerCase()}`}>{u.role}</span>
                        ) : (
                          <select
                            className="role-select"
                            value={u.role?.trim().toLowerCase()}
                            disabled={actionId === u._id}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          >
                            {MANAGER_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        )}
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
