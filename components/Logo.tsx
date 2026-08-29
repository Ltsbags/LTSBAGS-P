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
  overrideLogoDarkUrl?: string;
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
  overrideLogoDarkUrl,
  overrideLogoText,
  overrideLogoSubtitle,
}: LogoProps) {
  const [fetchedSettings, setFetchedSettings] = useState<{
    logoUrl?: string;
    logoDarkUrl?: string;
    logoText?: string;
    logoSubtitle?: string;
  } | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    const loadSettings = () => {
      fetch('/api/settings')
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (active && data && !data.error) {
            setFetchedSettings(data);
            setImgError(false);
          }
        })
        .catch(() => {
          // Silently retain defaults
        });
    };

    loadSettings();

    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setFetchedSettings(customEvent.detail);
        setImgError(false);
      } else {
        loadSettings();
      }
    };

    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    window.addEventListener('storage', loadSettings);

    return () => {
      active = false;
      window.removeEventListener('site-settings-updated', handleSettingsUpdate);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  const isDark = theme === 'dark';

  // Determine active logo URL based on theme and overrides
  const effectiveLogoUrl = overrideLogoUrl !== undefined ? overrideLogoUrl : (fetchedSettings?.logoUrl || '');
  const effectiveDarkLogoUrl = overrideLogoDarkUrl !== undefined 
    ? overrideLogoDarkUrl 
    : (fetchedSettings?.logoDarkUrl || '');

  const activeLogoUrl = isDark && effectiveDarkLogoUrl ? effectiveDarkLogoUrl : effectiveLogoUrl;

  const logoText = overrideLogoText !== undefined ? overrideLogoText : (fetchedSettings?.logoText || 'LTS BAGS');
  const logoSubtitle = overrideLogoSubtitle !== undefined ? overrideLogoSubtitle : (fetchedSettings?.logoSubtitle || 'PRIVATE LIMITED');

  // Reset img error if activeLogoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [activeLogoUrl]);

  // Height mappings for container - increased for crisp, full view of custom uploaded logos
  const containerHeights = {
    sm: 'h-9 sm:h-10 max-h-10',
    md: 'h-12 sm:h-14 md:h-16 max-h-16',
    lg: 'h-14 sm:h-16 md:h-18 max-h-18',
    xl: 'h-18 sm:h-22 md:h-24 max-h-24',
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
  const ltsGreyColor = isDark ? 'text-slate-100' : 'text-[#8F949B]';
  const bagsBlueColor = isDark ? 'text-[#38BDF8]' : 'text-[#6CA4D9]';
  const subtitleTextColor = isDark ? 'text-slate-400' : 'text-[#94A3B8]';
  const emblemLColor = isDark ? '#FFFFFF' : '#8F949B';
  const emblemBGradientId = `ltsBlueGrad_${theme}_${size}`;

  // If a custom image was uploaded or a specific logo URL is configured
  const hasCustomUploadedImage = Boolean(activeLogoUrl && !imgError);

  if (variant === 'vertical') {
    return (
      <div
        id="brand-logo-container"
        className={`inline-flex flex-col items-center justify-center gap-2 group select-none ${className}`}
      >
        {hasCustomUploadedImage ? (
          <img
            key={activeLogoUrl}
            src={activeLogoUrl}
            alt={logoText || 'LTS BAGS Logo'}
            className={`${containerHeights[size]} w-auto max-w-full object-contain object-center transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-xs`}
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            {/* Emblem */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 130 130"
                className="w-full h-full drop-shadow-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`${emblemBGradientId}_vert`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#6CA4D9'} />
                    <stop offset="100%" stopColor={isDark ? '#0284C7' : '#5599D0'} />
                  </linearGradient>
                </defs>
                <path fill={emblemLColor} d="M 0 0 H 34 V 82 H 66 L 68 116 H 0 Z" />
                <path
                  fill={`url(#${emblemBGradientId}_vert)`}
                  fillRule="evenodd"
                  d="M 34 0 H 82 C 106 0 120 12 120 31 C 120 43 111 52 98 57 C 114 62 124 73 124 90 C 124 110 108 120 82 120 H 74 L 72 100 H 80 C 95 100 102 94 102 85 C 102 76 95 70 80 70 H 34 V 48 H 76 C 90 48 98 42 98 33 C 98 24 90 18 76 18 H 34 Z"
                />
              </svg>
            </div>

            {/* LTS BAGS */}
            <div className="flex items-center gap-1.5 leading-none">
              <span className={`font-black tracking-tight ${titleTextSizes[size]} ${ltsGreyColor} font-sans`}>
                LTS
              </span>
              <span className={`font-black tracking-tight ${titleTextSizes[size]} ${bagsBlueColor} font-sans`}>
                BAGS
              </span>
              <span className={`text-[10px] sm:text-[11px] font-bold ${bagsBlueColor} self-start -mt-0.5 ml-0.5`}>
                ®
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      id="brand-logo-container"
      className={`inline-flex items-center gap-2 sm:gap-3 group select-none ${className}`}
    >
      {hasCustomUploadedImage ? (
        <div className="flex items-center shrink-0">
          <img
            key={activeLogoUrl}
            src={activeLogoUrl}
            alt={logoText || 'LTS BAGS Logo'}
            className={`${containerHeights[size]} w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[420px] object-contain object-left transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-xs`}
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
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
                viewBox="0 0 130 130"
                className="w-full h-full drop-shadow-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={emblemBGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#6CA4D9'} />
                    <stop offset="100%" stopColor={isDark ? '#0284C7' : '#5599D0'} />
                  </linearGradient>
                </defs>

                {/* Base 'L' Column */}
                <path
                  d="M 0 0 H 34 V 82 H 66 L 68 116 H 0 Z"
                  fill={emblemLColor}
                />

                {/* Interlocking 'B' Lobe */}
                <path
                  d="M 34 0 H 82 C 106 0 120 12 120 31 C 120 43 111 52 98 57 C 114 62 124 73 124 90 C 124 110 108 120 82 120 H 74 L 72 100 H 80 C 95 100 102 94 102 85 C 102 76 95 70 80 70 H 34 V 48 H 76 C 90 48 98 42 98 33 C 98 24 90 18 76 18 H 34 Z"
                  fill={`url(#${emblemBGradientId})`}
                  fillRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Typography Brand Wordmark */}
          {showText && variant !== 'icon-only' && (
            <div className="flex flex-col justify-center leading-none text-left">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span
                  className={`font-black tracking-tight ${titleTextSizes[size]} ${ltsGreyColor} font-sans`}
                >
                  LTS
                </span>
                <span
                  className={`font-black tracking-tight ${titleTextSizes[size]} ${bagsBlueColor} font-sans`}
                >
                  BAGS
                </span>
                {/* Registered ® Symbol */}
                <span className={`text-[10px] sm:text-[11px] font-bold ${bagsBlueColor} self-start -mt-0.5 ml-0.5`}>
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
