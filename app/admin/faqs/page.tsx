'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { FaqItem } from '@/lib/types';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Save, 
  X, 
  AlertCircle,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<Partial<FaqItem>>({
    question: '',
    answer: '',
    category: 'General',
    displayOrder: 1,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/admin/faqs')
      .then(async (res) => {
        if (res.ok && active) {
          const data = await res.json();
          setFaqs(data);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFaq.question || !currentFaq.answer) {
      setMessage({ type: 'error', text: 'Question and answer are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const isUpdate = !!currentFaq.id;
      const url = isUpdate ? `/api/admin/faqs/${currentFaq.id}` : '/api/admin/faqs';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFaq),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save FAQ');
      }

      setMessage({ type: 'success', text: `FAQ ${isUpdate ? 'updated' : 'created'} successfully!` });
      setIsEditing(false);
      setCurrentFaq({ question: '', answer: '', category: 'General', displayOrder: 1, isActive: true });
      fetchFaqs();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete FAQ: "${question}"?`)) return;

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'FAQ deleted successfully' });
        fetchFaqs();
      } else {
        throw new Error('Failed to delete FAQ');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleToggleActive = async (faq: FaqItem) => {
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      if (res.ok) {
        fetchFaqs();
      }
    } catch (err) {
      console.error('Failed to toggle FAQ active state:', err);
    }
  };

  const categories = Array.from(new Set(faqs.map((f) => f.category || 'General')));

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="faqs" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Frequently Asked Questions (FAQ) CMS</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage buyer FAQs for MOQ, sampling timelines, custom branding, and shipping logistics.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentFaq({
                question: '',
                answer: '',
                category: 'Ordering & MOQ',
                displayOrder: faqs.length + 1,
                isActive: true,
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
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

        {/* Search & Category Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search FAQs by question or answer keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="ALL">All FAQ Categories ({faqs.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({faqs.filter((f) => f.category === cat).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQs List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading FAQs catalog...
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-300">No FAQs match your search</p>
            <p className="text-xs text-slate-500">Add common questions to improve buyer confidence and SEO snippet rankings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {faq.category || 'General'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Order: #{faq.displayOrder}
                    </span>
                    <button
                      onClick={() => handleToggleActive(faq)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                        faq.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {faq.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{faq.isActive ? 'Active on Website' : 'Hidden / Draft'}</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug">{faq.question}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => {
                      setCurrentFaq(faq);
                      setIsEditing(true);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium"
                    title="Edit FAQ"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id, faq.question)}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-lg transition-colors text-xs flex items-center gap-1.5 font-medium"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {currentFaq.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Question (Prompt for buyers) *
                </label>
                <input
                  type="text"
                  required
                  value={currentFaq.question || ''}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                  placeholder="e.g., What is the MOQ for custom corporate backpacks?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={currentFaq.category || ''}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                    placeholder="e.g., Ordering & MOQ, Materials, Shipping"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={currentFaq.displayOrder || 1}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, displayOrder: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Answer (Detailed explanation) *
                </label>
                <textarea
                  required
                  rows={5}
                  value={currentFaq.answer || ''}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                  placeholder="Write clear, authoritative answer mentioning materials, turnaround, factory capabilities, etc."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveFaq"
                  checked={currentFaq.isActive !== false}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-800"
                />
                <label htmlFor="isActiveFaq" className="text-slate-300 font-medium cursor-pointer">
                  Active (Published immediately on public website and FAQ schema)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
