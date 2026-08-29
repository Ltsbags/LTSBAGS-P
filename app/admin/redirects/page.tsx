'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { RedirectRule } from '@/lib/types';
import { 
  Compass, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  Search,
  Activity
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function RedirectsAdminPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<RedirectRule | null>(null);
  const [formData, setFormData] = useState<Partial<RedirectRule>>({
    sourceUrl: '',
    targetUrl: '',
    statusCode: 301,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/redirects');
      if (res.ok) {
        const data = await res.json();
        setRedirects(data.redirects || []);
      }
    } catch (err) {
      console.error('Failed to load redirects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleOpenCreate = () => {
    setEditingRedirect(null);
    setFormData({
      sourceUrl: '',
      targetUrl: '',
      statusCode: 301,
      isActive: true,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: RedirectRule) => {
    setEditingRedirect(item);
    setFormData({ ...item });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceUrl || !formData.targetUrl) {
      setErrorMsg('Source URL and Target URL are required');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingRedirect?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save redirect rule');
      }

      setSuccessMsg(`Redirect rule ${editingRedirect ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        setShowModal(false);
        fetchRedirects();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, source: string) => {
    if (!confirm(`Are you sure you want to delete redirect for "${source}"?`)) return;

    try {
      const res = await fetch(`/api/admin/redirects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRedirects((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert('Failed to delete redirect');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete redirect');
    }
  };

  const filteredRedirects = redirects.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.sourceUrl.toLowerCase().includes(q) || r.targetUrl.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="redirects" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>SEO Routing & URL Migrations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-serif">301 / 302 Redirect Manager</h1>
            <p className="text-xs text-slate-400 mt-1">
              Prevent 404 broken links, migrate legacy product URLs, preserve search engine ranking equity, and monitor hit counts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Redirect Rule</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search source or target paths..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 pl-10 pr-4 py-2 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Total Rules: <span className="text-white font-bold">{filteredRedirects.length}</span>
          </div>
        </div>

        {/* Redirects Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading redirect rules...</div>
          ) : filteredRedirects.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Compass className="w-12 h-12 mx-auto text-slate-600" />
              <div className="text-slate-300 font-bold text-sm">No redirect rules defined</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create 301 redirects to forward old website links directly to updated product categories.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Source Path (Old URL)</th>
                    <th className="py-3.5 px-4 font-bold text-center">Type</th>
                    <th className="py-3.5 px-4 font-bold">Target Path (New Destination)</th>
                    <th className="py-3.5 px-4 font-bold text-center">Hits</th>
                    <th className="py-3.5 px-4 font-bold text-center">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRedirects.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {r.sourceUrl}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          r.statusCode === 301 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {r.statusCode === 301 ? '301 PERMANENT' : '302 TEMPORARY'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{r.targetUrl}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                        <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-[11px]">
                          {r.hitCount || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {r.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                            title="Edit Rule"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id, r.sourceUrl)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white font-serif mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>{editingRedirect ? 'Edit Redirect Rule' : 'Create 301/302 URL Redirect'}</span>
              </h2>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Source URL (Incoming Request Path) *</label>
                  <input
                    type="text"
                    required
                    value={formData.sourceUrl || ''}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="e.g. /old-school-backpacks or /products/bag-123"
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Relative path starting with / or external URL</span>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Destination URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.targetUrl || ''}
                    onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                    placeholder="e.g. /categories/school-bags or /products/lts-matrix-executive-backpack"
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">HTTP Status Code</label>
                    <select
                      value={formData.statusCode || 301}
                      onChange={(e) => setFormData({ ...formData, statusCode: Number(e.target.value) as any })}
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value={301}>301 - Moved Permanently (Recommended for SEO)</option>
                      <option value={302}>302 - Found / Temporary Redirect</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive !== false}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Active Rule</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingRedirect ? 'Update Rule' : 'Create Rule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
