import { useState, useRef, memo, useEffect } from 'react';
import styles from './WithdrawPage.module.css';
import api, { type Network } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { fetchAllPrices, formatUSD, usdToCrypto } from '@/services/prices';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchange: 'US', colorTheme: 'dark', dateRange: '1M', showChart: true,
      locale: 'en', largeChartUrl: '', isTransparent: false, showSymbolLogo: false, showFloatingTooltip: false,
      plotLineColorGrowing: 'rgba(41, 98, 255, 1)', plotLineColorFalling: 'rgba(41, 98, 255, 1)',
      gridLineColor: 'rgba(240, 243, 250, 0)', scaleFontColor: '#DBDBDB',
      belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)', belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)', belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
      symbolActiveColor: 'rgba(41, 98, 255, 0.12)', width: '100%', height: '100%',
    });
    container.current?.appendChild(script);
  }, []);
  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: '100%', height: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
const MemoTradingViewWidget = memo(TradingViewWidget);

const COIN_ICONS: Record<string, string> = {
  BTC: '₿', ETH: 'Ξ', USDT: '₮', BNB: '⬥', SOL: '◎', XRP: '✕', USDC: '$', TRX: '⚡',
};

type Step = 'select' | 'details' | 'confirm' | 'processing' | 'done';

