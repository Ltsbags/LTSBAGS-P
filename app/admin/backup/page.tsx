'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { 
  Database, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileJson,
  Package,
  Layers,
  MessageSquare,
  FileText,
  Star,
  HelpCircle
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminBackupPage() {
  const { user } = useAdminAuth({ requireAuth: true, requiredRole: 'SUPER_ADMIN' });
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreJson, setRestoreJson] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadBackup = async () => {
    try {
      setDownloading(true);
      setMessage(null);
      const res = await fetch('/api/admin/backup');
      if (!res.ok) throw new Error('Failed to generate system backup snapshot');

      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ltsbags-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'Full database snapshot JSON downloaded successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Download failed' });
    } finally {
      setDownloading(false);
    }
  };

  const handleRestoreBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreJson.trim()) {
      setMessage({ type: 'error', text: 'Please paste valid JSON backup data to restore.' });
      return;
    }

    if (!confirm('WARNING: Restoring will overwrite current products, categories, blogs, FAQs, reviews, and settings. Proceed?')) {
      return;
    }

    try {
      setRestoring(true);
      setMessage(null);

      const parsed = JSON.parse(restoreJson);

      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupData: parsed }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Restore failed');
      }

      setMessage({ type: 'success', text: 'Database restored successfully! All records have been updated.' });
      setRestoreJson('');
    } catch (err: any) {
      setMessage({ type: 'error', text: `Restore failed: ${err.message}` });
    } finally {
      setRestoring(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setRestoreJson(text);
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const exportTypes = [
    { type: 'products', name: 'Products & SKUs', desc: 'Catalog, MOQ, pricing, materials, SEO tags', icon: Package },
    { type: 'categories', name: 'Categories', desc: 'Category names, slugs, icons, parent groups', icon: Layers },
    { type: 'enquiries', name: 'RFQ Enquiries & Quotes', desc: 'Buyer contacts, quantities, specs, status', icon: MessageSquare },
    { type: 'blogs', name: 'B2B Blog Articles', desc: 'Guides, articles, meta titles, publish dates', icon: FileText },
    { type: 'faqs', name: 'FAQs', desc: 'Frequently asked questions, categories, answers', icon: HelpCircle },
    { type: 'testimonials', name: 'Client Reviews', desc: 'Client names, corporate entities, star ratings', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="backup" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Data Backup, Restore & CSV Exports</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Download complete database snapshots, restore from JSON points, or export spreadsheets for ERP/Excel.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Section 1: CSV Exports for Excel / Operations */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> 1. Excel / CSV Spreadsheets Export
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span>{item.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>

                  <a
                    href={`/api/admin/export?type=${item.type}`}
                    download
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download {item.name} CSV</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Full System JSON Snapshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          
          {/* Download Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <FileJson className="w-5 h-5 text-amber-400" />
              <span>Full System Snapshot (JSON)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Downloads the entire database including all catalog products, images, categories, enquiries, blogs, SEO metadata, users, FAQs, reviews, and factory settings as a single portable JSON file.
            </p>

            <button
              onClick={handleDownloadBackup}
              disabled={downloading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generating Snapshot...' : 'Download Complete Backup JSON'}</span>
            </button>
          </div>

          {/* Restore Snapshot */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Upload className="w-5 h-5 text-red-400" />
              <span>Restore Database Snapshot</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload or paste a previous JSON backup to restore all tables. This action writes directly to the local master database.
            </p>

            <form onSubmit={handleRestoreBackup} className="space-y-3 text-xs">
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <textarea
                rows={3}
                value={restoreJson}
                onChange={(e) => setRestoreJson(e.target.value)}
                placeholder="Or paste JSON backup string here..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[10px] outline-none focus:ring-2 focus:ring-red-500"
              />

              <button
                type="submit"
                disabled={restoring || !restoreJson}
                className="w-full bg-red-900/60 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all border border-red-800 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{restoring ? 'Restoring Master DB...' : 'Restore & Overwrite Database'}</span>
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
}
