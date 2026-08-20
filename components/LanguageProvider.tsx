'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language, INITIAL_LANGUAGES, getLanguageByCode } from '@/lib/i18n/languages';
import { DEFAULT_TRANSLATIONS, INITIAL_TRANSLATIONS_MAP, getTranslation } from '@/lib/i18n/translations';

interface LanguageContextType {
  currentLanguage: Language;
  languages: Language[];
  setLanguage: (code: string) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: INITIAL_LANGUAGES[0],
  languages: INITIAL_LANGUAGES,
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  isRtl: false,
  isLoading: false,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [languages, setLanguages] = useState<Language[]>(INITIAL_LANGUAGES);
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(INITIAL_LANGUAGES[0]);
  const [customUiTranslations, setCustomUiTranslations] = useState<Record<string, Record<string, string>>>(INITIAL_TRANSLATIONS_MAP);
  const [isLoading, setIsLoading] = useState(false);

  const applyLanguageDirection = (lang: Language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', lang.dir);
      document.documentElement.setAttribute('lang', lang.code);
      if (lang.dir === 'rtl') {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  };

  // Setup Google Translate Script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).googleTranslateElementInit = () => {
      try {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      } catch (err) {
        console.warn('Google Translate init suppressed:', err);
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.warn('Google Translate script could not be loaded in sandbox.');
      };
      document.body.appendChild(script);
    }
  }, []);

  // Initialize from localStorage or browser settings
  useEffect(() => {
    let savedLangCode = 'en';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lts_lang');
      if (stored) {
        savedLangCode = stored;
      }
    }

    // Fetch latest language settings from backend
    fetch('/api/languages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const loadedLangs = data.settings.languages && data.settings.languages.length > 0 ? data.settings.languages : INITIAL_LANGUAGES;
          setLanguages(loadedLangs);

          const matched = getLanguageByCode(savedLangCode, loadedLangs);
          setCurrentLanguageState(matched);
          applyLanguageDirection(matched);

          if (data.settings.uiTranslations) {
            setCustomUiTranslations(data.settings.uiTranslations);
          }
        } else {
          const matched = getLanguageByCode(savedLangCode, INITIAL_LANGUAGES);
          setCurrentLanguageState(matched);
          applyLanguageDirection(matched);
        }
      })
      .catch(() => {
        const matched = getLanguageByCode(savedLangCode, INITIAL_LANGUAGES);
        setCurrentLanguageState(matched);
        applyLanguageDirection(matched);
      });
  }, []);

  const setLanguage = (code: string) => {
    const targetLang = getLanguageByCode(code, languages);
    setCurrentLanguageState(targetLang);
    applyLanguageDirection(targetLang);

    if (typeof window !== 'undefined') {
      localStorage.setItem('lts_lang', targetLang.code);
      document.cookie = `lts_lang=${targetLang.code}; path=/; max-age=31536000; SameSite=Lax`;

      // Set googtrans cookie for Google Translate
      const googtransVal = targetLang.code === 'en' ? '' : `/en/${targetLang.code}`;
      document.cookie = `googtrans=${googtransVal}; path=/; max-age=31536000; SameSite=Lax`;
      if (window.location.hostname) {
        document.cookie = `googtrans=${googtransVal}; path=/; domain=${window.location.hostname}; max-age=31536000; SameSite=Lax`;
      }

      // Try triggering Google Translate combo
      const googCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (googCombo) {
        googCombo.value = targetLang.code === 'en' ? '' : targetLang.code;
        googCombo.dispatchEvent(new Event('change'));
      }
    }

    // Fetch UI translations for target language if not loaded
    if (!customUiTranslations[targetLang.code.toLowerCase()]) {
      setIsLoading(true);
      fetch(`/api/translations?lang=${targetLang.code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.translations) {
            setCustomUiTranslations((prev) => ({
              ...prev,
              [targetLang.code.toLowerCase()]: data.translations,
            }));
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langCode = currentLanguage.code;
    const value = getTranslation(langCode, key, customUiTranslations);
    if (value && value !== key) return value;
    return fallback || value || DEFAULT_TRANSLATIONS[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages: languages.filter((l) => l.enabled),
        setLanguage,
        t,
        isRtl: currentLanguage.dir === 'rtl',
        isLoading,
      }}
    >
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
      {children}
    </LanguageContext.Provider>
  );
}

