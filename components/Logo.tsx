'use client';

import React, { useEffect, useState } from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'text-only';
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  showIcon?: boolean;
  showText?: boolean;
  overrideLogoUrl?: string;
  overrideLogoText?: string;
  overrideLogoSubtitle?: string;
}

export default function Logo({
  variant = 'horizontal',
  theme = 'auto',
  size = 'md',
  className = '',
  showSubtitle = true,
  showIcon = true,
  showText = true,
  overrideLogoUrl,
  overrideLogoText,
  overrideLogoSubtitle,
}: LogoProps) {
  const [fetchedSettings, setFetchedSettings] = useState<{ logoUrl?: string; logoText?: string; logoSubtitle?: string } | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    if (overrideLogoUrl !== undefined) return;
    let active = true;
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (active && data && !data.error) {
          setFetchedSettings(data);
        }
      })
      .catch(() => {
        // Silently retain defaults
      });
    return () => {
      active = false;
    };
  }, [overrideLogoUrl]);

  const logoUrl = overrideLogoUrl !== undefined ? overrideLogoUrl : (fetchedSettings?.logoUrl || '');
  const logoText = overrideLogoText !== undefined ? overrideLogoText : (fetchedSettings?.logoText || 'LTS BAGS');
  const logoSubtitle = overrideLogoSubtitle !== undefined ? overrideLogoSubtitle : (fetchedSettings?.logoSubtitle || 'PRIVATE LIMITED');

  // Height mappings for container
  const containerHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  // Emblem icon dimension classes
  const iconDimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
    xl: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  // Text sizing classes
  const titleTextSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-xl sm:text-2xl md:text-3xl',
    xl: 'text-2xl sm:text-3xl md:text-4xl',
  };

  const subtitleTextSizes = {
    sm: 'text-[8px] sm:text-[9px]',
    md: 'text-[9px] sm:text-[10px] md:text-[11px]',
    lg: 'text-[10px] sm:text-[11px] md:text-[12px]',
    xl: 'text-[12px] sm:text-[13px] md:text-[14px]',
  };

  // Color theme helpers
  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? 'text-white' : 'text-slate-900 dark:text-white';
  const subtitleTextColor = isDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400';
  const emblemLColor = isDark ? '#FFFFFF' : '#0F172A';

  // If a custom image was uploaded and it's NOT the default logo.svg
  const hasCustomUploadedImage = logoUrl && logoUrl !== '/logo.svg' && logoUrl !== '/logo-white.svg' && !imgError;

  return (
    <div
      id="brand-logo-container"
      className={`inline-flex items-center gap-2 sm:gap-3 group select-none ${className}`}
    >
      {hasCustomUploadedImage ? (
        <div className="flex items-center shrink-0">
          <img
            key={logoUrl}
            src={logoUrl}
            alt={logoText || 'LTS BAGS Logo'}
            className={`${containerHeights[size]} w-auto max-w-[260px] sm:max-w-[320px] object-contain object-center transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-xs`}
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* LB Monogram Vector Emblem */}
          {showIcon && variant !== 'text-only' && (
            <div
              className={`relative shrink-0 ${iconDimensions[size]} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
            >
              <svg
                viewBox="0 0 140 140"
                className="w-full h-full drop-shadow-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`ltsBlueGrad_${theme}_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#0369A1" />
                  </linearGradient>
                </defs>

                {/* Base 'L' Column */}
                <path
                  d="M 6 4 H 42 V 88 H 74 V 122 H 6 Z"
                  fill={emblemLColor}
                />

                {/* Interlocking 'B' Lobe */}
                <path
                  d="M 42 4 H 92 C 118 4 134 18 134 39 C 134 53 124 64 110 70 C 128 76 138 90 138 107 C 138 129 120 140 92 140 H 42 V 116 H 88 C 102 116 110 109 110 99 C 110 89 102 82 88 82 H 42 V 58 H 84 C 98 58 106 51 106 42 C 106 33 98 26 84 26 H 42 Z"
                  fill={`url(#ltsBlueGrad_${theme}_${size})`}
                />
              </svg>
            </div>
          )}

          {/* Typography Brand Wordmark */}
          {showText && variant !== 'icon-only' && (
            <div className="flex flex-col justify-center leading-none text-left">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span
                  className={`font-black tracking-tight ${titleTextSizes[size]} ${primaryTextColor} font-sans`}
                >
                  LTS
                </span>
                <span
                  className={`font-black tracking-tight ${titleTextSizes[size]} text-[#0284C7] dark:text-[#38BDF8] font-sans`}
                >
                  BAGS
                </span>
                {/* Registered ® Symbol */}
                <span className="text-[10px] sm:text-[11px] font-bold text-[#0284C7] dark:text-[#38BDF8] self-start -mt-0.5 ml-0.5">
                  ®
                </span>
              </div>

              {showSubtitle && (
                <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                  <span
                    className={`font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.22em] ${subtitleTextSizes[size]} ${subtitleTextColor}`}
                  >
                    {logoSubtitle || 'PRIVATE LIMITED'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
