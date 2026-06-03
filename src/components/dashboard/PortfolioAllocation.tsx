import { useState, useEffect } from 'react';
import styles from './PortfolioAllocation.module.css';
import { useAuth } from '@/context/AuthContext';
import { formatUSD } from '@/services/prices';
import api from '@/services/api';

const COLORS = ['#1565C0', '#22c853', '#f59e0b', '#ef4444', '#9945ff', '#26a17b'];

interface NetworkBreakdown {
  name: string;
  symbol: string;
  amount: number;
  color: string;
}

export default function PortfolioAllocation() {
  const { user } = useAuth();
  const [networks, setNetworks] = useState<NetworkBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any[]>('/networks').then((data) => {
      const mapped = (data || []).slice(0, 6).map((n: any, i: number) => ({
        name: n.name,
        symbol: n.symbol,
        amount: 0,
        color: n.color || COLORS[i % COLORS.length],
      }));
      setNetworks(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const balance = user ? Number(user.balance) : 0;

  const kycStatus = user?.kyc_status;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Account Overview</h3>

      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Total Balance</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
          {formatUSD(balance)}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>Available USD balance</div>
      </div>

      <div style={{ padding: '0 4px' }}>
        {[
          { label: 'KYC Status', value: kycStatus || 'none', color: kycStatus === 'approved' ? '#22c55e' : kycStatus === 'pending' ? '#f59e0b' : '#9ca3af' },
          { label: 'Account Status', value: user?.account_status || 'active', color: user?.account_status === 'active' ? '#22c55e' : '#ef4444' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f2f5' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>{item.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: item.color, textTransform: 'capitalize' }}>
              ● {item.value}
            </span>
          </div>
        ))}
      </div>

      {loading ? null : networks.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>Supported Assets</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {networks.map((n) => (
              <div key={n.symbol} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${n.color}15`, border: `1px solid ${n.color}30`, borderRadius: '6px', padding: '4px 10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: n.color }} />
                <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>{n.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
