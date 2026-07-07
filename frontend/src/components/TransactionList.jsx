import React from "react";
import { ArrowUpRight, ArrowDownLeft, Calendar, FileText } from "lucide-react";

export default function TransactionList({ transactions }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-box">
      <div className="history-header">
        <h3>Transaction Activity</h3>
        <span className="history-count">{transactions.length} records found</span>
      </div>

      <div className="history-list-wrapper">
        {transactions.length === 0 ? (
          <div className="empty-history">
            <FileText className="empty-icon" size={40} />
            <p className="primary-text">No activity recorded yet</p>
            <p className="secondary-text">Deposits, withdrawals, and transfers will appear here once processed.</p>
          </div>
        ) : (
          <div className="history-items">
            {transactions.map((tx) => {
              const isCredit = tx.type === "CREDIT";
              return (
                <div key={tx._id} className={`history-item ${isCredit ? "credit-border" : "debit-border"}`}>
                  <div className="item-meta">
                    <div className={`meta-icon-box ${isCredit ? "bg-green-light" : "bg-red-light"}`}>
                      {isCredit ? (
                        <ArrowDownLeft className="text-green" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red" size={20} />
                      )}
                    </div>
                    <div className="meta-details">
                      <span className="item-desc">{tx.description || (isCredit ? "Deposit" : "Withdrawal")}</span>
                      <div className="item-time">
                        <Calendar size={12} style={{ marginRight: "4px" }} />
                        <span>{formatDate(tx.createdAt)} at {formatTime(tx.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="item-amount-box">
                    <span className={`item-type-badge ${isCredit ? "badge-credit" : "badge-debit"}`}>
                      {isCredit ? "CR" : "DR"}
                    </span>
                    <strong className={`item-amount ${isCredit ? "text-green" : "text-dark"}`}>
                      {isCredit ? "+" : "-"} ₹ {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