export default function WithdrawPage() {
  const { user, refreshUser } = useAuth();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [networksLoading, setNetworksLoading] = useState(true);
  const [networksError, setNetworksError] = useState('');
  const [prices, setPrices] = useState<Record<string, number>>({});

  const [step, setStep] = useState<Step>('select');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [address, setAddress] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitResult, setSubmitResult] = useState<any>(null);

  useEffect(() => {
    api.get<Network[]>('/networks')
      .then(async (data) => {
        const active = data.filter((n) => n.is_active);
        setNetworks(active);
        const p = await fetchAllPrices(active.map((n) => n.symbol));
        setPrices(p);
        setNetworksLoading(false);
      })
      .catch((e) => { setNetworksError(e.message); setNetworksLoading(false); });
  }, []);

  const handleConfirm = async () => {
    if (!selectedNetwork) return;
    setSubmitError('');
    setSubmitLoading(true);
    setStep('processing');
    try {
      const result = await api.post<any>('/user/withdrawals/submit', {
        network_id: selectedNetwork.id,
        usd_amount: parseFloat(usdAmount),
        recipient_address: address,
      });
      setSubmitResult(result);
      await refreshUser();
      setStep('done');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Withdrawal failed.');
      setStep('confirm');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select'); setSelectedNetwork(null); setUsdAmount('');
    setAddress(''); setConfirmed(false); setSubmitError(''); setSubmitResult(null);
  };

  const price = selectedNetwork ? (prices[selectedNetwork.symbol] || selectedNetwork.usd_rate || 1) : 1;
  const cryptoAmount = usdAmount && parseFloat(usdAmount) > 0 ? usdToCrypto(parseFloat(usdAmount), price).toFixed(8) : '0';
  const feeUsd = selectedNetwork ? (selectedNetwork.fee * price) : 0;
  const netUsd = usdAmount && parseFloat(usdAmount) > 0 ? Math.max(0, parseFloat(usdAmount) - feeUsd) : 0;

  const balance = user ? Number(user.balance) : 0;
  const usdNum = parseFloat(usdAmount) || 0;

  const detailsValid =
    usdNum > 0 &&
    usdNum <= balance &&
    address.trim().length > 10;

  const coinIcon = selectedNetwork ? (COIN_ICONS[selectedNetwork.symbol] ?? selectedNetwork.symbol.slice(0, 1)) : '';
  const STEPS: Step[] = ['select', 'details', 'confirm'];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className={styles.pageLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Withdraw Funds</h1>
          <p>Send cryptocurrency to any external wallet address</p>
        </div>

        {user && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(21,101,192,0.12)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>Available Balance</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{formatUSD(balance)}</span>
          </div>
        )}

        {user?.kyc_status !== 'approved' && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', fontSize: '13px', color: '#f87171' }}>
            ⚠️ KYC verification required to withdraw.{' '}
            <a href="/dashboard/settings" style={{ color: '#1565C0', textDecoration: 'underline' }}>Verify now →</a>
          </div>
        )}

        {step !== 'processing' && step !== 'done' && (
          <div className={styles.progressRow}>
            {['Select Coin', 'Enter Details', 'Confirm'].map((label, i) => (
              <div key={i} className={styles.progressStep}>
                <div className={`${styles.progressDot} ${i < stepIndex ? styles.dotDone : i === stepIndex ? styles.dotActive : ''}`}>
                  {i < stepIndex ? (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>) : (<span>{i + 1}</span>)}
                </div>
                <span className={`${styles.progressLabel} ${i === stepIndex ? styles.progressLabelActive : ''}`}>{label}</span>
                {i < 2 && <div className={`${styles.progressLine} ${i < stepIndex ? styles.lineDone : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Select Coin */}
        {step === 'select' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Choose coin to withdraw</h2>
            <p className={styles.cardSubtitle}>Select from available networks</p>
            {networksLoading && <div style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>Loading networks…</div>}
            {networksError && <div style={{ color: '#f87171', textAlign: 'center', padding: '20px' }}>{networksError}</div>}
            {!networksLoading && !networksError && (
              <div className={styles.coinGrid}>
                {networks.map((net) => {
                  const p = prices[net.symbol] || net.usd_rate || 0;
                  return (
                    <button
                      key={net.id}
                      className={`${styles.coinCard} ${selectedNetwork?.id === net.id ? styles.coinCardActive : ''}`}
                      style={selectedNetwork?.id === net.id ? { borderColor: net.color } : {}}
                      onClick={() => setSelectedNetwork(net)}
                    >
                      <div className={styles.coinIconWrap} style={{ color: net.color, background: `${net.color}18` }}>
                        <span className={styles.coinIcon}>{COIN_ICONS[net.symbol] ?? net.symbol.slice(0, 1)}</span>
                      </div>
                      <div className={styles.coinCardName}>{net.symbol}</div>
                      <div className={styles.coinCardSymbol}>{net.name}</div>
                      <div className={styles.coinCardBalance}>
                        Fee: {net.fee} {net.symbol}
                        {p > 0 && <span style={{ color: '#9ca3af' }}> (≈{formatUSD(net.fee * p)})</span>}
                      </div>
                      {selectedNetwork?.id === net.id && (
                        <div className={styles.coinCheck} style={{ background: net.color }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className={styles.cardFooter}>
              <button className={styles.btnPrimary} disabled={!selectedNetwork} onClick={() => setStep('details')}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && selectedNetwork && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep('select')}>← Back</button>
            <div className={styles.selectedCoinBadge}>
              <span style={{ color: selectedNetwork.color }}>{coinIcon}</span>
              {selectedNetwork.symbol} · {selectedNetwork.name}
              {price > 0 && <span style={{ color: '#9ca3af', fontSize: '12px' }}> · {formatUSD(price)}</span>}
            </div>
            <div className={styles.balanceBar}>
              <span className={styles.balanceLabel}>Available balance</span>
              <span className={styles.balanceValue} style={{ color: selectedNetwork.color }}>{formatUSD(balance)}</span>
            </div>
            <h2 className={styles.cardTitle}>Withdrawal details</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Amount (USD)</label>
              <div className={styles.amountInputBox}>
                <span style={{ color: '#9ca3af', fontSize: '18px', paddingLeft: '14px' }}>$</span>
                <input
                  type="number"
                  className={styles.amountInput}
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  max={balance}
                />
                <span className={styles.amountSymbol}>USD</span>
              </div>
              {usdNum > 0 && (
                <div className={styles.feeRow}>
                  <span>≈ {cryptoAmount} {selectedNetwork.symbol}</span>
                  <span>Fee: <strong>{formatUSD(feeUsd)}</strong></span>
                  <span>Net: <strong style={{ color: '#4ade80' }}>{formatUSD(netUsd)}</strong></span>
                </div>
              )}
              {usdNum > balance && (
                <div style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>Insufficient balance</div>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Recipient wallet address
                <span className={styles.networkTag}>{selectedNetwork.name}</span>
              </label>
              <textarea
                className={styles.addressInput}
                placeholder={`Enter ${selectedNetwork.symbol} wallet address…`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                spellCheck={false}
              />
            </div>
            <div className={styles.warningBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Only send to a <strong>{selectedNetwork.symbol}</strong> address. Withdrawals are irreversible.</span>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.btnPrimary} disabled={!detailsValid} onClick={() => setStep('confirm')}>Review Withdrawal →</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && selectedNetwork && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep('details')}>← Back</button>
            <h2 className={styles.cardTitle}>Review your withdrawal</h2>
            <p className={styles.cardSubtitle}>Double-check before submitting</p>
            {submitError && (
              <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>{submitError}</div>
            )}
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Coin</span><span className={styles.summaryValue}><span style={{ color: selectedNetwork.color }}>{coinIcon}</span> {selectedNetwork.symbol}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Network</span><span className={styles.summaryValue}>{selectedNetwork.name}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Amount (USD)</span><span className={`${styles.summaryValue} ${styles.summaryAmount}`}>{formatUSD(usdNum)}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Crypto Amount</span><span className={styles.summaryValue}>{cryptoAmount} {selectedNetwork.symbol}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Network fee</span><span className={styles.summaryValue}>{formatUSD(feeUsd)}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>You receive</span><span className={`${styles.summaryValue} ${styles.summaryNet}`}>{formatUSD(netUsd)}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>To address</span><code className={styles.summaryAddress}>{address.slice(0, 14)}…{address.slice(-8)}</code></div>
            </div>
            <div className={styles.checkRow}>
              <button className={`${styles.checkbox} ${confirmed ? styles.checkboxChecked : ''}`} onClick={() => setConfirmed(!confirmed)}>
                {confirmed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
              <span className={styles.checkLabel}>
                I confirm I want to withdraw <strong>{formatUSD(usdNum)}</strong> to <strong>{address.slice(0, 10)}…</strong> — this is irreversible.
              </span>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.btnPrimary} disabled={!confirmed || submitLoading} onClick={handleConfirm}>
                {submitLoading ? 'Submitting…' : 'Submit Withdrawal'}
              </button>
            </div>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && selectedNetwork && (
          <div className={styles.fullCard}>
            <div className={styles.processingSpinner} style={{ borderTopColor: selectedNetwork.color }} />
            <h2 className={styles.processingTitle}>Processing Withdrawal</h2>
            <p className={styles.processingText}>Submitting your <strong style={{ color: '#fff' }}>{formatUSD(usdNum)}</strong> withdrawal request.</p>
            <div className={styles.processingSteps}>
              {['Verifying request', 'Deducting balance', 'Queued for approval'].map((s, i) => (
                <div key={i} className={styles.procStep}>
                  <div className={styles.procDot} style={{ animationDelay: `${i * 0.4}s` }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {step === 'done' && selectedNetwork && (
          <div className={styles.fullCard}>
            <div className={styles.doneRing} style={{ borderColor: `${selectedNetwork.color}50`, background: `${selectedNetwork.color}12` }}>
              <div className={styles.doneIcon} style={{ color: selectedNetwork.color }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <h2 className={styles.doneTitle}>Withdrawal Submitted!</h2>
            <p className={styles.doneText}>
              Your withdrawal of <strong style={{ color: selectedNetwork.color }}>{formatUSD(usdNum)}</strong> ({cryptoAmount} {selectedNetwork.symbol}) is pending admin approval.
            </p>
            <div className={styles.doneDetails}>
              <div className={styles.doneRow}><span>Status</span><span className={styles.statusPending}>● Pending</span></div>
              <div className={styles.doneRow}><span>Amount</span><span>{formatUSD(usdNum)}</span></div>
              <div className={styles.doneRow}><span>Crypto</span><span>{cryptoAmount} {selectedNetwork.symbol}</span></div>
              <div className={styles.doneRow}><span>You receive</span><span style={{ color: '#4ade80' }}>{formatUSD(netUsd)}</span></div>
              <div className={styles.doneRow}><span>To address</span><span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{address.slice(0, 14)}…{address.slice(-8)}</span></div>
            </div>
            <div className={styles.doneActions}>
              <button className={styles.btnPrimary} onClick={handleReset}>Make Another Withdrawal</button>
              <a href="/dashboard/transactions" className={styles.btnSecondary}>View Transaction History</a>
            </div>
          </div>
        )}
      </div>
      <div className={styles.widgetSide}><MemoTradingViewWidget /></div>
    </div>
  );
}
