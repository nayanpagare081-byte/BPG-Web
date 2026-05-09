'use client';
import { useState, useEffect } from 'react';
import { timeAgo } from '@/lib/utils';
import { Users, Search, Mail, Phone, MessageSquare, Star, Calendar, Edit3, Save, X } from 'lucide-react';

type Customer = {
  id: string; name: string; email: string; phone: string | null; image: string | null;
  createdAt: string; role: string;
  _count?: { inquiries: number; reviews: number };
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{name: string; phone: string}>({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(d => { setCustomers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setEditForm({ name: c.name, phone: c.phone || '' });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setCustomers(customers.map(c => c.id === id ? { ...c, name: updated.name, phone: updated.phone } : c));
    }
    setEditingId(null);
    setSaving(false);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Customer Database</h1>
          <p style={{ fontSize: 13, color: 'var(--secondary)' }}>{customers.length} registered customers</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." style={{ paddingLeft: 36, width: 250, fontSize: 13 }} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <Users size={24} style={{ color: 'var(--primary)', marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 800 }}>{customers.length}</div>
          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>Total Customers</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <MessageSquare size={24} style={{ color: 'var(--info)', marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 800 }}>{customers.reduce((s, c) => s + (c._count?.inquiries || 0), 0)}</div>
          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>Total Inquiries</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <Star size={24} style={{ color: 'var(--warning)', marginBottom: 8 }} />
          <div style={{ fontSize: 28, fontWeight: 800 }}>{customers.reduce((s, c) => s + (c._count?.reviews || 0), 0)}</div>
          <div style={{ fontSize: 12, color: 'var(--secondary)' }}>Total Reviews</div>
        </div>
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}><Users size={48} style={{ color: 'var(--secondary-dim)', marginBottom: 16 }} /><p style={{ color: 'var(--secondary)' }}>No customers found</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(c => (
            <div key={c.id} className="card" style={{ padding: 16 }}>
              {editingId === c.id ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1, display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Phone Number</label>
                      <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                    <button onClick={() => saveEdit(c.id)} disabled={saving} className="btn btn-primary btn-sm"><Save size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm"><X size={14} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#000', flexShrink: 0 }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                      <button onClick={() => startEdit(c)} className="btn-icon btn-ghost" style={{ padding: 4, width: 'auto', height: 'auto', color: 'var(--info)' }}><Edit3 size={12} /></button>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--secondary)' }}><Mail size={12} /> {c.email}</span>
                      {c.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--secondary)' }}><Phone size={12} /> {c.phone}</span>}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--secondary)' }}><Calendar size={12} /> {timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--info)' }}>{c._count?.inquiries || 0}</div>
                      <div style={{ fontSize: 10, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inquiries</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning)' }}>{c._count?.reviews || 0}</div>
                      <div style={{ fontSize: 10, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reviews</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
