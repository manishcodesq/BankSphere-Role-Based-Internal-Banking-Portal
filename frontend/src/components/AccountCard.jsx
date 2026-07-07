import React, { useState } from "react";
import { Copy, Check, ShieldCheck, Landmark } from "lucide-react";

export default function AccountCard({ account }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCardNumber = (num) => {
    if (!num) return "";
    // E.g. BS123456781234 -> BS-1234-5678-1234
    const prefix = num.substring(0, 2);
    const rest = num.substring(2);
    const chunks = rest.match(/.{1,4}/g) || [];
    return `${prefix} ${chunks.join(" ")}`;
  };

  return (
    <div className="bank-card">
      <div className="bank-card-inner">
        {/* Card Header */}
        <div className="bank-card-header">
          <div className="card-logo">
            <Landmark size={20} />
            <span>BankSphere</span>
          </div>
          <span className="card-type-badge">{account.accountType}</span>
        </div>

        {/* Card Chip */}
        <div className="card-chip-container">
          <div className="card-chip"></div>
          <div className="contactless-wave">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Card Number */}
        <div className="card-number-section">
          <div className="card-number">{formatCardNumber(account.accountNumber)}</div>
          <button 
            className="copy-card-btn" 
            onClick={copyToClipboard} 
            title="Copy Account Number"
          >
            {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Balance & Info */}
        <div className="bank-card-footer">
          <div className="card-balance-box">
            <span className="label">AVAILABLE BALANCE</span>
            <div className="balance-value">₹ {account.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="card-security-badge">
            <ShieldCheck size={16} />
            <span>SECURED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
