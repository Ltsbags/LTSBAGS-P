'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { ChevronDown, Globe, Languages as LanguagesIcon } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'mobile' | 'widget';
}

interface WidgetProps {
  quickFlags: Array<{ code: string; flag: string; label: string }>;
  currentLanguageCode: string;
  languages: Array<{ code: string; name: string; nativeName: string; flag: string }>;
  onSelectLanguage: (code: string) => void;
}

function GoogleTranslateWidgetBox({
  quickFlags,
  currentLanguageCode,
  languages,
  onSelectLanguage,
}: WidgetProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center max-w-xs mx-auto">
      {/* 1. Quick Flag Row */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {quickFlags.map((item) => {
          const isSelected = currentLanguageCode === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => onSelectLanguage(item.code)}
              title={item.label}
              className={`text-lg hover:scale-125 transition-transform p-0.5 rounded cursor-pointer ${
                isSelected ? 'ring-2 ring-[#72AFDB] scale-110 font-bold' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {item.flag}
            </button>
          );
        })}
      </div>

      {/* 2. Select Language Dropdown */}
      <div className="relative w-full max-w-[200px]">
        <select
          value={currentLanguageCode}
          onChange={(e) => onSelectLanguage(e.target.value)}
          aria-label="Select Language"
          className="w-full appearance-none bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-md shadow-2xs hover:border-[#72AFDB] focus:outline-none focus:ring-2 focus:ring-[#72AFDB] cursor-pointer text-center"
        >
          <option value="" disabled>Select Language</option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400" />
      </div>

      {/* 3. Powered by Google Translate Label */}
      <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-0.5 select-none">
        <span>Powered by</span>
        <span className="font-bold tracking-tight">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
        <span className="font-medium text-slate-600 dark:text-slate-300">Translate</span>
      </div>
    </div>
  );
}

export default function LanguageSelector({ variant = 'header' }: LanguageSelectorProps) {
  const { currentLanguage, languages, setLanguage, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Top quick flag list as shown in the screenshot
  const quickFlags = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'fr', flag: '🇫🇷', label: 'French' },
    { code: 'de', flag: '🇩🇪', label: 'German' },
    { code: 'it', flag: '🇮🇹', label: 'Italian' },
    { code: 'pt', flag: '🇵🇹', label: 'Portuguese' },
    { code: 'ru', flag: '🇷🇺', label: 'Russian' },
    { code: 'es', flag: '🇪🇸', label: 'Spanish' },
    { code: 'zh', flag: '🇨🇳', label: 'Chinese' },
    { code: 'hi', flag: '🇮🇳', label: 'Hindi' },
    { code: 'ar', flag: '🇸🇦', label: 'Arabic' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: string) => {
    if (code) {
      setLanguage(code);
      setIsOpen(false);
    }
  };

  if (variant === 'widget') {
    return (
      <GoogleTranslateWidgetBox
        quickFlags={quickFlags}
        currentLanguageCode={currentLanguage.code}
        languages={languages}
        onSelectLanguage={handleSelectLanguage}
      />
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="w-full py-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2 px-1">
          <Globe className="w-3.5 h-3.5 text-[#72AFDB]" />
          <span>Language Settings</span>
        </label>
        <GoogleTranslateWidgetBox
          quickFlags={quickFlags}
          currentLanguageCode={currentLanguage.code}
          languages={languages}
          onSelectLanguage={handleSelectLanguage}
        />
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Top Header/Footer Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
          variant === 'footer'
            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-100 dark:bg-slate-800 dark:border-slate-700'
        }`}
      >
        <LanguagesIcon className="w-3.5 h-3.5 text-[#72AFDB] shrink-0" />
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="font-semibold truncate max-w-[110px]">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover showing Google Translate Widget */}
      {isOpen && (
        <div
          className={`absolute ${
            isRtl ? 'left-0' : 'right-0'
          } mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          <GoogleTranslateWidgetBox
            quickFlags={quickFlags}
            currentLanguageCode={currentLanguage.code}
            languages={languages}
            onSelectLanguage={handleSelectLanguage}
          />
        </div>
      )}
    </div>
  );
}

