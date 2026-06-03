'use client';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

  if (status === 'loading') return <div className="loading-page"><div className="spinner" /></div>;

  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 className="h2" style={{ marginBottom: 32 }}>My Profile</h1>
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#000' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{user?.name}</h2>
              <span className={`badge ${user?.role === 'ADMIN' ? 'badge-quoted' : 'badge-in-stock'}`} style={{ marginTop: 4 }}>
                <Shield size={12} style={{ marginRight: 4 }} /> {user?.role}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <User size={18} style={{ color: 'var(--secondary)' }} />
              <div><div className="label-caps" style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 2 }}>Full Name</div><div>{user?.name}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mail size={18} style={{ color: 'var(--secondary)' }} />
              <div><div className="label-caps" style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 2 }}>Email</div><div>{user?.email}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Phone size={18} style={{ color: 'var(--secondary)' }} />
              <div><div className="label-caps" style={{ fontSize: 11, color: 'var(--secondary)', marginBottom: 2 }}>Phone</div><div>Contact admin to update</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
