import React, { useState, useEffect } from "react";
import "./Deposit.css";

const API = import.meta.env.VITE_API_DOMAIN;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

/* ── Icons ── */
const IcoCopy = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IcoCheck = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoChevDown = () => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IcoWarn = () => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IcoArrowLeft = () => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const IcoClock = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoRefresh = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

/* ── Types ── */
interface Network {
  id: number | string;
  name: string;
  symbol: string;
  confirmations: number;
  min_deposit: number;
  min_deposit_usd: number;
  usd_rate: number;
  address: string;
  color?: string;
}

type Step = "form" | "confirm" | "pending";

/* ── Colors ── */
const COLORS: Record<string, string> = {
  btc: "#F7931A",
  eth: "#627EEA",
  bep20: "#F3BA2F",
  trc20: "#FF4D4D",
  erc20: "#627EEA",
  usdt: "#26A17B",
};
const pickColor = (name: string) => {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(COLORS)) {
    if (key.includes(k)) return v;
  }
  return "#3179c1";
};

/* ── Helpers ── */
const fmt = (n: number, decimals = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

const fmtCrypto = (n: number) => {
  if (n === 0) return "0";
  if (n >= 0.001) return n.toFixed(6);
  return n.toFixed(8);
};

/* ── Component ── */
const Deposit: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [netId, setNetId] = useState<string | number>("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Multi-step
  const [step, setStep] = useState<Step>("form");
  const [usdAmount, setUsdAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [depositResult, setDepositResult] = useState<{
    id: number;
    usd_amount: string;
    crypto_amount: string;
    currency: string;
    network_name: string;
    usd_rate: string;
    created_at: string;
  } | null>(null);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const res = await fetch(`${API}/api/networks`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        const rawList = Array.isArray(data) ? data : [];

        interface RawNetwork {
          id: number;
          name: string;
          symbol: string;
          confirmations: number;
          min_deposit: number;
          min_deposit_usd?: number;
          usd_rate?: number;
          deposit_address: string;
          color?: string;
        }

        const list: Network[] = rawList.map((n: RawNetwork) => ({
          id: n.id,
          name: n.name,
          symbol: n.symbol,
          confirmations: n.confirmations,
          min_deposit: n.min_deposit,
          min_deposit_usd: n.min_deposit_usd ?? 0,
          usd_rate: n.usd_rate ?? 1,
          address: n.deposit_address,
          color: n.color ?? pickColor(n.name),
        }));

        setNetworks(list);
        if (list.length > 0) setNetId(list[0].id);
      } catch (err) {
        console.error("Failed to load networks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetworks();
  }, []);

  const net = networks.find((n) => String(n.id) === String(netId));

  // Live conversion: USD → crypto
  const usdNum = parseFloat(usdAmount) || 0;
  const cryptoPreview =
    net && usdNum > 0 && net.usd_rate > 0 ? usdNum / net.usd_rate : 0;

  const copy = () => {
    if (!net?.address) return;
    navigator.clipboard.writeText(net.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Step 1 validation ── */
  const handleProceed = () => {
    setError("");
    if (!usdAmount || usdNum <= 0) {
      setError("Please enter a valid USD amount.");
      return;
    }
    if (net && usdNum < net.min_deposit_usd) {
      setError(
        `Minimum deposit is $${fmt(net.min_deposit_usd)} (≈ ${net.min_deposit} ${net.symbol}).`,
      );
      return;
    }
    setStep("confirm");
  };

  /* ── Step 2 submit ── */
  const handleConfirm = async () => {
    if (!net) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/user/deposits`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          network_id: net.id,
          usd_amount: usdNum,
          transaction_hash: txHash || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Failed to submit deposit. Please try again.");
        setStep("form");
        return;
      }

      setDepositResult({
        id: data.id,
        usd_amount: data.usd_amount ?? usdNum.toFixed(2),
        crypto_amount: data.amount ?? fmtCrypto(cryptoPreview),
        currency: data.currency ?? net.symbol,
        network_name: data.network?.name ?? net.name,
        usd_rate: data.usd_rate ?? net.usd_rate.toFixed(2),
        created_at: data.created_at,
      });
      setStep("pending");
    } catch {
      setError("Network error. Please try again.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Reset ── */
  const handleNewDeposit = () => {
    setStep("form");
    setUsdAmount("");
    setTxHash("");
    setDepositResult(null);
    setError("");
    setCopied(false);
  };

  const STEPS_INFO = net
    ? [
        "Enter the USD amount you want to deposit and select a network.",
        `Send the equivalent ${net.symbol} to the address shown on the next step.`,
        `Wait for ${net.confirmations} blockchain confirmations (~10–30 min).`,
        "Your balance is credited once admin approves the deposit.",
      ]
    : [];

  /* ═══════════════════════════════════
     PENDING SCREEN
  ═══════════════════════════════════ */
  if (step === "pending" && depositResult) {
    return (
      <div className="dp page-enter">
        <div className="page-hd">
          <h1>Deposit</h1>
          <p>Fund your Coinbridge account with crypto</p>
        </div>

        <div className="dp-pending-wrap">
          <div className="dp-pending-card">
            <div className="dp-pending-icon">
              <IcoClock />
            </div>
            <h2 className="dp-pending-title">Deposit Submitted</h2>
            <p className="dp-pending-sub">
              Your deposit is pending admin review. You'll be notified once it's
              approved.
            </p>

            <div className="dp-pending-details">
              <div className="dp-detail">
                <span className="dp-detail-label">USD Amount</span>
                <span className="dp-detail-value dp-pending-amount">
                  ${fmt(parseFloat(depositResult.usd_amount))}
                </span>
              </div>
              <div className="dp-detail">
                <span className="dp-detail-label">Crypto Equivalent</span>
                <span className="dp-detail-value">
                  {fmtCrypto(parseFloat(depositResult.crypto_amount))}{" "}
                  {depositResult.currency}
                </span>
              </div>
              <div className="dp-detail">
                <span className="dp-detail-label">Rate Used</span>
                <span className="dp-detail-value">
                  1 {depositResult.currency} = $
                  {fmt(parseFloat(depositResult.usd_rate))}
                </span>
              </div>
              <div className="dp-detail">
                <span className="dp-detail-label">Network</span>
                <span className="dp-detail-value">
                  {depositResult.network_name}
                </span>
              </div>
              <div className="dp-detail">
                <span className="dp-detail-label">Reference ID</span>
                <span className="dp-detail-value dp-detail-mono">
                  #{depositResult.id}
                </span>
              </div>
              <div className="dp-detail">
                <span className="dp-detail-label">Submitted</span>
                <span className="dp-detail-value">
                  {new Date(depositResult.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="dp-pending-badge">
              <span className="dp-badge-dot" />
              Pending Review
            </div>

            <div className="dp-pending-actions">
              <a href="/user/transactions" className="dp-btn-primary">
                View Transaction History
              </a>
              <button className="dp-btn-ghost" onClick={handleNewDeposit}>
                Make Another Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════
     CONFIRM SCREEN
  ═══════════════════════════════════ */
  if (step === "confirm" && net) {
    return (
      <div className="dp page-enter">
        <div className="page-hd">
          <h1>Deposit</h1>
          <p>Fund your Coinbridge account with crypto</p>
        </div>

        <div className="dp-grid">
          <div className="dp-card">
            <button className="dp-back-btn" onClick={() => setStep("form")}>
              <IcoArrowLeft /> Back
            </button>

            <div className="dp-section">
              <p className="dp-confirm-title">Confirm Your Deposit</p>
              <p className="dp-confirm-sub">
                Send the exact crypto amount below to the address shown, then
                click "I've Sent the Payment".
              </p>
            </div>

            {/* Summary box */}
            <div className="dp-confirm-summary">
              <div className="dp-confirm-row">
                <span className="dp-confirm-label">You pay</span>
                <span className="dp-confirm-big">${fmt(usdNum)}</span>
              </div>
              <div className="dp-confirm-divider">
                <span className="dp-confirm-equals">≈</span>
              </div>
              <div className="dp-confirm-row">
                <span className="dp-confirm-label">You send</span>
                <span className="dp-confirm-big" style={{ color: net.color }}>
                  {fmtCrypto(cryptoPreview)} {net.symbol}
                </span>
              </div>
              <div className="dp-confirm-rate-row">
                <IcoRefresh />
                <span>
                  1 {net.symbol} = ${fmt(net.usd_rate)} &nbsp;·&nbsp;
                  <span
                    className="dp-dot"
                    style={{
                      background: net.color,
                      display: "inline-block",
                      marginRight: 4,
                    }}
                  />
                  {net.name}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="dp-section">
              <span className="dp-label">Send To This Address</span>
              <div className="dp-addr-box">
                <p className="dp-addr-text">{net.address}</p>
                <div className="dp-addr-actions">
                  <button
                    className={`dp-btn-copy ${copied ? "dp-btn-copy--done" : ""}`}
                    onClick={copy}
                  >
                    {copied ? (
                      <>
                        <IcoCheck /> Copied
                      </>
                    ) : (
                      <>
                        <IcoCopy /> Copy address
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional tx hash */}
            <div className="dp-section">
              <span className="dp-label">
                Transaction Hash{" "}
                <span className="dp-label-optional">(optional)</span>
              </span>
              <input
                className="dp-input"
                type="text"
                placeholder="Paste your tx hash for faster verification"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
            </div>

            <div className="dp-warn">
              <IcoWarn />
              <p>
                <strong>Only send {net.symbol}</strong> on the {net.name}{" "}
                network. Send exactly{" "}
                <strong>
                  {fmtCrypto(cryptoPreview)} {net.symbol}
                </strong>
                . A different amount may delay or complicate processing.
              </p>
            </div>

            {error && <p className="dp-error">{error}</p>}

            <button
              className="dp-btn-confirm"
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "I've Sent the Payment"}
            </button>
          </div>

          {/* Steps panel */}
          <div className="dp-steps-card">
            <p className="dp-steps-title">How it works</p>
            <ol className="dp-steps">
              {STEPS_INFO.map((s, i) => (
                <li
                  key={i}
                  className={`dp-step ${i === 1 ? "dp-step--active" : ""}`}
                >
                  <span className="dp-step-n">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="dp-steps-note">
              Track your deposit in{" "}
              <a href="/user/transactions">Transaction History</a>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════
     FORM SCREEN (default)
  ═══════════════════════════════════ */
  if (loading)
    return (
      <div className="dp page-enter">
        <div className="page-hd">
          <h1>Deposit</h1>
        </div>
        <p
          style={{
            color: "var(--text-muted,#8b8b9a)",
            padding: "40px 0",
            textAlign: "center",
          }}
        >
          Loading networks…
        </p>
      </div>
    );

  return (
    <div className="dp page-enter">
      <div className="page-hd">
        <h1>Deposit</h1>
        <p>Fund your Coinbridge account with crypto</p>
      </div>

      <div className="dp-grid">
        {/* ── Main card ── */}
        <div className="dp-card">
          {/* Network selector */}
          <div className="dp-section">
            <span className="dp-label">Network</span>
            <div className={`dp-select ${open ? "dp-select--open" : ""}`}>
              <button
                className="dp-select-btn"
                onClick={() => setOpen((o) => !o)}
              >
                <span
                  className="dp-dot"
                  style={{ background: net?.color ?? "#3179c1" }}
                />
                <span className="dp-select-name">
                  {net?.name ?? "Select network"}
                </span>
                <span className="dp-select-sym">{net?.symbol ?? ""}</span>
                {net?.usd_rate ? (
                  <span className="dp-select-rate">${fmt(net.usd_rate)}</span>
                ) : null}
                <span className="dp-chevron">
                  <IcoChevDown />
                </span>
              </button>
              {open && (
                <div className="dp-menu">
                  {networks.map((n) => (
                    <button
                      key={n.id}
                      className={`dp-option ${String(n.id) === String(netId) ? "dp-option--active" : ""}`}
                      onClick={() => {
                        setNetId(n.id);
                        setOpen(false);
                        setUsdAmount("");
                        setError("");
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
                      <span className="dp-option-rate">${fmt(n.usd_rate)}</span>
                      {String(n.id) === String(netId) && <IcoCheck />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {net && (
            <>
              {/* USD Amount input */}
              <div className="dp-section">
                <span className="dp-label">Amount (USD)</span>
                <div className="dp-amount-wrap">
                  <span className="dp-amount-prefix">$</span>
                  <input
                    className="dp-input dp-amount-input dp-amount-input--usd"
                    type="number"
                    min={net.min_deposit_usd}
                    step="0.01"
                    placeholder={`Min. $${fmt(net.min_deposit_usd)}`}
                    value={usdAmount}
                    onChange={(e) => {
                      setUsdAmount(e.target.value);
                      setError("");
                    }}
                  />
                </div>

                {/* Live conversion preview */}
                {cryptoPreview > 0 ? (
                  <div className="dp-conversion-box">
                    <span className="dp-conversion-eq">≈</span>
                    <span
                      className="dp-conversion-crypto"
                      style={{ color: net.color }}
                    >
                      {fmtCrypto(cryptoPreview)} {net.symbol}
                    </span>
                    <span className="dp-conversion-rate">
                      @ ${fmt(net.usd_rate)} / {net.symbol}
                    </span>
                  </div>
                ) : (
                  <p className="dp-input-hint">
                    Minimum: ${fmt(net.min_deposit_usd)} · 1 {net.symbol} = $
                    {fmt(net.usd_rate)}
                  </p>
                )}
              </div>

              {/* Deposit address */}
              <div className="dp-section">
                <span className="dp-label">Deposit Address</span>
                <div className="dp-addr-box">
                  <p className="dp-addr-text">{net.address}</p>
                  <div className="dp-addr-actions">
                    <button
                      className={`dp-btn-copy ${copied ? "dp-btn-copy--done" : ""}`}
                      onClick={copy}
                    >
                      {copied ? (
                        <>
                          <IcoCheck /> Copied
                        </>
                      ) : (
                        <>
                          <IcoCopy /> Copy address
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="dp-details">
                {[
                  {
                    label: "Confirmations required",
                    value: String(net.confirmations),
                  },
                  {
                    label: "Minimum deposit",
                    value: `$${fmt(net.min_deposit_usd)} (${net.min_deposit} ${net.symbol})`,
                  },
                  {
                    label: "Current rate",
                    value: `1 ${net.symbol} = $${fmt(net.usd_rate)}`,
                  },
                  { label: "Expected arrival", value: "10 – 30 min" },
                ].map((d) => (
                  <div key={d.label} className="dp-detail">
                    <span className="dp-detail-label">{d.label}</span>
                    <span className="dp-detail-value">{d.value}</span>
                  </div>
                ))}
              </div>

              <div className="dp-warn">
                <IcoWarn />
                <p>
                  <strong>Only send {net.symbol}</strong> on the {net.name}{" "}
                  network to this address. Sending any other asset will result
                  in permanent loss.
                </p>
              </div>

              {error && <p className="dp-error">{error}</p>}

              <button
                className="dp-btn-confirm"
                onClick={handleProceed}
                disabled={!usdAmount || usdNum <= 0}
              >
                Continue to Confirm
              </button>
            </>
          )}
        </div>

        {/* ── Steps panel ── */}
        <div className="dp-steps-card">
          <p className="dp-steps-title">How it works</p>
          <ol className="dp-steps">
            {STEPS_INFO.map((s, i) => (
              <li
                key={i}
                className={`dp-step ${i === 0 ? "dp-step--active" : ""}`}
              >
                <span className="dp-step-n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="dp-steps-note">
            Track your deposit status in{" "}
            <a href="/user/transactions">Transaction History</a>. Processing is
            fully automatic.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
