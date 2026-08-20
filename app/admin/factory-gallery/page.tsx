'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { FactoryGalleryItem, FactoryDepartment } from '@/lib/types';
import { 
  Factory, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Layers, 
  ExternalLink,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const DEPARTMENTS: FactoryDepartment[] = [
  'Factory Exterior',
  'Factory Interior',
  'Cutting Department',
  'Stitching Department',
  'Printing Department',
  'Embroidery Department',
  'Quality Control',
  'Packaging',
  'Warehouse',
  'Finished Goods',
  'Dispatch',
  'Machinery',
];

export default function AdminFactoryGalleryPage() {
  const [items, setItems] = useState<FactoryGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [editingItem, setEditingItem] = useState<FactoryGalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState<{
    id?: string;
    imageUrl: string;
    department: FactoryDepartment;
    caption: string;
    altText: string;
    displayOrder: number;
    isActive: boolean;
  }>({
    imageUrl: '',
    department: 'Cutting Department',
    caption: '',
    altText: '',
    displayOrder: 1,
    isActive: true,
  });

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetch('/api/factory-gallery');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to load factory gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/factory-gallery')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load factory gallery:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      imageUrl: '',
      department: selectedDept !== 'ALL' ? (selectedDept as FactoryDepartment) : 'Cutting Department',
      caption: '',
      altText: '',
      displayOrder: items.length + 1,
      isActive: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: FactoryGalleryItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      imageUrl: item.imageUrl,
      department: item.department,
      caption: item.caption,
      altText: item.altText,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, caption: string) => {
    if (!confirm(`Are you sure you want to delete this factory photo: "${caption}"?`)) return;
    try {
      const res = await fetch(`/api/factory-gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setSuccessMsg('Photo removed successfully');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const handleToggleActive = async (item: FactoryGalleryItem) => {
    try {
      const updated = { ...item, isActive: !item.isActive };
      const res = await fetch(`/api/factory-gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl || !formData.caption) {
      setError('Please provide both an Image URL and Caption');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const endpoint = formData.id ? `/api/factory-gallery/${formData.id}` : '/api/factory-gallery';
      const method = formData.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save factory image');
      }

      await loadGallery();
      setIsModalOpen(false);
      setSuccessMsg(formData.id ? 'Photo updated successfully!' : 'New factory photo added!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving photo');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedDept === 'ALL') return true;
    return item.department.toLowerCase() === selectedDept.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="gallery" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
                <Factory className="w-4 h-4" />
                <span>Manufacturing Plant Trust Verification</span>
              </div>
              <h1 className="text-2xl font-black text-white font-serif">
                Real Factory & Department Gallery
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Manage high-resolution verified photographs for all 12 manufacturing departments (Cutting, Stitching, QC, Printing, Warehouse, Dispatch).
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all text-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Factory Photo</span>
            </button>
          </div>

          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            <button
              onClick={() => setSelectedDept('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedDept === 'ALL'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Departments ({items.length})
            </button>
            {DEPARTMENTS.map((dept) => {
              const count = items.filter((i) => i.department.toLowerCase() === dept.toLowerCase()).length;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedDept.toLowerCase() === dept.toLowerCase()
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>

          {/* Photo Cards Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
              Loading factory photo archive...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No Photos In This Department</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Upload real photos of your facility, machinery, or artisans to showcase authentic B2B manufacturing capability.
              </p>
              <button
                onClick={openCreateModal}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Upload First Photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                    item.isActive ? 'border-slate-800 hover:border-sky-500/50 shadow-sm' : 'border-red-900/40 opacity-70'
                  }`}
                >
                  <div className="relative aspect-4/3 bg-slate-950 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.altText || item.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <span className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-xs text-sky-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-slate-800">
                      {item.department}
                    </span>

                    <span className="absolute top-2 right-2 bg-slate-950/85 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-800">
                      Order: #{item.displayOrder}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-200 font-medium leading-snug line-clamp-2">
                        {item.caption}
                      </p>
                      {item.altText && (
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          Alt: {item.altText}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border font-medium ${
                          item.isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/80'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                        title={item.isActive ? 'Visible on website' : 'Hidden from website'}
                      >
                        {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{item.isActive ? 'Active' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.caption)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Factory className="w-4 h-4 text-sky-400" />
                <span>{editingItem ? 'Edit Factory Photo' : 'Add New Factory Photo'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Department */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Department / Section <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value as FactoryDepartment })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-sky-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Image URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or uploaded URL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-sky-500"
                  required
                />
              </div>

              {/* Preview */}
              {formData.imageUrl && (
                <div className="aspect-16/9 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Department Caption & Technical Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Automated CNC multi-ply fabric cutter ensuring millimeter-precision across bulk backpack runs."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-sky-500"
                  required
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  SEO Alt Text (Accessibility & Image SEO)
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="e.g. Automated fabric cutting machine at LTS Bags Mumbai manufacturing unit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              {/* Display Order & Active status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-sky-500 rounded bg-slate-950 border-slate-800"
                    />
                    <span>Active on Website</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Photo' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
