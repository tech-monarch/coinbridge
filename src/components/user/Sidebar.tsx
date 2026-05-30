import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

/* ── Icons ── */
const IcoGrid = () => (
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
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const IcoDown = () => (
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
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);
const IcoUp = () => (
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
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoList = () => (
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
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IcoShield = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoSettings = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IcoLogout = () => (
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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IcoSun = () => (
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
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IcoMoon = () => (
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IcoUsers = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* ── Nav definitions ── */
const USER_NAV = [
  { to: "/user/dashboard", label: "Overview", icon: <IcoGrid /> },
  { to: "/user/deposit", label: "Deposit", icon: <IcoDown /> },
  { to: "/user/withdraw", label: "Withdraw", icon: <IcoUp /> },
  { to: "/user/transactions", label: "Transactions", icon: <IcoList /> },
  { to: "/user/kyc", label: "KYC", icon: <IcoShield /> },
  { to: "/user/settings", label: "Settings", icon: <IcoSettings /> },
];

const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Overview", icon: <IcoGrid /> },
  { to: "/admin/users", label: "Users", icon: <IcoUsers /> },
  { to: "/admin/deposits", label: "Deposits", icon: <IcoDown /> },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: <IcoUp /> },
  { to: "/admin/transactions", label: "Transactions", icon: <IcoList /> },
  { to: "/admin/kyc", label: "KYC", icon: <IcoShield /> },
  { to: "/admin/settings", label: "Settings", icon: <IcoSettings /> },
];

/* ── Read role from storage ── */
function getRole(): string {
  try {
    return JSON.parse(localStorage.getItem("cb_user") ?? "{}").role ?? "user";
  } catch {
    return "user";
  }
}

interface Props {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  userName?: string;
  userAvatar?: string;
}

const Sidebar: React.FC<Props> = ({
  theme,
  onThemeToggle,
  userName = "User",
  userAvatar,
}) => {
  const navigate = useNavigate();
  const isAdmin = getRole() === "admin";
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;
  const initials = userName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cb_user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
{/* Logo */}
<div className="sidebar-logo">
  <img
    src="/landing/altioda.jpg"
    alt="Altioda"
    className="sidebar-logo-img"
  />
          <span className="sidebar-logo-text">Altioda</span>
</div>

        {/* Nav label */}
        <span className="sidebar-nav-label">{isAdmin ? "Admin" : "Menu"}</span>

        {/* Nav links */}
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item${isActive ? " sidebar-nav-item--active" : ""}`
            }
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="sidebar-spacer" />

        {/* Theme toggle */}
        <button className="sidebar-theme-btn" onClick={onThemeToggle}>
          <span className="sidebar-theme-icon">
            {theme === "dark" ? <IcoSun /> : <IcoMoon />}
          </span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {/* User strip */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {userAvatar ? <img src={userAvatar} alt={userName} /> : initials}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userName}</span>
            <span className="sidebar-user-role">
              {isAdmin ? "Administrator" : "Personal"}
            </span>
          </div>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <IcoLogout />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
