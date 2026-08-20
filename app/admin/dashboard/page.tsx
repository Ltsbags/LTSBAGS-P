'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
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
  Sliders, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  CreditCard, 
  Globe, 
  Settings,
  HelpCircle,
  Star,
  Compass,
  Users,
  History,
  Database,
  ShieldCheck,
  Building2,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth({ requireAuth: true });
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
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, enqRes] = await Promise.all([
        fetch('/api/admin/login'),
        fetch('/api/enquiries')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (enqRes.ok) {
        const enqData = await enqRes.json();
        if (Array.isArray(enqData)) {
          setRecentEnquiries(enqData.slice(0, 6));
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([fetch('/api/admin/login'), fetch('/api/enquiries')])
      .then(async ([statsRes, enqRes]) => {
        if (!active) return;
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (enqRes.ok) {
          const enqData = await enqRes.json();
          if (Array.isArray(enqData)) {
            setRecentEnquiries(enqData.slice(0, 6));
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleQuickStatus = async (id: string, newStatus: Enquiry['status']) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error('Quick status update failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome & Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                Manufacturing Command Center
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-serif">
              Welcome, {user?.name || 'Administrator'}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Manage custom bag models, B2B quote pipeline, SEO landing pages, FAQs, staff permissions, and master backups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/admin/products"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bag Model</span>
            </Link>

            <Link
              href="/admin/enquiries"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>View RFQ Leads</span>
            </Link>

            <Link
              href="/admin/backup"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2 rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Data</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Products</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-white font-mono">{stats.totalProducts}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Across {stats.totalCategories} Categories</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">RFQ Inquiries</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-white font-mono">{stats.totalEnquiries}</div>
              <div className="text-[11px] text-emerald-400 mt-1 font-bold flex items-center gap-1">
                <span>{stats.newEnquiriesCount} Pending Review</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">B2B Knowledge & SEO</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-white font-mono">{stats.totalBlogs}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Published Articles & Guides</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Hero Banners</span>
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-white font-mono">{stats.activeSlides}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Total Slides: {stats.totalSlides}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full CMS Modules Navigation Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> CMS Modules Directory
            </h2>
            <span className="text-[11px] text-slate-500">18 Production Management Systems</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: 'Products & SKUs', href: '/admin/products', icon: Package, desc: 'Catalog, MOQ, Specs', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
              { name: 'Categories', href: '/admin/categories', icon: Layers, desc: 'Bag Types & Slugs', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { name: 'RFQ Enquiries', href: '/admin/enquiries', icon: MessageSquare, desc: 'Quote CRM & Status', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { name: 'B2B Blog & Guides', href: '/admin/blogs', icon: FileText, desc: 'SEO Articles & Meta', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              { name: 'FAQ CMS', href: '/admin/faqs', icon: HelpCircle, desc: 'Buyer Q&A Catalog', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
              { name: 'Client Reviews', href: '/admin/testimonials', icon: Star, desc: 'Social Proof & Ratings', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
              { name: 'Navigation Menus', href: '/admin/navigation', icon: Compass, desc: 'Header & Footer Links', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
              { name: 'Hero Sliders', href: '/admin/slides', icon: Sliders, desc: 'Homepage Banners', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
              { name: 'Factory Photos', href: '/admin/factory-gallery', icon: Building2, desc: 'Machinery & Stitching', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
              { name: 'Certifications', href: '/admin/certifications', icon: ShieldCheck, desc: 'ISO, CE, Compliance', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
              { name: 'Media Library', href: '/admin/gallery', icon: ImageIcon, desc: 'Image Assets', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
              { name: 'Quotations & Invoices', href: '/admin/quotations', icon: FileSpreadsheet, desc: 'Proforma Generator', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { name: 'Payment Log', href: '/admin/payments', icon: CreditCard, desc: 'UTR & Advances', color: 'text-lime-400 bg-lime-500/10 border-lime-500/20' },
              { name: 'Content & Texts', href: '/admin/content', icon: Globe, desc: 'About & Factory Info', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
              { name: 'Company Settings', href: '/admin/settings', icon: Settings, desc: 'GST, Logo & Contact', color: 'text-slate-300 bg-slate-800 border-slate-700' },
              { name: 'Staff Users & Roles', href: '/admin/users', icon: Users, desc: 'RBAC Permissions', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
              { name: 'Audit Trail', href: '/admin/audit-logs', icon: History, desc: 'Security Event Logs', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
              { name: 'Backup & Restore', href: '/admin/backup', icon: Database, desc: 'Snapshots & CSV Export', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-xl hover:shadow-lg hover:shadow-amber-500/5 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{item.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Inbound Enquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-white font-serif">Recent B2B Quotation Requests</h2>
                <p className="text-[11px] text-slate-400">Incoming buyer requests from web forms, catalog pages, and WhatsApp</p>
              </div>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Enquiries ({stats.totalEnquiries})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No client quote enquiries found in database.
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 sm:px-6 hover:bg-slate-850/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-white font-bold text-sm">{enq.name}</strong>
                      <span className="text-amber-400 font-medium font-mono text-[11px]">({enq.company || 'Enterprise Buyer'})</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="text-slate-300">
                      <span className="text-slate-500 font-semibold">Requirement:</span>{' '}
                      <span className="font-medium text-slate-200">{enq.productRequirement}</span>{' '}
                      <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        Qty: {enq.quantity || 100} units
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                      <span>📧 {enq.email}</span>
                      <span>📞 {enq.mobile}</span>
                      {enq.deliveryLocation && <span>📍 {enq.deliveryLocation}</span>}
                    </div>
                  </div>

                  {/* Status & Quick Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => handleQuickStatus(enq.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                        enq.status === 'NEW'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : enq.status === 'CONTACTED'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : enq.status === 'QUOTED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="NEW" className="bg-slate-900 text-white">NEW</option>
                      <option value="CONTACTED" className="bg-slate-900 text-white">CONTACTED</option>
                      <option value="QUOTED" className="bg-slate-900 text-white">QUOTED</option>
                      <option value="CLOSED" className="bg-slate-900 text-white">CLOSED</option>
                    </select>

                    <Link
                      href={`/admin/enquiries?id=${enq.id}`}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="View Full Spec Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
