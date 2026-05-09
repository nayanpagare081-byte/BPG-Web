'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Star, Truck, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(r => r.json()).then(d => { setProduct(d); setLoading(false); });
  }, [slug]);

  const addToCart = async () => {
    if (!session) { router.push('/login'); return; }
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product?.id }) });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/inquiries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inquiryForm.name || (session?.user as { name?: string })?.name || 'Guest',
        email: (session?.user as { email?: string })?.email || 'guest@example.com',
        phone: inquiryForm.phone, message: inquiryForm.message,
        items: [{ productId: product?.id, quantity: 1 }],
      }),
    });
    setInquirySent(true);
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!product) return <div className="section container" style={{ textAlign: 'center' }}><p>Product not found</p></div>;

  const specs = product.specifications ? JSON.parse(product.specifications as string) : {};
  const reviews = (product.reviews as Array<{ id: string; rating: number; comment: string; user: { name: string }; createdAt: string }>) || [];

  return (
    <div className="section">
      <div className="container">
        <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--secondary)', marginBottom: 32, fontSize: 14 }}>
          <ArrowLeft size={16} /> Back to Catalogue
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Left: Image */}
          <div>
            <div className="product-image-placeholder" style={{ borderRadius: 'var(--radius-lg)', minHeight: 400 }}><Truck size={80} /></div>
          </div>

          {/* Right: Details */}
          <div>
            <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>{(product.category as { name?: string })?.name}</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>{product.name as string}</h1>
            <p style={{ color: 'var(--secondary)', lineHeight: 1.7, marginBottom: 24 }}>{product.description as string}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              {product.showPrice && product.price ? (
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-light)' }}>{formatPrice(product.price as number)}</span>
              ) : (
                <span style={{ fontSize: 16, color: 'var(--secondary)' }}>💰 Price available on request</span>
              )}
              <span className={`badge ${product.inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'On Order'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
              <button onClick={addToCart} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                {addedToCart ? <><CheckCircle size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Inquiry List</>}
              </button>
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 className="label-caps" style={{ marginBottom: 16, color: 'var(--primary)' }}>Technical Specifications</h3>
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  {Object.entries(specs).map(([key, val], i) => (
                    <div key={key} style={{ display: 'flex', padding: '12px 16px', background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-container)', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>{key}</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{val as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Form */}
        <div style={{ marginTop: 64 }}>
          <h2 className="h3" style={{ marginBottom: 24 }}>Request a Quote</h2>
          {inquirySent ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Inquiry Submitted!</h3>
              <p style={{ color: 'var(--secondary)' }}>Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 32, maxWidth: 600 }}>
              <form onSubmit={submitInquiry}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} placeholder="Full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })} placeholder="+91 98765 43210" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })} rows={4} placeholder="Tell us about your requirements..." />
                </div>
                <button type="submit" className="btn btn-primary"><Send size={16} /> Submit Inquiry</button>
              </form>
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 className="h3" style={{ marginBottom: 24 }}>Customer Reviews</h2>
            <div className="grid grid-2">
              {reviews.map(r => (
                <div key={r.id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < r.rating ? 'var(--primary)' : 'none'} color={i < r.rating ? 'var(--primary)' : 'var(--surface-bright)'} />)}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{r.comment}</p>
                  <div style={{ fontSize: 13, color: 'var(--secondary)' }}>{r.user.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
