import React, { useState, useEffect } from "react";
import "./Transactions.css";
import { listTransactions } from "../../../services/admin.api";
import type { Transaction, PaginatedResponse } from "../../../services/admin.api";

/* ── Icons ── */
const IcoDown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);
const IcoUp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

/* ── Safe status lookup ── */
const STATUS: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmed", cls: "badge-success" },
  pending:   { label: "Pending",   cls: "badge-warning" },
  failed:    { label: "Failed",    cls: "badge-danger"  },
};
const getStatus = (s: string) => STATUS[s] ?? { label: s, cls: "badge-warning" };

/* ── Admin Transactions Page ── */
const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");
  const [status, setStatus] = useState<"all" | "confirmed" | "pending" | "failed">("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<Transaction> = await listTransactions({
          search: search || undefined,
          type: filter === "all" ? undefined : filter,
          status: status === "all" ? undefined : status,
        });
        setTransactions(response.data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [search, filter, status]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return dateStr; }
  };

  const stats = {
    totalDep: transactions.filter((t) => t.type === "deposit" && t.status === "confirmed").length,
    totalWd:  transactions.filter((t) => t.type === "withdrawal" && t.status === "confirmed").length,
    total:    transactions.length,
  };

  return (
    <div className="adm-txp page-enter">
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#ffe5e5", color: "#c00", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}
      <div className="adm-page-hd">
        <h1>All Transactions</h1>
        <p>View all system transactions and activity</p>
      </div>

      {/* ── Stats ── */}
      <div className="adm-txp-stats">
        <div className="adm-txp-stat">
          <div className="adm-txp-stat-ico adm-txp-stat-ico--green"><IcoDown /></div>
          <div>
            <p className="adm-txp-stat-label">Total Deposits</p>
            <p className="adm-txp-stat-val">{loading ? "—" : stats.totalDep}</p>
          </div>
        </div>
        <div className="adm-txp-stat">
          <div className="adm-txp-stat-ico adm-txp-stat-ico--red"><IcoUp /></div>
          <div>
            <p className="adm-txp-stat-label">Total Withdrawals</p>
            <p className="adm-txp-stat-val">{loading ? "—" : stats.totalWd}</p>
          </div>
        </div>
        <div className="adm-txp-stat">
          <div className="adm-txp-stat-ico adm-txp-stat-ico--purple"><IcoFilter /></div>
          <div>
            <p className="adm-txp-stat-label">Total Records</p>
            <p className="adm-txp-stat-val">{loading ? "—" : stats.total}</p>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="adm-txp-toolbar">
        <div className="adm-txp-search-wrap">
          <IcoSearch />
          <input
            className="adm-txp-search"
            placeholder="Search by user or currency…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="adm-txp-filters">
          <div className="adm-txp-filter-group">
            {(["all", "deposit", "withdrawal"] as const).map((v) => (
              <button
                key={v}
                className={`adm-txp-filter-btn ${filter === v ? "adm-txp-filter-btn--active" : ""}`}
                onClick={() => setFilter(v)}
              >
                {v === "all" ? "All" : v === "deposit" ? "Deposits" : "Withdrawals"}
              </button>
            ))}
          </div>
          <select
            className="adm-txp-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-txp-table-card">
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#888" }}>Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="adm-txp-empty"><IcoFilter /><p>No transactions match your filters</p></div>
        ) : (
          <div className="adm-txp-table">
            <div className="adm-txp-thead">
              <span>User</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Currency</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {transactions.map((tx, i) => {
              const dep = tx.type === "deposit";
              const cfg = getStatus(tx.status);
              return (
                <div key={tx.id} className="adm-txp-row" style={{ "--i": i } as React.CSSProperties}>
                  <span className="adm-txp-user">{tx.user?.name ?? "Unknown"}</span>
                  <div className="adm-txp-type-cell">
                    <div className={`adm-txp-icon ${dep ? "adm-txp-icon--dep" : "adm-txp-icon--wd"}`}>
                      {dep ? <IcoDown /> : <IcoUp />}
                    </div>
                    <span>{dep ? "Deposit" : "Withdrawal"}</span>
                  </div>
                  <span className={`adm-txp-amount ${dep ? "adm-txp-amount--pos" : "adm-txp-amount--neg"}`}>
                    {dep ? "+" : "−"}{tx.amount}
                  </span>
                  <span className="adm-txp-currency">{tx.currency}</span>
                  <span><span className={`badge ${cfg.cls}`}>{cfg.label}</span></span>
                  <span className="adm-txp-date">{formatDate(tx.created_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;