'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Layers, 
  FileText, 
  MessageSquare, 
  LogOut, 
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
  Settings,
  Sliders,
  Image as ImageIcon,
  FileSpreadsheet,
  CreditCard,
  Globe,
  Building2,
  Languages,
  Users,
  History,
  Database,
  HelpCircle,
  Star,
  Compass,
  Search,
  KeyRound,
  ChevronDown,
  X,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Logo from './Logo';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminHeader({ activeTab }: { activeTab?: string }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAdminAuth({ requireAuth: true });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Quick Search state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    enquiries: any[];
    quotations: any[];
    customers: any[];
    blogs: any[];
  }>({ products: [], enquiries: [], quotations: [], customers: [], blogs: [] });
  const [searchLoading, setSearchLoading] = useState(false);

  // Keyboard shortcut Cmd+K or Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowSearchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Run search when query changes
  React.useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults({ products: [], enquiries: [], quotations: [], customers: [], blogs: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long');
      return;
    }

    setPassLoading(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPassSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess('');
      }, 1500);
    } catch (err: any) {
      setPassError(err.message || 'Password update failed');
    } finally {
      setPassLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', href: '/admin/products', icon: Package },
    { id: 'categories', name: 'Categories', href: '/admin/categories', icon: Layers },
    { id: 'enquiries', name: 'RFQ & Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { id: 'quotations', name: 'Quotations', href: '/admin/quotations', icon: FileSpreadsheet },
    { id: 'customers', name: 'Customer CRM', href: '/admin/customers', icon: Users },
    { id: 'catalogues', name: 'PDF Catalogues', href: '/admin/catalogues', icon: FileText },
    { id: 'payments', name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { id: 'redirects', name: '301 Redirects', href: '/admin/redirects', icon: Compass },
    { id: 'blogs', name: 'B2B Blog & Guides', href: '/admin/blogs', icon: FileText },
    { id: 'faqs', name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { id: 'testimonials', name: 'Client Reviews', href: '/admin/testimonials', icon: Star },
    { id: 'navigation', name: 'Navigation Menus', href: '/admin/navigation', icon: Compass },
    { id: 'factory-gallery', name: 'Factory Photos', href: '/admin/factory-gallery', icon: Building2 },
    { id: 'certifications', name: 'Certifications', href: '/admin/certifications', icon: ShieldCheck },
    { id: 'slides', name: 'Hero Sliders', href: '/admin/slides', icon: Sliders },
    { id: 'gallery', name: 'Media Library', href: '/admin/gallery', icon: ImageIcon },
    { id: 'languages', name: 'Languages & i18n', href: '/admin/languages', icon: Languages },
    { id: 'clients', name: 'Sectors & Logos', href: '/admin/clients', icon: Building2 },
    { id: 'content', name: 'SEO & Page Texts', href: '/admin/content', icon: Globe },
    { id: 'settings', name: 'Company & Contact Info', href: '/admin/settings', icon: Settings },
    { id: 'users', name: 'Staff Users & Roles', href: '/admin/users', icon: Users, requiresSuperAdmin: true },
    { id: 'audit-logs', name: 'Security Audit Logs', href: '/admin/audit-logs', icon: History },
    { id: 'backup', name: 'Data Backup & Export', href: '/admin/backup', icon: Database, requiresSuperAdmin: true },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SUPER ADMIN</span>;
      case 'CONTENT_MANAGER':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">CONTENT MGR</span>;
      case 'SALES_MANAGER':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SALES LEAD</span>;
      case 'SEO_SPECIALIST':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SEO EXPERT</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">STAFF</span>;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2 py-1 shrink-0">
              <Logo size="sm" theme="dark" showSubtitle={false} />
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                ENTERPRISE CMS
              </span>
            </Link>
          </div>

          {/* User info, Password Change, Live Site & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            
            {/* Global Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors font-medium group"
              title="Search across all modules (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-slate-400">Search CMS...</span>
              <kbd className="hidden lg:inline-block bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-mono px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left">
                  <div className="font-bold text-slate-200 text-xs leading-none">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.email}</div>
                </div>
                {getRoleBadge(user.role)}
              </div>
            )}

            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors font-medium cursor-pointer"
              title="Change Admin Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Change Password</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-medium hidden sm:inline">Live Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-600 text-red-200 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-900/50 transition-all font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Scrollable Navigation items */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {navItems.map((item) => {
            if (item.requiresSuperAdmin && user && user.role !== 'SUPER_ADMIN') {
              return null;
            }
            const Icon = item.icon;
            const isActive = pathname === item.href || activeTab === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Change Admin Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter new strong password"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {passLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Quick Search Modal (Cmd+K) */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Search Input Bar */}
            <div className="relative border-b border-slate-800 p-4 flex items-center gap-3 bg-slate-950/60">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search bags, RFQ leads, quotes, clients, articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs flex items-center gap-1 font-mono"
              >
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">ESC</kbd>
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
              {searchLoading ? (
                <div className="py-8 text-center text-slate-500 font-mono">Searching database records...</div>
              ) : !searchQuery.trim() || searchQuery.length < 2 ? (
                <div className="py-6 text-center space-y-2">
                  <p className="text-slate-400">Type at least 2 characters to search across LTS BAGS database.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
                    <span className="text-slate-500">Quick suggestions:</span>
                    <button onClick={() => setSearchQuery('Backpack')} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-amber-400 border border-slate-700">Backpack</button>
                    <button onClick={() => setSearchQuery('Duffel')} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-amber-400 border border-slate-700">Duffel</button>
                    <button onClick={() => setSearchQuery('Corporate')} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-amber-400 border border-slate-700">Corporate</button>
                    <button onClick={() => setSearchQuery('Laptop')} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-amber-400 border border-slate-700">Laptop</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Products */}
                  {searchResults.products?.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                        Bag Models ({searchResults.products.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.products.map((p) => (
                          <Link
                            key={p.id}
                            href="/admin/products"
                            onClick={() => setShowSearchModal(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white group-hover:text-amber-400 transition-colors">{p.name}</div>
                                <div className="text-[11px] text-slate-400">{p.categoryName || 'Product'} • SKU: {p.sku || 'N/A'} • MOQ: {p.moq || 100} pcs</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                              {p.status || 'PUBLISHED'}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enquiries */}
                  {searchResults.enquiries?.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase text-sky-400 tracking-wider">
                        RFQ Enquiries ({searchResults.enquiries.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.enquiries.map((e) => (
                          <Link
                            key={e.id}
                            href="/admin/enquiries"
                            onClick={() => setShowSearchModal(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <MessageSquare className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white group-hover:text-sky-400 transition-colors">{e.name} ({e.company || 'Direct'})</div>
                                <div className="text-[11px] text-slate-400">{e.productRequirement} • Qty: {e.quantity}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded font-bold">
                              {e.status}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quotations */}
                  {searchResults.quotations?.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                        Quotations ({searchResults.quotations.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.quotations.map((q) => (
                          <Link
                            key={q.id}
                            href="/admin/quotations"
                            onClick={() => setShowSearchModal(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{q.quoteNumber} - {q.clientName}</div>
                                <div className="text-[11px] text-slate-400">{q.clientCompany || ''} • Total: ₹{Number(q.totalAmount || 0).toLocaleString('en-IN')}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                              {q.status}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customers */}
                  {searchResults.customers?.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider">
                        Customers CRM ({searchResults.customers.length})
                      </div>
                      <div className="space-y-1">
                        {searchResults.customers.map((c) => (
                          <Link
                            key={c.id}
                            href="/admin/customers"
                            onClick={() => setShowSearchModal(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Users className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                              <div>
                                <div className="font-bold text-white group-hover:text-purple-400 transition-colors">{c.name} {c.companyName ? `(${c.companyName})` : ''}</div>
                                <div className="text-[11px] text-slate-400">{c.email} • {c.phone} • {c.city || 'India'}</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-bold">
                              {c.customerType || 'CLIENT'}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.products?.length === 0 && 
                   searchResults.enquiries?.length === 0 && 
                   searchResults.quotations?.length === 0 && 
                   searchResults.customers?.length === 0 && (
                    <div className="py-8 text-center text-slate-500">
                      No matching records found for &quot;{searchQuery}&quot;.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Shortcut hints */}
            <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3 font-mono">
                <span>Navigate modules instantly</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">LTS Enterprise CMS v2.5</span>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
