import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar       from "./components/user/Sidebar";
import BottomNav     from "./components/user/BottomNav";
import MarketSidebar from "./components/user/MarketSidebar";
import Dashboard     from "./pages/user/dashboard/Dashboard";
import AdminDashboard     from "./pages/admin/dashboard/Dashboard";
import Deposit       from "./pages/user/deposit/Deposit";
import AdminDeposit       from "./pages/admin/deposits/Deposits";
import Withdraw      from "./pages/user/withdraw/Withdraw";
import AdminWithdraw      from "./pages/admin/withdrawals/Withdrawals";
import Transactions  from "./pages/user/transactions/Transactions";
import AdminTransactions  from "./pages/admin/transactions/Transactions";
import Kyc           from "./pages/user/kyc/Kyc";
import AdminKyc           from "./pages/admin/kyc/Kyc";
import Settings      from "./pages/user/settings/Settings";
import AdminSettings      from "./pages/admin/settings/Settings";
import AdminUsers      from "./pages/admin/users/Users";
import Login       from "./pages/user/login/Login";
import Register       from "./pages/user/register/Register";
import "./styles/globals.css";

/* ── Landing redirect ── */
const LandingRedirect = () => {
  window.location.href = "/landing/index.html";
  return null;
};

/* ── Theme ── */
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const s = localStorage.getItem("cb_theme");
    if (s === "light" || s === "dark") return s;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cb_theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") };
}

/* ── Auth guard (user only) ── */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/* ── Admin guard (token + role check) ── */
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  const role = (() => {
    try {
      return JSON.parse(localStorage.getItem("cb_user") ?? "{}").role ?? null;
    } catch {
      return null;
    }
  })();

  if (!token || role === null) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/user/dashboard" replace />;

  return <>{children}</>;
}

/* ── User Shell ── */
function UserLayout() {
  const { theme, toggle } = useTheme();
  // Read the actual logged-in user's name from storage
  const userName = (() => {
    try {
      return JSON.parse(localStorage.getItem("cb_user") ?? "{}").name ?? "User";
    } catch {
      return "User";
    }
  })();

  return (
    <div className="app-shell">
      <Sidebar theme={theme} onThemeToggle={toggle} userName={userName} />
      <div className="app-content">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <MarketSidebar />
      <BottomNav />
    </div>
  );
}

/* ── Admin Shell (no MarketSidebar, no BottomNav) ── */
function AdminLayout() {
  const { theme, toggle } = useTheme();
  const userName = (() => {
    try {
      return JSON.parse(localStorage.getItem("cb_user") ?? "{}").name ?? "Admin";
    } catch {
      return "Admin";
    }
  })();

  return (
    <div className="app-shell">
      <Sidebar theme={theme} onThemeToggle={toggle} userName={userName} />
      <div className="app-content">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ── App ── */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingRedirect />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── User routes ── */}
        <Route path="/user" element={<RequireAuth><UserLayout /></RequireAuth>}>
          <Route index               element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="deposit"      element={<Deposit />} />
          <Route path="withdraw"     element={<Withdraw />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="kyc"          element={<Kyc />} />
          <Route path="settings"     element={<Settings />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index               element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<AdminDashboard />} />
          {/* Fixed: was "deposit"/"withdraw", must match the Link hrefs used in pages */}
          <Route path="deposits"     element={<AdminDeposit />} />
          <Route path="withdrawals"  element={<AdminWithdraw />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="kyc"          element={<AdminKyc />} />
          <Route path="settings"     element={<AdminSettings />} />
          <Route path="users"        element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;