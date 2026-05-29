import React, { useState, useEffect } from "react";
import "./Kyc.css";
import { listKyc, approveKyc, rejectKyc } from "../../../services/admin.api";
import type { KycSubmission, PaginatedResponse } from "../../../services/admin.api";

const API = import.meta.env.VITE_API_DOMAIN;

// Extend the imported type locally with fields the backend returns
// but that may not yet be declared in admin.api.ts
type KycFull = KycSubmission & {
  address?: string | null;
  front_doc_path?: string | null;
  back_doc_path?:  string | null;
  selfie_path?:    string | null;
};

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
const IcoEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoExternalLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ── Constants ── */
const STATUS_MAP = {
  pending:  { label: "Pending",  cls: "badge-warning" },
  approved: { label: "Approved", cls: "badge-success" },
  rejected: { label: "Rejected", cls: "badge-danger"  },
};

// Declared ONCE here — used by both the modal and the list
const DOC_LABELS: Record<string, string> = {
  passport:        "Passport",
  national_id:     "National ID",
  drivers_license: "Driver's License",
};

/* ── KYC Detail Modal ── */
interface KycModalProps {
  kyc: KycFull;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject:  (id: number) => void;
  actionLoading: boolean;
}

const DocImage: React.FC<{ path: string | null | undefined; label: string }> = ({ path, label }) => {
  if (!path) return null;
  const src    = `${API}/storage/${path}`;
  const isPdf  = path.toLowerCase().endsWith(".pdf");
  return (
    <div className="kyc-modal-doc">
      <p className="kyc-modal-doc-label">{label}</p>
      {isPdf ? (
        <a className="kyc-modal-doc-pdf" href={src} target="_blank" rel="noreferrer">
          <IcoExternalLink /> View PDF
        </a>
      ) : (
        <a href={src} target="_blank" rel="noreferrer">
          <img
            className="kyc-modal-doc-img"
            src={src}
            alt={label}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement | null)
                ?.style.setProperty("display", "block");
            }}
          />
          <span className="kyc-modal-doc-fallback" style={{ display: "none" }}>
            Image unavailable — <a href={src} target="_blank" rel="noreferrer">open link</a>
          </span>
        </a>
      )}
    </div>
  );
};

