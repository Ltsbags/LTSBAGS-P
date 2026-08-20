'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';
import { Product, Category, ProductSpecification } from '@/lib/types';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
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
  EyeOff
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([fetch('/api/products'), fetch('/api/categories')])
      .then(async ([pRes, cRes]) => {
        const pData = await pRes.json();
        const cData = await cRes.json();
        if (active) {
          setProducts(pData);
          setCategories(cData);
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

  const loadData = async () => {
    try {
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
      'wholesale supplier',
      'lts bags private limited',
      'oem odm bags'
    ].filter(Boolean).join(', ');

    const generatedAltText = `${name} custom manufactured by LTS BAGS PRIVATE LIMITED`;

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

  const handleUpdateGalleryImage = (index: number, value: string) => {
    const current = [...(editingProduct?.images || [])];
    current[index] = value;
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

    // Clean up empty images, features, specs
    const cleanedImages = (editingProduct.images || []).filter((img) => img.trim() !== '');
    const cleanedFeatures = (editingProduct.features || []).filter((f) => f.trim() !== '');
    const cleanedSpecs = (editingProduct.specifications || []).filter((s) => s.label.trim() !== '' || s.value.trim() !== '');

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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.materials.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-serif">Product Management</h1>
              <p className="text-slate-600 text-xs mt-1">
                Add, update, and publish custom bag models with gallery images, specifications, features, and auto SEO metadata.
              </p>
            </div>

            <button
              onClick={openNewModal}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title, material, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs outline-none bg-transparent"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-serif font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">MOQ</th>
                    <th className="p-4">Images</th>
                    <th className="p-4">SEO Slug</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No bag models found. Click &quot;Add New Product&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&q=80&w=200'}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <strong className="text-slate-900 font-bold block text-sm">{p.name}</strong>
                              <div className="flex items-center gap-2 mt-0.5">
                                {p.isFeatured && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                    Featured
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                                  {p.materials}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{p.categoryName || 'General'}</td>
                        <td className="p-4">
                          {p.status === 'INACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <EyeOff className="w-3 h-3 text-slate-400" /> Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Eye className="w-3 h-3 text-emerald-600" /> Active
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-amber-700">{p.moq} Units</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                            <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> {p.images?.length || 1}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">{p.slug}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Product & SEO"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
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

        </div>
      </main>

      {/* Product Add / Edit Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold font-serif">
                  {editingProduct.id ? 'Edit Product Specification & SEO' : 'Add New Product'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Basic Information */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 font-serif text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
                  <span>1. Basic Product Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Executive Tech Laptop Backpack"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Category *</label>
                    <select
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
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
                    <label className="block font-bold text-slate-700 mb-1">Product Status</label>
                    <select
                      value={editingProduct.status || 'ACTIVE'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="ACTIVE">Active (Published)</option>
                      <option value="INACTIVE">Inactive (Hidden)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Material</label>
                    <input
                      type="text"
                      value={editingProduct.materials || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g. 1680D Ballistic Nylon"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      value={editingProduct.moq || 100}
                      onChange={(e) => setEditingProduct({ ...editingProduct, moq: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 accent-amber-600"
                  />
                  <label htmlFor="isFeatured" className="font-bold text-slate-800 cursor-pointer">
                    Mark as Featured Product on Homepage
                  </label>
                </div>
              </div>

              {/* 2. Featured & Gallery Images */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-900 font-serif text-sm">
                    2. Product Images (Featured & Gallery)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-700" /> Add Gallery Image Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(editingProduct.images || ['']).map((imgUrl, idx) => (
                    <div key={idx} className="relative bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">
                          {idx === 0 ? '★ Featured Main Image *' : `Gallery Image #${idx + 1}`}
                        </span>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-50"
                            title="Remove Gallery Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <ImageUploader
                        value={imgUrl}
                        onChange={(url) => handleUpdateGalleryImage(idx, url)}
                        aspectRatio="square"
                        label=""
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Descriptions */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-slate-900 font-serif text-sm border-b border-slate-200 pb-2">
                  3. Product Descriptions
                </h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Description *</label>
                  <textarea
                    rows={2}
                    placeholder="Brief 2-line summary used in product cards and quotation previews..."
                    value={editingProduct.shortDesc || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Detailed Description</label>
                  <textarea
                    rows={4}
                    placeholder="Comprehensive explanation of design, compartments, materials, custom logo options, and factory warranty..."
                    value={editingProduct.fullDesc || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fullDesc: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* 4. Specifications & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Specifications */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 font-serif flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-amber-600" />
                      <span>Product Specifications</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="text-amber-700 hover:text-amber-800 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Spec Row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingProduct.specifications || []).map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          placeholder="Label (e.g. Dimensions)"
                          value={spec.label}
                          onChange={(e) => handleUpdateSpec(sIdx, 'label', e.target.value)}
                          className="w-1/2 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 45x30x16cm)"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(sIdx, 'value', e.target.value)}
                          className="w-1/2 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(sIdx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 font-serif flex items-center gap-1.5">
                      <ListPlus className="w-4 h-4 text-amber-600" />
                      <span>Product Key Features</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="text-amber-700 hover:text-amber-800 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(editingProduct.features || []).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          placeholder="Feature bullet point..."
                          value={feat}
                          onChange={(e) => handleUpdateFeature(fIdx, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIdx)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. SEO & Search Engine Optimization */}
              <div className="pt-4 border-t border-slate-200 space-y-4 bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm font-serif">
                    <Globe className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Product SEO & Metadata Configuration</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoSEO}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Auto SEO</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">SEO URL Slug</label>
                    <input
                      type="text"
                      placeholder="e.g. executive-tech-laptop-backpack"
                      value={editingProduct.slug || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">Image ALT Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Executive Tech Laptop Backpack custom manufactured by LTS BAGS"
                      value={editingProduct.imageAltText || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageAltText: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Meta Title</label>
                  <input
                    type="text"
                    placeholder="Title tag shown in Google search results..."
                    value={editingProduct.metaTitle || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metaTitle: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short 150-character search preview summary..."
                    value={editingProduct.metaDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metaDescription: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Meta Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g. laptop backpack, custom bag manufacturer, corporate gifts"
                    value={editingProduct.metaKeywords || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metaKeywords: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
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

