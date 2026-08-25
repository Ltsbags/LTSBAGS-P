'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle2,
  Trash2,
  Undo2,
  Layers,
  ZoomIn,
  ArrowLeftRight,
  Maximize2,
  Image as ImageIcon,
  AlertCircle,
  FileCheck,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { ProcessedProductImage, ImageProcessingStatus } from '@/lib/types';

interface ProductImageStudioProps {
  value?: string;
  imageItem?: ProcessedProductImage;
  onChange: (url: string, imageItem?: ProcessedProductImage) => void;
  onRemove?: () => void;
  productName?: string;
  categoryName?: string;
  isPrimary?: boolean;
  label?: string;
  className?: string;
}

const STEP_LABELS: Record<ImageProcessingStatus, { title: string; desc: string; percent: number }> = {
  pending: { title: 'Waiting to start', desc: 'Initializing queue', percent: 5 },
  uploading: { title: '1. Uploading Image', desc: 'Validating format & preserving original file', percent: 20 },
  removing_background: { title: '2. Removing Background', desc: 'Detecting bag silhouette & transparent cutout', percent: 45 },
  cleaning_edges: { title: '3. Cleaning Product Edges', desc: 'Anti-aliasing contours & preserving straps', percent: 65 },
  upscaling: { title: '4. AI Upscaling & Centering', desc: 'Multi-pass Lanczos3 2000px+ & 8% margin', percent: 80 },
  optimizing: { title: '5. Optimizing & Web Generation', desc: 'Generating Master, Web & Thumbnail variants', percent: 92 },
  completed: { title: 'Processed & Ready', desc: 'All variants generated successfully', percent: 100 },
  failed: { title: 'Processing Issue', desc: 'Error encountered during processing', percent: 0 },
};

