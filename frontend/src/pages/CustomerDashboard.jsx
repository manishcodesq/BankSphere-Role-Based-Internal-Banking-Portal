import React, { useEffect, useState } from "react";
import API from "../api/api";
import AccountCard from "../components/AccountCard";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import DashboardShell from "../components/DashboardShell";
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function CustomerDashboard({ user, onLogout }) {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [hasNoAccount, setHasNoAccount] = useState(false);
  const [accountType, setAccountType] = useState("SAVINGS");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/api/v1/accounts/my");
      if (res.data && res.data.success) {
        setAccount(res.data.data.account);
        setTransactions(res.data.data.transactions || []);
        setHasNoAccount(false);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setHasNoAccount(true);
        setAccount(null);
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.message || "Access denied for this portal.");
      } else {
        setError(err.response?.data?.message || "Failed to load account data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await API.post("/api/v1/accounts", { accountType });
      if (res.data && res.data.success) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCredits = transactions
    .filter((tx) => tx.type === "CREDIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebits = transactions
    .filter((tx) => tx.type === "DEBIT")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const isPending = account?.status === "PENDING";
  const isRejected = account?.status === "REJECTED";
  const isSuspended = account?.status === "SUSPENDED";

  return (
    <DashboardShell user={user} onLogout={onLogout} subtitle="Online Banking">
      {loading && !account && !hasNoAccount ? (
        <div className="loader-block">
          <RefreshCw className="spin-icon" size={32} />
          <p>Verifying secure connection and fetching accounts...</p>
        </div>
      ) : error && !account ? (
        <div className="dashboard-error-pane">
          <h3>System Notification</h3>
          <p>{error}</p>
          <button onClick={loadData} className="btn-secondary">
            Retry Connection
          </button>
        </div>
      ) : hasNoAccount ? (
        <div className="onboarding-container">
          <div className="onboarding-card">
            <div className="onboarding-header">
              <ShieldCheck size={48} className="onboard-icon" />
              <h2>Setup Your Digital Account</h2>
              <p>
                Welcome to BankSphere! To begin transacting, please open your first account below.
                An administrator will review and approve your application.
              </p>
            </div>

            {error && <div className="error-banner mb-4">{error}</div>}

            <form onSubmit={handleCreateAccount} className="onboarding-form">
              <div className="account-options-grid">
                <label
                  className={`account-option-box ${accountType === "SAVINGS" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="SAVINGS"
                    checked={accountType === "SAVINGS"}
                    onChange={() => setAccountType("SAVINGS")}
                  />
                  <div className="option-content">
                    <div className="option-title">Savings Account</div>
                    <p>Earn daily interest, no minimum balance, and get 24/7 online transfers.</p>
                  </div>
                </label>

                <label
                  className={`account-option-box ${accountType === "CURRENT" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="CURRENT"
                    checked={accountType === "CURRENT"}
                    onChange={() => setAccountType("CURRENT")}
                  />
                  <div className="option-content">
                    <div className="option-title">Current Account</div>
                    <p>Perfect for frequent business transactions, high volume transfers, and drafts.</p>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn-primary onboard-submit" disabled={creating}>
                {creating ? <span className="spinner"></span> : "Submit Account Application"}
              </button>
            </form>
          </div>
        </div>
      ) : isPending ? (
        <div className="pending-account-pane">
          <Clock size={48} className="onboard-icon" />
          <h2>Account pending approval</h2>
          <p>
            Your {account.accountType.toLowerCase()} account ({account.accountNumber}) is under
            review. You will be able to deposit, withdraw, and transfer once an administrator
            approves it.
          </p>
          <button type="button" className="btn-secondary" onClick={loadData}>
            Refresh status
          </button>
        </div>
      ) : isRejected || isSuspended ? (
        <div className="dashboard-error-pane">
          <h3>Account unavailable</h3>
          <p>
            {isRejected
              ? "Your account application was not approved. Contact branch support for assistance."
              : "Your account has been suspended. Contact branch support."}
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-sidebar">
            <AccountCard account={account} />

            <div className="summary-row">
              <div className="summary-card income">
                <div className="summary-card-header">
                  <span>Credits</span>
                  <TrendingUp size={16} className="text-green" />
                </div>
                <div className="summary-amount">₹ {totalCredits.toLocaleString()}</div>
              </div>
              <div className="summary-card expense">
                <div className="summary-card-header">
                  <span>Debits</span>
                  <TrendingDown size={16} className="text-red" />
                </div>
                <div className="summary-amount">₹ {totalDebits.toLocaleString()}</div>
              </div>
            </div>

            <TransactionForm accountId={account._id} refresh={loadData} />
          </div>

          <div className="dashboard-content">
            <TransactionList transactions={transactions} />
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
