'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { db } from '@/lib/db';
import { Enquiry } from '@/lib/types';
import { 
  Package, 
  Layers, 
  FileText, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Clock3,
  Sliders,
  Image as ImageIcon,
  FileSpreadsheet,
  CreditCard,
  Globe,
  Settings
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBlogs: 0,
    totalEnquiries: 0,
    totalSlides: 0,
    activeSlides: 0,
    newEnquiriesCount: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    fetch('/api/admin/login')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));

    fetch('/api/enquiries')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecentEnquiries(data.slice(0, 5));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Welcome Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">
                Factory Operations Dashboard
              </h1>
              <p className="text-slate-600 text-xs mt-1">
                Overview of custom bag catalog metrics, active category SEO rules, and client quote enquiries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/slides"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manage Hero Slider</span>
              </Link>
              <Link
                href="/admin/settings"
                className="bg-slate-800 hover:bg-slate-900 text-slate-200 font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Change Company Logo</span>
              </Link>
              <Link
                href="/admin/products"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Bag Model</span>
              </Link>
            </div>
          </div>

          {/* All 11 Admin Panel Modules Quick Access Grid */}
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
              Admin Panel Quick Navigation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                { name: 'Products', href: '/admin/products', icon: Package, desc: 'Catalog & Specs', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
                { name: 'Categories', href: '/admin/categories', icon: Layers, desc: 'Bag Categories', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
                { name: 'Blog', href: '/admin/blogs', icon: FileText, desc: 'B2B Insights', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
                { name: 'Homepage Slider', href: '/admin/slides', icon: Sliders, desc: 'Hero Banners', color: 'bg-sky-500/10 text-sky-600 border-sky-200' },
                { name: 'Gallery / Media', href: '/admin/gallery', icon: ImageIcon, desc: 'Image Library', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
                { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, desc: 'Quote Leads', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
                { name: 'Quotations', href: '/admin/quotations', icon: FileSpreadsheet, desc: 'Proforma Invoices', color: 'bg-teal-500/10 text-teal-600 border-teal-200' },
                { name: 'Payments', href: '/admin/payments', icon: CreditCard, desc: 'Collections & UTR', color: 'bg-green-500/10 text-green-600 border-green-200' },
                { name: 'Website Content', href: '/admin/content', icon: Globe, desc: 'About, FAQ & CMS', color: 'bg-rose-500/10 text-rose-600 border-rose-200' },
                { name: 'Website Settings', href: '/admin/settings', icon: Settings, desc: 'Company & Branding', color: 'bg-slate-500/10 text-slate-700 border-slate-200' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{item.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Enquiries Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-serif">Recent Wholesale Quote Requests</h2>
                <p className="text-xs text-slate-500">Inbound B2B enquiries stored in database</p>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
              >
                View All ({stats.totalEnquiries}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recentEnquiries.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-500">No client enquiries found in database.</p>
              ) : (
                recentEnquiries.map((enq) => (
                  <div key={enq.id} className="p-4 sm:px-6 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold text-sm">{enq.name}</strong>
                        <span className="text-slate-500">({enq.company})</span>
                      </div>
                      <p className="text-slate-600">
                        <strong className="text-slate-700">Req:</strong> {enq.productRequirement} ({enq.quantity} units)
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        📧 {enq.email} | 📞 {enq.mobile}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        enq.status === 'NEW'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : enq.status === 'QUOTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {enq.status}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
