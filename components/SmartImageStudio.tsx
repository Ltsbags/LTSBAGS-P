'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Image as ImageIcon,
  Sliders,
  Crop,
  ShieldCheck,
  FileText,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { IMAGE_PRESETS, ImagePresetKey, getPresetConfig, ImagePresetConfig } from '@/lib/image-processing/presets';
import { ResponsiveVariant } from '@/lib/types';

export interface SmartImageStudioProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  initialPreset?: ImagePresetKey | string;
  contextName?: string;
  categoryName?: string;
  onSuccess: (result: {
    url: string;
    originalUrl?: string;
    thumbnailUrl?: string;
    dimensions: string;
    fileSize: string;
    altText?: string;
    responsiveVariants?: ResponsiveVariant[];
    savingsPercent?: number;
    mediaId?: string;
  }) => void;
}

export default function SmartImageStudio({
  isOpen,
  onClose,
  file,
  initialPreset = 'general',
  contextName = '',
  categoryName = '',
  onSuccess,
}: SmartImageStudioProps) {
  const [selectedPreset, setSelectedPreset] = useState<ImagePresetKey>(
    (initialPreset as ImagePresetKey) in IMAGE_PRESETS ? (initialPreset as ImagePresetKey) : 'general'
  );
  const [fitMode, setFitMode] = useState<'cover' | 'contain' | 'smart_crop'>('contain');
  const [bgMode, setBgMode] = useState<'white' | 'transparent' | 'original'>('white');
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [altText, setAltText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Metadata
  const [originalMeta, setOriginalMeta] = useState<{
    width: number;
    height: number;
    format: string;
    fileSize: string;
    aspectRatio: number;
  } | null>(null);

  // Duplicate state
  const [duplicateInfo, setDuplicateInfo] = useState<{
    isDuplicate: boolean;
    duplicateAsset: any | null;
  }>({ isDuplicate: false, duplicateAsset: null });

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const presetConfig = getPresetConfig(selectedPreset);

  // Update preset defaults on change
  useEffect(() => {
    const config = getPresetConfig(selectedPreset);
    // Always default to contain so images are never cut off
    setFitMode('contain');
    if (config.allowAlpha) {
      setBgMode('transparent');
    } else {
      setBgMode('white');
    }
  }, [selectedPreset]);

  // Load and analyze file when opened
  useEffect(() => {
    if (!isOpen || !file) {
      setPreviewUrl('');
      setOriginalMeta(null);
      setError(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setRotation(0);
    setZoom(1);
    setFocalPoint({ x: 50, y: 50 });
    setFitMode('contain');

    // Pre-populate with high quality B2B SEO alt text
    const baseSubject = contextName || categoryName || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setAltText(`${baseSubject} wholesale manufacturer Mumbai India - LTS Bags`);

    // Analyze image on server
    const analyze = async () => {
      setIsAnalyzing(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('preset', selectedPreset);
        if (contextName) formData.append('contextName', contextName);
        if (categoryName) formData.append('categoryName', categoryName);

        const res = await fetch('/api/images/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: 'Analysis failed' }));
          throw new Error(errData.error || 'Failed to analyze image');
        }

        const data = await res.json();
        if (data.success && data.analysis) {
          setOriginalMeta({
            width: data.analysis.width,
            height: data.analysis.height,
            format: data.analysis.format.toUpperCase(),
            fileSize: data.analysis.formattedSize,
            aspectRatio: data.analysis.aspectRatio,
          });

          if (!altText) {
            setAltText(data.analysis.suggestedAltText || '');
          }
          setFileName(data.analysis.suggestedFileName || '');

          if (data.isDuplicate && data.duplicateAsset) {
            setDuplicateInfo({
              isDuplicate: true,
              duplicateAsset: data.duplicateAsset,
            });
          } else {
            setDuplicateInfo({ isDuplicate: false, duplicateAsset: null });
          }

          // If no initial preset was explicitly passed, use suggestion
          if (initialPreset === 'general' && data.analysis.suggestedPreset) {
            setSelectedPreset(data.analysis.suggestedPreset);
          }
        }
      } catch (err: any) {
        console.error('Analysis error:', err);
        setError(err.message || 'Could not analyze image.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyze();

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, file]);

  const handleRotate = (dir: 'cw' | 'ccw') => {
    setRotation((prev) => {
      const next = dir === 'cw' ? prev + 90 : prev - 90;
      return ((next % 360) + 360) % 360;
    });
  };

  const handleFocalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const xPct = Math.round(Math.max(0, Math.min(100, (clickX / rect.width) * 100)));
    const yPct = Math.round(Math.max(0, Math.min(100, (clickY / rect.height) * 100)));
    setFocalPoint({ x: xPct, y: yPct });
  };

  const handleUseExisting = () => {
    if (!duplicateInfo.duplicateAsset) return;
    onSuccess({
      url: duplicateInfo.duplicateAsset.url,
      thumbnailUrl: duplicateInfo.duplicateAsset.thumbnailUrl,
      dimensions: duplicateInfo.duplicateAsset.dimensions || '1200x1200',
      fileSize: duplicateInfo.duplicateAsset.fileSize || '350 KB',
      altText: duplicateInfo.duplicateAsset.altText || altText,
      mediaId: duplicateInfo.duplicateAsset.id,
    });
    onClose();
  };

  const handleProcessAndSave = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preset', selectedPreset);
      formData.append('fitMode', fitMode);
      formData.append('bgMode', bgMode);
      formData.append('focalX', focalPoint.x.toString());
      formData.append('focalY', focalPoint.y.toString());
      formData.append('rotation', rotation.toString());
      formData.append('zoom', zoom.toString());
      formData.append('altText', altText);
      formData.append('contextName', contextName || fileName.replace(/\.[^/.]+$/, ''));
      formData.append('categoryName', categoryName);
      formData.append('addToMediaLibrary', 'true');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errJson.error || 'Failed to process image');
      }

      const result = await res.json();
      if (result.success) {
        onSuccess({
          url: result.url,
          originalUrl: result.originalUrl,
          thumbnailUrl: result.thumbnailUrl,
          dimensions: result.dimensions,
          fileSize: result.fileSize,
          altText: result.altText,
          responsiveVariants: result.responsiveVariants,
          savingsPercent: result.savingsPercent,
          mediaId: result.mediaId,
        });
        onClose();
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Image optimization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="smart-image-studio-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        id="smart-image-studio-card"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Smart Image Studio & Auto-Optimizer
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  WebP Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Preset-aware focal crop, aspect ratio preservation, and compression
              </p>
            </div>
          </div>
          <button
            id="close-studio-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning */}
        {duplicateInfo.isDuplicate && duplicateInfo.duplicateAsset && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between gap-4 text-amber-900 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Duplicate Image Detected:</strong> An identical image already exists in your Media Library:{' '}
                <em>&quot;{duplicateInfo.duplicateAsset.title}&quot;</em> ({duplicateInfo.duplicateAsset.dimensions},{' '}
                {duplicateInfo.duplicateAsset.fileSize}).
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                id="use-existing-media-btn"
                type="button"
                onClick={handleUseExisting}
                className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-md font-medium transition-colors"
              >
                Use Existing
              </button>
              <span className="text-amber-700 font-semibold">or continue new</span>
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left / Center: Interactive Preview Canvas */}
          <div className="lg:col-span-7 bg-slate-900 p-6 flex flex-col items-center justify-center relative overflow-hidden select-none">
            {/* Top Toolbar */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
                <span className="font-semibold text-white">Target Preset:</span>
                <span className="text-blue-400 font-mono">{presetConfig.aspectRatioLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/60 pointer-events-auto">
                <button
                  type="button"
                  title="Rotate Left 90°"
                  onClick={() => handleRotate('ccw')}
                  className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors text-slate-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Rotate Right 90°"
                  onClick={() => handleRotate('cw')}
                  className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors text-slate-400"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-slate-700 my-auto" />
                <button
                  type="button"
                  title="Zoom Out"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(1)))}
                  className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors text-slate-400"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono px-1 text-[11px] text-slate-300 font-semibold">{zoom.toFixed(1)}x</span>
                <button
                  type="button"
                  title="Zoom In"
                  onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}
                  className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors text-slate-400"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Preview Frame */}
            <div className="w-full flex items-center justify-center p-4 min-h-[320px] max-h-[460px]">
              {previewUrl ? (
                <div
                  ref={previewContainerRef}
                  onClick={fitMode === 'cover' || fitMode === 'smart_crop' ? handleFocalClick : undefined}
                  style={{
                    aspectRatio: `${presetConfig.aspectRatio}`,
                  }}
                  className={`relative max-w-full max-h-[420px] rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/50 bg-slate-950 flex items-center justify-center ${
                    fitMode === 'cover' ? 'cursor-crosshair' : 'cursor-default'
                  }`}
                >
                  {/* Image Rendering */}
                  <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-200"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${zoom})`,
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Crop preview"
                      className={`max-w-full max-h-full transition-all ${
                        fitMode === 'contain'
                          ? 'object-contain p-4'
                          : 'w-full h-full object-cover'
                      }`}
                      style={{
                        objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
                        backgroundColor:
                          bgMode === 'white'
                            ? '#ffffff'
                            : bgMode === 'transparent'
                            ? 'transparent'
                            : '#f8fafc',
                      }}
                    />
                  </div>

                  {fitMode === 'contain' && (
                    <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-1 bg-emerald-950/85 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-500/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>100% Full Uncropped Image</span>
                      </span>
                    </div>
                  )}

                  {/* Focal point indicator for Cover mode */}
                  {(fitMode === 'cover' || fitMode === 'smart_crop') && (
                    <div
                      className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                      style={{
                        left: `${focalPoint.x}%`,
                        top: `${focalPoint.y}%`,
                      }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-500/80 shadow-lg animate-pulse flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>
                  )}

                  {/* Rule of Thirds Grid Guide */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-2">
                  <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                  <span>No image selected</span>
                </div>
              )}
            </div>

            {/* Bottom Focal Point Presets Bar */}
            {(fitMode === 'cover' || fitMode === 'smart_crop') && (
              <div className="w-full flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="text-[11px]">Click preview to set focal point</span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-500 mr-1">Focal:</span>
                  {[
                    { label: 'Top', x: 50, y: 15 },
                    { label: 'Center', x: 50, y: 50 },
                    { label: 'Bottom', x: 50, y: 85 },
                    { label: 'Left', x: 15, y: 50 },
                    { label: 'Right', x: 85, y: 50 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFocalPoint({ x: p.x, y: p.y })}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        focalPoint.x === p.x && focalPoint.y === p.y
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Controls & Optimization Settings */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between overflow-y-auto max-h-[580px] bg-slate-50/50 space-y-6">
            <div className="space-y-5">
              {/* Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Destination Preset</span>
                  <span className="text-[11px] font-normal text-slate-500 lowercase">
                    {presetConfig.targetWidth}×{presetConfig.targetHeight}px
                  </span>
                </label>
                <select
                  id="preset-selector"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value as ImagePresetKey)}
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  {Object.values(IMAGE_PRESETS).map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label} — {p.aspectRatioLabel}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{presetConfig.description}</p>
              </div>

              {/* Fit Mode Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Crop & Framing Mode
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                    {fitMode === 'contain' ? '100% Uncropped Active' : 'Cropped to Frame'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFitMode('contain')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      fitMode === 'contain'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fit Full Image (Uncropped)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('cover')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      fitMode === 'cover'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Smart Crop (Fill Frame)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {fitMode === 'contain'
                    ? '✓ The complete photo will be kept intact without cutting off any edges or straps.'
                    : '⚠ Image will be cropped to fill the exact aspect ratio frame.'}
                </p>
              </div>

              {/* Product Background Option (when contain mode or logo) */}
              {fitMode === 'contain' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Canvas Background
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'white', label: 'Clean White' },
                      { id: 'transparent', label: 'Transparent' },
                      { id: 'original', label: 'Soft Neutral' },
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setBgMode(bg.id as any)}
                        className={`px-2 py-1.5 text-xs font-medium rounded-lg border text-center transition-colors ${
                          bgMode === bg.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO & ALT text */}
              <div className="space-y-3 pt-2 border-t border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Image ALT Text (Auto SEO)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const base = contextName || categoryName || 'Custom Bag';
                        setAltText(`${base} wholesale manufacturer Mumbai India - LTS Bags`);
                      }}
                      className="text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors cursor-pointer"
                      title="Auto generate SEO Alt Text"
                    >
                      ⚡ Auto SEO
                    </button>
                  </div>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. Custom Laptop Sleeves manufactured in Mumbai by LTS Bags..."
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Google Image Search indexes this text for wholesale B2B ranking.
                  </p>
                </div>
              </div>

              {/* Optimization Metric Badges */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Source File:</span>
                  <span className="font-semibold text-slate-800">
                    {originalMeta ? `${originalMeta.width}×${originalMeta.height} px (${originalMeta.fileSize})` : 'Detecting...'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Optimized Output:</span>
                  <span className="font-semibold text-blue-700">
                    {presetConfig.targetWidth}×{presetConfig.targetHeight} px (WebP ~85% Q)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Estimated Savings:</span>
                  <span className="font-bold text-emerald-600">~80% to 95% smaller</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRotation(0);
                    setZoom(1);
                    setFocalPoint({ x: 50, y: 50 });
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Reset
                </button>
                <button
                  id="apply-optimize-image-btn"
                  type="button"
                  disabled={isProcessing || isAnalyzing}
                  onClick={handleProcessAndSave}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimize & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
