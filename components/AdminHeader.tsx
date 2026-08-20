'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Image,
  FileSpreadsheet,
  CreditCard,
  Globe,
  Building2,
  Languages
} from 'lucide-react';
import Logo from './Logo';

export default function AdminHeader({ activeTab }: { activeTab?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('apex_admin_logged_in');
    if (!loggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('apex_admin_logged_in');
    localStorage.removeItem('apex_admin_email');
    router.push('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', href: '/admin/products', icon: Package },
    { id: 'categories', name: 'Categories', href: '/admin/categories', icon: Layers },
    { id: 'factory-gallery', name: 'Factory Photos', href: '/admin/factory-gallery', icon: Building2 },
    { id: 'certifications', name: 'Certifications', href: '/admin/certifications', icon: ShieldCheck },
    { id: 'blogs', name: 'Blog', href: '/admin/blogs', icon: FileText },
    { id: 'slides', name: 'Homepage Slider', href: '/admin/slides', icon: Sliders },
    { id: 'languages', name: 'Languages & i18n', href: '/admin/languages', icon: Languages },
    { id: 'clients', name: 'Clients / Sectors', href: '/admin/clients', icon: Building2 },
    { id: 'gallery', name: 'Media Library', href: '/admin/gallery', icon: Image },
    { id: 'enquiries', name: 'Enquiries / RFQ CRM', href: '/admin/enquiries', icon: MessageSquare },
    { id: 'quotations', name: 'Quotations', href: '/admin/quotations', icon: FileSpreadsheet },
    { id: 'payments', name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { id: 'content', name: 'Website Content', href: '/admin/content', icon: Globe },
    { id: 'settings', name: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 py-1 shrink-0">
              <Logo size="sm" theme="dark" showSubtitle={false} />
              <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ml-1">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium hidden sm:inline">View Live Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-red-600/90 hover:text-white px-3 py-1.5 rounded-lg text-slate-300 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Full Nav Bar (Horizontal Scrollable Menu) */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || activeTab === item.id;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-black shadow-sm shadow-sky-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
}
