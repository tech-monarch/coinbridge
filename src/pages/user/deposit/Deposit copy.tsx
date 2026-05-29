import React, { useState } from 'react';
import './Deposit.css';

/* ── Icons ── */
const IcoCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoChevDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IcoWarn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IcoQr = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/>
    <rect x="3" y="16" width="5" height="5" rx="1"/>
    <rect x="4" y="4" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="17" y="4" width="3" height="3" fill="currentColor" stroke="none"/>
    <rect x="4" y="17" width="3" height="3" fill="currentColor" stroke="none"/>
    <line x1="14" y1="9" x2="14" y2="9.01"/><line x1="17" y1="9" x2="17" y2="9.01"/>
    <line x1="14" y1="12" x2="17" y2="12"/><line x1="14" y1="15" x2="14" y2="21"/>
    <line x1="17" y1="15" x2="17" y2="18"/><line x1="17" y1="21" x2="21" y2="21"/>
    <line x1="21" y1="15" x2="21" y2="18"/>
  </svg>
);

/* ── Networks ── */
interface Network { id: string; name: string; symbol: string; confirmations: number; minDeposit: number; address: string; color: string; }
const NETWORKS: Network[] = [
  { id:'eth',   name:'Ethereum (ERC-20)',      symbol:'ETH / USDT', confirmations:12, minDeposit:0.01,  address:'0x742d35Cc6634C0532925a3b8D4C9D5f8B3e8B2e', color:'#627EEA' },
  { id:'btc',   name:'Bitcoin',                symbol:'BTC',        confirmations:3,  minDeposit:0.001, address:'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',  color:'#F7931A' },
  { id:'bep20', name:'BNB Smart Chain (BEP-20)',symbol:'BNB / USDT', confirmations:15, minDeposit:0.005, address:'0x8a5B3dE58A3F4C0532925a3b8D4C9D5f8B3e2a4f', color:'#F3BA2F' },
  { id:'trc20', name:'TRON (TRC-20)',           symbol:'TRX / USDT', confirmations:20, minDeposit:10,    address:'TQcGPvpnR2A1a3BqTdPbU8cGLFX7aKjm3s',           color:'#FF4D4D' },
];

/* ── SVG QR placeholder ── */
const QRCode: React.FC<{ value: string; color: string }> = ({ value, color }) => {
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const SIZE = 9; const CELL = 18;
  const grid = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (__, c) => {
      if (r < 3 && c < 3) return true;
      if (r < 3 && c > 5) return true;
      if (r > 5 && c < 3) return true;
      return ((seed * (r * SIZE + c + 1) * 2654435761) & 0xffffffff) % 3 !== 0;
    })
  );
  const total = SIZE * CELL + 28;
  return (
    <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}>
      <rect width={total} height={total} rx="12" fill="white"/>
      {grid.map((row, r) => row.map((on, c) => on
        ? <rect key={`${r}-${c}`} x={c*CELL+14} y={r*CELL+14} width={CELL-2} height={CELL-2} rx="2" fill="#111"/>
        : null
      ))}
      <rect x="12" y="12" width={3*CELL} height={3*CELL} rx="5" fill="none" stroke={color} strokeWidth="2.5"/>
      <rect x={6*CELL+2} y="12" width={3*CELL} height={3*CELL} rx="5" fill="none" stroke={color} strokeWidth="2.5"/>
      <rect x="12" y={6*CELL+2} width={3*CELL} height={3*CELL} rx="5" fill="none" stroke={color} strokeWidth="2.5"/>
    </svg>
  );
};

/* ── Component ── */
const Deposit: React.FC = () => {
  const [netId, setNetId]   = useState('eth');
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);
  const [qr, setQr]         = useState(false);
  const net = NETWORKS.find(n => n.id === netId)!;

  const copy = () => {
    navigator.clipboard.writeText(net.address);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const STEPS = [
    'Select a network and copy the deposit address below.',
    `Send only ${net.symbol} to this address on the ${net.name} network.`,
    `Wait for ${net.confirmations} blockchain confirmations (~10–30 min).`,
    'Your balance is credited automatically once confirmed.',
  ];

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
            <div className={`dp-select ${open ? 'dp-select--open' : ''}`}>
              <button className="dp-select-btn" onClick={() => setOpen(o => !o)}>
                <span className="dp-dot" style={{ background: net.color }}/>
                <span className="dp-select-name">{net.name}</span>
                <span className="dp-select-sym">{net.symbol}</span>
                <span className="dp-chevron"><IcoChevDown /></span>
              </button>
              {open && (
                <div className="dp-menu">
                  {NETWORKS.map(n => (
                    <button key={n.id} className={`dp-option ${n.id===netId?'dp-option--active':''}`}
                      onClick={() => { setNetId(n.id); setOpen(false); }}>
                      <span className="dp-dot" style={{ background: n.color }}/>
                      <div className="dp-option-info">
                        <span>{n.name}</span>
                        <span className="dp-option-sym">{n.symbol}</span>
                      </div>
                      {n.id === netId && <IcoCheck />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="dp-section">
            <span className="dp-label">Deposit Address</span>
            <div className="dp-addr-box">
              {qr
                ? <div className="dp-qr"><QRCode value={net.address} color={net.color}/><p>Scan with your wallet</p></div>
                : <p className="dp-addr-text">{net.address}</p>
              }
              <div className="dp-addr-actions">
                <button className="dp-btn-ghost" onClick={() => setQr(q => !q)}>
                  <IcoQr /> {qr ? 'Show text' : 'Show QR'}
                </button>
                <button className={`dp-btn-copy ${copied ? 'dp-btn-copy--done' : ''}`} onClick={copy}>
                  {copied ? <><IcoCheck /> Copied</> : <><IcoCopy /> Copy address</>}
                </button>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="dp-details">
            {[
              { label: 'Confirmations required', value: String(net.confirmations) },
              { label: 'Minimum deposit',         value: `${net.minDeposit} ${net.symbol.split(' ')[0]}` },
              { label: 'Expected arrival',         value: '10 – 30 min' },
              { label: 'Network fee',              value: 'Paid by sender' },
            ].map(d => (
              <div key={d.label} className="dp-detail">
                <span className="dp-detail-label">{d.label}</span>
                <span className="dp-detail-value">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="dp-warn">
            <IcoWarn />
            <p><strong>Only send {net.symbol}</strong> on the {net.name} network to this address. Sending any other asset will result in permanent loss.</p>
          </div>
        </div>

        {/* ── Steps panel ── */}
        <div className="dp-steps-card">
          <p className="dp-steps-title">How it works</p>
          <ol className="dp-steps">
            {STEPS.map((s, i) => (
              <li key={i} className="dp-step">
                <span className="dp-step-n">{String(i+1).padStart(2,'0')}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="dp-steps-note">
            Track your deposit status in{' '}
            <a href="/user/transactions">Transaction History</a>.
            Processing is fully automatic.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Deposit;