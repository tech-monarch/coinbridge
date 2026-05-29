import React, { useState, useEffect } from "react";
import "./Users.css";
import { listUsers, suspendUser, activateUser } from "../../../services/admin.api";
import type { User, PaginatedResponse } from "../../../services/admin.api";

/* ── Icons ── */
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
const IcoChevRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
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

/* ── Safe map lookups ── */
const KYC_MAP: Record<string, { label: string; cls: string }> = {
  pending:  { label: "Pending",  cls: "badge-warning" },
  approved: { label: "Verified", cls: "badge-success" },
  rejected: { label: "Rejected", cls: "badge-danger"  },
};
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  active:    { label: "Active",    cls: "badge-success" },
  suspended: { label: "Suspended", cls: "badge-danger"  },
};
const getKyc    = (s: string) => KYC_MAP[s]    ?? { label: s, cls: "badge-warning" };
const getStatus = (s: string) => STATUS_MAP[s]  ?? { label: s, cls: "badge-warning" };

/* ── Admin Users Page ── */
const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [pageLoading, setPageLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<User> = await listUsers({
          search: search || undefined,
          kyc_status: kycFilter === "all" ? undefined : kycFilter,
          account_status: statusFilter === "all" ? undefined : statusFilter,
        });
        setUsers(response.data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [search, kycFilter, statusFilter]);

  const handleSuspendUser = async (userId: number) => {
    try {
      setPageLoading((prev) => ({ ...prev, [userId]: true }));
      await suspendUser(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...u, account_status: "suspended" } : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to suspend user");
    } finally {
      setPageLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      setPageLoading((prev) => ({ ...prev, [userId]: true }));
      await activateUser(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...u, account_status: "active" } : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to activate user");
    } finally {
      setPageLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return dateStr; }
  };

  const verifiedCount = users.filter((u) => u.kyc_status === "approved").length;
  const pendingCount  = users.filter((u) => u.kyc_status === "pending").length;
  const activeCount   = users.filter((u) => u.account_status === "active").length;

  return (
    <div className="adm-users page-enter">
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#ffe5e5", color: "#c00", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      <div className="adm-page-hd">
        <h1>Users</h1>
        <p>Manage user accounts and KYC status</p>
      </div>

      {/* ── Stats ── */}
      <div className="adm-users-stats">
        <div className="adm-users-stat">
          <span className="adm-users-stat-label">Total Users</span>
          <p className="adm-users-stat-value">{loading ? "—" : users.length}</p>
        </div>
        <div className="adm-users-stat">
          <span className="adm-users-stat-label">KYC Verified</span>
          <p className="adm-users-stat-value">{loading ? "—" : verifiedCount}</p>
        </div>
        <div className="adm-users-stat">
          <span className="adm-users-stat-label">Pending Review</span>
          <p className="adm-users-stat-value">{loading ? "—" : pendingCount}</p>
        </div>
        <div className="adm-users-stat">
          <span className="adm-users-stat-label">Active Users</span>
          <p className="adm-users-stat-value">{loading ? "—" : activeCount}</p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="adm-users-toolbar">
        <div className="adm-users-search-wrap">
          <IcoSearch />
          <input
            className="adm-users-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="adm-users-filters">
          <div className="adm-users-filter-group">
            <label>KYC Status:</label>
            <select value={kycFilter} onChange={(e) => setKycFilter(e.target.value as typeof kycFilter)}>
              <option value="all">All</option>
              <option value="approved">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="adm-users-filter-group">
            <label>User Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-users-table-card">
        {loading ? (
          <div className="adm-users-empty"><IcoFilter /><p>Loading users...</p></div>
        ) : users.length === 0 ? (
          <div className="adm-users-empty"><IcoFilter /><p>No users match your filters</p></div>
        ) : (
          <div className="adm-users-table">
            <div className="adm-users-thead">
              <span>User</span>
              <span>Balance</span>
              <span>Volume</span>
              <span>KYC</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {users.map((user, i) => {
              const kycCfg    = getKyc(user.kyc_status);
              const statusCfg = getStatus(user.account_status);
              return (
                <div key={user.id} className="adm-users-row" style={{ "--i": i } as React.CSSProperties}>
                  <div className="adm-users-info">
                    <p className="adm-users-name">{user.name}</p>
                    <p className="adm-users-email">{user.email}</p>
                  </div>
                  <span className="adm-users-balance">
                    ${user.balance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                  <span className="adm-users-volume">$0</span>
                  <span><span className={`badge ${kycCfg.cls}`}>{kycCfg.label}</span></span>
                  <span><span className={`badge ${statusCfg.cls}`}>{statusCfg.label}</span></span>
                  <span className="adm-users-date">{formatDate(user.created_at)}</span>
                  <div className="adm-users-actions">
                    {user.account_status === "suspended" ? (
                      <button
                        className="adm-users-action-btn adm-users-action-approve"
                        title="Activate"
                        aria-label="Activate user"
                        onClick={() => handleActivateUser(user.id)}
                        disabled={pageLoading[user.id]}
                      >
                        <IcoCheck />
                      </button>
                    ) : (
                      <button
                        className="adm-users-action-btn adm-users-action-reject"
                        title="Suspend"
                        aria-label="Suspend user"
                        onClick={() => handleSuspendUser(user.id)}
                        disabled={pageLoading[user.id]}
                      >
                        <IcoX />
                      </button>
                    )}
                    <button
                      className="adm-users-action-btn adm-users-action-view"
                      title="View details"
                      aria-label="View user details"
                    >
                      <IcoChevRight />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;