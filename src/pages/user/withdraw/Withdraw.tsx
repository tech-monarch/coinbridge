import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Withdraw.css";

const API = import.meta.env.VITE_API_DOMAIN;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

/* ── Icons ── */
const IcoUp = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const IcoChevDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IcoCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoCheckLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IcoClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IcoShieldLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IcoBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

/* ── Types ── */
interface Network {
  id: number | string;
  name: string;
  symbol: string;
  fee?: number;
  min_deposit?: number;
  color?: string;
}

interface SubmitResult {
  message: string;
  usd_amount: number;
  crypto_amount: number;
  symbol: string;
  usd_rate: number;
  fee_usd: number;
  net_usd: number;
}

const COLORS: Record<string, string> = {
  btc:   "#F7931A",
  eth:   "#627EEA",
  bep20: "#F3BA2F",
  trc20: "#FF4D4D",
  erc20: "#627EEA",
  usdt:  "#26A17B",
};
const pickColor = (name: string) => {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(COLORS)) {
    if (key.includes(k)) return v;
  }
  return "#a78bfa";
};

type Step = "form" | "confirm" | "done";

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep]               = useState<Step>("form");
  const [networks, setNetworks]       = useState<Network[]>([]);
  const [netId, setNetId]             = useState<string | number>("");
  const [ddOpen, setDdOpen]           = useState(false);
  const [address, setAddress]         = useState("");
  const [amount, setAmount]           = useState("");
  const [errors, setErrors]           = useState<{ address?: string; amount?: string; api?: string }>({});
  const [loading, setLoading]         = useState(false);
  const [loadingNets, setLoadingNets] = useState(true);
  const [balance, setBalance]         = useState<number>(0);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  // null = no KYC wall; "none" | "pending" | "rejected" = show wall
  const [kycStatus, setKycStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const netRes = await fetch(`${API}/api/networks`, {
          headers: authHeaders(),
        });
        if (netRes.status === 401) {
          navigate("/login");
          return;
        }
        const netData = await netRes.json();
        const list: Network[] = (netData.data ?? netData ?? []).map(
          (n: {
            id?: string;
            name?: string;
            symbol?: string;
            fee?: number;
            min_deposit?: number;
            color?: string;
          }) => ({
            ...n,
            color: n.color ?? pickColor(n.name ?? ""),
          }),
        );
        setNetworks(list);
        if (list.length > 0) setNetId(list[0].id);

        const profileRes = await fetch(`${API}/api/user/profile`, {
          headers: authHeaders(),
        });
        const profileData = await profileRes.json();
        setBalance(parseFloat(profileData.balance ?? 0));
      } catch (err) {
        console.error("Withdraw fetch error:", err);
      } finally {
        setLoadingNets(false);
      }
    };
    fetchData();
  }, [navigate]);

  const net        = networks.find((n) => String(n.id) === String(netId));
  const usdAmount  = parseFloat(amount) || 0;

  const validate = () => {
    const e: typeof errors = {};
    if (!address.trim() || address.trim().length < 10)
      e.address = "Enter a valid wallet address.";
    if (!amount || usdAmount <= 0)
      e.amount = "Enter a valid amount.";
    else if (usdAmount < 1)
      e.amount = "Minimum withdrawal is $1.00.";
    else if (usdAmount > balance)
      e.amount = "Insufficient balance.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const res  = await fetch(`${API}/api/user/withdrawals/submit`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          network_id:         netId,
          usd_amount:         usdAmount,
          recipient_address:  address,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // ── KYC guard response ──
        if (data.kyc_required) {
          setKycStatus(data.kyc_status ?? "none");
          setStep("form");
          return;
        }
        // Generic API error
        const apiMsg =
          data.message ??
          data.errors?.usd_amount?.[0] ??
          data.errors?.network_id?.[0] ??
          data.errors?.recipient_address?.[0] ??
          "Submission failed. Please try again.";
        setErrors({ api: apiMsg });
        setStep("form");
        return;
      }

      setSubmitResult(data as SubmitResult);
      setStep("done");
    } catch {
      setErrors({ api: "Network error. Please try again." });
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  /* ── KYC wall ── */
  if (kycStatus !== null)
    return (
      <div className="wd page-enter">
        <div className="page-hd">
          <h1>Withdraw</h1>
        </div>
        <div className="wd-success-wrap">
          <div className="wd-success-card">
            <div
              className="wd-success-icon"
              style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
            >
              <IcoShieldLg />
            </div>

            <h2>Identity Verification Required</h2>

            <p>
              {kycStatus === "pending"
                ? "Your KYC submission is currently under review. Withdrawals will be enabled once it's approved — this usually takes 24–48 hours."
                : kycStatus === "rejected"
                ? "Your previous KYC submission was rejected. Please re-submit with valid documents to enable withdrawals."
                : "You need to complete identity verification before you can make a withdrawal. It only takes a few minutes."}
            </p>

            <div className="wd-success-rows">
              <div className="wd-confirm-row">
                <span>Status</span>
                <span
                  className={`badge ${
                    kycStatus === "pending"
                      ? "badge-warning"
                      : kycStatus === "rejected"
                      ? "badge-danger"
                      : "badge-muted"
                  }`}
                >
                  {kycStatus === "pending" ? (
                    <><IcoClock /> Under Review</>
                  ) : kycStatus === "rejected" ? (
                    <><IcoAlert /> Rejected</>
                  ) : (
                    <><IcoShield /> Not Started</>
                  )}
                </span>
              </div>
              {kycStatus !== "pending" && (
                <div className="wd-confirm-row">
                  <span>Action required</span>
                  <span>
                    {kycStatus === "rejected"
                      ? "Re-submit KYC documents"
                      : "Complete identity verification"}
                  </span>
                </div>
              )}
            </div>

            <div className="wd-success-actions">
              {kycStatus !== "pending" && (
                <Link to="/user/kyc" className="wd-btn-primary">
                  {kycStatus === "rejected"
                    ? "Re-submit KYC"
                    : "Start Verification"}
                </Link>
              )}
              <button
                className="wd-btn-ghost"
                onClick={() => {
                  setKycStatus(null);
                  setStep("form");
                }}
              >
                <IcoBack /> Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  /* ── Done ── */
  if (step === "done")
    return (
      <div className="wd page-enter">
        <div className="page-hd">
          <h1>Withdraw</h1>
        </div>
        <div className="wd-success-wrap">
          <div className="wd-success-card">
            <div className="wd-success-icon">
              <IcoCheckLg />
            </div>
            <h2>Request Submitted</h2>
            <p>
              Your withdrawal of{" "}
              <strong>
                ${submitResult?.usd_amount.toFixed(2) ?? usdAmount.toFixed(2)}
              </strong>{" "}
              ({submitResult?.crypto_amount.toFixed(6) ?? "—"}{" "}
              {submitResult?.symbol ?? net?.symbol}) is pending admin approval.
              You'll be notified when it's processed.
            </p>
            <div className="wd-success-rows">
              <div className="wd-confirm-row">
                <span>Destination</span>
                <span className="mono">
                  {address.slice(0, 10)}…{address.slice(-6)}
                </span>
              </div>
              <div className="wd-confirm-row">
                <span>You receive</span>
                <span>
                  {submitResult
                    ? `${submitResult.net_usd.toFixed(2)} USD (${submitResult.crypto_amount.toFixed(6)} ${submitResult.symbol})`
                    : "—"}
                </span>
              </div>
              <div className="wd-confirm-row">
                <span>Network fee</span>
                <span>
                  {submitResult ? `$${submitResult.fee_usd.toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="wd-confirm-row">
                <span>Status</span>
                <span className="badge badge-warning">
                  <IcoClock /> Pending
                </span>
              </div>
            </div>
            <div className="wd-success-actions">
              <Link to="/user/transactions" className="wd-btn-primary">
                View Transactions
              </Link>
              <button
                className="wd-btn-ghost"
                onClick={() => {
                  setStep("form");
                  setAddress("");
                  setAmount("");
                  setSubmitResult(null);
                }}
              >
                New Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  /* ── Confirm ── */
  if (step === "confirm")
    return (
      <div className="wd page-enter">
        <div className="page-hd">
          <h1>Review Withdrawal</h1>
          <p>Confirm the details before submitting</p>
        </div>
        <div className="wd-confirm-card">
          <div className="wd-confirm-asset">
            <span
              className="dp-dot"
              style={{
                background: net?.color ?? "#a78bfa",
                width: 10,
                height: 10,
              }}
            />
            {net?.name}
          </div>
          <div className="wd-confirm-amount-block">
            <span className="wd-confirm-amount-label">You Send</span>
            <div className="wd-confirm-amount">${usdAmount.toFixed(2)}</div>
            <p className="wd-confirm-net">
              Crypto amount calculated at live rate on submission.{" "}
              {net?.fee != null && (
                <>
                  Network fee: <strong>{net.fee} {net.symbol}</strong>
                </>
              )}
            </p>
          </div>
          <div className="wd-confirm-rows">
            <div className="wd-confirm-row">
              <span>Destination</span>
              <span className="mono">{address}</span>
            </div>
            <div className="wd-confirm-row">
              <span>Network</span>
              <span>{net?.name} ({net?.symbol})</span>
            </div>
            <div className="wd-confirm-row">
              <span>Processing time</span>
              <span>24 – 48 hours</span>
            </div>
          </div>
          {errors.api && (
            <div className="auth-error" style={{ marginBottom: 12 }}>
              {errors.api}
            </div>
          )}
          <div className="wd-danger-note">
            <IcoAlert />
            <span>This cannot be undone. Verify the address is correct.</span>
          </div>
          <div className="wd-confirm-actions">
            <button className="wd-btn-ghost" onClick={() => setStep("form")}>
              <IcoBack /> Edit
            </button>
            <button
              className="wd-btn-primary wd-btn-flex"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <span className="wd-spinner" />
              ) : (
                <>
                  <IcoUp /> Confirm Withdrawal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );

  /* ── Form ── */
  return (
    <div className="wd page-enter">
      <div className="page-hd">
        <h1>Withdraw</h1>
        <p>Send crypto to an external wallet</p>
      </div>
      <div className="wd-grid">
        <div className="wd-form-card">
          {errors.api && (
            <div className="auth-error" style={{ marginBottom: 16 }}>
              {errors.api}
            </div>
          )}

          {/* Network selector */}
          <div className="wd-section">
            <span className="dp-label">Network</span>
            {loadingNets ? (
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                Loading networks…
              </p>
            ) : (
              <div className={`dp-select ${ddOpen ? "dp-select--open" : ""}`}>
                <button
                  className="dp-select-btn"
                  onClick={() => setDdOpen((o) => !o)}
                >
                  <span
                    className="dp-dot"
                    style={{ background: net?.color ?? "#a78bfa" }}
                  />
                  <span className="dp-select-name">
                    {net?.name ?? "Select network"}
                  </span>
                  <span className="dp-select-sym">
                    Balance: ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                  <span className="dp-chevron">
                    <IcoChevDown />
                  </span>
                </button>
                {ddOpen && (
                  <div className="dp-menu">
                    {networks.map((n) => (
                      <button
                        key={n.id}
                        className={`dp-option ${String(n.id) === String(netId) ? "dp-option--active" : ""}`}
                        onClick={() => {
                          setNetId(n.id);
                          setDdOpen(false);
                        }}
                      >
                        <span
                          className="dp-dot"
                          style={{ background: n.color }}
                        />
                        <div className="dp-option-info">
                          <span>{n.name}</span>
                          <span className="dp-option-sym">{n.symbol}</span>
                        </div>
                        {String(n.id) === String(netId) && <IcoCheck />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="wd-section">
            <span className="dp-label">Destination Address</span>
            <input
              className={`input-field ${errors.address ? "input-field--error" : ""}`}
              placeholder="Enter recipient wallet address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setErrors((p) => ({ ...p, address: undefined }));
              }}
            />
            {errors.address && (
              <span className="input-error">{errors.address}</span>
            )}
          </div>

          {/* Amount */}
          <div className="wd-section">
            <span className="dp-label">Amount (USD)</span>
            <div
              className={`wd-amount-wrap ${errors.amount ? "wd-amount-wrap--error" : ""}`}
            >
              <span className="wd-amount-prefix">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                className="wd-amount-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((p) => ({ ...p, amount: undefined }));
                }}
              />
              <span className="wd-amount-unit">USD</span>
              <button
                className="wd-amount-max"
                onClick={() => setAmount(balance.toFixed(2))}
              >
                MAX
              </button>
            </div>
            {errors.amount && (
              <span className="input-error">{errors.amount}</span>
            )}
            <div className="wd-amount-meta">
              <span>
                Balance:{" "}
                <strong>
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </strong>
              </span>
              {net?.fee != null && (
                <span>
                  Network fee:{" "}
                  <strong>
                    {net.fee} {net.symbol}
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {usdAmount > 0 && (
            <div className="wd-summary">
              <div className="wd-sum-row">
                <span>You send</span>
                <span>${usdAmount.toFixed(2)} USD</span>
              </div>
              <div className="wd-sum-row">
                <span>Network</span>
                <span>{net?.name} ({net?.symbol})</span>
              </div>
              <div className="wd-sum-divider" />
              <div className="wd-sum-row wd-sum-row--total">
                <span>Crypto amount</span>
                <span className="wd-sum-total">Calculated at live rate</span>
              </div>
            </div>
          )}

          <div className="wd-section">
            <button
              className="wd-btn-primary wd-btn-full"
              onClick={() => validate() && setStep("confirm")}
            >
              <IcoUp /> Continue to Review
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="wd-info-card">
          {[
            {
              icon: <IcoClock />,
              title: "Processing Time",
              text: "Withdrawals require admin approval and are typically processed within 24–48 hours.",
            },
            {
              icon: <IcoShield />,
              title: "Security Review",
              text: "All withdrawals undergo a security check. You may be asked to verify your identity.",
            },
            {
              icon: <IcoAlert />,
              title: "Irreversible",
              text: "Crypto transactions cannot be reversed. Always double-check your destination address.",
            },
          ].map((item, i) => (
            <div key={i} className="wd-info-item">
              <div className="wd-info-ico">{item.icon}</div>
              <div>
                <p className="wd-info-title">{item.title}</p>
                <p className="wd-info-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Withdraw;