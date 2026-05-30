import React, { useState, useEffect, useRef, memo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../App";
import "./Dashboard.css";

const API = import.meta.env.VITE_API_DOMAIN;

// ── Auth helper ──
const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

/* ── Icons ── */
const IcoEye = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoEyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IcoCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoArrowDown = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);
const IcoArrowUp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoChevRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IcoTrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IcoList = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IcoBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IcoSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IcoMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IcoLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ── Types ── */
interface UserProfile {
  name: string;
  email: string;
  wallet_address?: string;
  balance?: number;
}
interface Tx {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "failed";
  hash?: string;
  date: string;
}

const STATUS_MAP = {
  confirmed: { label: "Confirmed", cls: "badge-success" },
  pending: { label: "Pending", cls: "badge-warning" },
  failed: { label: "Failed", cls: "badge-danger" },
};

/* ── TradingView Widget ── */
const TradingViewWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `{
      "autosize": true,
      "symbol": "NASDAQ:AAPL",
      "interval": "D",
      "timezone": "exchange",
      "theme": "dark",
      "style": "0",
      "locale": "en",
      "allow_symbol_change": true,
      "withdateranges": true,
      "save_image": false,
      "details": true,
      "hotlist": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    }`;
    container.current.appendChild(script);
  }, []);
  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">AAPL stock chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
});

