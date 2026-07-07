import { useState, useEffect, useCallback } from 'react';
import api, { type Transaction, type PaginatedResponse } from '@/services/api';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('search', search);
    params.set('page', String(page));
    api.get<PaginatedResponse<Transaction>>(`/admin/transactions?${params}`)
      .then(res => { setTransactions(res.data || []); setLastPage(res.last_page || 1); setTotal(res.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [typeFilter, statusFilter, search, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusColors: Record<string, string> = { confirmed: '#16a34a', pending: '#d97706', failed: '#dc2626' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>Transactions</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{total} total records</p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #f0f2f5', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: '10px', padding: '16px', borderBottom: '1px solid #f0f2f5', flexWrap: 'wrap' }}>
          <input placeholder="Search…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: 1, minWidth: '160px', padding: '8px 12px', background: '#f5f6fa', border: '1px solid #e8ecf0', borderRadius: '8px', color: '#111827', fontSize: '13px', outline: 'none' }} />
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'deposit', 'withdrawal'].map(t => (
              <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px',
                  background: typeFilter === t ? '#1565C0' : '#f5f6fa',
                  color: typeFilter === t ? '#fff' : '#6b7280' }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'confirmed', 'pending', 'failed'].map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px',
                  background: statusFilter === s ? '#1565C0' : '#f5f6fa',
                  color: statusFilter === s ? '#fff' : '#6b7280' }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading…</div> : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px 120px 100px 80px 120px', gap: '10px', padding: '10px 16px', borderBottom: '1px solid #f0f2f5', fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: '800px' }}>
              <span>Type</span><span>User</span><span>Amount</span><span>Currency</span><span>Network</span><span>Status</span><span>Date</span>
            </div>
            {transactions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>No transactions found.</div>
            ) : transactions.map(tx => (
              <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 140px 120px 100px 80px 120px', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f0f2f5', alignItems: 'center', minWidth: '800px' }}>
                <div>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                    color: tx.type === 'deposit' ? '#16a34a' : '#dc2626',
                    background: tx.type === 'deposit' ? 'rgba(34,200,83,0.12)' : 'rgba(239,68,68,0.12)',
                    textTransform: 'capitalize' }}>
                    {tx.type}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#111827' }}>{tx.user?.name || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{tx.user?.email}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: tx.type === 'deposit' ? '#16a34a' : '#dc2626' }}>
                  {tx.type === 'deposit' ? '+' : '-'}{Number(tx.amount).toFixed(6)}
                </div>
                <div style={{ fontSize: '12px', color: '#374151' }}>{tx.currency}</div>
                <div style={{ fontSize: '12px', color: '#374151' }}>{tx.network}</div>
                <div>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                    color: statusColors[tx.status] || '#6b7280',
                    background: `${statusColors[tx.status] || '#6b7280'}18`,
                    textTransform: 'capitalize' }}>
                    ● {tx.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(tx.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '16px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '6px 12px', borderRadius: '6px', background: '#f1f5f9', color: '#6b7280', border: 'none', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
            <span style={{ padding: '6px 12px', color: '#6b7280', fontSize: '13px' }}>Page {page} of {lastPage}</span>
            <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
              style={{ padding: '6px 12px', borderRadius: '6px', background: '#f1f5f9', color: '#6b7280', border: 'none', cursor: 'pointer', opacity: page === lastPage ? 0.4 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
