'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { NavigationMenuConfig, NavigationMenuItem } from '@/lib/types';
import { 
  Compass, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Save, 
  X, 
  AlertCircle, 
  ExternalLink,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function AdminNavigationPage() {
  const [nav, setNav] = useState<NavigationMenuConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'quickLinks' | 'importantLinks'>('header');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNav = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/navigation');
      if (res.ok) {
        const data = await res.json();
        setNav(data);
      }
    } catch (err) {
      console.error('Failed to load navigation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/admin/navigation')
      .then(async (res) => {
        if (res.ok && active) {
          const data = await res.json();
          setNav(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getActiveList = (): NavigationMenuItem[] => {
    if (!nav) return [];
    if (activeTab === 'header') return nav.headerNav || [];
    if (activeTab === 'footer') return nav.footerNav || [];
    if (activeTab === 'quickLinks') return nav.quickLinks || [];
    return nav.importantLinks || [];
  };

  const updateActiveList = (newList: NavigationMenuItem[]) => {
    if (!nav) return;
    if (activeTab === 'header') setNav({ ...nav, headerNav: newList });
    else if (activeTab === 'footer') setNav({ ...nav, footerNav: newList });
    else if (activeTab === 'quickLinks') setNav({ ...nav, quickLinks: newList });
    else setNav({ ...nav, importantLinks: newList });
  };

  const handleAddItem = () => {
    const list = getActiveList();
    const newItem: NavigationMenuItem = {
      id: 'nav-' + Date.now(),
      label: 'New Menu Link',
      url: '/',
      displayOrder: list.length + 1,
      isEnabled: true,
    };
    updateActiveList([...list, newItem]);
  };

  const handleUpdateItem = (index: number, key: keyof NavigationMenuItem, value: any) => {
    const list = [...getActiveList()];
    list[index] = { ...list[index], [key]: value };
    updateActiveList(list);
  };

  const handleDeleteItem = (index: number) => {
    const list = getActiveList().filter((_, i) => i !== index);
    updateActiveList(list);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const list = [...getActiveList()];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // renumber display orders
    list.forEach((item, idx) => {
      item.displayOrder = idx + 1;
    });

    updateActiveList(list);
  };

  const handleSaveAll = async () => {
    if (!nav) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nav),
      });

      if (!res.ok) {
        throw new Error('Failed to save navigation menus');
      }

      setMessage({ type: 'success', text: 'Navigation menus saved and published successfully!' });
      fetchNav();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const currentItems = getActiveList();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="navigation" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Navigation Menus CMS</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure header main navigation, footer manufacturing categories, quick enquiry links, and legal menus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Menu Item</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
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
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('header')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'header'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Primary Header Menu ({nav?.headerNav?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'footer'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Footer Category Links ({nav?.footerNav?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('quickLinks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quickLinks'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Quick Actions & Downloads ({nav?.quickLinks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('importantLinks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'importantLinks'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Legal & Policies ({nav?.importantLinks?.length || 0})
          </button>
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading navigation structure...
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">Order</th>
                    <th className="py-3.5 px-4">Display Label</th>
                    <th className="py-3.5 px-4">Target URL / Route</th>
                    <th className="py-3.5 px-4 w-28 text-center">Status</th>
                    <th className="py-3.5 px-4 w-24 text-center">Reorder</th>
                    <th className="py-3.5 px-4 w-20 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentItems.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500 font-bold">
                        #{idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateItem(idx, 'label', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => handleUpdateItem(idx, 'url', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(idx, 'isEnabled', !item.isEnabled)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                            item.isEnabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {item.isEnabled ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, 'up')}
                            className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentItems.length - 1}
                            onClick={() => handleMove(idx, 'down')}
                            className="p-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
