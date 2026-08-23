'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Camera, Trash2, Loader2, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Product Image',
  aspectRatio = 'square',
  className = '',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file size must be less than 15MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload image. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Client-side fallback to FileReader DataURL
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } catch (readErr) {
        console.error('Client file read error:', readErr);
        setError('Could not process image file.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClasses = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'square' ? 'aspect-square' :
    'h-40';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block font-bold text-slate-800 text-xs">
          {label}
        </label>
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
        <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900/5 shadow-xs transition-all hover:border-amber-500/50">
          <div className={`w-full ${aspectClasses} relative flex items-center justify-center bg-slate-100 overflow-hidden`}>
            <img
              src={value}
              alt="Uploaded image preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
                <span className="text-xs font-bold">Uploading new image...</span>
              </div>
            )}
          </div>

          {/* Action Buttons Overlay */}
          {!uploading && (
            <div className="p-2 bg-slate-900 text-white flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={triggerSelect}
                className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>
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
              ? 'border-amber-600 bg-amber-50/80 scale-[0.99]'
              : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/30 bg-slate-50'
          }`}
        >
          {uploading ? (
            <div className="py-4 flex flex-col items-center gap-2 text-amber-700">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <span className="font-bold text-xs">Uploading photo from gallery...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs mb-1">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs flex items-center justify-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose Image from Device or Gallery</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click to select photo from Computer or Mobile Phone
                </p>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full font-medium mt-1">
                Supports JPG, PNG, WEBP (Max 15MB)
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-600 font-semibold mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
