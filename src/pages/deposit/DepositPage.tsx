import { useState, useEffect, useRef, memo } from 'react';
import styles from './DepositPage.module.css';
import api, { type Network } from '@/services/api';
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
      locale: 'en', largeChartUrl: '', isTransparent: false, showSymbolLogo: false,
      showFloatingTooltip: false,
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

type Step = 'select' | 'amount' | 'address' | 'confirm' | 'processing' | 'done';

export default function DepositPage() {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [networksLoading, setNetworksLoading] = useState(true);
  const [networksError, setNetworksError] = useState('');
  const [prices, setPrices] = useState<Record<string, number>>({});

  const [step, setStep] = useState<Step>('select');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    api.get<Network[]>('/networks')
      .then(async (data) => {
        const active = data.filter((n) => n.is_active);
        setNetworks(active);
        const syms = active.map((n) => n.symbol);
        const p = await fetchAllPrices(syms);
        setPrices(p);
        setNetworksLoading(false);
      })
      .catch((e) => { setNetworksError(e.message); setNetworksLoading(false); });
  }, []);

  const handleCopy = () => {
    if (!selectedNetwork?.deposit_address) return;
    navigator.clipboard.writeText(selectedNetwork.deposit_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmPayment = async () => {
    if (!selectedNetwork) return;
    setSubmitError('');
    setSubmitLoading(true);
    setStep('processing');
    try {
      await api.post('/user/deposits', {
        network_id: selectedNetwork.id,
        usd_amount: parseFloat(usdAmount),
        transaction_hash: txHash || undefined,
      });
      setStep('done');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Deposit submission failed.');
      setStep('confirm');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select'); setSelectedNetwork(null); setUsdAmount('');
    setTxHash(''); setCopied(false); setConfirmed(false); setSubmitError('');
  };

  const coinIcon = selectedNetwork ? (COIN_ICONS[selectedNetwork.symbol] ?? selectedNetwork.symbol.slice(0, 1)) : '';
  const price = selectedNetwork ? (prices[selectedNetwork.symbol] || selectedNetwork.usd_rate || 1) : 1;
  const cryptoAmount = usdAmount ? usdToCrypto(parseFloat(usdAmount), price).toFixed(8) : '0';
  const minDepositUsd = selectedNetwork ? (selectedNetwork.min_deposit_usd || selectedNetwork.min_deposit * price) : 0;

  const STEPS: Step[] = ['select', 'amount', 'address', 'confirm'];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className={styles.pageLayout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Deposit Crypto</h1>
            <p>Fund your account by sending cryptocurrency</p>
          </div>
        </div>

        {step !== 'processing' && step !== 'done' && (
          <div className={styles.progressRow}>
            {['Select Coin', 'Enter Amount', 'Get Address', 'Confirm'].map((label, i) => (
              <div key={i} className={styles.progressStep}>
                <div className={`${styles.progressDot} ${i < stepIndex ? styles.dotDone : i === stepIndex ? styles.dotActive : ''}`}>
                  {i < stepIndex ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (<span>{i + 1}</span>)}
                </div>
                <span className={`${styles.progressLabel} ${i === stepIndex ? styles.progressLabelActive : ''}`}>{label}</span>
                {i < 3 && <div className={`${styles.progressLine} ${i < stepIndex ? styles.lineDone : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Select Coin */}
        {step === 'select' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Choose cryptocurrency to deposit</h2>
            <p className={styles.cardSubtitle}>Select the network you want to deposit on</p>
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
                      {p > 0 && <div className={styles.coinCardNetwork} style={{ color: net.color }}>{formatUSD(p)}</div>}
                      {selectedNetwork?.id === net.id && (
                        <div className={styles.coinCheck} style={{ background: net.color }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className={styles.cardFooter}>
              <button className={styles.btnPrimary} disabled={!selectedNetwork} onClick={() => setStep('amount')}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 'amount' && selectedNetwork && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep('select')}>← Back</button>
            <div className={styles.selectedCoinBadge}>
              <span style={{ color: selectedNetwork.color }}>{coinIcon}</span>
              {selectedNetwork.symbol} · {selectedNetwork.name}
              {price > 0 && <span style={{ color: '#9ca3af', fontSize: '12px' }}> · {formatUSD(price)}</span>}
            </div>
            <h2 className={styles.cardTitle}>How much do you want to deposit?</h2>
            <p className={styles.cardSubtitle}>Enter amount in USD — minimum {formatUSD(minDepositUsd)}</p>
            <div className={styles.amountInputWrap}>
              <div className={styles.amountInputBox}>
                <span style={{ color: '#9ca3af', fontSize: '20px', paddingLeft: '14px' }}>$</span>
                <input
                  type="number"
                  className={styles.amountInput}
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <span className={styles.amountSymbol}>USD</span>
              </div>
            </div>
            {usdAmount && parseFloat(usdAmount) > 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '8px' }}>
                ≈ <strong style={{ color: '#fff' }}>{cryptoAmount} {selectedNetwork.symbol}</strong> at {formatUSD(price)}/{selectedNetwork.symbol}
              </div>
            )}
            <div className={styles.infoBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Requires {selectedNetwork.confirmations} network confirmations. Processing takes 10–30 minutes.
            </div>
            <div className={styles.cardFooter}>
              <button
                className={styles.btnPrimary}
                disabled={!usdAmount || parseFloat(usdAmount) < minDepositUsd}
                onClick={() => setStep('address')}
              >
                Get Deposit Address →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 'address' && selectedNetwork && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep('amount')}>← Back</button>
            <div className={styles.selectedCoinBadge}>
              <span style={{ color: selectedNetwork.color }}>{coinIcon}</span>
              {selectedNetwork.symbol} · {selectedNetwork.name}
            </div>
            <h2 className={styles.cardTitle}>Send to this address</h2>
            <p className={styles.cardSubtitle}>
              Send exactly <strong style={{ color: '#fff' }}>{formatUSD(parseFloat(usdAmount))}</strong> worth of {selectedNetwork.symbol} ({cryptoAmount} {selectedNetwork.symbol}) to:
            </p>
            <div className={styles.qrWrap}>
              <div className={styles.qrCode}>
                <svg viewBox="0 0 80 80" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="24" height="24" rx="3" fill="none" stroke={selectedNetwork.color} strokeWidth="3"/>
                  <rect x="9" y="9" width="14" height="14" rx="1" fill={selectedNetwork.color}/>
                  <rect x="52" y="4" width="24" height="24" rx="3" fill="none" stroke={selectedNetwork.color} strokeWidth="3"/>
                  <rect x="57" y="9" width="14" height="14" rx="1" fill={selectedNetwork.color}/>
                  <rect x="4" y="52" width="24" height="24" rx="3" fill="none" stroke={selectedNetwork.color} strokeWidth="3"/>
                  <rect x="9" y="57" width="14" height="14" rx="1" fill={selectedNetwork.color}/>
                  {[[34,4],[40,4],[46,4],[34,10],[46,10],[40,16],[34,22],[46,22],[4,34],[10,34],[22,34],[34,34],[46,34],[58,34],[70,34],[4,40],[16,40],[28,40],[40,40],[52,40],[64,40],[76,40],[4,46],[10,46],[28,46],[34,46],[52,46],[58,46],[70,46],[34,52],[40,52],[52,52],[64,52],[70,52],[76,52],[34,58],[46,58],[52,58],[64,58],[34,64],[40,64],[58,64],[70,64],[76,64],[34,70],[52,70],[58,70],[70,70],[34,76],[40,76],[46,76],[64,76],[76,76]].map(([x, y], i) => (
                    <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill={selectedNetwork.color} opacity="0.85"/>
                  ))}
                </svg>
                <div className={styles.qrCoinLabel} style={{ color: selectedNetwork.color }}>{coinIcon}</div>
              </div>
            </div>
            {selectedNetwork.deposit_address ? (
              <div className={styles.addressBox}>
                <div className={styles.addressLabel}>Deposit Address ({selectedNetwork.name})</div>
                <div className={styles.addressRow}>
                  <code className={styles.addressCode}>{selectedNetwork.deposit_address}</code>
                  <button className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`} onClick={handleCopy}>
                    {copied ? (<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>) : (<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>)}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: '#f87171', textAlign: 'center', padding: '16px' }}>
                No deposit address configured for this network. Please contact support.
              </div>
            )}
            <div className={styles.warningBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Only send <strong>{selectedNetwork.symbol}</strong> on the <strong>{selectedNetwork.name}</strong>. Wrong coin = permanent loss.
            </div>

            {/* Optional TX Hash */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Transaction Hash (optional — speeds up confirmation)</label>
              <input
                type="text"
                placeholder="0x..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
              />
            </div>

            <div className={styles.cardFooter}>
              <button className={styles.btnPrimary} onClick={() => setStep('confirm')}>I've Sent the Payment →</button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && selectedNetwork && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep('address')}>← Back</button>
            <h2 className={styles.cardTitle}>Confirm your deposit</h2>
            <p className={styles.cardSubtitle}>Review details before submitting</p>
            {submitError && (
              <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>{submitError}</div>
            )}
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Coin</span><span className={styles.summaryValue}><span style={{ color: selectedNetwork.color }}>{coinIcon}</span> {selectedNetwork.symbol}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Network</span><span className={styles.summaryValue}>{selectedNetwork.name}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>USD Amount</span><span className={`${styles.summaryValue} ${styles.summaryAmount}`}>{formatUSD(parseFloat(usdAmount))}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Crypto Amount</span><span className={styles.summaryValue}>{cryptoAmount} {selectedNetwork.symbol}</span></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>To Address</span><code className={styles.summaryAddress}>{(selectedNetwork.deposit_address ?? '').slice(0, 16)}…{(selectedNetwork.deposit_address ?? '').slice(-8)}</code></div>
              <div className={styles.summaryRow}><span className={styles.summaryLabel}>Confirmations</span><span className={styles.summaryValue}>{selectedNetwork.confirmations} required</span></div>
              {txHash && <div className={styles.summaryRow}><span className={styles.summaryLabel}>TX Hash</span><code className={styles.summaryAddress}>{txHash.slice(0, 16)}…</code></div>}
            </div>
            <div className={styles.checkRow}>
              <button className={`${styles.checkbox} ${confirmed ? styles.checkboxChecked : ''}`} onClick={() => setConfirmed(!confirmed)}>
                {confirmed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
              <span className={styles.checkLabel}>
                I confirm I have sent <strong>{formatUSD(parseFloat(usdAmount))}</strong> worth of <strong>{selectedNetwork.symbol}</strong> to the address above.
              </span>
            </div>
            <div className={styles.cardFooter}>
              <button className={styles.btnPrimary} disabled={!confirmed || submitLoading} onClick={handleConfirmPayment}>
                {submitLoading ? 'Submitting…' : 'Confirm Deposit'}
              </button>
            </div>
          </div>
        )}

        {/* Processing */}
        {step === 'processing' && selectedNetwork && (
          <div className={styles.fullCard}>
            <div className={styles.processingSpinner} style={{ borderTopColor: selectedNetwork.color }} />
            <h2 className={styles.processingTitle}>Processing Your Deposit</h2>
            <p className={styles.processingText}>Submitting your <strong style={{ color: '#fff' }}>{formatUSD(parseFloat(usdAmount))}</strong> deposit request.</p>
            <div className={styles.processingSteps}>
              {['Transaction received', 'Awaiting confirmations', 'Pending admin review'].map((s, i) => (
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
            <h2 className={styles.doneTitle}>Deposit Submitted!</h2>
            <p className={styles.doneText}>Your deposit of <strong style={{ color: selectedNetwork.color }}>{formatUSD(parseFloat(usdAmount))}</strong> ({cryptoAmount} {selectedNetwork.symbol}) is pending admin review.</p>
            <div className={styles.doneDetails}>
              <div className={styles.doneRow}><span>Status</span><span className={styles.statusPending}>● Pending</span></div>
              <div className={styles.doneRow}><span>Amount</span><span>{formatUSD(parseFloat(usdAmount))}</span></div>
              <div className={styles.doneRow}><span>Crypto</span><span>{cryptoAmount} {selectedNetwork.symbol}</span></div>
              <div className={styles.doneRow}><span>Network</span><span>{selectedNetwork.name}</span></div>
              <div className={styles.doneRow}><span>Est. time</span><span>10–30 minutes</span></div>
            </div>
            <div className={styles.doneActions}>
              <button className={styles.btnPrimary} onClick={handleReset}>Make Another Deposit</button>
              <a href="/dashboard/transactions" className={styles.btnSecondary}>View Transaction History</a>
            </div>
          </div>
        )}
      </div>
      <div className={styles.widgetSide}><MemoTradingViewWidget /></div>
    </div>
  );
}
