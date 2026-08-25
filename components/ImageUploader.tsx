'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Camera,
  Trash2,
  Loader2,
  RefreshCw,
  Crop,
  Sparkles,
  FolderOpen,
  CheckCircle2,
  Info
} from 'lucide-react';
import SmartImageStudio from './SmartImageStudio';
import MediaLibraryPickerModal from './MediaLibraryPickerModal';
import { ImagePresetKey, getPresetConfig } from '@/lib/image-processing/presets';
import { MediaAsset } from '@/lib/types';

export interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  preset?: ImagePresetKey | string;
  contextName?: string;
  categoryName?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  helperText?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Upload Image',
  preset = 'general',
  contextName = '',
  categoryName = '',
  aspectRatio = 'auto',
  className = '',
  helperText,
}: ImageUploaderProps) {
  const [selectedFileForStudio, setSelectedFileForStudio] = useState<File | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [metadataBadge, setMetadataBadge] = useState<{ dimensions?: string; fileSize?: string; savings?: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const presetConfig = getPresetConfig(preset);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleIncomingFile(file);
    }
  };

  const handleIncomingFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      setError('Please select a valid image file (JPG, PNG, WebP, AVIF, SVG)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file size must be less than 15MB');
      return;
    }

    setError('');
    setSelectedFileForStudio(file);
    setIsStudioOpen(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleIncomingFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    setMetadataBadge(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStudioSuccess = (result: {
    url: string;
    dimensions: string;
    fileSize: string;
    savingsPercent?: number;
  }) => {
    onChange(result.url);
    setMetadataBadge({
      dimensions: result.dimensions,
      fileSize: result.fileSize,
      savings: result.savingsPercent,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMediaPickerSelect = (asset: MediaAsset) => {
    onChange(asset.url);
    setMetadataBadge({
      dimensions: asset.dimensions,
      fileSize: asset.fileSize,
    });
  };

  // Determine aspect container styling
  let containerAspectStyle: React.CSSProperties = {};
  if (aspectRatio === 'square') {
    containerAspectStyle = { aspectRatio: '1 / 1' };
  } else if (aspectRatio === 'video') {
    containerAspectStyle = { aspectRatio: '16 / 9' };
  } else if (aspectRatio === 'banner') {
    containerAspectStyle = { aspectRatio: '12 / 5' };
  } else if (presetConfig.aspectRatio) {
    // Dynamic based on preset ratio, capped to reasonable height
    containerAspectStyle = { aspectRatio: `${presetConfig.aspectRatio}` };
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Preset indicator */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <span>{label}</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {presetConfig.aspectRatioLabel}
            </span>
          </label>
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Media Library</span>
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900/5 shadow-xs transition-all hover:border-blue-500/50">
          <div
            style={containerAspectStyle}
            className="w-full max-h-[260px] relative flex items-center justify-center bg-slate-100 overflow-hidden"
          >
            <img
              src={value}
              alt="Uploaded optimized preview"
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-full ${
                presetConfig.defaultFitMode === 'contain' ? 'object-contain object-center p-2' : 'w-full h-full object-cover object-center'
              }`}
              style={{
                objectFit: presetConfig.defaultFitMode === 'contain' ? 'contain' : 'cover',
                objectPosition: 'center',
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <span className="text-xs font-bold">Optimizing image...</span>
              </div>
            )}

            {/* Quality Badge Overlay */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
              <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-md flex items-center gap-1 border border-slate-700/60">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>WebP Optimized</span>
              </span>
              {metadataBadge?.savings ? (
                <span className="px-1.5 py-0.5 bg-emerald-600/90 text-white text-[10px] font-bold rounded-md">
                  -{metadataBadge.savings}% size
                </span>
              ) : null}
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          {!uploading && (
            <div className="p-2 bg-slate-900 text-white flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-1">
                <button
                  type="button"
                  onClick={triggerSelect}
                  className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
                  title="Pick from existing Media Library"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="py-1.5 px-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                title="Remove Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Upload Area Dropzone */
        <div
          onClick={triggerSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2 ${
            dragOver
              ? 'border-blue-600 bg-blue-50/80 scale-[0.99]'
              : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 bg-slate-50'
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs mb-0.5">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-xs flex items-center justify-center gap-1">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Choose or Drag Image Here</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Auto-sizes to <strong className="text-slate-700">{presetConfig.targetWidth}×{presetConfig.targetHeight} px</strong> with smart crop & WebP compression
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full font-medium">
              JPG, PNG, WebP, AVIF
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMediaPickerOpen(true);
              }}
              className="text-[10px] text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full font-bold border border-blue-200 transition-colors"
            >
              Browse Library
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500 italic">{helperText}</p>}

      {error && <p className="text-[11px] text-red-600 font-semibold mt-1">{error}</p>}

      {/* Smart Crop & Optimizer Modal */}
      <SmartImageStudio
        isOpen={isStudioOpen}
        onClose={() => {
          setIsStudioOpen(false);
          setSelectedFileForStudio(null);
        }}
        file={selectedFileForStudio}
        initialPreset={preset}
        contextName={contextName}
        categoryName={categoryName}
        onSuccess={handleStudioSuccess}
      />

      {/* Media Library Picker Modal */}
      <MediaLibraryPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaPickerSelect}
        categoryFilter={presetConfig.category}
      />
    </div>
  );
}
