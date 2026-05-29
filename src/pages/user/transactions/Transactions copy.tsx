import React, { useState } from "react";
import "./Transactions.css";

/* ── Icons ── */
const IcoDown = () => (
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
const IcoUp = () => (
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
const IcoSearch = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoFilter = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);
const IcoLink = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ── Data ── */
interface Tx {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "failed";
  hash?: string;
  network: string;
  date: string;
}
const ALL_TXS: Tx[] = [
  {
    id: "1",
    type: "deposit",
    amount: 0.5,
    currency: "BTC",
    status: "confirmed",
    hash: "0x3f4a8b2c",
    network: "Bitcoin",
    date: "Jan 15, 2024",
  },
  {
    id: "2",
    type: "withdrawal",
    amount: 200,
    currency: "USDT",
    status: "pending",
    network: "ERC-20",
    date: "Jan 14, 2024",
  },
  {
    id: "3",
    type: "deposit",
    amount: 1.2,
    currency: "ETH",
    status: "confirmed",
    hash: "0xa1b29d0e",
    network: "Ethereum",
    date: "Jan 13, 2024",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: 50,
    currency: "USDT",
    status: "confirmed",
    network: "TRC-20",
    date: "Jan 12, 2024",
  },
  {
    id: "5",
    type: "deposit",
    amount: 0.025,
    currency: "BTC",
    status: "confirmed",
    hash: "0xd5e61f2a",
    network: "Bitcoin",
    date: "Jan 11, 2024",
  },
  {
    id: "6",
    type: "deposit",
    amount: 500,
    currency: "USDT",
    status: "confirmed",
    hash: "0xb3c41e9d",
    network: "ERC-20",
    date: "Jan 10, 2024",
  },
  {
    id: "7",
    type: "withdrawal",
    amount: 100,
    currency: "USDT",
    status: "failed",
    network: "TRC-20",
    date: "Jan 9, 2024",
  },
  {
    id: "8",
    type: "deposit",
    amount: 0.8,
    currency: "ETH",
    status: "confirmed",
    hash: "0x7f2a3b5c",
    network: "Ethereum",
    date: "Jan 8, 2024",
  },
];

const STATUS = {
  confirmed: { label: "Confirmed", cls: "badge-success" },
  pending: { label: "Pending", cls: "badge-warning" },
  failed: { label: "Failed", cls: "badge-danger" },
};

const Transactions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");
  const [status, setStatus] = useState<
    "all" | "confirmed" | "pending" | "failed"
  >("all");

  const filtered = ALL_TXS.filter((tx) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (status !== "all" && tx.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        tx.currency.toLowerCase().includes(q) ||
        tx.network.toLowerCase().includes(q) ||
        (tx.hash || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalDep = ALL_TXS.filter(
    (t) => t.type === "deposit" && t.status === "confirmed",
  ).reduce((s, t) => s + t.amount, 0);
  const totalWd = ALL_TXS.filter(
    (t) => t.type === "withdrawal" && t.status === "confirmed",
  ).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="txp page-enter">
      <div className="page-hd">
        <h1>Transactions</h1>
        <p>Your full deposit and withdrawal history</p>
      </div>

      {/* Stats */}
      <div className="txp-stats">
        <div className="txp-stat">
          <div className="txp-stat-ico txp-stat-ico--green">
            <IcoDown />
          </div>
          <div>
            <p className="txp-stat-label">Total Deposited</p>
            <p className="txp-stat-val">{totalDep.toFixed(4)} mixed</p>
          </div>
        </div>
        <div className="txp-stat">
          <div className="txp-stat-ico txp-stat-ico--red">
            <IcoUp />
          </div>
          <div>
            <p className="txp-stat-label">Total Withdrawn</p>
            <p className="txp-stat-val">{totalWd.toFixed(2)} USDT</p>
          </div>
        </div>
        <div className="txp-stat">
          <div className="txp-stat-ico txp-stat-ico--purple">
            <IcoFilter />
          </div>
          <div>
            <p className="txp-stat-label">Total Records</p>
            <p className="txp-stat-val">{ALL_TXS.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="txp-toolbar">
        <div className="txp-search-wrap">
          <IcoSearch />
          <input
            className="txp-search"
            placeholder="Search by currency, network or hash…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="txp-filters">
          <div className="txp-filter-group">
            {(["all", "deposit", "withdrawal"] as const).map((v) => (
              <button
                key={v}
                className={`txp-filter-btn ${filter === v ? "txp-filter-btn--active" : ""}`}
                onClick={() => setFilter(v)}
              >
                {v === "all"
                  ? "All"
                  : v === "deposit"
                    ? "Deposits"
                    : "Withdrawals"}
              </button>
            ))}
          </div>
          <select
            className="txp-status-select"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as "all" | "confirmed" | "pending" | "failed",
              )
            }
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="txp-table-card">
        {filtered.length === 0 ? (
          <div className="txp-empty">
            <IcoFilter />
            <p>No transactions match your filters</p>
          </div>
        ) : (
          <div className="txp-table">
            <div className="txp-thead">
              <span>Type</span>
              <span>Network</span>
              <span>Amount</span>
              <span>Hash</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {filtered.map((tx, i) => {
              const dep = tx.type === "deposit";
              const cfg = STATUS[tx.status];
              return (
                <div
                  key={tx.id}
                  className="txp-row"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className="txp-type-cell">
                    <div
                      className={`txp-icon ${dep ? "txp-icon--dep" : "txp-icon--wd"}`}
                    >
                      {dep ? <IcoDown /> : <IcoUp />}
                    </div>
                    <span>{dep ? "Deposit" : "Withdrawal"}</span>
                  </div>
                  <span className="txp-network">{tx.network}</span>
                  <span
                    className={`txp-amount ${dep ? "txp-amount--pos" : "txp-amount--neg"}`}
                  >
                    {dep ? "+" : "−"}
                    {tx.amount} {tx.currency}
                  </span>
                  <span className="txp-hash">
                    {tx.hash ? (
                      <>
                        {tx.hash.slice(0, 10)}…{" "}
                        <a href="#" className="txp-hash-link">
                          <IcoLink />
                        </a>
                      </>
                    ) : (
                      <span className="txp-hash-none">—</span>
                    )}
                  </span>
                  <span>
                    <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                  </span>
                  <span className="txp-date">{tx.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
