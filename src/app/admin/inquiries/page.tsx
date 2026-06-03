'use client';
import { useState, useEffect } from 'react';
import { getStatusLabel, timeAgo, formatPrice } from '@/lib/utils';
import { MessageSquare, Search, Filter, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';

type Inquiry = {
  id: string; status: string; name: string; email: string; phone: string;
  message: string | null; createdAt: string;
  items: Array<{ id: string; quantity: number; message: string | null; product: { name: string; price: number | null } }>;
  user?: { name: string; email: string };
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/inquiries').then(r => r.json()).then(d => { setInquiries(d); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/inquiries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPipelineValue = filtered.reduce((sum, inq) => sum + inq.items.reduce((s, item) => s + (item.product.price || 0) * item.quantity, 0), 0);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Inquiry Management</h1>
          <p style={{ fontSize: 13, color: 'var(--secondary)' }}>{inquiries.length} total inquiries · Pipeline: {formatPrice(totalPipelineValue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search inquiries by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => setStatusFilter('')} 
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${!statusFilter ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
          >
            <Filter size={14} /> All ({inquiries.length})
          </button>
          {['PENDING', 'CONTACTED', 'QUOTED', 'CLOSED'].map(s => {
            const count = inquiries.filter(i => i.status === s).length;
            return (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${statusFilter === s ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
              >
                {getStatusLabel(s)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiry Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}><MessageSquare size={48} style={{ color: 'var(--secondary-dim)', marginBottom: 16 }} /><p style={{ color: 'var(--secondary)' }}>No inquiries found</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(inq => {
            const isExpanded = expandedId === inq.id;
            const inqValue = inq.items.reduce((s, item) => s + (item.product.price || 0) * item.quantity, 0);
            return (
              <div key={inq.id} className="card" style={{ overflow: 'visible' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : inq.id)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--secondary-dim)', background: 'var(--surface)', padding: '2px 6px', borderRadius: 4 }}>INQ-{inq.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`badge badge-${inq.status.toLowerCase()}`} style={{ fontSize: 11 }}>{getStatusLabel(inq.status)}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{inq.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{inq.items.length} product{inq.items.length > 1 ? 's' : ''} · {timeAgo(inq.createdAt)}</div>
                  </div>
                  {inqValue > 0 && <div style={{ textAlign: 'right', marginRight: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--secondary-dim)' }}>Value</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: 14 }}>{formatPrice(inqValue)}</div>
                  </div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select value={inq.status} onClick={e => e.stopPropagation()} onChange={e => updateStatus(inq.id, e.target.value)} style={{ fontSize: 12, padding: '6px 10px', width: 'auto', background: 'var(--surface-high)' }}>
                      {['PENDING', 'CONTACTED', 'QUOTED', 'CLOSED'].map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                    </select>
                    {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--secondary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--secondary)' }} />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: 20, background: 'var(--surface)' }}>
                    <div className="grid grid-2" style={{ gap: 24, marginBottom: 20 }}>
                      <div>
                        <div className="label-caps" style={{ fontSize: 10, color: 'var(--secondary-dim)', marginBottom: 8 }}>Contact Info</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <a href={`mailto:${inq.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--on-surface)' }}><Mail size={14} style={{ color: 'var(--secondary)' }} /> {inq.email}</a>
                          {inq.phone && <a href={`tel:${inq.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--on-surface)' }}><Phone size={14} style={{ color: 'var(--secondary)' }} /> {inq.phone}</a>}
                        </div>
                      </div>
                      {inq.message && (
                        <div>
                          <div className="label-caps" style={{ fontSize: 10, color: 'var(--secondary-dim)', marginBottom: 8 }}>Message</div>
                          <p style={{ fontSize: 13, color: 'var(--on-surface)', lineHeight: 1.6 }}>{inq.message}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="label-caps" style={{ fontSize: 10, color: 'var(--secondary-dim)', marginBottom: 8 }}>Requested Products</div>
                      {inq.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{item.product.name}</span>
                            <span style={{ fontSize: 12, color: 'var(--secondary)', marginLeft: 8 }}>× {item.quantity}</span>
                            {item.message && <div style={{ fontSize: 12, color: 'var(--secondary-dim)', marginTop: 2 }}>Note: {item.message}</div>}
                          </div>
                          {item.product.price && <span style={{ fontWeight: 600, color: 'var(--primary-light)', fontSize: 13 }}>{formatPrice(item.product.price * item.quantity)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
