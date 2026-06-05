'use client';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BecomeAdmin() {
  const [msg, setMsg] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const upgrade = async () => {
    if (passcode !== 'BPG-ADMIN-2024') {
      setMsg('❌ Incorrect secret passcode!');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Update Supabase Session MetaData
      const { error } = await supabase.auth.updateUser({
        data: { role: 'ADMIN' }
      });
      
      if (error) {
        setMsg(`Supabase Error: ${error.message}`);
        setLoading(false);
        return;
      }

      // 2. Update Prisma Database
      const res = await fetch('/api/upgrade', { method: 'POST' });
      if (!res.ok) {
        setMsg('Failed to update database role.');
        setLoading(false);
        return;
      }

      setMsg('✅ You are now an ADMIN! Redirecting to Admin Panel...');
      
      // Give it a second to sync, then redirect
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-surface p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-outline-variant/30">
        <h1 className="text-2xl font-bold text-primary mb-4">Admin Access Request</h1>
        <p className="text-on-surface-variant mb-6 text-sm">
          Enter your secret authorization code below to upgrade your account to full Administrator privileges. 
          Make sure you are logged in first!
        </p>
        
        <input 
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter Secret Passcode"
          className="w-full mb-4 px-4 py-3 border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center tracking-widest"
        />

        <button 
          onClick={upgrade} 
          disabled={loading || !passcode}
          className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Upgrading...' : 'Grant Me Admin Access'}
        </button>

        {msg && (
          <div className="mt-4 p-3 bg-primary/10 text-primary font-medium rounded-lg text-sm">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
