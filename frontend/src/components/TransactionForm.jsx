import React, { useState, useEffect } from "react";
import API from "../api/api";
import { ArrowUpRight, ArrowDownLeft, Send, Search, UserCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TransactionForm({ accountId, refresh }) {
  const [tab, setTab] = useState("DEPOSIT"); // DEPOSIT, WITHDRAW, TRANSFER
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  
  // Transfer states
  const [recipientNumber, setRecipientNumber] = useState("");
  const [searchingRecipient, setSearchingRecipient] = useState(false);
  const [recipientAccount, setRecipientAccount] = useState(null);
  const [recipientError, setRecipientError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset states when switching tabs
  useEffect(() => {
    setAmount("");
    setDescription("");
    setRecipientNumber("");
    setRecipientAccount(null);
    setRecipientError("");
    setError("");
    setSuccessMsg("");
  }, [tab]);

  // Lookup recipient on blur or click of verify button
  const handleVerifyRecipient = async () => {
    if (!recipientNumber.trim()) return;
    setSearchingRecipient(true);
    setRecipientError("");
    setRecipientAccount(null);

    try {
      const res = await API.get(`/accounts/search/${recipientNumber.trim()}`);
      if (res.data && res.data.success) {
        const targetAcc = res.data.data;
        
        if (targetAcc._id === accountId) {
          setRecipientError("Cannot transfer to your own account.");
        } else {
          setRecipientAccount(targetAcc);
        }
      }
    } catch (err) {
      console.error(err);
      setRecipientError("Recipient account not found. Verify account number.");
    } finally {
      setSearchingRecipient(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      setLoading(false);
      return;
    }

    try {
      if (tab === "DEPOSIT") {
        const res = await API.post("/transactions", {
          accountId,
          type: "CREDIT",
          amount: numericAmount,
          description: description || "Cash Deposit"
        });
        if (res.data.success) {
          setSuccessMsg(`Successfully deposited ₹${numericAmount.toLocaleString()} to your account.`);
          setAmount("");
          setDescription("");
          refresh();
        }
      } else if (tab === "WITHDRAW") {
        const res = await API.post("/transactions", {
          accountId,
          type: "DEBIT",
          amount: numericAmount,
          description: description || "Cash Withdrawal"
        });
        if (res.data.success) {
          setSuccessMsg(`Successfully withdrew ₹${numericAmount.toLocaleString()} from your account.`);
          setAmount("");
          setDescription("");
          refresh();
        }
      } else if (tab === "TRANSFER") {
        if (!recipientAccount) {
          setError("Please verify a valid recipient account first.");
          setLoading(false);
          return;
        }

        const res = await API.post("/transactions/transfer", {
          fromAccountId: accountId,
          toAccountId: recipientAccount._id,
          amount: numericAmount,
          description: description || `Transfer to ${recipientAccount.accountNumber}`
        });

        if (res.data.success) {
          setSuccessMsg(`Successfully transferred ₹${numericAmount.toLocaleString()} to ${recipientAccount.userId.name.toUpperCase()}.`);
          setAmount("");
          setDescription("");
          setRecipientNumber("");
          setRecipientAccount(null);
          refresh();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Transaction failed. Please check balance and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-box">
      {/* Tab Selectors */}
      <div className="tab-header">
        <button
          type="button"
          className={`tab-btn ${tab === "DEPOSIT" ? "active" : ""}`}
          onClick={() => setTab("DEPOSIT")}
        >
          <ArrowDownLeft size={16} />
          <span>Deposit</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "WITHDRAW" ? "active" : ""}`}
          onClick={() => setTab("WITHDRAW")}
        >
          <ArrowUpRight size={16} />
          <span>Withdraw</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${tab === "TRANSFER" ? "active" : ""}`}
          onClick={() => setTab("TRANSFER")}
        >
          <Send size={14} />
          <span>Transfer</span>
        </button>
      </div>

      <div className="tab-body">
        {error && (
          <div className="error-banner mb-3">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="success-banner mb-3">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="action-form">
          {/* TRANSFER RECIPIENT BLOCK */}
          {tab === "TRANSFER" && (
            <div className="input-group">
              <label>Recipient Account Number</label>
              <div className="lookup-wrapper">
                <input
                  type="text"
                  placeholder="E.g. BS12345678"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyRecipient}
                  disabled={searchingRecipient || loading || !recipientNumber}
                  className="btn-lookup"
                  title="Verify Account"
                >
                  {searchingRecipient ? <span className="spinner-mini"></span> : <Search size={16} />}
                </button>
              </div>

              {recipientAccount && (
                <div className="recipient-resolved">
                  <UserCheck size={16} className="text-green" />
                  <span>
                    Recipient verified: <strong>{recipientAccount.userId.name.toUpperCase()}</strong>
                  </span>
                </div>
              )}

              {recipientError && (
                <div className="recipient-error">
                  <AlertCircle size={14} />
                  <span>{recipientError}</span>
                </div>
              )}
            </div>
          )}

          {/* AMOUNT INPUT */}
          <div className="input-group">
            <label>Amount (INR)</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                placeholder="0.00"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* DESCRIPTION INPUT */}
          <div className="input-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              placeholder={tab === "TRANSFER" ? "E.g. Rent, School fees" : "E.g. Cash transaction"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className={`btn-primary form-submit ${tab === "TRANSFER" && !recipientAccount ? "disabled" : ""}`}
            disabled={loading || (tab === "TRANSFER" && !recipientAccount)}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : tab === "DEPOSIT" ? (
              "Complete Deposit"
            ) : tab === "WITHDRAW" ? (
              "Complete Withdrawal"
            ) : (
              "Complete Secure Transfer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
