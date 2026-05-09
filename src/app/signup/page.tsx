'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    router.push('/');
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/images/logo.png" alt="BPG Construction & Earthmoving" width={200} height={60} style={{ objectFit: 'contain', height: 56, width: 'auto', margin: '0 auto 20px' }} />
          <h1 className="h2">Create Account</h1>
          <p style={{ color: 'var(--secondary)', marginTop: 8 }}>Join BPG to start enquiring about equipment</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '12px 24px', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600,
              background: '#fff', color: '#1f1f1f', border: '1px solid #dadce0',
              cursor: 'pointer', transition: 'all 0.2s', marginBottom: 24,
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = '#f7f8f8'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = '#fff'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div style={{ background: 'rgba(255,180,171,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 20, fontSize: 14, color: 'var(--error)' }}>{error}</div>}

            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Rajesh Kumar' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com' },
              { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
              { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password' },
            ].map(field => (
              <div className="form-group" key={field.key}>
                <label className="form-label">{field.label}</label>
                <input type={field.type} value={form[field.key as keyof typeof form]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} required={field.key !== 'phone'} />
              </div>
            ))}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
