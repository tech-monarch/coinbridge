import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import BotVerification from "../../../components/shared/BotVerification";

const API = import.meta.env.VITE_API_DOMAIN;

const IcoEye = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoEyeOff = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [verified, setVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!verified) {
      setError("Please complete the bot verification.");
      return;
    }

    // Basic client-side validation
    const fe: Record<string, string> = {};
    if (!name.trim()) fe.name = "Name is required.";
    if (!email.trim()) fe.email = "Email is required.";
    if (password.length < 8)
      fe.password = "Password must be at least 8 characters.";
    if (password !== confirm) fe.confirm = "Passwords do not match.";
    if (Object.keys(fe).length) {
      setFieldErrors(fe);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirm,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Laravel 422 returns errors as { errors: { field: [msg] } }
        if (data.errors) {
          const mapped: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(
            data.errors as Record<string, string[]>,
          )) {
            mapped[key] = msgs[0];
          }
          setFieldErrors(mapped);
        } else {
          setError(data.message || "Registration failed. Please try again.");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("cb_user", JSON.stringify(data.user));
      navigate("/user/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          {/* <div className="auth-brand-icon">₿</div> */}
          <span className="auth-brand-name">Altioda</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start your crypto journey today</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <label className="input-label">Full Name</label>
            <input
              className={`input-field ${fieldErrors.name ? "input-field--error" : ""}`}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {fieldErrors.name && (
              <span className="input-error">{fieldErrors.name}</span>
            )}
          </div>

          <div className="input-wrap">
            <label className="input-label">Email Address</label>
            <input
              className={`input-field ${fieldErrors.email ? "input-field--error" : ""}`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className="input-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="input-wrap">
            <label className="input-label">Password</label>
            <div className="auth-pw-wrap">
              <input
                className={`input-field auth-pw-input ${fieldErrors.password ? "input-field--error" : ""}`}
                type={showPw ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-pw-eye"
                onClick={() => setShowPw((s) => !s)}
              >
                {showPw ? <IcoEyeOff /> : <IcoEye />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="input-error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="input-wrap">
            <label className="input-label">Confirm Password</label>
            <div className="auth-pw-wrap">
              <input
                className={`input-field auth-pw-input ${fieldErrors.confirm ? "input-field--error" : ""}`}
                type={showConf ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-pw-eye"
                onClick={() => setShowConf((s) => !s)}
              >
                {showConf ? <IcoEyeOff /> : <IcoEye />}
              </button>
            </div>
            {fieldErrors.confirm && (
              <span className="input-error">{fieldErrors.confirm}</span>
            )}
          </div>

          <BotVerification onVerified={setVerified} />

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || !verified}
          >
            {loading ? <span className="wd-spinner" /> : "Create Account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
