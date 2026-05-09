'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, MessageSquare, DollarSign, Package } from 'lucide-react';
import { getStatusLabel, timeAgo } from '@/lib/utils';

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock size={16} />, CONTACTED: <MessageSquare size={16} />,
  QUOTED: <DollarSign size={16} />, CLOSED: <CheckCircle size={16} />,
};

export default function InquiriesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Array<{ id: string; status: string; name: string; message: string | null; createdAt: string; items: Array<{ id: string; quantity: number; product: { name: string } }> }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated') fetch('/api/inquiries').then(r => r.json()).then(d => { setInquiries(d); setLoading(false); });
  }, [status, router]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className="h2" style={{ marginBottom: 8 }}>Inquiry Tracking</h1>
        <p style={{ color: 'var(--secondary)', marginBottom: 32 }}>Track the status of your submitted inquiries</p>

        {inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <Package size={48} style={{ color: 'var(--secondary-dim)', marginBottom: 16 }} />
            <p style={{ color: 'var(--secondary)' }}>No inquiries yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {inquiries.map(inq => (
              <div key={inq.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>INQ-{inq.id.slice(0, 8).toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary-dim)' }}>{timeAgo(inq.createdAt)}</div>
                  </div>
                  <span className={`badge badge-${inq.status.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {statusIcons[inq.status]} {getStatusLabel(inq.status)}
                  </span>
                </div>
                {inq.message && <p style={{ fontSize: 14, color: 'var(--on-surface)', marginBottom: 12 }}>{inq.message}</p>}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  {inq.items.map(item => (
                    <div key={item.id} style={{ fontSize: 13, color: 'var(--secondary)', padding: '4px 0' }}>
                      • {item.product.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
