'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const fetchCartCount = async (currentSession: any) => {
    if (!currentSession) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const total = data.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(total);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      fetchCartCount(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (session) {
      fetchCartCount(session);
    }
    
    const handleCartUpdate = () => fetchCartCount(session);
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [session]);

  const isAppAdmin = user?.email === 'nayanpagare081@gmail.com' || user?.email === 'admin@bpg.com';
  const isAdmin = isAppAdmin || user?.user_metadata?.role === 'ADMIN';

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 w-full z-50 border-b border-outline-variant/40 font-body-sm text-body-sm">
      <div className="max-w-container-max mx-auto flex justify-between items-center px-md py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="BPG Logo" className="h-12 md:h-14 w-auto object-contain" />
        </Link>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="nav-link text-on-surface font-medium hover:text-primary transition-colors text-sm">Home</Link>
          <Link href="/products" className="nav-link text-on-surface font-medium hover:text-primary transition-colors text-sm">Machinery</Link>
          <Link href="/contact" className="nav-link text-on-surface font-medium hover:text-primary transition-colors text-sm">Contact Us</Link>
          <Link href="/about" className="nav-link text-on-surface font-medium hover:text-primary transition-colors text-sm">About me</Link>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-1 text-on-surface relative">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)} 
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">person</span>
          </button>
          
          <Link href="/cart" className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative">
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          <button 
            className="md:hidden p-2 hover:bg-surface-container-low rounded-full transition-colors" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined text-[22px]">{menuOpen ? 'close' : 'menu'}</span>
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-outline-variant/40 rounded-lg shadow-xl z-50 flex flex-col py-1 overflow-hidden">
                {session ? (
                  <>
                    <div className="px-4 py-3 border-b border-outline-variant/30">
                      <div className="font-semibold text-sm text-on-surface">{user?.user_metadata?.full_name || user?.email}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{user?.email}</div>
                    </div>
                    <Link href="/profile" className="px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                    <Link href="/inquiries" className="px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors" onClick={() => setUserMenuOpen(false)}>My Inquiries</Link>
                    {isAdmin && (
                      <Link href="/admin" className="px-4 py-2.5 text-sm text-secondary font-medium hover:bg-surface-container-low transition-colors" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <div className="border-t border-outline-variant/30 mt-1"></div>
                    <button onClick={handleSignOut} className="px-4 py-2.5 text-sm text-error text-left hover:bg-surface-container-low transition-colors">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                    <Link href="/signup" className="px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-outline-variant/40 shadow-sm p-4 z-40">
          <form onSubmit={handleSearch} className="max-w-container-max mx-auto flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">search</span>
            <input 
              type="text" 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment..."
              className="flex-grow bg-transparent border-none outline-none font-body-md text-body-md text-on-surface"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-white px-md py-4 flex flex-col gap-4">
          <Link href="/" className="text-on-surface font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" className="text-on-surface font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Machinery</Link>
          <Link href="/contact" className="text-on-surface font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          <Link href="/about" className="text-on-surface font-medium hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>About me</Link>
        </div>
      )}
    </nav>
  );
}
