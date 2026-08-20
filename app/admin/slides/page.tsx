'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { HeroSlide } from '@/lib/types';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  Send,
  Save,
  RefreshCw,
} from 'lucide-react';

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [previewModalSlide, setPreviewModalSlide] = useState<HeroSlide | null>(null);

  // Form Fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [badgeText, setBadgeText] = useState<string>('');
  const [buttonText, setButtonText] = useState<string>('Request Bulk Quote');
  const [buttonUrl, setButtonUrl] = useState<string>('/contact');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Drag & drop upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification helper
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Fetch all slides
  const fetchSlides = useCallback(async () => {
    try {
      const res = await fetch('/api/slides');
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error('Failed to load slides:', err);
      showNotification('error', 'Failed to load slides.');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let active = true;
    fetch('/api/slides')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active && Array.isArray(data)) {
          setSlides(data);
        }
      })
      .catch((err) => {
        if (active) {
          console.error('Failed to load slides:', err);
          showNotification('error', 'Failed to load slides.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [showNotification]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingSlide(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setBadgeText('ISO 9001:2015 CERTIFIED PLANT');
    setButtonText('Request Bulk Quote');
    setButtonUrl('/contact');
    setDisplayOrder(slides.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setDescription(slide.description);
    setImageUrl(slide.imageUrl);
    setBadgeText(slide.badgeText || '');
    setButtonText(slide.buttonText);
    setButtonUrl(slide.buttonUrl);
    setDisplayOrder(slide.displayOrder);
    setIsActive(slide.isActive);
    setIsModalOpen(true);
  };

  // Upload image handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        showNotification('success', 'Image uploaded successfully!');
      } else {
        showNotification('error', data.error || 'Image upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showNotification('error', 'Failed to upload image file.');
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save / Update Slide
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification('error', 'Slide title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      showNotification('error', 'Slide image is required.');
      return;
    }

    const payload = {
      title,
      description,
      imageUrl,
      badgeText,
      buttonText,
      buttonUrl,
      displayOrder: Number(displayOrder),
      isActive,
    };

    try {
      if (editingSlide) {
        // Update
        const res = await fetch(`/api/slides/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showNotification('success', 'Slide updated successfully!');
          setIsModalOpen(false);
          fetchSlides();
        } else {
          const errData = await res.json();
          showNotification('error', errData.error || 'Failed to update slide.');
        }
      } else {
        // Create
        const res = await fetch('/api/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showNotification('success', 'New slide created successfully!');
          setIsModalOpen(false);
          fetchSlides();
        } else {
          const errData = await res.json();
          showNotification('error', errData.error || 'Failed to create slide.');
        }
      }
    } catch (err) {
      console.error('Save slide error:', err);
      showNotification('error', 'An error occurred while saving.');
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slide.isActive }),
      });

      if (res.ok) {
        showNotification(
          'success',
          `Slide "${slide.title.substring(0, 25)}..." is now ${!slide.isActive ? 'Active' : 'Inactive'}.`
        );
        fetchSlides();
      } else {
        showNotification('error', 'Failed to update slide status.');
      }
    } catch (err) {
      console.error('Toggle error:', err);
      showNotification('error', 'Failed to toggle slide status.');
    }
  };

  // Delete Slide
  const handleDeleteSlide = async (id: string, titleText: string) => {
    if (!confirm(`Are you sure you want to delete slide "${titleText}"?`)) return;

    try {
      const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('success', 'Slide deleted successfully.');
        fetchSlides();
      } else {
        showNotification('error', 'Failed to delete slide.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('error', 'Failed to delete slide.');
    }
  };

  // Move slide up or down
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSlides = [...slides];
    
    // Swap displayOrder values
    const tempOrder = updatedSlides[index].displayOrder;
    updatedSlides[index].displayOrder = updatedSlides[targetIndex].displayOrder;
    updatedSlides[targetIndex].displayOrder = tempOrder;

    const reorderPayload = [
      { id: updatedSlides[index].id, displayOrder: updatedSlides[index].displayOrder },
      { id: updatedSlides[targetIndex].id, displayOrder: updatedSlides[targetIndex].displayOrder },
    ];

    try {
      const res = await fetch('/api/slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: reorderPayload }),
      });

      if (res.ok) {
        showNotification('success', 'Slide order updated!');
        fetchSlides();
      } else {
        showNotification('error', 'Failed to update order.');
      }
    } catch (err) {
      console.error('Reorder error:', err);
      showNotification('error', 'Failed to update slide order.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="slides" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider mb-1 font-bold">
              <Sliders className="w-4 h-4" />
              <span>Homepage Hero Slider Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Manage Hero Slides
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Add, edit, reorder, or toggle slides displayed on the website homepage hero slider.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSlides}
              type="button"
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Refresh slides list"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleOpenAddModal}
              type="button"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Slide</span>
            </button>
          </div>
        </div>

        {/* Notifications Toast */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium shadow-lg animate-in fade-in duration-200 ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-200'
                : 'bg-rose-950/80 border-rose-800/80 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Slides List Table / Cards */}
        {loading ? (
          <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm">Loading hero slides...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">No Slides Found</h3>
              <p className="text-slate-400 text-sm">
                Create your first homepage hero slide to highlight corporate bags, bulk manufacturing capabilities, or offers.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              type="button"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2 text-sm shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Slide</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 px-2">
              <span>All Slides ({slides.length})</span>
              <span>Active: {slides.filter((s) => s.isActive).length} | Inactive: {slides.filter((s) => !s.isActive).length}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`bg-slate-900/90 rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 gap-5 ${
                    slide.isActive
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/60 opacity-60 bg-slate-950/80'
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    
                    {/* Display order badge & move buttons */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        type="button"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-sky-400">
                        {slide.displayOrder}
                      </span>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === slides.length - 1}
                        type="button"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {!slide.isActive && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-xs font-mono text-slate-400 font-bold uppercase">
                          Disabled
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {slide.badgeText && (
                          <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-400 font-mono text-[10px] uppercase font-bold">
                            {slide.badgeText}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            slide.isActive
                              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {slide.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-1 font-serif">
                        {slide.title}
                      </h3>

                      {slide.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {slide.description}
                        </p>
                      )}

                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-3 pt-0.5">
                        <span className="text-sky-400 font-semibold">
                          CTA: &quot;{slide.buttonText}&quot; ({slide.buttonUrl})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 shrink-0 justify-end">
                    {/* Live Preview Button */}
                    <button
                      onClick={() => setPreviewModalSlide(slide)}
                      type="button"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
                      title="Preview Slide"
                    >
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* Enable/Disable Toggle */}
                    <button
                      onClick={() => handleToggleActive(slide)}
                      type="button"
                      className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-medium ${
                        slide.isActive
                          ? 'bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border-emerald-800/60'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                      }`}
                      title={slide.isActive ? 'Disable Slide' : 'Enable Slide'}
                    >
                      {slide.isActive ? (
                        <>
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-slate-400" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(slide)}
                      type="button"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                      title="Edit Slide"
                    >
                      <Edit2 className="w-4 h-4 text-sky-400" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteSlide(slide.id, slide.title)}
                      type="button"
                      className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ADD / EDIT SLIDE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white">
                  {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveSlide} className="p-6 space-y-6">
              
              {/* Image Drag & Drop Upload Section */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Slide Background Image <span className="text-rose-400">*</span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                    isDragging
                      ? 'border-sky-400 bg-sky-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-950/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {uploading ? (
                    <div className="py-6 space-y-3">
                      <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-mono text-sky-400">Uploading image file...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                        <img
                          src={imageUrl}
                          alt="Slide Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="text-xs font-semibold text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                            Click or Drag to replace
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Image attached successfully
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                        <Upload className="w-6 h-6 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Click to upload or drag & drop image here
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          PNG, JPG, WebP up to 10MB (Recommended size: 1920x800px)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Image URL input option */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">Or paste an external image URL:</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Slide Headline <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Premium Custom Bag Manufacturing For Corporate Brands"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Top Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. ISO 9001:2015 CERTIFIED"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Direct factory supply of executive laptop bags, corporate tech backpacks, heavy travel duffels..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none resize-none"
                />
              </div>

              {/* Button Text & Button URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Request Bulk Quote"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    CTA Button Link URL
                  </label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="/contact"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Display Order (1 = First)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-sky-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 pt-4 sm:pt-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Enable Slide:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isActive ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-mono text-slate-400">
                    {isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlide ? 'Update Slide' : 'Create Slide'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewModalSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
                Slide Live Preview
              </span>
              <button
                onClick={() => setPreviewModalSlide(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-[400px] sm:h-[480px] bg-slate-950 overflow-hidden">
              <img
                src={previewModalSlide.imageUrl}
                alt={previewModalSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.65]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />

              <div className="absolute inset-0 flex items-center p-6 sm:p-12">
                <div className="max-w-xl space-y-4">
                  {previewModalSlide.badgeText && (
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-mono text-xs uppercase tracking-wider font-semibold">
                      {previewModalSlide.badgeText}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-4xl font-black text-white font-serif leading-tight">
                    {previewModalSlide.title}
                  </h2>
                  {previewModalSlide.description && (
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {previewModalSlide.description}
                    </p>
                  )}
                  {previewModalSlide.buttonText && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 bg-sky-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow-lg">
                        <Send className="w-4 h-4" />
                        <span>{previewModalSlide.buttonText}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
