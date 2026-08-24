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
  showSubtitle = false,
  showIcon = true,
  showText = false,
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
  const logoSubtitle = overrideLogoSubtitle !== undefined ? overrideLogoSubtitle : (fetchedSettings?.logoSubtitle || '');

  // Image height mapping
  const imgHeights = {
    sm: 'h-8 sm:h-9 max-w-[180px]',
    md: 'h-10 sm:h-12 max-w-[240px]',
    lg: 'h-14 sm:h-16 max-w-[300px]',
    xl: 'h-16 sm:h-20 max-w-[360px]',
  };

  // Dimension classes for SVG Mark
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {logoUrl && !imgError ? (
        <div className="flex items-center">
          <img
            key={logoUrl}
            src={logoUrl}
            alt={logoText || 'Company Logo'}
            className={`${imgHeights[size]} w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-xs`}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          {/* Default SVG Geometric Logo Emblem */}
          <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center transition-transform group-hover:scale-105`}>
            <svg
              viewBox="0 0 160 180"
              className="w-full h-full drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 12 12 L 52 12 L 52 132 L 80 132 L 80 168 L 12 168 Z"
                fill={theme === 'dark' ? '#FFFFFF' : '#1E293B'}
              />
              <path
                d="M 52 12 L 112 12 C 140 12 156 28 156 52 C 156 68 146 80 132 86 C 150 92 160 108 160 128 C 160 156 140 168 112 168 L 80 168 L 80 132 L 110 132 C 124 132 130 124 130 112 C 130 100 122 92 106 92 L 52 92 Z M 52 48 L 106 48 C 120 48 126 54 126 64 C 126 74 120 80 106 80 L 52 80 Z"
                fill="#72AFDB"
              />
            </svg>
          </div>

          {showText && (
            <div className="flex flex-col justify-center leading-none">
              <span className="font-extrabold text-sm tracking-wider text-slate-800 dark:text-white">
                {logoText}
              </span>
              {showSubtitle && logoSubtitle && (
                <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">
                  {logoSubtitle}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
