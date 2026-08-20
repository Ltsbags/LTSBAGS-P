'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { TestimonialItem } from '@/lib/types';
import { 
  Star, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Save, 
  X, 
  AlertCircle,
  Building2,
  ShieldCheck,
  User
} from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<TestimonialItem>>({
    name: '',
    role: 'Procurement Manager',
    company: '',
    content: '',
    rating: 5,
    source: 'Verified Customer',
    verificationStatus: 'VERIFIED',
    publishStatus: 'PUBLISHED',
    displayOrder: 1,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/admin/testimonials')
      .then(async (res) => {
        if (res.ok && active) {
          const data = await res.json();
          setTestimonials(data);
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
    if (!currentTestimonial.name || !currentTestimonial.company || (!currentTestimonial.content && !currentTestimonial.review)) {
      setMessage({ type: 'error', text: 'Name, Company, and Review Text are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const isUpdate = !!currentTestimonial.id;
      const url = isUpdate ? `/api/admin/testimonials/${currentTestimonial.id}` : '/api/admin/testimonials';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTestimonial),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save testimonial');
      }

      setMessage({ type: 'success', text: `Testimonial ${isUpdate ? 'updated' : 'created'} successfully!` });
      setIsEditing(false);
      setCurrentTestimonial({
        name: '',
        role: 'Procurement Manager',
        company: '',
        content: '',
        rating: 5,
        source: 'Verified Customer',
        verificationStatus: 'VERIFIED',
        publishStatus: 'PUBLISHED',
        displayOrder: 1,
        isActive: true,
      });
      fetchTestimonials();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${clientName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Testimonial deleted successfully' });
        fetchTestimonials();
      } else {
        throw new Error('Failed to delete testimonial');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const filtered = testimonials.filter((t) => {
    const s = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(s) ||
      t.company.toLowerCase().includes(s) ||
      (t.content && t.content.toLowerCase().includes(s)) ||
      (t.review && t.review.toLowerCase().includes(s))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="testimonials" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Star className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Client Reviews & Testimonials CMS</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage corporate buyer endorsements, verification badges, ratings, and institutional proof.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentTestimonial({
                name: '',
                role: 'Procurement Specialist',
                company: '',
                content: '',
                rating: 5,
                source: 'Verified Customer',
                verificationStatus: 'VERIFIED',
                publishStatus: 'PUBLISHED',
                displayOrder: testimonials.length + 1,
                isActive: true,
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Review</span>
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

        {/* Search */}
        <div className="relative bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500 absolute left-6 top-5" />
          <input
            type="text"
            placeholder="Search reviews by client name, corporate entity, or quote feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading client testimonials...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Star className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-300">No client reviews found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{item.name}</h3>
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                          {item.verificationStatus}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-medium">{item.role} • {item.company}</p>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{item.content || item.review}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-mono text-slate-500">
                    Source: {item.source} • Status: {item.publishStatus}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentTestimonial(item);
                        setIsEditing(true);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {currentTestimonial.id ? 'Edit Client Review' : 'Add New Client Review'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Buyer / Executive Name *</label>
                  <input
                    type="text"
                    required
                    value={currentTestimonial.name || ''}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={currentTestimonial.company || ''}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                    placeholder="e.g., Infosys Limited"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={currentTestimonial.role || ''}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                    placeholder="e.g., Procurement VP"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rating (1 to 5)</label>
                  <select
                    value={currentTestimonial.rating || 5}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Publish Status</label>
                  <select
                    value={currentTestimonial.publishStatus || 'PUBLISHED'}
                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, publishStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Review Feedback Content *</label>
                <textarea
                  required
                  rows={4}
                  value={currentTestimonial.content || currentTestimonial.review || ''}
                  onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value, review: e.target.value })}
                  placeholder="Details of bag batch ordered, quality rating, stitching, delivery timeline..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                />
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
                  <span>{saving ? 'Saving...' : 'Save Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
