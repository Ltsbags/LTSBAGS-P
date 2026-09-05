'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  Layers, 
  MapPin, 
  Briefcase, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  TrendingUp, 
  ArrowUpRight,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  BarChart3,
  Sliders,
  Send,
  HelpCircle,
  MessageCircle,
  Phone
} from 'lucide-react';
import { SeoPage, PageStatus, PageType, QualityCheckResult, SeoLeadEvent } from '@/lib/programmatic-seo/types';

export default function AdminProgrammaticSeoPage() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    published: 0,
    approved: 0,
    review: 0,
    draft: 0,
    indexed: 0,
    noindexed: 0,
    avgScore: 0,
    duplicateAlerts: 0,
  });
  const [leadEvents, setLeadEvents] = useState<SeoLeadEvent[]>([]);
  const [metadata, setMetadata] = useState<any>({
    products: [],
    locations: [],
    industries: [],
    materials: [],
    applications: [],
  });

  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Page Generator State
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [genPageType, setGenPageType] = useState<PageType>('product_location');
  const [genProductId, setGenProductId] = useState('');
  const [genLocationId, setGenLocationId] = useState('');
  const [genIndustryId, setGenIndustryId] = useState('');
  const [genMaterialId, setGenMaterialId] = useState('');
  const [genApplicationId, setGenApplicationId] = useState('');
  const [genCustomSlug, setGenCustomSlug] = useState('');
  const [candidatePage, setCandidatePage] = useState<SeoPage | null>(null);
  const [generating, setGenerating] = useState(false);

  // Preview / Inspector Modal
  const [inspectPage, setInspectPage] = useState<SeoPage | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [pagesRes, leadsRes, metaRes] = await Promise.all([
        fetch('/api/admin/programmatic-seo'),
        fetch('/api/admin/programmatic-seo?action=leads'),
        fetch('/api/admin/programmatic-seo?action=meta'),
      ]);

      if (pagesRes.ok) {
        const d = await pagesRes.json();
        setPages(d.pages || []);
        if (d.stats) setStats(d.stats);
      }

      if (leadsRes.ok) {
        const l = await leadsRes.json();
        setLeadEvents(Array.isArray(l) ? l : []);
      }

      if (metaRes.ok) {
        const m = await metaRes.json();
        setMetadata(m);
        // Set initial select values
        if (m.products?.length) setGenProductId(m.products[0].id);
        if (m.locations?.length) setGenLocationId(m.locations[0].id);
        if (m.industries?.length) setGenIndustryId(m.industries[0].id);
        if (m.materials?.length) setGenMaterialId(m.materials[0].id);
        if (m.applications?.length) setGenApplicationId(m.applications[0].id);
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Failed to fetch SEO data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRunAudit = async () => {
    try {
      setAuditLoading(true);
      setFeedback(null);
      const res = await fetch('/api/admin/programmatic-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'audit' }),
      });

      if (!res.ok) throw new Error('Audit failed');
      const d = await res.json();
      setFeedback({ type: 'success', message: `Full Quality & Cannibalization audit completed across ${d.results?.length || 0} pages!` });
      fetchAllData();
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error running audit' });
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSeedCurated = async () => {
    try {
      setSeedLoading(true);
      setFeedback(null);
      const res = await fetch('/api/admin/programmatic-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed' }),
      });

      if (!res.ok) throw new Error('Seeding failed');
      const d = await res.json();
      setFeedback({ type: 'success', message: `Initialized ${d.addedCount || 0} verified high-intent programmatic landing pages!` });
      fetchAllData();
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error seeding pages' });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: PageStatus) => {
    try {
      const res = await fetch('/api/admin/programmatic-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      fetchAllData();
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error updating status' });
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to remove this programmatic landing page?')) return;
    try {
      const res = await fetch(`/api/admin/programmatic-seo?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete page');
      fetchAllData();
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Error deleting page' });
    }
  };

  const handleGeneratePreview = async () => {
    try {
      setGenerating(true);
      const payload: any = {
        page_type: genPageType,
        custom_slug: genCustomSlug || undefined,
      };

      if (genPageType === 'product_location') {
        payload.product_id = genProductId;
        payload.location_id = genLocationId;
      } else if (genPageType === 'product_industry') {
        payload.product_id = genProductId;
        payload.industry_id = genIndustryId;
      } else if (genPageType === 'product_material') {
        payload.product_id = genProductId;
        payload.material_id = genMaterialId;
      } else if (genPageType === 'product_application') {
        payload.product_id = genProductId;
        payload.application_id = genApplicationId;
      }

      const res = await fetch('/api/admin/programmatic-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', options: payload }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const d = await res.json();
      setCandidatePage(d.page);
    } catch (e: any) {
      alert(e.message || 'Failed to generate page');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveCandidate = async (status: PageStatus) => {
    if (!candidatePage) return;
    try {
      const toSave = { ...candidatePage, status };
      const res = await fetch('/api/admin/programmatic-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: toSave }),
      });

      if (!res.ok) throw new Error('Failed to save page');
      setShowGeneratorModal(false);
      setCandidatePage(null);
      setFeedback({ type: 'success', message: `Page "${toSave.h1}" saved as ${status}!` });
      fetchAllData();
    } catch (e: any) {
      alert(e.message || 'Error saving page');
    }
  };

  // Filtered pages
  const filteredPages = pages.filter((p) => {
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    if (filterType !== 'ALL' && p.page_type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.h1.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.seo_title.toLowerCase().includes(q) ||
        p.location_id?.toLowerCase().includes(q) ||
        p.industry_id?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      <AdminHeader activeTab="programmatic-seo" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                ENTERPRISE B2B PROGRAMMATIC SEO ENGINE
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                E-E-A-T & ANTI-SPAM PROTECTED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
              Programmatic SEO Landing Page Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Generate, audit, and approve high-conversion B2B commercial landing pages. Strictly respects Google helpful content guidelines with automated Jaccard duplicate detection, truthfulness checks, and automatic NOINDEX protection for thin pages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setCandidatePage(null);
                setShowGeneratorModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Page</span>
            </button>

            <button
              onClick={handleRunAudit}
              disabled={auditLoading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>{auditLoading ? 'Auditing...' : 'Run Audit'}</span>
            </button>

            <button
              onClick={handleSeedCurated}
              disabled={seedLoading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
              title="Ensure all default curated landing pages are seeded"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seed Curated</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Engine KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              Total Pages
              <Layers className="w-3.5 h-3.5 text-purple-400" />
            </span>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-[10px] text-slate-400">{stats.published} Published • {stats.draft} Draft</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              Google Indexable
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <div className="text-2xl font-black text-emerald-400">{stats.indexed}</div>
            <div className="text-[10px] text-slate-400">Meets 12-point Quality Gate</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              Protected NOINDEX
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <div className="text-2xl font-black text-amber-400">{stats.noindexed}</div>
            <div className="text-[10px] text-slate-400">Draft or thin content safe-guards</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              Avg Quality Score
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            </span>
            <div className="text-2xl font-black text-white">{stats.avgScore} / 100</div>
            <div className="text-[10px] text-emerald-400">Benchmark: 80+ for indexation</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              Duplicate Alerts
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </span>
            <div className="text-2xl font-black text-white">{stats.duplicateAlerts}</div>
            <div className="text-[10px] text-slate-400">Jaccard similarity &gt; 60%</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-semibold">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-slate-200 outline-none font-bold cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Statuses ({pages.length})</option>
                <option value="PUBLISHED" className="bg-slate-900">Published ({pages.filter(p => p.status === 'PUBLISHED').length})</option>
                <option value="APPROVED" className="bg-slate-900">Approved ({pages.filter(p => p.status === 'APPROVED').length})</option>
                <option value="REVIEW" className="bg-slate-900">Review ({pages.filter(p => p.status === 'REVIEW').length})</option>
                <option value="DRAFT" className="bg-slate-900">Draft ({pages.filter(p => p.status === 'DRAFT').length})</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
              <span className="text-slate-400 font-semibold">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-slate-200 outline-none font-bold cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Combination Types</option>
                <option value="product_location" className="bg-slate-900">Product + Location</option>
                <option value="product_industry" className="bg-slate-900">Product + Industry</option>
                <option value="product_material" className="bg-slate-900">Product + Material</option>
                <option value="product_application" className="bg-slate-900">Product + Application</option>
                <option value="manufacturing_service" className="bg-slate-900">Manufacturing Service</option>
              </select>
            </div>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search keyword, city, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Landing Page & H1</th>
                  <th className="py-3.5 px-4 font-bold">Combination Type</th>
                  <th className="py-3.5 px-4 font-bold">Quality Gate</th>
                  <th className="py-3.5 px-4 font-bold">Robots Index</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No programmatic SEO pages match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => {
                    const score = page.quality_score || 0;
                    const scoreColor =
                      score >= 85
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : score >= 70
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : 'text-red-400 bg-red-500/10 border-red-500/30';

                    return (
                      <tr key={page.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Title & Slug */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white max-w-sm sm:max-w-md truncate">
                            {page.h1}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] text-amber-400/90 truncate max-w-[260px]">
                              /{page.slug}
                            </span>
                            <a
                              href={`/${page.slug}`}
                              target="_blank"
                              className="text-slate-400 hover:text-white"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Combination Type */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300">
                            {page.page_type.replace('_', ' + ')}
                          </span>
                          {page.location_id && (
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-primary" />
                              <span className="capitalize">{page.location_id}</span>
                            </div>
                          )}
                        </td>

                        {/* Quality Gate Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${scoreColor}`}>
                              {score}/100
                            </span>
                            {page.duplicate_score >= 60 && (
                              <span
                                className="text-red-400 text-[10px] font-bold flex items-center gap-0.5"
                                title="High duplicate risk with existing pages"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                Dup {page.duplicate_score}%
                              </span>
                            )}
                          </div>
                          {page.quality_flags && page.quality_flags.length > 0 && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5" title={page.quality_flags.join(', ')}>
                              {page.quality_flags[0]}
                            </div>
                          )}
                        </td>

                        {/* Robots Index */}
                        <td className="py-3.5 px-4">
                          {page.robots_index && page.status === 'PUBLISHED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>INDEX</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold font-mono">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>NOINDEX</span>
                            </span>
                          )}
                        </td>

                        {/* Status Select */}
                        <td className="py-3.5 px-4">
                          <select
                            value={page.status}
                            onChange={(e) => handleUpdateStatus(page.id, e.target.value as PageStatus)}
                            className={`text-[11px] font-bold rounded px-2 py-1 outline-none border cursor-pointer ${
                              page.status === 'PUBLISHED'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                : page.status === 'APPROVED'
                                ? 'bg-sky-950/80 text-sky-300 border-sky-700'
                                : page.status === 'REVIEW'
                                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <option value="DRAFT">DRAFT</option>
                            <option value="REVIEW">REVIEW</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectPage(page)}
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                              title="Inspect Technical Specs & Quality"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePage(page.id)}
                              className="p-1.5 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                              title="Delete landing page"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Lead Events Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-white text-base">Real-Time Lead Attribution & Conversions</h2>
            </div>
            <span className="text-xs text-slate-400">
              Direct B2B Enquiry Tracking from Programmatic Pages
            </span>
          </div>

          {leadEvents.length === 0 ? (
            <div className="text-xs text-slate-500 py-4 text-center">
              No lead events logged yet. Clicks on &quot;Request Factory Quote&quot; and &quot;WhatsApp&quot; will appear here in real-time.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {leadEvents.map((evt) => (
                <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {evt.event_type.includes('whatsapp') ? (
                      <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : evt.event_type.includes('phone') ? (
                      <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-white capitalize">
                        {evt.event_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-slate-300 font-mono text-[11px]">/{evt.page_slug}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Generator Modal */}
      {showGeneratorModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Generate High-Intent Programmatic Page</h3>
              </div>
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Combination Type */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Combination Type:
                </label>
                <select
                  value={genPageType}
                  onChange={(e) => setGenPageType(e.target.value as PageType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-bold"
                >
                  <option value="product_location">Product + Location (e.g. Backpacks in Pune / Delhi)</option>
                  <option value="product_industry">Product + Industry (e.g. IT Corporate Bags / School Bags)</option>
                  <option value="product_material">Product + Material (e.g. Ballistic Nylon Backpacks)</option>
                  <option value="product_application">Product + Application (e.g. Bags for Conferences)</option>
                  <option value="manufacturing_service">Manufacturing Service (e.g. OEM / Private Label)</option>
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Product:</label>
                <select
                  value={genProductId}
                  onChange={(e) => setGenProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  {metadata.products?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Conditional Location */}
              {genPageType === 'product_location' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Commercial Location:</label>
                  <select
                    value={genLocationId}
                    onChange={(e) => setGenLocationId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {metadata.locations?.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city}, {loc.state} {loc.is_factory_hq ? '(Factory HQ)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Industry */}
              {genPageType === 'product_industry' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Target Industry:</label>
                  <select
                    value={genIndustryId}
                    onChange={(e) => setGenIndustryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {metadata.industries?.map((ind: any) => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Material */}
              {genPageType === 'product_material' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Material:</label>
                  <select
                    value={genMaterialId}
                    onChange={(e) => setGenMaterialId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {metadata.materials?.map((mat: any) => (
                      <option key={mat.id} value={mat.id}>{mat.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional Application */}
              {genPageType === 'product_application' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Select Application:</label>
                  <select
                    value={genApplicationId}
                    onChange={(e) => setGenApplicationId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {metadata.applications?.map((app: any) => (
                      <option key={app.id} value={app.id}>{app.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Slug */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Custom Slug (optional):</label>
                <input
                  type="text"
                  placeholder="Auto-generated based on combination if left blank"
                  value={genCustomSlug}
                  onChange={(e) => setGenCustomSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleGeneratePreview}
                disabled={generating}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                {generating ? 'Evaluating & Synthesizing...' : 'Generate Candidate & Check Quality Gate'}
              </button>

              {/* Candidate Preview & Quality Verdict */}
              {candidatePage && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm truncate">{candidatePage.h1}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                      candidatePage.quality_score >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      Score: {candidatePage.quality_score}/100
                    </span>
                  </div>

                  <div className="text-slate-300 space-y-1">
                    <p className="font-mono text-amber-400 text-[11px]">/{candidatePage.slug}</p>
                    <p className="text-slate-400 line-clamp-2">{candidatePage.meta_description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">
                      Indexable Verdict: <b className={candidatePage.robots_index ? 'text-emerald-400' : 'text-amber-400'}>
                        {candidatePage.robots_index ? 'QUALIFIED FOR INDEXING' : 'HEURISTIC NOINDEX'}
                      </b>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveCandidate('DRAFT')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                      >
                        Save as Draft
                      </button>
                      <button
                        onClick={() => handleSaveCandidate('PUBLISHED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        Approve & Publish
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Inspect Page Modal */}
      {inspectPage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{inspectPage.h1}</h3>
                <span className="text-xs font-mono text-amber-400">/{inspectPage.slug}</span>
              </div>
              <button
                onClick={() => setInspectPage(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 font-semibold block">SEO Title:</span>
                <p className="text-white font-medium">{inspectPage.seo_title}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Meta Description:</span>
                <p className="text-slate-300">{inspectPage.meta_description}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block">Introduction Paragraphs:</span>
                <div className="space-y-1.5 mt-1">
                  {inspectPage.intro_content?.map((para, i) => (
                    <p key={i} className="text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {inspectPage.location_content && (
                <div>
                  <span className="text-slate-400 font-semibold block">Truthful Location Note:</span>
                  <p className="text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    {inspectPage.location_content}
                  </p>
                </div>
              )}

              <div>
                <span className="text-slate-400 font-semibold block">Specifications:</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">MOQ:</span> <span className="font-bold text-white">{inspectPage.specifications?.moq}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">Sample:</span> <span className="font-bold text-white">{inspectPage.specifications?.sample_timeline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <a
                  href={`/${inspectPage.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold"
                >
                  <span>Visit Live Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setInspectPage(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
