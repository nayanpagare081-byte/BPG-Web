'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            phone: form.phone,
          },
        },
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
  };

  return (
    <div className="relative flex-grow flex items-center justify-center py-lg px-margin-mobile overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Background Image with Dark Glassy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="BPG Construction Machinery & Earthmoving Equipment"
          className="w-full h-full object-cover transform scale-105"
          src="/images/hero-bg.png"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Signup Card Panel */}
      <div className="relative z-10 w-full max-w-[440px] p-md md:p-lg flex flex-col gap-md text-white my-sm">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-xs">
          <img src="/images/logo.png" alt="BPG Logo" className="h-28 md:h-32 w-auto object-contain mb-sm" />
          <h2 className="font-label-md text-label-md text-slate-300 font-bold uppercase tracking-widest">
            Create Your Account
          </h2>
          <p className="font-body-sm text-body-sm text-slate-400">
            Join BPG to request customized machinery quotes
          </p>
        </div>

        {/* Authentication Actions */}
        <div className="flex flex-col gap-md">
          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-sm px-md py-[12px] bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-all duration-200 cursor-pointer active:scale-98 font-button text-button text-white"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Separator */}
          <div className="flex items-center gap-sm">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="font-label-sm text-label-sm text-slate-400 uppercase tracking-widest">
              Or sign up with email
            </span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
            {error && (
              <div className="bg-red-500/15 border border-red-500/40 text-red-300 p-sm text-body-sm rounded">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-slate-300 font-bold" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                required
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-sm py-[10px] bg-white/10 border border-white/20 rounded font-body-md text-body-md text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-white/40"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-slate-300 font-bold" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-sm py-[10px] bg-white/10 border border-white/20 rounded font-body-md text-body-md text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-white/40"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-slate-300 font-bold" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-sm py-[10px] bg-white/10 border border-white/20 rounded font-body-md text-body-md text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-white/40"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-slate-300 font-bold" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                required
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full px-sm py-[10px] bg-white/10 border border-white/20 rounded font-body-md text-body-md text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-white/45"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-slate-300 font-bold" htmlFor="confirm">
                Confirm Password
              </label>
              <input
                id="confirm"
                required
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Re-enter password"
                className="w-full px-sm py-[10px] bg-white/10 border border-white/20 rounded font-body-md text-body-md text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all placeholder:text-white/45"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-slate-200 font-button text-button py-[14px] px-md rounded mt-sm transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center gap-xs font-bold"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin text-black">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-xs pt-md border-t border-white/10">
          <p className="font-body-sm text-body-sm text-slate-300">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Sign in
            </Link>
          </p>
          <p className="mt-md font-body-sm text-body-sm text-slate-400/80 leading-relaxed">
            By continuing, you agree to our{' '}
            <a className="underline hover:text-white transition-colors" href="#">
              Terms of Service
            </a>{' '}
            and{' '}
            <a className="underline hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
