import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

/* ── Icons ── */
const IcoEye = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoEyeOff = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IcoCopy = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IcoCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoArrowDown = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);
const IcoArrowUp = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoChevRight = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IcoTrendUp = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IcoList = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IcoBell = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/* ── Mock data ── */
const WALLET = "0x742d35Cc6634C0532925a3b8D";

interface Tx {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "failed";
  hash?: string;
  date: string;
}

const TXS: Tx[] = [
  {
    id: "1",
    type: "deposit",
    amount: 0.5,
    currency: "BTC",
    status: "confirmed",
    hash: "0x3f4a...8b2c",
    date: "Jan 15",
  },
  {
    id: "2",
    type: "withdrawal",
    amount: 200,
    currency: "USDT",
    status: "pending",
    date: "Jan 14",
  },
  {
    id: "3",
    type: "deposit",
    amount: 1.2,
    currency: "ETH",
    status: "confirmed",
    hash: "0xa1b2...9d0e",
    date: "Jan 13",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: 50,
    currency: "USDT",
    status: "confirmed",
    date: "Jan 12",
  },
  {
    id: "5",
    type: "deposit",
    amount: 0.025,
    currency: "BTC",
    status: "confirmed",
    hash: "0xd5e6...1f2a",
    date: "Jan 11",
  },
];

const STATUS_MAP = {
  confirmed: { label: "Confirmed", cls: "badge-success" },
  pending: { label: "Pending", cls: "badge-warning" },
  failed: { label: "Failed", cls: "badge-danger" },
};

/* ── Component ── */
const Dashboard: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Replace with real user from AuthContext
  const userName = "Alex Turner";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="dash page-enter">
      {/* ── Top bar: greeting left, avatar right ── */}
      <div className="dash-topbar">
        <div className="dash-greeting">
          <p className="dash-greeting-sub"></p>
          <p className="dash-greeting-name">
            Hiii,{" "}
            <span style={{ color: "#3179c1" }}>{userName.split(" ")[0]}</span>👋
          </p>
        </div>
        <div className="dash-topbar-right">
          <button className="dash-notif-btn" aria-label="Notifications">
            <IcoBell />
            <span className="dash-notif-dot" />
          </button>
          <Link
            to="/user/settings"
            className="dash-avatar"
            aria-label="Go to settings"
          >
            <span>{initials}</span>
          </Link>
        </div>
      </div>

      {/* ── Balance hero ── */}
      <div className="dash-hero">
        {/* <p className="dash-hero-label">Total Balance</p> */}
        <div className="dash-hero-amount">
          {visible ? (
            <span>
              $12,847<span className="dash-hero-cents">.32</span>
            </span>
          ) : (
            <span className="dash-hero-masked">••••••</span>
          )}
          <button
            className="dash-vis-btn"
            onClick={() => setVisible((v) => !v)}
            aria-label="Toggle visibility"
          >
            {visible ? <IcoEyeOff /> : <IcoEye />}
          </button>
        </div>
        <div className="dash-hero-meta">
          <span className="dash-hero-change">
            <IcoTrendUp /> +4.2% this month
          </span>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="dash-actions">
        <Link
          to="/user/deposit"
          className="dash-action-btn dash-action-btn--primary"
        >
          <IcoArrowDown /> Add Funds
        </Link>
        <Link
          to="/user/withdraw"
          className="dash-action-btn dash-action-btn--secondary"
        >
          <IcoArrowUp /> Withdraw
        </Link>
      </div>

      {/* ── Wallet address strip ── */}
      <div className="dash-address-strip">
        <span className="dash-address-label">Deposit address</span>
        <button className="dash-address-copy" onClick={copy}>
          <span className="dash-address-text">
            {WALLET.slice(0, 14)}...{WALLET.slice(-6)}
          </span>
          <span className="dash-address-copy-icon">
            {copied ? <IcoCheck /> : <IcoCopy />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--green">
            <IcoArrowDown />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Total Deposited</span>
            <span className="dash-stat-value">$15,000</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--yellow">
            <IcoArrowUp />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Pending</span>
            <span className="dash-stat-value">$250.00</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--purple">
            <IcoList />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Transactions</span>
            <span className="dash-stat-value">24</span>
          </div>
        </div>
      </div>

      {/* ── Recent transactions ── */}
      <div className="section-hd" style={{ marginTop: 28 }}>
        <h2>Recent Activity</h2>
        <Link to="/user/transactions" className="section-link">
          View all <IcoChevRight />
        </Link>
      </div>

      <div className="dash-tx-list">
        {TXS.map((tx, i) => {
          const dep = tx.type === "deposit";
          const cfg = STATUS_MAP[tx.status];
          return (
            <div
              key={tx.id}
              className="dash-tx-row"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div
                className={`dash-tx-icon ${dep ? "dash-tx-icon--dep" : "dash-tx-icon--wit"}`}
              >
                {dep ? <IcoArrowDown /> : <IcoArrowUp />}
              </div>
              <div className="dash-tx-info">
                <span className="dash-tx-type">
                  {dep ? "Deposit" : "Withdrawal"}
                </span>
                {tx.hash && <span className="dash-tx-hash">{tx.hash}</span>}
              </div>
              <div className="dash-tx-right">
                <span
                  className={`dash-tx-amount ${dep ? "dash-tx-amount--pos" : "dash-tx-amount--neg"}`}
                >
                  {dep ? "+" : "−"}
                  {tx.amount} {tx.currency}
                </span>
                <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
