import React, { useEffect, useState } from "react";
import API from "../api/api";
import AccountCard from "../components/AccountCard";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { Landmark, LogOut, PlusCircle, TrendingUp, TrendingDown, ShieldCheck, UserCircle, RefreshCw } from "lucide-react";

export default function Dashboard({ user, onLogout }) {
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

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
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
            <div className="user-profile">
              <UserCircle size={20} className="profile-icon" />
              <span>{user.name.toUpperCase()}</span>
            </div>
            <button className="btn-logout" onClick={onLogout} title="Sign Out">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {loading && !account && !hasNoAccount ? (
          <div className="loader-block">
            <RefreshCw className="spin-icon" size={32} />
            <p>Verifying secure connection and fetching accounts...</p>
          </div>
        ) : error ? (
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
                <p>Welcome to BankSphere! To begin transacting, please open your first account below.</p>
              </div>

              {error && <div className="error-banner mb-4">{error}</div>}

              <form onSubmit={handleCreateAccount} className="onboarding-form">
                <div className="account-options-grid">
                  <label className={`account-option-box ${accountType === "SAVINGS" ? "active" : ""}`}>
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

                  <label className={`account-option-box ${accountType === "CURRENT" ? "active" : ""}`}>
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
                  {creating ? <span className="spinner"></span> : "Open Secure Account Now"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Left Side: Account Detail & Quick Actions */}
            <div className="dashboard-sidebar">
              <AccountCard account={account} />
              
              {/* Summary Cards */}
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

              {/* Transaction Form */}
              <TransactionForm accountId={account._id} refresh={loadData} />
            </div>

            {/* Right Side: Recent Transactions */}
            <div className="dashboard-content">
              <TransactionList transactions={transactions} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
