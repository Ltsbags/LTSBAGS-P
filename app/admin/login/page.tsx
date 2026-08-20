'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@ltsbags.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store auth session flag
      localStorage.setItem('apex_admin_logged_in', 'true');
      localStorage.setItem('apex_admin_email', data.user.email);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#020617_100%)] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex flex-col items-center justify-center gap-1 mb-2">
            <Logo size="lg" theme="dark" />
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider mt-1">
              ADMIN PORTAL
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white font-serif">Factory Operations Portal</h1>
          <p className="text-xs text-slate-400">
            Authorized admin access for LTS BAGS catalog, SEO metadata, and client quote enquiries.
          </p>
        </div>

        {/* Demo Credentials Alert */}
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3.5 text-xs text-sky-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Default Operations Credentials:</span>
          </div>
          <p className="font-mono text-[11px] text-sky-200">Email: admin@ltsbags.com</p>
          <p className="font-mono text-[11px] text-sky-200">Password: admin123</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
