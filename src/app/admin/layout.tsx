'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MessageSquare,
  Users,
  BarChart3
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/admin/products', icon: <Package size={18} />, label: 'Products' },
  { href: '/admin/categories', icon: <FolderOpen size={18} />, label: 'Categories' },
  { href: '/admin/inquiries', icon: <MessageSquare size={18} />, label: 'Inquiries' },
  { href: '/admin/users', icon: <Users size={18} />, label: 'Customers' },
  { href: '/admin/analytics', icon: <BarChart3 size={18} />, label: 'Analytics' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // 🔥 FIX: handle stuck loading
  useEffect(() => {
    console.log("STATUS:", status);
    console.log("SESSION:", session);

    const timer = setTimeout(() => {
      if (status === 'loading') {
        console.log("Session stuck → redirecting");
        router.push('/login');
      }
    }, 5000);

    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (
      status === 'authenticated' &&
      (session?.user as { role?: string })?.role !== 'ADMIN'
    ) {
      router.push('/');
    }

    return () => clearTimeout(timer);
  }, [status, session, router]);

  // 🔥 FIX: no infinite spinner
  if (status === 'loading') {
    return (
      <div style={{ padding: 40 }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if ((session?.user as { role?: string })?.role !== 'ADMIN') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, padding: 20 }}>
        <Link href="/">← Back</Link>

        {navItems.map(item => (
          <Link key={item.href} href={item.href}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: pathname === item.href ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
              color: pathname === item.href ? 'var(--primary)' : 'var(--text-dim)',
              fontWeight: pathname === item.href ? 600 : 400,
              marginBottom: '4px'
            }}>
              {item.icon} {item.label}
            </div>
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  );
}