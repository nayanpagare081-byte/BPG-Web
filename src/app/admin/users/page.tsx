'use client';
import { useState, useEffect } from 'react';
import { Users, Search, Shield, User, Mail, Calendar, Activity } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

type UserData = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: { inquiries: number; reviews: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      setMessage(`✅ User role updated to ${newRole}`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error || 'Failed to update user'}`);
    }
  };

  const filtered = users.filter(u => 
    (u.name?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={28} style={{ color: 'var(--primary)' }} />
            Customer Management
          </h1>
          <p style={{ fontSize: 13, color: 'var(--secondary)' }}>{users.length} registered users across the platform</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ paddingLeft: 36, width: 280, fontSize: 13 }} />
          </div>
        </div>
      </div>

      {message && (
        <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 16, fontSize: 14, color: 'var(--success)' }}>{message}</div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface-high)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>User</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>Contact</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>Joined</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>Activity</th>
                <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--secondary)', textAlign: 'right' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-dim)' }}>
                        <User size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{user.name || 'Unnamed User'}</div>
                        <div style={{ fontSize: 12, color: 'var(--secondary-dim)' }}>ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
                      <Mail size={14} /> {user.email}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--secondary)' }}>
                      <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                      <span style={{ fontSize: 11, color: 'var(--secondary-dim)' }}>({timeAgo(user.createdAt)})</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--on-surface)' }}>
                        <Activity size={14} style={{ color: 'var(--primary)' }} />
                        <strong>{user._count.inquiries}</strong> Quotes
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => toggleRole(user.id, user.role)}
                      className={`badge ${user.role === 'ADMIN' ? 'badge-in-stock' : 'badge-out-of-stock'}`}
                      style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      title="Click to toggle role"
                    >
                      {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                      {user.role}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 48, textAlign: 'center', color: 'var(--secondary)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
