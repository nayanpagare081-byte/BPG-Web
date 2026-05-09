import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dim)', borderTop: '1px solid var(--border)', paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, marginBottom: 48 }}>
          {/* Company Info */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Image src="/images/logo.png" alt="BPG Construction & Earthmoving" width={180} height={54} style={{ objectFit: 'contain', height: 50, width: 'auto' }} />
            </div>
            <p style={{ fontSize: 14, color: 'var(--secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              Industrial-grade earthmoving machinery and construction equipment. Trusted by contractors across India.
            </p>
            <div style={{ fontSize: 12, color: 'var(--secondary-dim)' }}>GSTIN: 27ABBFB9400H1ZO</div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="label-caps" style={{ color: 'var(--primary)', marginBottom: 16 }}>Navigation</h4>
            {[['/', 'Home'], ['/products', 'Machinery'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: 'var(--secondary)', padding: '6px 0', transition: 'color 0.2s' }}>{label}</Link>
            ))}
          </div>

          {/* Equipment */}
          <div>
            <h4 className="label-caps" style={{ color: 'var(--primary)', marginBottom: 16 }}>Equipment</h4>
            {[['/products?category=excavators', 'Excavators'], ['/products?category=wheel-loaders', 'Wheel Loaders'], ['/products?category=bulldozers', 'Bulldozers'], ['/products?category=cranes', 'Cranes']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 14, color: 'var(--secondary)', padding: '6px 0' }}>{label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-caps" style={{ color: 'var(--primary)', marginBottom: 16 }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="tel:+919623941966" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--secondary)' }}>
                <Phone size={14} /> +91 96239 41966
              </a>
              <a href="mailto:Satishpagare2013@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--secondary)' }}>
                <Mail size={14} /> Satishpagare2013@gmail.com
              </a>
              <a href="https://maps.app.goo.gl/R52nTpVqJ4rhej469" target="_blank" style={{ display: 'flex', alignItems: 'start', gap: 8, fontSize: 14, color: 'var(--secondary)' }}>
                <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} /> Plot No-26, G, No-82/A-1, Ambad, Nashik 422010
              </a>
              <a href="https://wa.me/qr/CYHYIGHKGCSNO1" target="_blank" className="btn btn-sm" style={{ background: '#25D366', color: '#fff', marginTop: 4, width: 'fit-content' }}>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--secondary-dim)' }}>© {new Date().getFullYear()} BPG Construction & Earthmoving Equipment. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="#" style={{ fontSize: 13, color: 'var(--secondary-dim)' }}>Privacy Policy</Link>
            <Link href="#" style={{ fontSize: 13, color: 'var(--secondary-dim)' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