const KycModal: React.FC<KycModalProps> = ({ kyc, onClose, onApprove, onReject, actionLoading }) => {
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formatDate = (d?: string | null) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch { return d; }
  };

  return (
    <div className="kyc-modal-backdrop" onClick={handleBackdrop}>
      <div className="kyc-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="kyc-modal-hd">
          <div>
            <h2 className="kyc-modal-title">KYC Submission</h2>
            <p className="kyc-modal-subtitle">#{kyc.id} · {formatDate(kyc.created_at)}</p>
          </div>
          <button className="kyc-modal-close" onClick={onClose}><IcoClose /></button>
        </div>

        <div className="kyc-modal-body">
          {/* Status */}
          <div className="kyc-modal-section">
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Status</span>
              <span className={`badge ${STATUS_MAP[kyc.status as keyof typeof STATUS_MAP]?.cls ?? "badge-info"}`}>
                {STATUS_MAP[kyc.status as keyof typeof STATUS_MAP]?.label ?? kyc.status}
              </span>
            </div>
            {kyc.rejection_reason && (
              <div className="kyc-modal-row">
                <span className="kyc-modal-key">Rejection Reason</span>
                <span className="kyc-modal-val kyc-modal-val--danger">{kyc.rejection_reason}</span>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="kyc-modal-section">
            <p className="kyc-modal-section-title">Account</p>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Name</span>
              <span className="kyc-modal-val">{kyc.user?.name ?? "—"}</span>
            </div>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Email</span>
              <span className="kyc-modal-val">{kyc.user?.email ?? "—"}</span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="kyc-modal-section">
            <p className="kyc-modal-section-title">Personal Information</p>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Full Name</span>
              <span className="kyc-modal-val">{kyc.first_name} {kyc.last_name}</span>
            </div>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Date of Birth</span>
              <span className="kyc-modal-val">{formatDate(kyc.date_of_birth)}</span>
            </div>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Country</span>
              <span className="kyc-modal-val">{kyc.country ?? "—"}</span>
            </div>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Address</span>
              <span className="kyc-modal-val">{kyc.address ?? "—"}</span>
            </div>
          </div>

          {/* Document */}
          <div className="kyc-modal-section">
            <p className="kyc-modal-section-title">Document</p>
            <div className="kyc-modal-row">
              <span className="kyc-modal-key">Type</span>
              <span className="kyc-modal-val">{DOC_LABELS[kyc.document_type] ?? kyc.document_type}</span>
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="kyc-modal-section">
            <p className="kyc-modal-section-title">Uploaded Files</p>
            <div className="kyc-modal-docs">
              <DocImage path={kyc.front_doc_path} label="Front of Document" />
              <DocImage path={kyc.back_doc_path}  label="Back of Document" />
              <DocImage path={kyc.selfie_path}    label="Selfie with Document" />
            </div>
          </div>
        </div>

        {/* Footer */}
        {kyc.status === "pending" && (
          <div className="kyc-modal-footer">
            <button
              className="adm-kyc-modal-btn adm-kyc-modal-btn--reject"
              disabled={actionLoading}
              onClick={() => onReject(kyc.id)}
            >
              {actionLoading ? "…" : <><IcoX /> Reject</>}
            </button>
            <button
              className="adm-kyc-modal-btn adm-kyc-modal-btn--approve"
              disabled={actionLoading}
              onClick={() => onApprove(kyc.id)}
            >
              {actionLoading ? "…" : <><IcoCheck /> Approve</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Admin KYC Page ── */
const AdminKyc: React.FC = () => {
  const [kycs, setKycs]               = useState<KycFull[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [status, setStatus]           = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [pageLoading, setPageLoading] = useState<Record<number, boolean>>({});
  const [selected, setSelected]       = useState<KycFull | null>(null);

  useEffect(() => {
    const fetchKycs = async () => {
      try {
        setLoading(true);
        const response: PaginatedResponse<KycFull> = await listKyc({
          search: search || undefined,
          status: status === "all" ? undefined : status,
        });
        setKycs(response.data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load KYC submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchKycs();
  }, [search, status]);

  const handleApprove = async (id: number) => {
    try {
      setPageLoading((p) => ({ ...p, [id]: true }));
      await approveKyc(id);
      const patch = (k: KycFull): KycFull => k.id === id ? { ...k, status: "approved" } : k;
      setKycs((prev) => prev.map(patch));
      setSelected((s) => s ? patch(s) : null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve KYC");
    } finally {
      setPageLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      setPageLoading((p) => ({ ...p, [id]: true }));
      await rejectKyc(id, { reason: reason || undefined });
      // rejection_reason is string | null in KycSubmission — use null, not undefined
      const patch = (k: KycFull): KycFull =>
        k.id === id ? { ...k, status: "rejected", rejection_reason: reason ?? null } : k;
      setKycs((prev) => prev.map(patch));
      setSelected((s) => s ? patch(s) : null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject KYC");
    } finally {
      setPageLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return dateStr; }
  };

  const stats = {
    total:    kycs.length,
    pending:  kycs.filter((r) => r.status === "pending").length,
    approved: kycs.filter((r) => r.status === "approved").length,
    rejected: kycs.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="adm-kyc page-enter">
      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "#ffe5e5", color: "#c00", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}
      <div className="adm-page-hd">
        <h1>KYC Management</h1>
        <p>Review and approve user KYC submissions</p>
      </div>

      {/* ── Stats ── */}
      <div className="adm-kyc-stats">
        <div className="adm-kyc-stat">
          <span className="adm-kyc-stat-label">Total Requests</span>
          <p className="adm-kyc-stat-value">{stats.total}</p>
        </div>
        <div className="adm-kyc-stat">
          <span className="adm-kyc-stat-label">Pending</span>
          <p className="adm-kyc-stat-value adm-kyc-stat-warning">{stats.pending}</p>
        </div>
        <div className="adm-kyc-stat">
          <span className="adm-kyc-stat-label">Approved</span>
          <p className="adm-kyc-stat-value adm-kyc-stat-success">{stats.approved}</p>
        </div>
        <div className="adm-kyc-stat">
          <span className="adm-kyc-stat-label">Rejected</span>
          <p className="adm-kyc-stat-value adm-kyc-stat-danger">{stats.rejected}</p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="adm-kyc-toolbar">
        <div className="adm-kyc-search-wrap">
          <IcoSearch />
          <input
            className="adm-kyc-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="adm-kyc-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | "pending" | "approved" | "rejected")}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ── KYC Requests List ── */}
      <div className="adm-kyc-card">
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#888" }}>
            Loading KYC submissions...
          </div>
        ) : kycs.length === 0 ? (
          <div className="adm-kyc-empty">
            <IcoFilter />
            <p>No KYC requests match your filters</p>
          </div>
        ) : (
          <div className="adm-kyc-list">
            {kycs.map((req, i) => (
              <div key={req.id} className="adm-kyc-row" style={{ "--i": i } as React.CSSProperties}>
                <div className="adm-kyc-info">
                  <p className="adm-kyc-user">{req.user?.name || "Unknown"}</p>
                  <p className="adm-kyc-email">{req.user?.email || "N/A"}</p>
                </div>
                <div className="adm-kyc-level">
                  <span className="badge badge-info">{DOC_LABELS[req.document_type] ?? req.document_type}</span>
                </div>
                <div className="adm-kyc-docs">
                  <p className="adm-kyc-docs-count">{req.first_name} {req.last_name}</p>
                  <p className="adm-kyc-docs-submitted">{formatDate(req.created_at)}</p>
                </div>
                <div className="adm-kyc-status">
                  <span className={`badge ${STATUS_MAP[req.status as keyof typeof STATUS_MAP]?.cls}`}>
                    {STATUS_MAP[req.status as keyof typeof STATUS_MAP]?.label}
                  </span>
                </div>
                <div className="adm-kyc-actions">
                  <button
                    className="adm-kyc-btn adm-kyc-btn-view"
                    title="View details"
                    aria-label="View KYC details"
                    onClick={() => setSelected(req)}
                  >
                    <IcoEye />
                  </button>
                  {req.status === "pending" && !pageLoading[req.id] && (
                    <>
                      <button
                        className="adm-kyc-btn adm-kyc-btn-approve"
                        title="Approve"
                        aria-label="Approve KYC"
                        onClick={() => handleApprove(req.id)}
                      >
                        <IcoCheck />
                      </button>
                      <button
                        className="adm-kyc-btn adm-kyc-btn-reject"
                        title="Reject"
                        aria-label="Reject KYC"
                        onClick={() => handleReject(req.id)}
                      >
                        <IcoX />
                      </button>
                    </>
                  )}
                  {pageLoading[req.id] && (
                    <span style={{ fontSize: "12px", color: "#888" }}>Processing...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <KycModal
          kyc={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={!!pageLoading[selected.id]}
        />
      )}
    </div>
  );
};

export default AdminKyc;