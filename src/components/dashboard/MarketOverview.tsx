import { useState, useEffect } from 'react';
import styles from './MarketOverview.module.css';
import { fetchMarketData, type MarketCoin, formatUSD } from '@/services/prices';

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  const w = 70, h = 32;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const pts = points.map((p, i) => ({ x: i * step, y: h - ((p - min) / range) * (h - 4) - 2 }));
  const d = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const area = `${d} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;
  const color = positive ? '#22c55e' : '#ef4444';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={area} fill={color} opacity="0.15" />
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const COIN_ICONS: Record<string, string> = { BTC: '₿', ETH: 'Ξ', USDT: '₮', BNB: '⬥', SOL: '◎', XRP: '✕' };

export default function MarketOverview() {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData().then((data) => { setCoins(data); setLoading(false); });
    const interval = setInterval(() => {
      fetchMarketData().then(setCoins);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Market Overview</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '11px', color: '#6b7280' }}>Live</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Loading market data…</div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Asset</span>
            <span>Price (USD)</span>
            <span>24h</span>
            <span>Market Cap</span>
            <span>7D</span>
          </div>
          {coins.map((coin) => {
            const positive = coin.change24h >= 0;
            return (
              <div key={coin.symbol} className={styles.tableRow}>
                <div className={styles.coinCell}>
                  <div className={styles.coinIcon} style={{ color: coin.color, background: `${coin.color}18` }}>
                    {COIN_ICONS[coin.symbol] ?? coin.symbol.slice(0, 1)}
                  </div>
                  <div>
                    <div className={styles.coinName}>{coin.name}</div>
                    <div className={styles.coinSymbol}>{coin.symbol}</div>
                  </div>
                </div>
                <div className={styles.priceCell}>
                  <div className={styles.price}>{formatUSD(coin.price)}</div>
                </div>
                <div className={`${styles.changeCell} ${positive ? styles.positive : styles.negative}`}>
                  {positive ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                </div>
                <div className={styles.capCell}>{coin.marketCap}</div>
                <div className={styles.sparkCell}>
                  <Sparkline points={coin.sparkPoints} positive={positive} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
