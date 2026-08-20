'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';
import { Blog } from '@/lib/types';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setBlogs(data);
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

  const loadBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openNewModal = () => {
    setEditingBlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000',
      author: 'ApexBags Editorial',
      category: 'Material Sourcing',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog({ ...blog });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
        setSuccessMsg('Blog deleted');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.content) {
      setError('Title and Content are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const isEdit = Boolean(editingBlog.id);
      const url = isEdit ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save blog');
      }

      setSuccessMsg(isEdit ? 'Blog post updated' : 'Blog post created');
      setModalOpen(false);
      loadBlogs();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">Blog Management</h1>
              <p className="text-slate-600 text-xs mt-1">
                Publish B2B bag manufacturing guides, material articles, and SEO content.
              </p>
            </div>

            <button
              onClick={openNewModal}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blog Post</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <p className="text-xs text-slate-500">Loading blog posts...</p>
            ) : (
              blogs.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
                      <img src={b.image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      {b.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base font-serif">{b.title}</h3>
                    <p className="text-slate-600 text-xs line-clamp-2">{b.excerpt}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      By {b.author}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Article & SEO"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>

      {/* Blog Modal */}
      {modalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif">
                {editingBlog.id ? 'Edit Article & Article Schema SEO' : 'Create Blog Post'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingBlog.category || 'Material Sourcing'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={editingBlog.author || 'ApexBags Editorial'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <ImageUploader
                label="Article Cover Image"
                value={editingBlog.image || ''}
                onChange={(url) => setEditingBlog({ ...editingBlog, image: url })}
                aspectRatio="video"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Article Body Content *</label>
                <textarea
                  required
                  rows={6}
                  value={editingBlog.content || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                />
              </div>

              {/* SEO FIELDS */}
              <div className="pt-3 border-t border-slate-200 space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                  <Globe className="w-4 h-4 text-amber-700" />
                  <span>Blog SEO Metadata</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SEO URL Slug</label>
                  <input
                    type="text"
                    value={editingBlog.slug || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={editingBlog.metaTitle || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, metaTitle: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={editingBlog.metaDescription || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, metaDescription: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Publish Article'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
