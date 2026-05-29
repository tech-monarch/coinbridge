import React, { useState, useEffect } from "react";
import "./Withdrawals.css";
import { listWithdrawals, approveWithdrawal, rejectWithdrawal } from "../../../services/admin.api";
import type { Withdrawal, PaginatedResponse } from "../../../services/admin.api";

/* ── Icons ── */
const IcoArrowUp = () => (
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
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Safe status lookup ── */
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Pending",   cls: "badge-warning" },
  approved: { label: "Confirmed", cls: "badge-success" },
  rejected: { label: "Rejected",  cls: "badge-danger"  },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? { label: s, cls: "badge-warning" };

/* ── Admin Withdrawals Page ── */
const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [pageLoading, setPageLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<Withdrawal> = await listWithdrawals({
          search: search || undefined,
          status: status === "all" ? undefined : status,
        });
        setWithdrawals(response.data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load withdrawals");
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, [search, status]);

  const handleApprove = async (id: number) => {
    try {
      setPageLoading((prev) => ({ ...prev, [id]: true }));
      await approveWithdrawal(id);
      setWithdrawals(withdrawals.map((w) => (w.id === id ? { ...w, status: "approved" } : w)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve withdrawal");
    } finally {
      setPageLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      setPageLoading((prev) => ({ ...prev, [id]: true }));
      await rejectWithdrawal(id, { reason: reason || undefined });
      setWithdrawals(withdrawals.map((w) => (w.id === id ? { ...w, status: "rejected" } : w)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject withdrawal");
    } finally {
      setPageLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return dateStr; }
  };

  const truncateAddress = (addr: string) =>
    addr.length > 16 ? addr.substring(0, 8) + "..." + addr.substring(addr.length - 6) : addr;

  const stats = {
    total:     withdrawals.length,
    pending:   withdrawals.filter((w) => w.status === "pending").length,
    confirmed: withdrawals.filter((w) => w.status === "approved").length,
    rejected:  withdrawals.filter((w) => w.status === "rejected").length,
  };

  return (
    <div className="adm-withdrawals page-enter">
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#ffe5e5", color: "#c00", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div className="adm-page-hd">
        <h1>Withdrawals</h1>
        <p>Manage and approve user withdrawals</p>
      </div>

      {/* ── Stats ── */}
      <div className="adm-withdrawals-stats">
        <div className="adm-withdrawals-stat">
          <span className="adm-withdrawals-stat-label">Total Withdrawals</span>
          <p className="adm-withdrawals-stat-value">{loading ? "—" : stats.total}</p>
        </div>
        <div className="adm-withdrawals-stat">
          <span className="adm-withdrawals-stat-label">Pending</span>
          <p className="adm-withdrawals-stat-value adm-withdrawals-stat-warning">{loading ? "—" : stats.pending}</p>
        </div>
        <div className="adm-withdrawals-stat">
          <span className="adm-withdrawals-stat-label">Confirmed</span>
          <p className="adm-withdrawals-stat-value adm-withdrawals-stat-success">{loading ? "—" : stats.confirmed}</p>
        </div>
        <div className="adm-withdrawals-stat">
          <span className="adm-withdrawals-stat-label">Rejected</span>
          <p className="adm-withdrawals-stat-value adm-withdrawals-stat-danger">{loading ? "—" : stats.rejected}</p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="adm-withdrawals-toolbar">
        <div className="adm-withdrawals-search-wrap">
          <IcoSearch />
          <input
            className="adm-withdrawals-search"
            placeholder="Search by user, currency, or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="adm-withdrawals-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── List ── */}
      <div className="adm-withdrawals-card">
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#888" }}>Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="adm-withdrawals-empty"><IcoFilter /><p>No withdrawals found</p></div>
        ) : (
          <div className="adm-withdrawals-list">
            {withdrawals.map((wd, i) => {
              const cfg = getStatus(wd.status);
              return (
                <div key={wd.id} className="adm-withdrawal-row" style={{ "--i": i } as React.CSSProperties}>
                  <div className="adm-withdrawal-icon"><IcoArrowUp /></div>
                  <div className="adm-withdrawal-info">
                    <p className="adm-withdrawal-user">{wd.user?.name ?? "Unknown"}</p>
                    <p className="adm-withdrawal-details">{wd.currency} on {wd.network?.name ?? "—"}</p>
                  </div>
                  <div className="adm-withdrawal-amount">
                    <p className="adm-withdrawal-val">−{wd.amount} {wd.currency}</p>
                    <p className="adm-withdrawal-address" title={wd.recipient_address}>
                      {truncateAddress(wd.recipient_address)}
                    </p>
                  </div>
                  <div className="adm-withdrawal-time"><p>{formatDate(wd.created_at)}</p></div>
                  <div className="adm-withdrawal-status">
                    <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                  {wd.status === "pending" && (
                    <div className="adm-withdrawal-actions">
                      <button className="adm-withdrawal-btn adm-withdrawal-btn-approve" title="Approve" onClick={() => handleApprove(wd.id)} disabled={pageLoading[wd.id]}>
                        <IcoCheck /> Approve
                      </button>
                      <button className="adm-withdrawal-btn adm-withdrawal-btn-reject" title="Reject" onClick={() => handleReject(wd.id)} disabled={pageLoading[wd.id]}>
                        <IcoX /> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;