/* ── Portfolio Pie Chart ── */
const PortfolioPie: React.FC<{ deposited: number; pending: number; txCount: number }> = ({ deposited, pending, txCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const radius = Math.min(cx, cy) - 10;
    const innerRadius = radius * 0.58;

    const slices = [
      { label: "Deposited", value: deposited || 1, color: "#14c784" },
      { label: "Pending",   value: pending  || 0, color: "#f5a524" },
      { label: "Txns",      value: txCount  || 0, color: "#3179c1" },
    ];

    const sum = slices.reduce((s, sl) => s + sl.value, 0);
    ctx.clearRect(0, 0, W, H);

    let startAngle = -Math.PI / 2;
    slices.forEach((sl) => {
      const sweep = (sl.value / sum) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sweep);
      ctx.closePath();
      ctx.fillStyle = sl.color;
      ctx.fill();
      startAngle += sweep;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "var(--bg-surface, #0e1c35)";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Portfolio", cx, cy - 8);
    ctx.fillStyle = "#8a9ab5";
    ctx.font = "11px sans-serif";
    ctx.fillText("breakdown", cx, cy + 10);
  }, [deposited, pending, txCount]);

  return (
    <div className="dash-pie-wrap">
      <canvas ref={canvasRef} width={160} height={160} className="dash-pie-canvas" />
      <div className="dash-pie-legend">
        <div className="dash-pie-legend-item">
          <span className="dash-pie-dot" style={{ background: "#14c784" }} />
          <span className="dash-pie-legend-label">Deposited</span>
          <span className="dash-pie-legend-val">${deposited.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="dash-pie-legend-item">
          <span className="dash-pie-dot" style={{ background: "#f5a524" }} />
          <span className="dash-pie-legend-label">Pending</span>
          <span className="dash-pie-legend-val">${pending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="dash-pie-legend-item">
          <span className="dash-pie-dot" style={{ background: "#3179c1" }} />
          <span className="dash-pie-legend-label">Transactions</span>
          <span className="dash-pie-legend-val">{txCount}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Avatar Dropdown ── */
interface AvatarMenuProps {
  initials: string;
  userName: string;
  userEmail: string;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({ initials, userName, userEmail, theme, onThemeToggle }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cb_user");
    navigate("/login");
  };

  return (
    <div className="dash-avatar-wrap" ref={wrapRef}>
      <button
        className="dash-avatar"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span>{initials}</span>
      </button>

      {open && (
        <div className="dash-avatar-dropdown">
          {/* User info header */}
          <div className="dash-avatar-dd-header">
            <div className="dash-avatar-dd-avatar">{initials}</div>
            <div className="dash-avatar-dd-info">
              <span className="dash-avatar-dd-name">{userName}</span>
              <span className="dash-avatar-dd-email">{userEmail}</span>
            </div>
          </div>

          <div className="dash-avatar-dd-divider" />

          {/* Theme toggle switch */}
          <div className="dash-avatar-dd-item dash-avatar-dd-theme-row">
            <span className="dash-avatar-dd-item-icon">
              {theme === "dark" ? <IcoSun /> : <IcoMoon />}
            </span>
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            <button
              className={`dash-theme-toggle${theme === "light" ? " dash-theme-toggle--on" : ""}`}
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              role="switch"
              aria-checked={theme === "light"}
            >
              <span className="dash-theme-toggle-thumb" />
            </button>
          </div>

          <div className="dash-avatar-dd-divider" />

          {/* Logout */}
          <button className="dash-avatar-dd-item dash-avatar-dd-item--danger" onClick={handleLogout}>
            <span className="dash-avatar-dd-item-icon">
              <IcoLogout />
            </span>
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Component ── */
const Dashboard: React.FC = () => {
  const { theme, toggle: onThemeToggle } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem("cb_user");
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [txs, setTxs] = useState<Tx[]>([]);
  const [deposits, setDeposits] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [txCount, setTxCount] = useState<number>(0);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${API}/api/user/profile`, { headers: authHeaders() });
        if (profileRes.status === 401) { navigate("/login"); return; }
        const profileData = await profileRes.json();
        setUser(profileData);
        localStorage.setItem("cb_user", JSON.stringify(profileData));

        const txRes  = await fetch(`${API}/api/user/transactions`, { headers: authHeaders() });
        const txData = await txRes.json();
        const allTxs: Tx[] = txData.data ?? txData ?? [];
        setTxs(allTxs.slice(0, 5));
        setTxCount(txData.total ?? allTxs.length);

        const depRes  = await fetch(`${API}/api/user/deposits`, { headers: authHeaders() });
        const depData = await depRes.json();
        const depList = depData.data ?? depData ?? [];
        const confirmedDep = depList
          .filter((d: { status: string; amount: string | number }) => d.status === "confirmed")
          .reduce((s: number, d: { amount: string | number }) => s + parseFloat(String(d.amount || 0)), 0);
        setDeposits(confirmedDep);

        const wdRes  = await fetch(`${API}/api/user/withdrawals`, { headers: authHeaders() });
        const wdData = await wdRes.json();
        const wdList = wdData.data ?? wdData ?? [];
        const pendingWd = wdList
          .filter((w: { status: string; amount: string | number }) => w.status === "pending")
          .reduce((s: number, w: { amount: string | number }) => s + parseFloat(String(w.amount || 0)), 0);
        setPending(pendingWd);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchData();
  }, [navigate]);

  const copy = () => {
    navigator.clipboard.writeText(user?.wallet_address ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walletAddr = user?.wallet_address ?? "";
  const balance    = user?.balance ?? 0;
  const firstName  = (user?.name ?? "User").split(" ")[0];
  const initials   = (user?.name ?? "U").split(" ").map((w: string) => w[0]).join("").toUpperCase();

  return (
    <div className="dash page-enter">
      {/* ── Top bar ── */}
      <div className="dash-topbar">
        <div className="dash-greeting">
          <p className="dash-greeting-sub"></p>
          <p className="dash-greeting-name">
            Hiii, <span style={{ color: "#3179c1" }}>{firstName}</span>👋
          </p>
        </div>
        <div className="dash-topbar-right">
          <button className="dash-notif-btn" aria-label="Notifications">
            <IcoBell />
            <span className="dash-notif-dot" />
          </button>

          {/* ── Avatar with dropdown (replaces the Link) ── */}
          <AvatarMenu
            initials={initials}
            userName={user?.name ?? "User"}
            userEmail={user?.email ?? ""}
            theme={theme}
            onThemeToggle={onThemeToggle}
          />
        </div>
      </div>

{/* ── Balance hero ── */}
<div className="dash-hero-glass">
  <div className="dash-hero-glass-glow" />
  <div className="dash-hero-glass-inner">
    <span className="dash-hero-glass-label">Total Balance</span>
    <div className="dash-hero-amount">
      {loadingUser ? (
        <span className="dash-hero-masked">••••••</span>
      ) : visible ? (
        <span>${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      ) : (
        <span className="dash-hero-masked">••••••</span>
      )}
      <button className="dash-vis-btn" onClick={() => setVisible((v) => !v)} aria-label="Toggle visibility">
        {visible ? <IcoEyeOff /> : <IcoEye />}
      </button>
    </div>
    <div className="dash-hero-meta">
      <span className="dash-hero-change"><IcoTrendUp /> Portfolio value</span>
    </div>
  </div>
</div>

      {/* ── Action buttons ── */}
      <div className="dash-actions">
        <Link to="/user/deposit"  className="dash-action-btn dash-action-btn--primary"><IcoArrowDown /> Add Funds</Link>
        <Link to="/user/withdraw" className="dash-action-btn dash-action-btn--secondary"><IcoArrowUp /> Withdraw</Link>
      </div>

      {/* ── Wallet address strip ── */}
      {walletAddr && (
        <div className="dash-address-strip">
          <span className="dash-address-label">Deposit address</span>
          <button className="dash-address-copy" onClick={copy}>
            <span className="dash-address-text">{walletAddr.slice(0, 14)}...{walletAddr.slice(-6)}</span>
            <span className="dash-address-copy-icon">
              {copied ? <IcoCheck /> : <IcoCopy />}
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--green"><IcoArrowDown /></div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Total Deposited</span>
            <span className="dash-stat-value">${deposits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--yellow"><IcoArrowUp /></div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Pending</span>
            <span className="dash-stat-value">${pending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon--purple"><IcoList /></div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Transactions</span>
            <span className="dash-stat-value">{txCount}</span>
          </div>
        </div>
      </div>

      {/* ── Pie Chart ── */}
      <div className="section-hd" style={{ marginTop: 28 }}>
        <h2>Portfolio Breakdown</h2>
      </div>
      <PortfolioPie deposited={deposits} pending={pending} txCount={txCount} />

      {/* ── TradingView Widget ── */}
      <div className="section-hd" style={{ marginTop: 28 }}>
        <h2>Analyze Market</h2>
      </div>
      <div className="dash-tv-wrap"><TradingViewWidget /></div>

      {/* ── Recent transactions ── */}
      <div className="section-hd" style={{ marginTop: 28 }}>
        <h2>Recent Activity</h2>
        <Link to="/user/transactions" className="section-link">View all <IcoChevRight /></Link>
      </div>

      <div className="dash-tx-list">
        {txs.length === 0 && !loadingUser && (
          <p style={{ color: "var(--text-muted, #8b8b9a)", fontSize: 14, textAlign: "center", padding: "24px 0" }}>
            No transactions yet.
          </p>
        )}
        {txs.map((tx, i) => {
          const dep = tx.type === "deposit";
          const cfg = STATUS_MAP[tx.status] ?? STATUS_MAP.pending;
          return (
            <div key={tx.id} className="dash-tx-row" style={{ "--i": i } as React.CSSProperties}>
              <div className={`dash-tx-icon ${dep ? "dash-tx-icon--dep" : "dash-tx-icon--wit"}`}>
                {dep ? <IcoArrowDown /> : <IcoArrowUp />}
              </div>
              <div className="dash-tx-info">
                <span className="dash-tx-type">{dep ? "Deposit" : "Withdrawal"}</span>
                {tx.hash && <span className="dash-tx-hash">{tx.hash}</span>}
              </div>
              <div className="dash-tx-right">
                <span className={`dash-tx-amount ${dep ? "dash-tx-amount--pos" : "dash-tx-amount--neg"}`}>
                  {dep ? "+" : "−"}{tx.amount} {tx.currency}
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