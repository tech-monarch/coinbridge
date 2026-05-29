import React, { useState, useEffect } from "react";
import "./Deposits.css";
import { listDeposits, approveDeposit, rejectDeposit } from "../../../services/admin.api";
import type { Deposit, PaginatedResponse } from "../../../services/admin.api";

/* ── Icons ── */
const IcoArrowDown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7" />
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
const IcoLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ── Safe status lookup ── */
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Pending",   cls: "badge-warning" },
  confirmed: { label: "Confirmed", cls: "badge-success" },
  rejected:  { label: "Rejected",  cls: "badge-danger"  },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? { label: s, cls: "badge-warning" };

/* ── Admin Deposits Page ── */
const AdminDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [pageLoading, setPageLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<Deposit> = await listDeposits({
          search: search || undefined,
          status: status === "all" ? undefined : status,
        });
        setDeposits(response.data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deposits");
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, [search, status]);

  const handleApprove = async (id: number) => {
    try {
      setPageLoading((prev) => ({ ...prev, [id]: true }));
      await approveDeposit(id);
      setDeposits(deposits.map((d) => (d.id === id ? { ...d, status: "confirmed" } : d)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve deposit");
    } finally {
      setPageLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      setPageLoading((prev) => ({ ...prev, [id]: true }));
      await rejectDeposit(id, { reason: reason || undefined });
      setDeposits(deposits.map((d) => (d.id === id ? { ...d, status: "rejected" } : d)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject deposit");
    } finally {
      setPageLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return dateStr; }
  };

  const truncateHash = (hash: string) =>
    hash.length > 20 ? hash.substring(0, 10) + "..." + hash.substring(hash.length - 8) : hash;

  const stats = {
    total:     deposits.length,
    pending:   deposits.filter((d) => d.status === "pending").length,
    confirmed: deposits.filter((d) => d.status === "confirmed").length,
    rejected:  deposits.filter((d) => d.status === "rejected").length,
  };

  return (
    <div className="adm-deposits page-enter">
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#ffe5e5", color: "#c00", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div className="adm-page-hd">
        <h1>Deposits</h1>
        <p>Manage and approve user deposits</p>
      </div>

      {/* ── Stats ── */}
      <div className="adm-deposits-stats">
        <div className="adm-deposits-stat">
          <span className="adm-deposits-stat-label">Total Deposits</span>
          <p className="adm-deposits-stat-value">{loading ? "—" : stats.total}</p>
        </div>
        <div className="adm-deposits-stat">
          <span className="adm-deposits-stat-label">Pending</span>
          <p className="adm-deposits-stat-value adm-deposits-stat-warning">{loading ? "—" : stats.pending}</p>
        </div>
        <div className="adm-deposits-stat">
          <span className="adm-deposits-stat-label">Confirmed</span>
          <p className="adm-deposits-stat-value adm-deposits-stat-success">{loading ? "—" : stats.confirmed}</p>
        </div>
        <div className="adm-deposits-stat">
          <span className="adm-deposits-stat-label">Rejected</span>
          <p className="adm-deposits-stat-value adm-deposits-stat-danger">{loading ? "—" : stats.rejected}</p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="adm-deposits-toolbar">
        <div className="adm-deposits-search-wrap">
          <IcoSearch />
          <input
            className="adm-deposits-search"
            placeholder="Search by user, currency, or hash…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="adm-deposits-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── List ── */}
      <div className="adm-deposits-card">
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#888" }}>Loading deposits...</div>
        ) : deposits.length === 0 ? (
          <div className="adm-deposits-empty"><IcoFilter /><p>No deposits found</p></div>
        ) : (
          <div className="adm-deposits-list">
            {deposits.map((dep, i) => {
              const cfg = getStatus(dep.status);
              return (
                <div key={dep.id} className="adm-deposit-row" style={{ "--i": i } as React.CSSProperties}>
                  <div className="adm-deposit-icon"><IcoArrowDown /></div>
                  <div className="adm-deposit-info">
                    <p className="adm-deposit-user">{dep.user?.name ?? "Unknown"}</p>
                    <p className="adm-deposit-details">{dep.currency} on {dep.network?.name ?? "—"}</p>
                  </div>
                  <div className="adm-deposit-amount">
                    <p className="adm-deposit-val">+{dep.amount} {dep.currency}</p>
                    <p className="adm-deposit-hash" title={dep.transaction_hash}>
                      {truncateHash(dep.transaction_hash)}{" "}
                      <a href="#" title="View on explorer"><IcoLink /></a>
                    </p>
                  </div>
                  <div className="adm-deposit-time"><p>{formatDate(dep.created_at)}</p></div>
                  <div className="adm-deposit-status">
                    <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                  </div>
                  {dep.status === "pending" && (
                    <div className="adm-deposit-actions">
                      <button className="adm-deposit-btn adm-deposit-btn-approve" title="Approve" onClick={() => handleApprove(dep.id)} disabled={pageLoading[dep.id]}>
                        <IcoCheck /> Approve
                      </button>
                      <button className="adm-deposit-btn adm-deposit-btn-reject" title="Reject" onClick={() => handleReject(dep.id)} disabled={pageLoading[dep.id]}>
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

export default AdminDeposits;