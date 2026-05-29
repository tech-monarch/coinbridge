import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Withdraw.css';

/* ── Icons ── */
const IcoUp = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
);
const IcoChevDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoCheckLg = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IcoClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IcoBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

/* ── Assets ── */
interface Asset { id: string; name: string; symbol: string; balance: number; color: string; fee: number; min: number; }
const ASSETS: Asset[] = [
  { id:'usdt_erc20', name:'Tether (ERC-20)', symbol:'USDT', balance:5847.32, color:'#26A17B', fee:5,     min:10    },
  { id:'eth',        name:'Ethereum',        symbol:'ETH',  balance:1.45,    color:'#627EEA', fee:0.003, min:0.01  },
  { id:'btc',        name:'Bitcoin',         symbol:'BTC',  balance:0.082,   color:'#F7931A', fee:0.0002,min:0.001 },
  { id:'usdt_trc20', name:'Tether (TRC-20)', symbol:'USDT', balance:3000,    color:'#FF4D4D', fee:1,     min:5     },
];

type Step = 'form' | 'confirm' | 'done';

const Withdraw: React.FC = () => {
  const [step, setStep]       = useState<Step>('form');
  const [assetId, setAssetId] = useState('usdt_erc20');
  const [ddOpen, setDdOpen]   = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount]   = useState('');
  const [errors, setErrors]   = useState<{address?:string; amount?:string}>({});
  const [loading, setLoading] = useState(false);

  const asset  = ASSETS.find(a => a.id === assetId)!;
  const num    = parseFloat(amount) || 0;
  const net    = Math.max(0, num - asset.fee);

  const validate = () => {
    const e: typeof errors = {};
    if (!address.trim() || address.trim().length < 20) e.address = 'Enter a valid wallet address.';
    if (!amount || num <= 0)         e.amount = 'Enter a valid amount.';
    else if (num < asset.min)        e.amount = `Minimum is ${asset.min} ${asset.symbol}.`;
    else if (num > asset.balance)    e.amount = 'Insufficient balance.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setStep('done');
  };

  /* ── Done ── */
  if (step === 'done') return (
    <div className="wd page-enter">
      <div className="page-hd"><h1>Withdraw</h1></div>
      <div className="wd-success-wrap">
        <div className="wd-success-card">
          <div className="wd-success-icon"><IcoCheckLg /></div>
          <h2>Request Submitted</h2>
          <p>Your withdrawal of <strong>{num} {asset.symbol}</strong> is pending admin approval. You'll be notified when it's processed.</p>
          <div className="wd-success-rows">
            <div className="wd-confirm-row"><span>Destination</span><span className="mono">{address.slice(0,10)}…{address.slice(-6)}</span></div>
            <div className="wd-confirm-row"><span>You receive</span><span>{net.toFixed(6)} {asset.symbol}</span></div>
            <div className="wd-confirm-row"><span>Status</span><span className="badge badge-warning"><IcoClock /> Pending</span></div>
          </div>
          <div className="wd-success-actions">
            <Link to="/user/transactions" className="wd-btn-primary">View Transactions</Link>
            <button className="wd-btn-ghost" onClick={() => { setStep('form'); setAddress(''); setAmount(''); }}>New Withdrawal</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Confirm ── */
  if (step === 'confirm') return (
    <div className="wd page-enter">
      <div className="page-hd"><h1>Review Withdrawal</h1><p>Confirm the details before submitting</p></div>
      <div className="wd-confirm-card">
        <div className="wd-confirm-asset">
          <span className="dp-dot" style={{ background: asset.color, width:10, height:10 }}/>
          {asset.name}
        </div>
        <div className="wd-confirm-amount-block">
          <span className="wd-confirm-amount-label">You Send</span>
          <div className="wd-confirm-amount">{num}<span> {asset.symbol}</span></div>
          <p className="wd-confirm-net">You receive after fee: <strong>{net.toFixed(6)} {asset.symbol}</strong></p>
        </div>
        <div className="wd-confirm-rows">
          <div className="wd-confirm-row"><span>Destination</span><span className="mono">{address}</span></div>
          <div className="wd-confirm-row"><span>Network fee</span><span>{asset.fee} {asset.symbol}</span></div>
          <div className="wd-confirm-row"><span>Processing time</span><span>24 – 48 hours</span></div>
        </div>
        <div className="wd-danger-note"><IcoAlert /><span>This cannot be undone. Verify the address is correct.</span></div>
        <div className="wd-confirm-actions">
          <button className="wd-btn-ghost" onClick={() => setStep('form')}><IcoBack /> Edit</button>
          <button className="wd-btn-primary wd-btn-flex" onClick={submit} disabled={loading}>
            {loading ? <span className="wd-spinner"/> : <><IcoUp /> Confirm Withdrawal</>}
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Form ── */
  return (
    <div className="wd page-enter">
      <div className="page-hd"><h1>Withdraw</h1><p>Send crypto to an external wallet</p></div>
      <div className="wd-grid">

        <div className="wd-form-card">

          {/* Asset selector */}
          <div className="wd-section">
            <span className="dp-label">Asset</span>
            <div className={`dp-select ${ddOpen ? 'dp-select--open' : ''}`}>
              <button className="dp-select-btn" onClick={() => setDdOpen(o => !o)}>
                <span className="dp-dot" style={{ background: asset.color }}/>
                <span className="dp-select-name">{asset.name}</span>
                <span className="dp-select-sym">{asset.balance.toLocaleString()} {asset.symbol} available</span>
                <span className="dp-chevron"><IcoChevDown /></span>
              </button>
              {ddOpen && (
                <div className="dp-menu">
                  {ASSETS.map(a => (
                    <button key={a.id} className={`dp-option ${a.id===assetId?'dp-option--active':''}`}
                      onClick={() => { setAssetId(a.id); setDdOpen(false); }}>
                      <span className="dp-dot" style={{ background: a.color }}/>
                      <div className="dp-option-info">
                        <span>{a.name}</span>
                        <span className="dp-option-sym">{a.balance} {a.symbol} available</span>
                      </div>
                      {a.id === assetId && <IcoCheck />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="wd-section">
            <span className="dp-label">Destination Address</span>
            <input
              className={`input-field ${errors.address ? 'input-field--error' : ''}`}
              placeholder="Enter recipient wallet address"
              value={address}
              onChange={e => { setAddress(e.target.value); setErrors(p => ({...p, address: undefined})); }}
            />
            {errors.address && <span className="input-error">{errors.address}</span>}
          </div>

          {/* Amount */}
          <div className="wd-section">
            <span className="dp-label">Amount</span>
            <div className={`wd-amount-wrap ${errors.amount ? 'wd-amount-wrap--error' : ''}`}>
              <input
                type="number" min="0" step="any"
                className="wd-amount-input"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(p => ({...p, amount: undefined})); }}
              />
              <span className="wd-amount-unit">{asset.symbol}</span>
              <button className="wd-amount-max" onClick={() => setAmount(String(asset.balance))}>MAX</button>
            </div>
            {errors.amount && <span className="input-error">{errors.amount}</span>}
            <div className="wd-amount-meta">
              <span>Balance: <strong>{asset.balance.toLocaleString()} {asset.symbol}</strong></span>
              <span>Fee: <strong>{asset.fee} {asset.symbol}</strong></span>
            </div>
          </div>

          {/* Summary */}
          {num > 0 && (
            <div className="wd-summary">
              <div className="wd-sum-row"><span>You send</span><span>{num} {asset.symbol}</span></div>
              <div className="wd-sum-row"><span>Network fee</span><span>− {asset.fee} {asset.symbol}</span></div>
              <div className="wd-sum-divider"/>
              <div className="wd-sum-row wd-sum-row--total">
                <span>You receive</span>
                <span className="wd-sum-total">{net.toFixed(6)} {asset.symbol}</span>
              </div>
            </div>
          )}

          <div className="wd-section">
            <button className="wd-btn-primary wd-btn-full" onClick={() => validate() && setStep('confirm')}>
              <IcoUp /> Continue to Review
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="wd-info-card">
          {[
            { icon: <IcoClock />,  title: 'Processing Time',   text: 'Withdrawals require admin approval and are typically processed within 24–48 hours.' },
            { icon: <IcoShield />, title: 'Security Review',   text: 'All withdrawals undergo a security check. You may be asked to verify your identity.' },
            { icon: <IcoAlert />,  title: 'Irreversible',      text: 'Crypto transactions cannot be reversed. Always double-check your destination address.' },
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