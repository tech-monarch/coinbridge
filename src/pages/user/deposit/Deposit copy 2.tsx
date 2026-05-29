import React, { useState, useEffect } from "react";
import "./Deposit.css";

const API = import.meta.env.VITE_API_DOMAIN;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

/* ── Icons (unchanged) ── */
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
// const IcoQr = () => (
//   <svg
//     width="15"
//     height="15"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="3" width="5" height="5" rx="1" />
//     <rect x="16" y="3" width="5" height="5" rx="1" />
//     <rect x="3" y="16" width="5" height="5" rx="1" />
//     <rect x="4" y="4" width="3" height="3" fill="currentColor" stroke="none" />
//     <rect x="17" y="4" width="3" height="3" fill="currentColor" stroke="none" />
//     <rect x="4" y="17" width="3" height="3" fill="currentColor" stroke="none" />
//     <line x1="14" y1="9" x2="14" y2="9.01" />
//     <line x1="17" y1="9" x2="17" y2="9.01" />
//     <line x1="14" y1="12" x2="17" y2="12" />
//     <line x1="14" y1="15" x2="14" y2="21" />
//     <line x1="17" y1="15" x2="17" y2="18" />
//     <line x1="17" y1="21" x2="21" y2="21" />
//     <line x1="21" y1="15" x2="21" y2="18" />
//   </svg>
// );

// /* ── QR placeholder (unchanged) ── */
// const QRCode: React.FC<{ value: string; color: string }> = ({
//   value,
//   color,
// }) => {
//   const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
//   const SIZE = 9;
//   const CELL = 18;
//   const grid = Array.from({ length: SIZE }, (_, r) =>
//     Array.from({ length: SIZE }, (__, c) => {
//       if (r < 3 && c < 3) return true;
//       if (r < 3 && c > 5) return true;
//       if (r > 5 && c < 3) return true;
//       return ((seed * (r * SIZE + c + 1) * 2654435761) & 0xffffffff) % 3 !== 0;
//     }),
//   );
//   const total = SIZE * CELL + 28;
//   return (
//     <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}>
//       <rect width={total} height={total} rx="12" fill="white" />
//       {grid.map((row, r) =>
//         row.map((on, c) =>
//           on ? (
//             <rect
//               key={`${r}-${c}`}
//               x={c * CELL + 14}
//               y={r * CELL + 14}
//               width={CELL - 2}
//               height={CELL - 2}
//               rx="2"
//               fill="#111"
//             />
//           ) : null,
//         ),
//       )}
//       <rect
//         x="12"
//         y="12"
//         width={3 * CELL}
//         height={3 * CELL}
//         rx="5"
//         fill="none"
//         stroke={color}
//         strokeWidth="2.5"
//       />
//       <rect
//         x={6 * CELL + 2}
//         y="12"
//         width={3 * CELL}
//         height={3 * CELL}
//         rx="5"
//         fill="none"
//         stroke={color}
//         strokeWidth="2.5"
//       />
//       <rect
//         x="12"
//         y={6 * CELL + 2}
//         width={3 * CELL}
//         height={3 * CELL}
//         rx="5"
//         fill="none"
//         stroke={color}
//         strokeWidth="2.5"
//       />
//     </svg>
//   );
// };

/* ── Network type (matches backend shape) ── */
interface Network {
  id: number | string;
  name: string;
  symbol: string;
  confirmations: number;
  min_deposit: number;
  address: string; // deposit address from backend
  color?: string; // UI only — assigned client-side if not in API
}

// Fallback colors if API doesn't return them
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
  return "#a78bfa";
};

/* ── Component ── */
const Deposit: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [netId, setNetId] = useState<string | number>("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
//   const [qr, setQr] = useState(false);
  const [loading, setLoading] = useState(true);

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
        deposit_address: string;
        color?: string;
      }

      const list: Network[] = rawList.map((n: RawNetwork) => ({
        id: n.id,
        name: n.name,
        symbol: n.symbol,
        confirmations: n.confirmations,
        min_deposit: n.min_deposit,
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

  const copy = () => {
    if (!net?.address) return;
    navigator.clipboard.writeText(net.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STEPS = net
    ? [
        "Select a network and copy the deposit address below.",
        `Send only ${net.symbol} to this address on the ${net.name} network.`,
        `Wait for ${net.confirmations} blockchain confirmations (~10–30 min).`,
        "Your balance is credited automatically once confirmed.",
      ]
    : [];

  if (loading)
    return (
      <div className="dp page-enter">
        <div className="page-hd">
          <h1>Deposit</h1>
        </div>
        <p
          style={{
            color: "var(--text-muted, #8b8b9a)",
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
                  style={{ background: net?.color ?? "#a78bfa" }}
                />
                <span className="dp-select-name">
                  {net?.name ?? "Select network"}
                </span>
                <span className="dp-select-sym">{net?.symbol ?? ""}</span>
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
          </div>

          {/* Address */}
          {net && (
            <>
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

              <div className="dp-details">
                {[
                  {
                    label: "Confirmations required",
                    value: String(net.confirmations),
                  },
                  {
                    label: "Minimum deposit",
                    value: `${net.min_deposit} ${net.symbol.split(" ")[0]}`,
                  },
                  { label: "Expected arrival", value: "10 – 30 min" },
                  { label: "Network fee", value: "Paid by sender" },
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
            </>
          )}
        </div>

        {/* ── Steps panel ── */}
        <div className="dp-steps-card">
          <p className="dp-steps-title">How it works</p>
          <ol className="dp-steps">
            {STEPS.map((s, i) => (
              <li key={i} className="dp-step">
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
