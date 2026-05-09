import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Shield, Clock, Globe, Star, Truck, Wrench, ChevronRight } from 'lucide-react';

export default async function HomePage() {
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  const featured = await prisma.product.findMany({ where: { featured: true }, include: { category: true }, take: 6 });
  const reviews = await prisma.review.findMany({ where: { approved: true }, include: { user: true, product: true }, take: 3 });

  const categoryIcons: Record<string, string> = {
    excavators: '🏗️', 'wheel-loaders': '🚜', bulldozers: '🚧', compactors: '🛞', cranes: '🏗️', 'dump-trucks': '🚛',
  };

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, var(--bg-dim) 0%, var(--surface) 50%, var(--bg-dim) 100%)',
        overflow: 'hidden',
      }}>
        {/* Cinematic Background Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("/images/hero-bg.png")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.4, pointerEvents: 'none',
        }} />
        {/* Dark Overlay to ensure text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '140%',
          background: 'radial-gradient(ellipse, rgba(245,130,32,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          opacity: 0.3,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 1, background: 'var(--primary)', display: 'inline-block' }} />
              Industrial Earthmoving Solutions
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, color: '#ffffff' }}>
              Equip Your Project With{' '}
              <span style={{ color: 'var(--primary)' }}>Unbreakable</span>{' '}
              Machinery
            </h1>
            <p className="body-lg" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 40, maxWidth: 540 }}>
              Forged for India&apos;s most demanding construction environments. BPG delivers excavators, loaders, and heavy machinery built to dominate every jobsite.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/products" className="btn btn-primary btn-lg">
                Explore Machinery <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                Request Consultation
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 48, marginTop: 64 }}>
              {[['15+', 'Years Experience'], ['500+', 'Machines Deployed'], ['200+', 'Active Clients']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{num}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>Equipment Categories</div>
            <h2 className="h2">Purpose-Built for Every Operation</h2>
          </div>
          <div className="grid grid-3">
            {categories.map(cat => (
              <Link href={`/products?category=${cat.slug}`} key={cat.id} className="card" style={{ padding: 32, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 36 }}>{categoryIcons[cat.slug] || '⚙️'}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)' }}>{cat.name}</h3>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{cat.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span className="label-caps" style={{ color: 'var(--primary)' }}>{cat._count?.products || 0} Models</span>
                  <ChevronRight size={18} style={{ color: 'var(--primary)' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section" style={{ background: 'var(--bg-dim)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>Featured</div>
              <h2 className="h2">Elite Machines Ready for Deployment</h2>
            </div>
            <Link href="/products" className="btn btn-secondary">
              View Full Inventory <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-3">
            {featured.map(product => (
              <Link href={`/products/${product.slug}`} key={product.id} className="card" style={{ textDecoration: 'none' }}>
                <div className="product-image-placeholder">
                  <Truck size={64} />
                </div>
                <div style={{ padding: 24 }}>
                  <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>{product.category?.name}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 8 }}>{product.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {product.showPrice && product.price ? (
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(product.price)}</span>
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--secondary-dim)' }}>Price on Request</span>
                    )}
                    <span className={`badge ${product.inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`}>
                      {product.inStock ? 'In Stock' : 'On Order'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BPG ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>Why BPG</div>
            <h2 className="h2">Engineered for Uptime</h2>
            <p className="body-md" style={{ color: 'var(--secondary)', maxWidth: 600, margin: '16px auto 0' }}>
              In heavy construction, downtime is a liability. BPG equipment is designed with precision and backed by rapid-response support.
            </p>
          </div>
          <div className="grid grid-4">
            {[
              { icon: <Shield size={28} />, title: 'Built to Last', desc: 'Heavy-gauge steel construction rated for 20,000+ operating hours.' },
              { icon: <Clock size={28} />, title: 'Rapid Response', desc: 'Technicians dispatched within hours, not days. Nationwide coverage.' },
              { icon: <Globe size={28} />, title: 'Parts Network', desc: 'Global inventory access ensures zero-delay repairs and maintenance.' },
              { icon: <Wrench size={28} />, title: 'Full Service', desc: 'From procurement to disposal — complete lifecycle management.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {reviews.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-dim)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>Testimonials</div>
              <h2 className="h2">Trusted by Industry Leaders</h2>
            </div>
            <div className="grid grid-3">
              {reviews.map(review => (
                <div key={review.id} className="card" style={{ padding: 32 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? 'var(--primary)' : 'none'} color={i < review.rating ? 'var(--primary)' : 'var(--surface-bright)'} />
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.7, marginBottom: 16 }}>&ldquo;{review.comment}&rdquo;</p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{review.user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>Re: {review.product.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(245,130,32,0.1) 0%, var(--bg) 50%, rgba(245,130,32,0.05) 100%)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 16 }}>Secure Your Fleet</h2>
          <p className="body-lg" style={{ color: 'var(--secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Professional consultation for heavy machinery procurement and support services.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary btn-lg">Get a Quote <ArrowRight size={18} /></Link>
            <a href="tel:+919623941966" className="btn btn-secondary btn-lg">Call +91 96239 41966</a>
          </div>
        </div>
      </section>
    </>
  );
}
