'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, KeyRound, UserCheck, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@ltsbags.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if already authenticated on server
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const res = await fetch('/api/admin/auth/me', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.replace('/admin/dashboard');
            return;
          }
        }
      } catch (err) {
        // Not logged in, stay on login page
      } finally {
        setCheckingSession(false);
      }
    }
    checkCurrentSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store compatibility flags and route
      localStorage.setItem('apex_admin_logged_in', 'true');
      localStorage.setItem('apex_admin_email', data.user.email);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying secure admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#020617_100%)] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-7 sm:p-8 shadow-2xl relative z-10 space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex flex-col items-center justify-center gap-1 mb-1">
            <Logo size="lg" theme="dark" />
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mt-1">
              ENTERPRISE CMS & ADMIN
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white font-serif">Factory Management Portal</h1>
          <p className="text-xs text-slate-400">
            Secure Role-Based Access for LTS BAGS Catalog, Enquiries & Manufacturing CMS
          </p>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Quick Demo Accounts
            </span>
            <span className="text-[10px] text-slate-500">Click to load</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setDemoRole('admin@ltsbags.com', 'admin123')}
              className={`p-2 rounded-lg text-left transition-all border ${
                email === 'admin@ltsbags.com' 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-[11px] text-white">Super Admin</div>
              <div className="text-[9px] text-slate-400 truncate">Full System Control</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoRole('content@ltsbags.com', 'admin123')}
              className={`p-2 rounded-lg text-left transition-all border ${
                email === 'content@ltsbags.com' 
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-[11px] text-white">Content Mgr</div>
              <div className="text-[9px] text-slate-400 truncate">Catalog & SEO</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoRole('sales.lead@ltsbags.com', 'admin123')}
              className={`p-2 rounded-lg text-left transition-all border ${
                email === 'sales.lead@ltsbags.com' 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-[11px] text-white">Sales Lead</div>
              <div className="text-[9px] text-slate-400 truncate">RFQ & Enquiries</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
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
                placeholder="admin@ltsbags.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-1 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Securely...</span>
              </div>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            ← Return to Public Website
          </Link>
          <span className="text-slate-600 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-slate-500" /> PBKDF2 Hashed & Session Secured
          </span>
        </div>

      </div>
    </div>
  );
}
