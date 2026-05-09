'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Send, ShoppingCart, CheckCircle, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Array<{ id: string; quantity: number; product: { id: string; name: string; slug: string; price: number | null; showPrice: boolean; category?: { name: string } } }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated') {
      fetch('/api/cart').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
      const user = session?.user as { name?: string } | undefined;
      if (user?.name) setTimeout(() => setForm(f => ({ ...f, name: user.name || '' })), 0);
    }
  }, [status, session, router]);

  const removeItem = async (id: string) => {
    await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setItems(items.filter(i => i.id !== id));
  };

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await fetch('/api/inquiries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, email: (session?.user as { email?: string })?.email || '',
        phone: form.phone, message: form.message,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      }),
    });
    setSubmitting(false); setSubmitted(true); setItems([]);
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  if (submitted) return (
    <div className="section container" style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
      <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 24 }} />
      <h1 className="h2" style={{ marginBottom: 12 }}>Inquiry Submitted!</h1>
      <p style={{ color: 'var(--secondary)', marginBottom: 32 }}>Our team will review your request and contact you within 24 hours.</p>
      <Link href="/inquiries" className="btn btn-primary">Track Inquiries</Link>
    </div>
  );

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 className="h2" style={{ marginBottom: 8 }}>Inquiry Cart</h1>
        <p style={{ color: 'var(--secondary)', marginBottom: 32 }}>Review equipment and submit your inquiry</p>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <ShoppingCart size={48} style={{ color: 'var(--secondary-dim)', marginBottom: 16 }} />
            <p style={{ color: 'var(--secondary)', marginBottom: 24 }}>Your inquiry cart is empty</p>
            <Link href="/products" className="btn btn-primary">Browse Machinery</Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 32 }}>
              {items.map(item => (
                <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, marginBottom: 12 }}>
                  <div style={{ width: 80, height: 60, background: 'var(--surface-high)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={28} style={{ color: 'var(--secondary-dim)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link href={`/products/${item.product.slug}`} style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)' }}>{item.product.name}</Link>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{item.product.category?.name} · Qty: {item.quantity}</div>
                  </div>
                  {item.product.showPrice && item.product.price && <span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{formatPrice(item.product.price)}</span>}
                  <button onClick={() => removeItem(item.id)} className="btn-icon btn-ghost" style={{ color: 'var(--error)', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Submit Inquiry for {items.length} Item{items.length > 1 ? 's' : ''}</h3>
              <form onSubmit={submitInquiry}>
                <div className="grid grid-2">
                  <div className="form-group"><label className="form-label">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Message (Optional)</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} placeholder="Any special requirements..." /></div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                  {submitting ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Send size={18} /> Submit Inquiry</>}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
