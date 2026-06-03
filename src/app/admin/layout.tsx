'use client';

import { useSession } from '@/hooks/useSession';
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
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-surface-container-lowest">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-outline-variant/30 p-4 md:p-6 flex flex-col gap-2 shrink-0">
        <Link href="/" className="mb-4 md:mb-6 text-sm text-on-surface-variant hover:text-primary font-medium flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Site
        </Link>

        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {navItems.map(item => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link key={item.href} href={item.href} className="shrink-0">
                <div className={`px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                  {item.icon} {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-[1400px] mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}