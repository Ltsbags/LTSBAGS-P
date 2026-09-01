'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { PdfCatalogue } from '@/lib/types';
import { 
  FileText, 
  Upload, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Copy, 
  Share2, 
  ExternalLink, 
  FileCheck, 
  Sparkles, 
  Layers, 
  ArrowUpDown, 
  Eye, 
  EyeOff, 
  FileUp, 
  Image as ImageIcon,
  QrCode,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  MessageCircle,
  HardDrive
} from 'lucide-react';
import Image from 'next/image';

const CATEGORY_OPTIONS = [
  'Corporate Backpacks',
  'Executive Laptop Bags',
  'Duffel & Travel Bags',
  'Eco Totes & Shopping Bags',
  'School & College Bags',
  'Promotional & Gifting Bags',
  'Industrial & Medical Bags',
  'Master 2026 Full Edition',
];

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState<PdfCatalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState('Corporate Backpacks');
  const [version, setVersion] = useState('v2026.1');
  const [isActive, setIsActive] = useState(true);

  // Upload Tab & States
  const [pdfInputMode, setPdfInputMode] = useState<'upload' | 'url'>('upload');
  const [coverInputMode, setCoverInputMode] = useState<'upload' | 'url'>('upload');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadPdfProgress, setUploadPdfProgress] = useState(0);

  // QR Modal
  const [qrModalCatalogue, setQrModalCatalogue] = useState<PdfCatalogue | null>(null);

  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchCatalogues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/catalogues');
      if (res.ok) {
        const data = await res.json();
        setCatalogues(data.catalogues || []);
      }
    } catch (err) {
      console.error('Failed to load catalogues:', err);
      showToast('Error loading catalogues');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogues();
  }, [fetchCatalogues]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setFileUrl('');
    setOriginalFileName('');
    setFileSize('');
    setCoverImageUrl('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800');
    setCategory('Corporate Backpacks');
    setVersion('v2026.1');
    setIsActive(true);
    setPdfInputMode('upload');
    setCoverInputMode('upload');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: PdfCatalogue) => {
    setEditingId(cat.id);
    setTitle(cat.title);
    setDescription(cat.description || '');
    setFileUrl(cat.fileUrl);
    setOriginalFileName(cat.originalFileName || '');
    setFileSize(cat.fileSize || '');
    setCoverImageUrl(cat.coverImageUrl || '');
    setCategory(cat.category || 'Corporate Backpacks');
    setVersion(cat.version || 'v2026.1');
    setIsActive(cat.isActive);
    setPdfInputMode(cat.fileUrl.startsWith('/uploads/') ? 'upload' : 'url');
    setCoverInputMode('upload');
    setIsModalOpen(true);
  };

  // Direct PDF File Upload Handler
  const handlePdfFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      showToast('Please select a valid .pdf file');
      return;
    }

    try {
      setUploadingPdf(true);
      setUploadPdfProgress(20);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'pdf');

      setUploadPdfProgress(50);
      const res = await fetch('/api/admin/catalogues/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadPdfProgress(85);
      const data = await res.json();

      if (res.ok && data.url) {
        setUploadPdfProgress(100);
        setFileUrl(data.url);
        setOriginalFileName(data.originalFileName || file.name);
        setFileSize(data.fileSize || `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        
        // If title is empty, prefill with a clean name from file
        if (!title.trim()) {
          const autoTitle = file.name
            .replace(/\.pdf$/i, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setTitle(autoTitle);
        }

        showToast('PDF file uploaded successfully');
      } else {
        showToast(data.error || 'Failed to upload PDF');
      }
    } catch (err: any) {
      console.error('PDF upload error:', err);
      showToast(err.message || 'Network error during PDF upload');
    } finally {
      setUploadingPdf(false);
      setTimeout(() => setUploadPdfProgress(0), 1000);
    }
  };

  // Direct Cover Image Upload Handler
  const handleCoverImageUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');

      const res = await fetch('/api/admin/catalogues/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImageUrl(data.url);
        showToast('Cover thumbnail updated');
      } else {
        showToast(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      showToast('Network error during image upload');
    } finally {
      setUploadingCover(false);
    }
  };

  // Submit Save/Update
  const handleSubmitCatalogue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Catalogue Title is required');
      return;
    }

    if (!fileUrl.trim()) {
      showToast('Please upload a PDF file or enter a PDF URL');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        fileUrl: fileUrl.trim(),
        originalFileName: originalFileName.trim() || fileUrl.split('/').pop() || 'catalogue.pdf',
        fileSize: fileSize.trim() || '5.0 MB',
        coverImageUrl: coverImageUrl.trim(),
        category,
        version: version.trim() || 'v2026.1',
        isActive,
      };

      const url = editingId ? `/api/admin/catalogues/${editingId}` : '/api/admin/catalogues';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(editingId ? 'Catalogue updated successfully' : 'New PDF Catalogue published');
        setIsModalOpen(false);
        fetchCatalogues();
      } else {
        showToast(data.error || 'Failed to save catalogue');
      }
    } catch (err: any) {
      console.error('Error saving catalogue:', err);
      showToast('Error saving catalogue');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Catalogue
  const handleDelete = async (id: string, catTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${catTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/catalogues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Catalogue deleted');
        setCatalogues((prev) => prev.filter((c) => c.id !== id));
      } else {
        showToast('Failed to delete catalogue');
      }
    } catch (err) {
      showToast('Error deleting catalogue');
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (cat: PdfCatalogue) => {
    try {
      const updatedStatus = !cat.isActive;
      const res = await fetch(`/api/admin/catalogues/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      if (res.ok) {
        setCatalogues((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: updatedStatus } : c))
        );
        showToast(updatedStatus ? 'Catalogue set to ACTIVE' : 'Catalogue HIDDEN');
      }
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  // Copy Link to Clipboard
  const handleCopyLink = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('Download link copied to clipboard!');
  };

  // Filter Catalogues
  const filteredCatalogues = catalogues.filter((cat) => {
    const matchesCategory = selectedCategory === 'ALL' || cat.category === selectedCategory;
    const matchesSearch =
      !search ||
      cat.title.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase()) ||
      cat.category?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalDownloads = catalogues.reduce((sum, c) => sum + (c.downloadCount || 0), 0);
  const activeCount = catalogues.filter((c) => c.isActive).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <AdminHeader activeTab="catalogues" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Header & Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white font-serif">
                PDF Catalogues &amp; Digital Brochures
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Upload, organize, and track downloads for your B2B corporate bag collections and factory brochures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCatalogues}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
              title="Refresh catalogues"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF Catalogue</span>
            </button>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Catalogues</div>
              <div className="text-2xl font-bold text-white mt-1">{catalogues.length}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Downloads</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{totalDownloads.toLocaleString()}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Download className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Active Online</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{activeCount}</div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Active Categories</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">
                {new Set(catalogues.map((c) => c.category)).size}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Segment:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">All Bag Segments ({catalogues.length})</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({catalogues.filter((c) => c.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, edition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Catalogues Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading PDF catalogues...</p>
          </div>
        ) : filteredCatalogues.length === 0 ? (
          <div className="mt-8 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Catalogues Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search || selectedCategory !== 'ALL'
                ? 'Try changing your search term or category filter.'
                : 'Upload your first PDF catalogue so buyers can view and download technical specifications.'}
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF Catalogue</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCatalogues.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-all shadow-xl group relative"
              >
                {/* Cover Banner with Thumbnail */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  {cat.coverImageUrl ? (
                    <Image
                      src={cat.coverImageUrl}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                      <FileText className="w-16 h-16" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Category & Version Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                      {cat.category || 'B2B Catalogue'}
                    </span>
                    {cat.version && (
                      <span className="bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full">
                        {cat.version}
                      </span>
                    )}
                  </div>

                  {/* Active / Hidden Status Pill */}
                  <button
                    onClick={() => handleToggleActive(cat)}
                    className={`absolute top-3 right-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md border transition-all ${
                      cat.isActive
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900/80'
                    }`}
                    title={cat.isActive ? 'Click to hide catalogue' : 'Click to publish catalogue'}
                  >
                    {cat.isActive ? (
                      <>
                        <Eye className="w-3 h-3 text-emerald-400" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-rose-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* File Size & PDF Pill Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                      <FileText className="w-3.5 h-3.5 text-rose-400" />
                      <span>PDF</span>
                      <span className="text-slate-400 font-normal">| {cat.fileSize || '5.0 MB'}</span>
                    </span>

                    <span className="text-[11px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 font-mono">
                      {cat.downloadCount || 0} downloads
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description || 'Complete B2B product specifications, MOQ tiers, dimensions, and fabric swatches.'}
                    </p>
                    
                    <div className="mt-3 text-[11px] font-mono text-slate-500 truncate flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{cat.originalFileName || cat.fileUrl}</span>
                    </div>
                  </div>

                  {/* Bottom Action Grid */}
                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Direct PDF Download / View */}
                      <a
                        href={cat.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-500/40 transition-colors"
                        title="Download / View PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      {/* Copy Direct Link */}
                      <button
                        onClick={() => handleCopyLink(cat.fileUrl)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="Copy PDF Link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Share QR Code */}
                      <button
                        onClick={() => setQrModalCatalogue(cat)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
                        title="Show QR Code & Share"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* WhatsApp Share */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Check out LTS BAGS ${cat.title} (${cat.version || '2026 Edition'}): ${
                            typeof window !== 'undefined' ? window.location.origin : ''
                          }${cat.fileUrl}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 transition-colors"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors"
                        title="Edit Catalogue"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(cat.id, cat.title)}
                        className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 border border-rose-800/40 transition-colors"
                        title="Delete Catalogue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* ADD / EDIT CATALOGUE MODAL WITH DIRECT PDF UPLOAD & FILE PICKER           */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingId ? 'Edit PDF Catalogue' : 'Add New PDF Catalogue'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Upload your digital PDF collection or enter a downloadable brochure URL
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitCatalogue} className="p-6 space-y-6">
              
              {/* SECTION 1: PDF FILE UPLOAD (THE PRIMARY UPLOAD FEATURE) */}
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>PDF Document File *</span>
                  </label>

                  {/* Switch between Upload from Device and Manual URL */}
                  <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setPdfInputMode('upload')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        pdfInputMode === 'upload'
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfInputMode('url')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        pdfInputMode === 'url'
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      URL Link
                    </button>
                  </div>
                </div>

                {/* Mode A: Direct Device File Upload */}
                {pdfInputMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={pdfFileInputRef}
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfFileUpload(file);
                      }}
                    />

                    {fileUrl ? (
                      /* Uploaded PDF Preview Card */
                      <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white truncate">
                                {originalFileName || fileUrl.split('/').pop()}
                              </span>
                              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold shrink-0">
                                Ready ({fileSize || 'PDF'})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                              {fileUrl}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => pdfFileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
                          >
                            Replace PDF
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop Upload Zone */
                      <div
                        onClick={() => pdfFileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handlePdfFileUpload(file);
                        }}
                        className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-slate-950/60 hover:bg-amber-500/5 rounded-xl p-8 text-center cursor-pointer transition-all group"
                      >
                        {uploadingPdf ? (
                          <div className="space-y-3">
                            <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
                            <div className="text-xs text-amber-300 font-semibold">
                              Uploading &amp; processing PDF ({uploadPdfProgress}%)...
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <FileUp className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-bold text-white">
                              Click or Drag &amp; Drop your PDF Catalogue here
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Accepts .pdf files up to 50MB. Auto-extracts file size &amp; title.
                            </p>
                            <span className="inline-block mt-3 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30">
                              Browse Files
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Mode B: Manual PDF URL Input */
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. /catalogues/LTS-Brochure-2026.pdf or https://..."
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Direct downloadable PDF URL link
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 2: CATALOGUE METADATA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Catalogue Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LTS Corporate Backpacks 2026 Master Catalogue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description / Highlights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief highlights about this collection, fabric grades, MOQ, and technical specifications..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Category / Segment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category / Bag Segment
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Version & File Size */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Edition / Version
                    </label>
                    <input
                      type="text"
                      placeholder="v2026.1"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      File Size Display
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6.5 MB"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: COVER THUMBNAIL IMAGE */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cover Thumbnail Image</span>
                  </label>

                  <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCoverInputMode('upload')}
                      className={`px-2.5 py-0.5 rounded font-semibold ${
                        coverInputMode === 'upload' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverInputMode('url')}
                      className={`px-2.5 py-0.5 rounded font-semibold ${
                        coverInputMode === 'url' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Thumbnail Preview */}
                  <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative shrink-0">
                    {coverImageUrl ? (
                      <Image
                        src={coverImageUrl}
                        alt="Cover Preview"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverImageUpload(file);
                      }}
                    />

                    {coverInputMode === 'upload' ? (
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        disabled={uploadingCover}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{uploadingCover ? 'Optimizing image...' : 'Choose Cover Photo'}</span>
                      </button>
                    ) : (
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">
                      Visual preview card displayed in buyer download sections
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Toggle Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-xs text-slate-200 cursor-pointer font-medium">
                  Active (Visible on public catalogue download section and brochure links)
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingPdf}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingId ? 'Update Catalogue' : 'Publish Catalogue'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QR CODE & QUICK SHARE MODAL                                               */}
      {/* ========================================================================= */}
      {qrModalCatalogue && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Share Catalogue</h3>
              <button
                onClick={() => setQrModalCatalogue(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-lg mx-auto">
              {/* Dynamic QR Code */}
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  typeof window !== 'undefined' ? `${window.location.origin}${qrModalCatalogue.fileUrl}` : ''
                )}`}
                alt="QR Code"
                width={180}
                height={180}
                className="mx-auto"
                unoptimized
              />
            </div>

            <div>
              <div className="font-bold text-sm text-white">{qrModalCatalogue.title}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {qrModalCatalogue.version} • {qrModalCatalogue.fileSize}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleCopyLink(qrModalCatalogue.fileUrl);
                  setQrModalCatalogue(null);
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Here is the LTS BAGS ${qrModalCatalogue.title}: ${
                    typeof window !== 'undefined' ? window.location.origin : ''
                  }${qrModalCatalogue.fileUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
