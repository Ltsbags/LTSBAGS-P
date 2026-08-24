'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';
import ProductImageStudio from '@/components/ProductImageStudio';
import { Product, Category, ProcessedProductImage } from '@/lib/types';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy,
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Search,
  Globe,
  Image as ImageIcon,
  Wand2,
  ListPlus,
  Sliders,
  Check,
  Eye,
  EyeOff,
  Download,
  Filter,
  Tag,
  Sparkles,
  Star
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([fetch('/api/products'), fetch('/api/categories')])
      .then(async ([pRes, cRes]) => {
        if (!active) return;
        const pData = await pRes.json();
        const cData = await cRes.json();
        setProducts(pData);
        setCategories(cData);
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData);
      setCategories(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    const defaultCat = categories[0]?.id || '';
    setEditingProduct({
      name: '',
      slug: '',
      categoryId: defaultCat,
      images: ['https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000'],
      shortDesc: '',
      fullDesc: '',
      features: ['High-Grade Durable Material', 'EVA Shock-Proof Padding', 'Water-Resistant Finish'],
      materials: '1680D Ballistic Nylon',
      moq: 100,
      specifications: [
        { label: 'Capacity', value: '25 Liters' },
        { label: 'Dimensions', value: '45cm x 30cm x 16cm' },
        { label: 'Warranty', value: '1 Year Factory Warranty' },
      ],
      isFeatured: false,
      status: 'ACTIVE',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      imageAltText: '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct({
      ...product,
      images: product.images && product.images.length > 0 ? [...product.images] : [''],
      features: product.features && product.features.length > 0 ? [...product.features] : [''],
      specifications: product.specifications && product.specifications.length > 0 ? [...product.specifications] : [{ label: '', value: '' }],
      status: product.status || 'ACTIVE',
    });
    setError('');
    setModalOpen(true);
  };

  const handleDuplicate = async (id: string, name: string) => {
    try {
      setDuplicatingId(id);
      const res = await fetch(`/api/products/${id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to duplicate product');
      }
      setSuccessMsg(`Successfully cloned: "${data.product.name}"`);
      loadData();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      alert(err.message || 'Duplication failed');
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bag model?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setSuccessMsg('Product deleted successfully');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoSEO = () => {
    if (!editingProduct?.name) {
      setError('Please enter a Product Name first before generating Auto SEO.');
      return;
    }
    setError('');
    const name = editingProduct.name.trim();
    const cat = categories.find((c) => c.id === editingProduct.categoryId);
    const catName = cat?.name || 'Custom Bag';

    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const generatedMetaTitle = `${name} | Custom Bag Manufacturer | LTS BAGS`;

    const descSource = editingProduct.shortDesc || editingProduct.fullDesc || `Bulk custom manufacturer of ${name} with high quality materials, custom logo printing, and direct factory pricing.`;
    const generatedMetaDesc = descSource.length > 155 ? descSource.slice(0, 152) + '...' : descSource;

    const keywordsList = [
      name.toLowerCase(),
      catName.toLowerCase(),
      editingProduct.materials ? editingProduct.materials.toLowerCase() : '',
      'custom bag manufacturer',
      'wholesale supplier mumbai',
      'lts bags private limited',
      'b2b bulk bags'
    ].filter(Boolean).join(', ');

    const generatedAltText = `${name} manufactured by LTS BAGS Mumbai`;

    setEditingProduct((prev) => ({
      ...prev,
      slug: prev?.slug || generatedSlug,
      metaTitle: generatedMetaTitle,
      metaDescription: generatedMetaDesc,
      metaKeywords: keywordsList,
      imageAltText: generatedAltText,
    }));
  };

  // Gallery Image helpers
  const handleAddGalleryImage = () => {
    const current = editingProduct?.images || [];
    setEditingProduct({ ...editingProduct, images: [...current, ''] });
  };

  const handleUpdateGalleryImage = (index: number, value: string, processedItem?: ProcessedProductImage) => {
    const current = [...(editingProduct?.images || [])];
    current[index] = value;
    
    let updatedGalleryItems = [...(editingProduct?.galleryImages || [])];
    if (processedItem) {
      const existingIdx = updatedGalleryItems.findIndex((g) => g.id === processedItem.id);
      if (existingIdx >= 0) {
        updatedGalleryItems[existingIdx] = processedItem;
      } else {
        updatedGalleryItems.push(processedItem);
      }
    }

    setEditingProduct({ 
      ...editingProduct, 
      images: current,
      galleryImages: updatedGalleryItems.length > 0 ? updatedGalleryItems : editingProduct?.galleryImages,
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!editingProduct?.images || index === 0) return;
    const current = [...editingProduct.images];
    const target = current.splice(index, 1)[0];
    current.unshift(target);
    setEditingProduct({ ...editingProduct, images: current });
  };

  const handleRemoveGalleryImage = (index: number) => {
    const current = [...(editingProduct?.images || [])];
    if (current.length <= 1) {
      current[0] = '';
    } else {
      current.splice(index, 1);
    }
    setEditingProduct({ ...editingProduct, images: current });
  };

  // Specifications helpers
  const handleAddSpec = () => {
    const current = editingProduct?.specifications || [];
    setEditingProduct({ ...editingProduct, specifications: [...current, { label: '', value: '' }] });
  };

  const handleUpdateSpec = (index: number, field: 'label' | 'value', val: string) => {
    const current = [...(editingProduct?.specifications || [])];
    current[index] = { ...current[index], [field]: val };
    setEditingProduct({ ...editingProduct, specifications: current });
  };

  const handleRemoveSpec = (index: number) => {
    const current = [...(editingProduct?.specifications || [])];
    current.splice(index, 1);
    setEditingProduct({ ...editingProduct, specifications: current });
  };

  // Features helpers
  const handleAddFeature = () => {
    const current = editingProduct?.features || [];
    setEditingProduct({ ...editingProduct, features: [...current, ''] });
  };

  const handleUpdateFeature = (index: number, val: string) => {
    const current = [...(editingProduct?.features || [])];
    current[index] = val;
    setEditingProduct({ ...editingProduct, features: current });
  };

  const handleRemoveFeature = (index: number) => {
    const current = [...(editingProduct?.features || [])];
    current.splice(index, 1);
    setEditingProduct({ ...editingProduct, features: current });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.categoryId) {
      setError('Product Name and Category are required');
      return;
    }

    const cleanedImages = (editingProduct.images || []).filter((img) => img && img.trim() !== '');
    const cleanedFeatures = (editingProduct.features || []).filter((f) => f && f.trim() !== '');
    const cleanedSpecs = (editingProduct.specifications || []).filter((s) => (s.label && s.label.trim() !== '') || (s.value && s.value.trim() !== ''));

    const payload = {
      ...editingProduct,
      images: cleanedImages.length > 0 ? cleanedImages : ['https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=1000'],
      features: cleanedFeatures,
      specifications: cleanedSpecs,
    };

    setSaving(true);
    setError('');

    try {
      const isEdit = Boolean(editingProduct.id);
      const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSuccessMsg(isEdit ? 'Product updated successfully' : 'New product created successfully');
      setModalOpen(false);
      loadData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const s = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(s) ||
      p.materials.toLowerCase().includes(s) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(s)) ||
      (p.slug && p.slug.toLowerCase().includes(s));
    const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="products" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Package className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Product Catalog & Model CMS</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Add, update, clone, and publish custom bag models with specifications, MOQ, gallery photos, and auto SEO metadata.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/api/admin/export?type=products"
              download
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={openNewModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bag Model</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by title, materials, slug, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="ALL">All Categories ({products.length} models)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({products.filter((p) => p.categoryId === c.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="p-4">Bag Model & Specs</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">MOQ</th>
                  <th className="p-4">Images</th>
                  <th className="p-4">SEO Slug</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading product catalog...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No bag models found. Click &quot;Add Bag Model&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=200'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-950"
                          />
                          <div>
                            <strong className="text-white font-bold block text-sm">{p.name}</strong>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              {p.isFeatured && (
                                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-1.5 py-0.5 rounded">
                                  ★ Featured
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                {p.materials}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-300">{p.categoryName || 'General'}</td>
                      <td className="p-4">
                        {p.status === 'INACTIVE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            <EyeOff className="w-3 h-3 text-slate-500" /> Inactive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Eye className="w-3 h-3 text-emerald-400" /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-amber-400 font-mono">{p.moq} Units</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-semibold">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> {p.images?.length || 1}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500 truncate max-w-[150px]">{p.slug}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDuplicate(p.id, p.name)}
                            disabled={duplicatingId === p.id}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Duplicate Product & Specs"
                          >
                            <Copy className={`w-3.5 h-3.5 ${duplicatingId === p.id ? 'animate-spin text-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 bg-slate-800 hover:bg-sky-600/80 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Edit Product & SEO"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Product Add / Edit Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold font-serif">
                  {editingProduct.id ? 'Edit Bag Model Specification & SEO' : 'Add New Bag Model'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Basic Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-white font-serif text-sm border-b border-slate-800 pb-2">
                  1. Basic Product Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Executive Tech Laptop Backpack"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Product Category *</label>
                    <select
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Product Status</label>
                    <select
                      value={editingProduct.status || 'ACTIVE'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="ACTIVE">Active (Published)</option>
                      <option value="INACTIVE">Inactive (Hidden)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Primary Material</label>
                    <input
                      type="text"
                      value={editingProduct.materials || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g. 1680D Ballistic Nylon"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      value={editingProduct.moq || 100}
                      onChange={(e) => setEditingProduct({ ...editingProduct, moq: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-800"
                  />
                  <label htmlFor="isFeatured" className="font-bold text-slate-300 cursor-pointer">
                    Mark as Featured Model on Homepage & B2B Catalogs
                  </label>
                </div>
              </div>

              {/* 2. Featured & Gallery Images with AI Studio */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white font-serif text-sm">
                        2. AI Product Images & Studio (Master & Gallery)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Automatic background removal, 2000px upscaling, edge matting & transparent WebP
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1 border border-amber-500/30 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Gallery Image Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(editingProduct.images || ['']).map((imgUrl, idx) => (
                    <div key={idx} className="relative bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {idx === 0 ? (
                            <span className="font-black text-xs text-amber-300 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              Primary Featured Image
                            </span>
                          ) : (
                            <span className="font-bold text-xs text-slate-300">
                              Gallery Image #{idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {idx > 0 && imgUrl && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-amber-400 hover:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
                              title="Set as Main Featured Image"
                            >
                              Make Main
                            </button>
                          )}
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-950/40"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <ProductImageStudio
                        value={imgUrl}
                        imageItem={editingProduct.galleryImages?.[idx]}
                        onChange={(url, processed) => handleUpdateGalleryImage(idx, url, processed)}
                        onRemove={idx > 0 ? () => handleRemoveGalleryImage(idx) : undefined}
                        productName={editingProduct.name || 'B2B Bag'}
                        categoryName={editingProduct.categoryName || 'Custom Bags'}
                        isPrimary={idx === 0}
                        label={idx === 0 ? 'Master Product Shot' : `Angle #${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Descriptions */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-white font-serif text-sm border-b border-slate-800 pb-2">
                  3. Product Descriptions
                </h3>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Short Description *</label>
                  <textarea
                    rows={2}
                    placeholder="Brief 2-line summary used in product cards and quotation previews..."
                    value={editingProduct.shortDesc || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Detailed Description</label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive explanation of design, compartments, materials, custom logo options, and factory warranty..."
                    value={editingProduct.fullDesc || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fullDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 4. Specifications & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Specifications */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white font-serif flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>Product Specifications</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Spec
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingProduct.specifications || []).map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input
                          type="text"
                          placeholder="Label (e.g. Dimensions)"
                          value={spec.label}
                          onChange={(e) => handleUpdateSpec(sIdx, 'label', e.target.value)}
                          className="w-1/2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 45x30x16cm)"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(sIdx, 'value', e.target.value)}
                          className="w-1/2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(sIdx)}
                          className="p-1 text-red-400 hover:bg-red-950/40 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-white font-serif flex items-center gap-1.5">
                      <ListPlus className="w-4 h-4 text-amber-400" />
                      <span>Product Key Features</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingProduct.features || []).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Feature bullet point..."
                          value={feat}
                          onChange={(e) => handleUpdateFeature(fIdx, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIdx)}
                          className="p-1 text-red-400 hover:bg-red-950/40 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. SEO & Search Engine Optimization */}
              <div className="pt-4 border-t border-slate-800 space-y-4 bg-amber-500/5 p-4 sm:p-5 rounded-2xl border border-amber-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm font-serif">
                    <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Product SEO & Metadata Configuration</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoSEO}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Auto SEO</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">SEO URL Slug</label>
                    <input
                      type="text"
                      placeholder="e.g. executive-tech-laptop-backpack"
                      value={editingProduct.slug || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Image ALT Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Executive Tech Laptop Backpack custom manufactured by LTS BAGS"
                      value={editingProduct.imageAltText || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageAltText: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Meta Title</label>
                  <input
                    type="text"
                    placeholder="Title tag shown in Google search results..."
                    value={editingProduct.metaTitle || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metaTitle: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short 150-character search preview summary..."
                    value={editingProduct.metaDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metaDescription: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Meta Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g. laptop backpack, custom bag manufacturer, corporate gifts"
                    value={editingProduct.metaKeywords || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metaKeywords: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
