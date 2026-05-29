import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

import {
  getDashboardMetrics,
  type DashboardMetrics,
  type Transaction,
} from "../../../services/admin.api";

/* ── Icons ── */
const IcoUsers = ({ className }: { className?: string }) => (
  <svg className={className} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoArrowDown = ({ className }: { className?: string }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);
const IcoArrowUp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoCheck = ({ className }: { className?: string }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoClock = ({ className }: { className?: string }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoChevRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IcoBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

/* ── Status map with safe fallback ── */
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmed", cls: "badge-success" },
  pending:   { label: "Pending",   cls: "badge-warning" },
  failed:    { label: "Failed",    cls: "badge-danger"  },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? { label: s, cls: "badge-warning" };

/* ── Admin Dashboard ── */
const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics();
        setMetrics(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const recentTxs: Transaction[] = metrics?.recent_transactions ?? [];

  return (
    <div className="adm-dash page-enter">
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#ffe5e5", color: "#c00", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* ── Header ── */}
      <div className="adm-dash-header">
        <div className="adm-dash-greeting">
          <h1>Admin Dashboard</h1>
          <p>System overview and key metrics</p>
        </div>
        <div className="adm-dash-actions">
          <button className="adm-dash-notif-btn" aria-label="Notifications">
            <IcoBell />
            <span className="adm-dash-notif-dot" />
          </button>
        </div>
      </div>

      {/* ── Key Stats ── */}
      <div className="adm-dash-stats">
        <div className="adm-stat-card">
          <div className="adm-stat-header">
            <span className="adm-stat-label">Total Users</span>
            <IcoUsers className="adm-stat-ico adm-stat-ico--blue" />
          </div>
          <p className="adm-stat-value">
            {loading ? "—" : (metrics?.total_users ?? 0).toLocaleString()}
          </p>
          <span className="adm-stat-change adm-stat-change--neutral">Active accounts</span>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-header">
            <span className="adm-stat-label">Total Volume</span>
            <IcoArrowDown className="adm-stat-ico adm-stat-ico--green" />
          </div>
          <p className="adm-stat-value">
            {loading ? "—" : formatCurrency(metrics?.total_volume ?? 0)}
          </p>
          <span className="adm-stat-change adm-stat-change--neutral">All transactions</span>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-header">
            <span className="adm-stat-label">Pending Reviews</span>
            <IcoClock className="adm-stat-ico adm-stat-ico--yellow" />
          </div>
          <p className="adm-stat-value">
            {loading ? "—" : (
              (metrics?.pending_kyc ?? 0) +
              (metrics?.pending_deposits ?? 0) +
              (metrics?.pending_withdrawals ?? 0)
            ).toString()}
          </p>
          <span className="adm-stat-change adm-stat-change--neutral">
            {loading ? "—" : `${metrics?.pending_kyc ?? 0} KYC, ${(metrics?.pending_deposits ?? 0) + (metrics?.pending_withdrawals ?? 0)} Transactions`}
          </span>
        </div>

        <div className="adm-stat-card">
          <div className="adm-stat-header">
            <span className="adm-stat-label">Success Rate</span>
            <IcoCheck className="adm-stat-ico adm-stat-ico--purple" />
          </div>
          <p className="adm-stat-value">{loading ? "—" : "98.7%"}</p>
          <span className="adm-stat-change adm-stat-change--neutral">All transaction types</span>
        </div>
      </div>

      {/* ── Quick Action Cards ── */}
      {/* FIX: paths now match route definitions in App.tsx */}
      <div className="adm-dash-quick">
        <Link to="/admin/users" className="adm-quick-card">
          <IcoUsers />
          <span>Manage Users</span>
          <IcoChevRight />
        </Link>
        <Link to="/admin/deposits" className="adm-quick-card">
          <IcoArrowDown />
          <span>Review Deposits</span>
          <IcoChevRight />
        </Link>
        <Link to="/admin/withdrawals" className="adm-quick-card">
          <IcoArrowUp />
          <span>Review Withdrawals</span>
          <IcoChevRight />
        </Link>
        <Link to="/admin/kyc" className="adm-quick-card">
          <IcoCheck />
          <span>KYC Approvals</span>
          <IcoChevRight />
        </Link>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="adm-section-hd" style={{ marginTop: 32 }}>
        <h2>Recent Transactions</h2>
        <Link to="/admin/transactions" className="adm-section-link">
          View all <IcoChevRight />
        </Link>
      </div>

      <div className="adm-tx-list">
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#888" }}>Loading transactions...</div>
        ) : recentTxs.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#888" }}>No recent transactions</div>
        ) : (
          recentTxs.slice(0, 5).map((tx, i) => {
            const dep = tx.type === "deposit";
            const cfg = getStatus(tx.status);
            return (
              <div key={tx.id} className="adm-tx-row" style={{ "--i": i } as React.CSSProperties}>
                <div className="adm-tx-user">
                  <div className={`adm-tx-icon ${dep ? "adm-tx-icon--dep" : "adm-tx-icon--wit"}`}>
                    {dep ? <IcoArrowDown /> : <IcoArrowUp />}
                  </div>
                  <div>
                    <p className="adm-tx-username">{tx.user?.name ?? "Unknown User"}</p>
                    <p className="adm-tx-date">{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <span className="adm-tx-type">{dep ? "Deposit" : "Withdrawal"}</span>
                <span className={`adm-tx-amount ${dep ? "adm-tx-amount--pos" : "adm-tx-amount--neg"}`}>
                  {dep ? "+" : "−"}{tx.amount} {tx.currency}
                </span>
                <span>
                  <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;