export default function ProductImageStudio({
  value = '',
  imageItem,
  onChange,
  onRemove,
  productName = 'Product Bag',
  categoryName = 'B2B Bags',
  isPrimary = false,
  label = 'Product Image (AI Studio)',
  className = '',
}: ProductImageStudioProps) {
  const [currentImage, setCurrentImage] = useState<ProcessedProductImage | null>(imageItem || null);
  const [processingStatus, setProcessingStatus] = useState<ImageProcessingStatus>('completed');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'processed' | 'original' | 'split'>('processed');
  const [splitPos, setSplitPos] = useState<number>(50);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Custom processing options state
  const [customOptions, setCustomOptions] = useState({
    autoBackgroundRemoval: true,
    autoUpscaling: true,
    targetResolution: 2000,
    paddingPercent: 8,
    outputFormat: 'webp' as 'webp' | 'png',
    quality: 'high' as 'high' | 'very_high',
  });

  // SEO fields
  const [altText, setAltText] = useState(
    currentImage?.altText || `${productName} manufactured by LTS Bags Mumbai`
  );
  const [fileName, setFileName] = useState(
    currentImage?.fileName || `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-main.webp`
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if value changes externally
  useEffect(() => {
    if (imageItem) {
      setCurrentImage(imageItem);
      if (imageItem.altText) setAltText(imageItem.altText);
      if (imageItem.fileName) setFileName(imageItem.fileName);
    }
  }, [imageItem]);

  const activeUrl = currentImage?.webUrl || currentImage?.processedUrl || value;
  const originalUrl = currentImage?.originalUrl || value;

  const simulateStepProgress = async () => {
    const steps: ImageProcessingStatus[] = [
      'uploading',
      'removing_background',
      'cleaning_edges',
      'upscaling',
      'optimizing',
    ];

    for (const st of steps) {
      setProcessingStatus(st);
      setProgressPercent(STEP_LABELS[st].percent);
      await new Promise((r) => setTimeout(r, 280));
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Supported formats: JPG, PNG, WEBP. Please select a valid product photo.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB limit. Please upload an image under 25MB.');
      return;
    }

    setErrorMessage('');
    setProgressPercent(10);
    setProcessingStatus('uploading');

    // Run animation steps in background
    const progressPromise = simulateStepProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productName', productName);
      formData.append('categoryName', categoryName);
      formData.append('variantSuffix', isPrimary ? 'main' : 'gallery');
      formData.append('autoBackgroundRemoval', String(customOptions.autoBackgroundRemoval));
      formData.append('autoUpscaling', String(customOptions.autoUpscaling));
      formData.append('targetResolution', String(customOptions.targetResolution));
      formData.append('paddingPercent', String(customOptions.paddingPercent));
      formData.append('outputFormat', customOptions.outputFormat);
      formData.append('quality', customOptions.quality);

      const res = await fetch('/api/images/process', {
        method: 'POST',
        body: formData,
      });

      await progressPromise;

      const data = await res.json();

      if (res.ok && data.success && data.image) {
        const item: ProcessedProductImage = data.image;
        setCurrentImage(item);
        setAltText(item.altText || altText);
        setFileName(item.fileName || fileName);
        setWarnings(data.warnings || []);
        setProcessingStatus('completed');
        setProgressPercent(100);

        // Notify parent
        onChange(item.webUrl || item.processedUrl, item);
      } else {
        throw new Error(data.error || 'Failed to process image through AI pipeline');
      }
    } catch (err: any) {
      console.warn('AI processing error, falling back gracefully:', err);
      // Fallback: Read as raw dataUrl so user is never blocked
      const reader = new FileReader();
      reader.onload = (e) => {
        const fallbackUrl = e.target?.result as string;
        const fallbackItem: ProcessedProductImage = {
          id: `fallback-${Date.now()}`,
          originalUrl: fallbackUrl,
          processedUrl: fallbackUrl,
          webUrl: fallbackUrl,
          thumbnailUrl: fallbackUrl,
          altText: `${productName} by LTS Bags`,
          fileName: `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`,
          isPrimary,
          sortOrder: 0,
          processingStatus: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCurrentImage(fallbackItem);
        setProcessingStatus('completed');
        setProgressPercent(100);
        onChange(fallbackUrl, fallbackItem);
      };
      reader.readAsDataURL(file);
      setErrorMessage(`Note: Processed using standard fallback mode (${err.message || 'Server pipeline busy'})`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReprocess = async () => {
    const sourceUrl = currentImage?.originalUrl || originalUrl || activeUrl || value;
    if (!sourceUrl) {
      setErrorMessage('No source image available to process. Please upload a product photo.');
      return;
    }
    setErrorMessage('');
    setProgressPercent(10);
    setProcessingStatus('removing_background');
    setShowSettingsModal(false);

    const progressPromise = simulateStepProgress();

    try {
      const res = await fetch('/api/images/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: sourceUrl,
          productName,
          categoryName,
          variantSuffix: isPrimary ? 'main' : 'gallery',
          autoBackgroundRemoval: customOptions.autoBackgroundRemoval,
          autoUpscaling: customOptions.autoUpscaling,
          targetResolution: customOptions.targetResolution,
          paddingPercent: customOptions.paddingPercent,
          outputFormat: customOptions.outputFormat,
          quality: customOptions.quality,
        }),
      });

      await progressPromise;
      const data = await res.json();

      if (res.ok && data.success && data.image) {
        const item: ProcessedProductImage = data.image;
        setCurrentImage(item);
        setWarnings(data.warnings || []);
        setProcessingStatus('completed');
        setProgressPercent(100);
        onChange(item.webUrl || item.processedUrl, item);
      } else {
        throw new Error(data.error || 'Reprocessing failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reprocess image. Please re-upload or select a photo.');
      setProcessingStatus('completed');
    }
  };

  const handleRestoreOriginal = () => {
    if (!currentImage?.originalUrl) return;
    const restored: ProcessedProductImage = {
      ...currentImage,
      webUrl: currentImage.originalUrl,
      processedUrl: currentImage.originalUrl,
      bgRemovalApplied: false,
      upscalingApplied: false,
    };
    setCurrentImage(restored);
    setViewMode('original');
    onChange(currentImage.originalUrl, restored);
  };

  const handleSaveSeo = () => {
    if (currentImage) {
      const updated = {
        ...currentImage,
        altText,
        fileName,
      };
      setCurrentImage(updated);
      onChange(activeUrl, updated);
    }
    setShowSeoModal(false);
  };

  const isProcessing = processingStatus !== 'completed' && processingStatus !== 'failed';

  return (
    <div className={`space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800 ${className}`}>
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-xs text-white">
              {label}
            </span>
            {isPrimary && (
              <span className="ml-2 text-[10px] uppercase font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                Primary Master
              </span>
            )}
          </div>
        </div>

        {activeUrl && !isProcessing && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              title="Image AI Processing Settings"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-[11px] flex items-center gap-1 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSeoModal(true)}
              title="Edit SEO Alt text & File Name"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 text-[11px] flex items-center gap-1 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEO</span>
            </button>
          </div>
        )}
      </div>

      {/* Optional Provider Notice / Warnings */}
      {warnings.length > 0 && !isProcessing && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
          {warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        className="hidden"
      />

      {/* Upload Zone / Active Preview Canvas */}
      {!activeUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload(file);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all text-center flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-amber-400 bg-amber-950/20'
              : 'border-slate-700/80 hover:border-amber-500/50 bg-slate-950/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-200">
              Drag & Drop product photo or <span className="text-amber-400 underline">Browse</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Auto background removal • AI 2000px upscaling • Clean transparent RGBA
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
            <span>JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Max 25MB</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Main Visual Box */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group aspect-square flex items-center justify-center">
            
            {/* Transparent checkerboard background grid for transparent cutouts */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 8px 8px',
              }}
            />

            {/* Displaying Image according to view mode */}
            {viewMode === 'processed' && (
              <img
                src={activeUrl}
                alt={altText}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-2 relative z-10 transition-transform duration-200"
              />
            )}

            {viewMode === 'original' && (
              <img
                src={originalUrl}
                alt="Original Upload"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-2 relative z-10"
              />
            )}

            {viewMode === 'split' && (
              <div className="relative w-full h-full p-2 z-10 overflow-hidden select-none">
                {/* Background: Processed */}
                <img
                  src={activeUrl}
                  alt="Processed"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
                {/* Foreground: Original with clipPath */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${splitPos}%` }}
                >
                  <img
                    src={originalUrl}
                    alt="Original"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-contain p-2 max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-2 left-2 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                    Original
                  </div>
                </div>

                <div className="absolute top-2 right-2 bg-amber-500/90 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-bold">
                  AI Processed
                </div>

                {/* Split Handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 cursor-ew-resize z-20"
                  style={{ left: `${splitPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                    <ArrowLeftRight className="w-3 h-3" />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                />
              </div>
            )}

            {/* Processing Overlay with Step Progress */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-40 space-y-3">
                <div className="relative">
                  <RefreshCw className="w-10 h-10 animate-spin text-amber-400" />
                  <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <p className="font-bold text-sm text-white">
                    {STEP_LABELS[processingStatus]?.title || 'Processing Product Image...'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {STEP_LABELS[processingStatus]?.desc || 'Applying automated enhancements'}
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  {progressPercent}% Completed
                </span>
              </div>
            )}

            {/* Badges on bottom corner */}
            {!isProcessing && (
              <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5">
                <span className="bg-slate-900/90 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {currentImage?.dimensions ? `${currentImage.dimensions.width}×${currentImage.dimensions.height}px` : '2000×2000px'}
                </span>
                <span className="bg-slate-900/90 backdrop-blur-xs text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                  WebP RGBA
                </span>
              </div>
            )}
          </div>

          {/* View Mode Switcher */}
          {!isProcessing && (
            <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-[11px]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('processed')}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    viewMode === 'processed'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Processed Cutout
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded font-bold transition-colors flex items-center gap-1 ${
                    viewMode === 'split'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowLeftRight className="w-3 h-3" /> Compare
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('original')}
                  className={`px-2.5 py-1 rounded font-bold transition-colors ${
                    viewMode === 'original'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Original
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload different photo"
                  className="text-slate-300 hover:text-amber-400 p-1 rounded hover:bg-slate-900 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    title="Remove Image"
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Fast action row */}
          {!isProcessing && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleReprocess}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 px-2 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors text-[11px]"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>Reprocess AI</span>
              </button>

              <button
                type="button"
                onClick={handleRestoreOriginal}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 px-2 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors text-[11px]"
              >
                <Undo2 className="w-3 h-3 text-slate-400" />
                <span>Restore Raw</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="bg-amber-950/40 border border-amber-500/30 text-amber-200 p-2.5 rounded-lg text-xs flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="leading-tight block">{errorMessage}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-bold"
              >
                Upload a new image file
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-slate-400 hover:text-white text-xs px-1"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* AI Processing Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Image Processing Studio Options</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <p className="font-bold text-white">Automatic Background Removal</p>
                  <p className="text-[11px] text-slate-400">Isolate bag silhouette, generate transparent RGBA</p>
                </div>
                <input
                  type="checkbox"
                  checked={customOptions.autoBackgroundRemoval}
                  onChange={(e) => setCustomOptions({ ...customOptions, autoBackgroundRemoval: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <p className="font-bold text-white">Automatic AI Upscaling & Centering</p>
                  <p className="text-[11px] text-slate-400">High-fidelity Lanczos3 super-resolution</p>
                </div>
                <input
                  type="checkbox"
                  checked={customOptions.autoUpscaling}
                  onChange={(e) => setCustomOptions({ ...customOptions, autoUpscaling: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200">Target Output Resolution</label>
                <select
                  value={customOptions.targetResolution}
                  onChange={(e) => setCustomOptions({ ...customOptions, targetResolution: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none"
                >
                  <option value={2000}>2000 × 2000 px (Recommended Web Standard)</option>
                  <option value={2400}>2400 × 2400 px (High-Resolution Zoom)</option>
                  <option value={3000}>3000 × 3000 px (Ultra HD Master)</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="font-bold text-slate-200">Canvas Breathing Padding</label>
                  <span className="font-mono text-amber-400">{customOptions.paddingPercent}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={customOptions.paddingPercent}
                  onChange={(e) => setCustomOptions({ ...customOptions, paddingPercent: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReprocess}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Apply & Reprocess
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO & ALT Text Modal */}
      {showSeoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Image SEO & Alt Text</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSeoModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Image ALT Text (Accessibility & Google Image Search)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. Corporate Laptop Backpack manufactured by LTS Bags"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">SEO File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. corporate-laptop-backpack-main.webp"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSeoModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSeo}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Save SEO Metadata
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
