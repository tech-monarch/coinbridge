import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './StatsRow.module.css';
import { useAuth } from '@/context/AuthContext';
import api, { type PaginatedResponse, type Transaction } from '@/services/api';
import { formatUSD } from '@/services/prices';

function WalletIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>;
}
function TradeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
}
function DepositIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}
function KycIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}

export default function StatsRow() {
  const { user } = useAuth();
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: any[] }>('/user/deposits').catch(() => ({ data: [] })),
      api.get<{ data: any[]; total: number }>('/user/transactions').catch(() => ({ data: [], total: 0 })),
    ]).then(([deps, txs]) => {
      const confirmed = (deps.data || []).filter((d: any) => d.status === 'confirmed');
      const totalUsd = confirmed.reduce((sum: number, d: any) => sum + Number(d.usd_amount || d.amount || 0), 0);
      setTotalDeposited(totalUsd);
      setTxCount((txs as any).total || (txs.data || []).length);
      setLoading(false);
    });
  }, []);

  const balance = user ? Number(user.balance) : 0;
  const kycStatus = user?.kyc_status || 'none';

  const kycBadge = {
    none: { label: 'Not Verified', color: '#9ca3af' },
    pending: { label: 'Pending Review', color: '#f59e0b' },
    approved: { label: 'Verified ✓', color: '#22c55e' },
    rejected: { label: 'Rejected', color: '#ef4444' },
  }[kycStatus];

  const STATS = [
    {
      icon: <WalletIcon />,
      label: 'Account Balance',
      value: loading ? '…' : formatUSD(balance),
      sub: 'Available to withdraw',
      positive: balance >= 0,
      iconBg: '#1565C020',
      iconColor: '#1565C0',
    },
    {
      icon: <DepositIcon />,
      label: 'Total Deposited',
      value: loading ? '…' : formatUSD(totalDeposited),
      sub: 'Lifetime confirmed',
      positive: true,
      iconBg: '#22c85320',
      iconColor: '#22c853',
    },
    {
      icon: <TradeIcon />,
      label: 'Total Transactions',
      value: loading ? '…' : String(txCount),
      sub: 'Deposits & withdrawals',
      positive: true,
      iconBg: '#f59e0b20',
      iconColor: '#f59e0b',
    },
    {
      icon: <KycIcon />,
      label: 'KYC Status',
      value: kycBadge.label,
      sub: kycStatus === 'none' ? 'Required for withdrawals' : kycStatus === 'approved' ? 'Full access enabled' : '',
      positive: kycStatus === 'approved',
      iconBg: `${kycBadge.color}20`,
      iconColor: kycBadge.color,
      link: kycStatus !== 'approved' ? '/dashboard/settings' : undefined,
    },
  ];

  return (
    <div className={styles.row}>
      {STATS.map((stat, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.iconWrap} style={{ background: stat.iconBg, color: stat.iconColor }}>
            {stat.icon}
          </div>
          <div className={styles.info}>
            <span className={styles.label}>{stat.label}</span>
            <span className={styles.value} style={{ color: stat.iconColor }}>{stat.value}</span>
            <div className={styles.sub}>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>{stat.sub}</span>
              {stat.link && <Link to={stat.link} style={{ fontSize: '11px', color: '#1565C0', marginLeft: '6px' }}>Verify →</Link>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
