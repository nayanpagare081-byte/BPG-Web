'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = session?.user as { name?: string; role?: string; email?: string } | undefined;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--surface)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image src="/images/logo.png" alt="BPG Construction & Earthmoving" width={160} height={48} style={{ objectFit: 'contain', height: 44, width: 'auto' }} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hide-mobile" style={{ display: 'flex', gap: 32 }}>
          {[['/', 'Home'], ['/products', 'Machinery'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 14, fontWeight: 500, color: 'var(--secondary)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--on-surface)'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--secondary)'}
            >{label}</Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <Link href="/cart" className="btn-icon btn-ghost" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'var(--secondary)' }}>
            <ShoppingCart size={20} />
          </Link>

          {session ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-high)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 12px', color: 'var(--on-surface)', fontSize: 14 }}>
                <User size={16} />
                <span className="hide-mobile">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setUserMenuOpen(false)} />
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 8,
                    background: 'var(--surface-container)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: 8, minWidth: 200,
                    boxShadow: 'var(--shadow-lg)', zIndex: 50,
                  }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{user?.email}</div>
                    </div>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--on-surface)' }}>
                      <User size={16} /> Profile
                    </Link>
                    <Link href="/inquiries" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--on-surface)' }}>
                      <ShoppingCart size={16} /> My Inquiries
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--primary)' }}>
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { setUserMenuOpen(false); signOut(); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--error)', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hide-mobile" style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="btn-ghost btn-icon" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', border: 'none', background: 'transparent', color: 'var(--on-surface)' }}
            id="mobile-menu-toggle">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'var(--surface)' }} onClick={() => setMenuOpen(false)}>
          {[['/', 'Home'], ['/products', 'Machinery'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} style={{ display: 'block', padding: '12px 0', fontSize: 16, color: 'var(--on-surface)', borderBottom: '1px solid var(--border)' }}>{label}</Link>
          ))}
          {!session && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Link href="/login" className="btn btn-secondary" style={{ flex: 1 }}>Sign In</Link>
              <Link href="/signup" className="btn btn-primary" style={{ flex: 1 }}>Get Started</Link>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          #mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
