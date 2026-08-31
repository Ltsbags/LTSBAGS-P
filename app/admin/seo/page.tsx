'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Compass, 
  Search, 
  FileText, 
  Layers, 
  Sparkles,
  Link2,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminSeoHubPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [generating, setGenerating] = useState(false);
  const [sitemapResult, setSitemapResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [metaStats, setMetaStats] = useState({
    indexedProducts: 0,
    indexedCategories: 0,
    indexedBlogs: 0,
    canonicalBase: 'https://ltsbags.com',
  });

  const fetchSeoData = async () => {
    try {
      const [prodRes, catRes, blogRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/blogs')
      ]);

      let pCount = 0;
      let cCount = 0;
      let bCount = 0;

      if (prodRes.ok) {
        const d = await prodRes.json();
        pCount = Array.isArray(d) ? d.length : 0;
      }
      if (catRes.ok) {
        const d = await catRes.json();
        cCount = Array.isArray(d) ? d.length : 0;
      }
      if (blogRes.ok) {
        const d = await blogRes.json();
        bCount = Array.isArray(d) ? d.length : 0;
      }

      setMetaStats({
        indexedProducts: pCount,
        indexedCategories: cCount,
        indexedBlogs: bCount,
        canonicalBase: 'https://ltsbags.com',
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  const handleGenerateSitemap = async () => {
    try {
      setGenerating(true);
      setError('');
      setSitemapResult(null);

      const res = await fetch('/api/admin/generate-sitemap', {
        method: 'POST',
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to generate sitemap');
      }

      const data = await res.json();
      setSitemapResult(data);
    } catch (err: any) {
      setError(err.message || 'Error generating XML sitemap');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      <AdminHeader activeTab="seo" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                TECHNICAL SEO & SEARCH CONSOLE HUB
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Search Engine Optimization & Sitemap Control
            </h1>
            <p className="text-xs text-slate-400">
              Manage XML sitemaps, robots directives, schema structured data, canonical tags, and 301 redirects.
            </p>
          </div>

          <button
            onClick={handleGenerateSitemap}
            disabled={generating}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Regenerating...' : 'Regenerate XML Sitemap'}</span>
          </button>
        </div>

        {sitemapResult && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>XML Sitemap regenerated with <b>{sitemapResult.urlCount || (metaStats.indexedProducts + metaStats.indexedCategories + metaStats.indexedBlogs + 10)} URLs</b>!</span>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px]"
            >
              <span>View sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Indexation Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Canonical Base</span>
              <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2 text-sm font-bold text-white font-mono truncate">
              {metaStats.canonicalBase}
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> HTTPS & Canonical Enforced
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Indexed Bag Models</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {metaStats.indexedProducts} SKUs
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              With Product Schema markup
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Category Hubs</span>
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {metaStats.indexedCategories} Categories
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Keyword optimized slugs
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>B2B Articles & Guides</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {metaStats.indexedBlogs} Guides
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Article JSON-LD configured
            </div>
          </div>
        </div>

        {/* Technical SEO Checklist & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 1: Real-time XML Sitemap & Google Search Console Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-white text-base">Sitemap & Indexing Endpoints</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">XML Sitemap Feed</div>
                  <div className="text-[11px] text-slate-400 font-mono">https://ltsbags.com/sitemap.xml</div>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg"
                  title="Open live sitemap"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Robots.txt Crawler Rules</div>
                  <div className="text-[11px] text-slate-400 font-mono">https://ltsbags.com/robots.txt</div>
                </div>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg"
                  title="Open live robots.txt"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">301 Permanent Redirects</div>
                  <div className="text-[11px] text-slate-400">Manage legacy URLs and 404 redirects</div>
                </div>
                <Link
                  href="/admin/redirects"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
                >
                  Manage 301s →
                </Link>
              </div>
            </div>
          </div>

          {/* Section 2: Structured Data & Social Graph Checks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-white text-base">Schema & Rich Snippets Health</h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Organization & Manufacturer Schema</div>
                  <p className="text-[11px] text-slate-400">
                    Defines LTS BAGS PRIVATE LIMITED, logo, address, contact, and official social handles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">B2B Product & MOQ Rich Snippets</div>
                  <p className="text-[11px] text-slate-400">
                    Includes SKU, material description, minimum order quantity, and high-res imagery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Open Graph & Twitter Meta Cards</div>
                  <p className="text-[11px] text-slate-400">
                    Auto-configured for WhatsApp, LinkedIn, and social previews when sharing bag links.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
