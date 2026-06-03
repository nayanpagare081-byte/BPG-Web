import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) return { data: null, status: 'loading' };
  if (!session) return { data: null, status: 'unauthenticated' };

  const isAdmin = session.user.email === 'nayanpagare081@gmail.com' || session.user.email === 'admin@bpg.com';

  const user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
    role: isAdmin ? 'ADMIN' : (session.user.user_metadata?.role || 'CUSTOMER'),
  };

  return { data: { user }, status: 'authenticated' };
}
