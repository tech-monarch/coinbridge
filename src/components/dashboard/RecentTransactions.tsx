import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecentTransactions.module.css';
import api, { type Transaction } from '@/services/api';
import { formatUSD } from '@/services/prices';

const COIN_COLORS: Record<string, string> = {
  BTC: '#f7931a', ETH: '#627eea', USDT: '#26a17b', SOL: '#9945ff',
  BNB: '#f3ba2f', XRP: '#346aa9', TRX: '#e50915', USDC: '#2775ca',
};

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Transaction[] }>('/user/transactions?per_page=5')
      .then((res) => { setTransactions(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Transactions</h3>
        <Link to="/dashboard/transactions" className={styles.viewAll}>View all →</Link>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Loading…</div>
      ) : transactions.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
          No transactions yet.<br />
          <Link to="/dashboard/deposit" style={{ color: '#1565C0', fontSize: '13px' }}>Make your first deposit →</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {transactions.map((tx) => {
            const isDeposit = tx.type === 'deposit';
            const statusColors = { confirmed: '#22c55e', pending: '#f59e0b', failed: '#ef4444' };
            const color = COIN_COLORS[tx.currency?.toUpperCase()] || '#1565C0';
            return (
              <div key={tx.id} className={styles.txRow}>
                <div className={styles.txIconWrap}>
                  <div className={styles.txTypeIcon} style={{ background: isDeposit ? '#22c85320' : '#ef444420', color: isDeposit ? '#22c853' : '#ef4444' }}>
                    {isDeposit ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 10 12 5 7 10"/><line x1="12" y1="5" x2="12" y2="15"/></svg>
                    )}
                  </div>
                </div>
                <div className={styles.txMain}>
                  <div className={styles.txTitle}>{isDeposit ? 'Deposit' : 'Withdrawal'}</div>
                  <div className={styles.txMeta}>{tx.network} · {new Date(tx.created_at).toLocaleDateString()}</div>
                </div>
                <div className={styles.txRight}>
                  <div className={styles.txAmount} style={{ color: isDeposit ? '#22c55e' : '#ef4444' }}>
                    {isDeposit ? '+' : '-'}{Number(tx.amount).toFixed(6)} {tx.currency}
                  </div>
                  <div className={styles.txStatus} style={{ color: statusColors[tx.status] || '#9ca3af' }}>
                    ● {tx.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
