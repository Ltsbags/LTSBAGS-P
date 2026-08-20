'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { 
  Languages as LanguagesIcon, 
  Plus, 
  Search, 
  Save, 
  Wand2, 
  Check, 
  Globe, 
  AlertCircle, 
  Filter, 
  RefreshCw, 
  Package, 
  Layers, 
  FileText, 
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { LanguageConfig, EntityTranslation } from '@/lib/types';
import { DEFAULT_TRANSLATIONS, INITIAL_TRANSLATIONS_MAP } from '@/lib/i18n/translations';

export default function AdminLanguagesPage() {
  const [activeSubTab, setActiveSubTab] = useState<'languages' | 'ui' | 'entities'>('languages');
  
  // Language settings state
  const [languages, setLanguages] = useState<LanguageConfig[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');
  const [uiTranslationsMap, setUiTranslationsMap] = useState<Record<string, Record<string, string>>>({});
  
  // UI Translations tab state
  const [selectedUiLang, setSelectedUiLang] = useState<string>('hi');
  const [uiSearchQuery, setUiSearchQuery] = useState('');
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [editingUiStrings, setEditingUiStrings] = useState<Record<string, string>>({});
  const [uiSaveSuccess, setUiSaveSuccess] = useState(false);
  const [uiTranslatingKey, setUiTranslatingKey] = useState<string | null>(null);
  const [uiBulkTranslating, setUiBulkTranslating] = useState(false);

  // Entity Translations tab state
  const [selectedEntityType, setSelectedEntityType] = useState<'product' | 'category' | 'blog' | 'slide'>('product');
  const [entityItems, setEntityItems] = useState<any[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [selectedEntityLang, setSelectedEntityLang] = useState<string>('hi');
  const [entityForm, setEntityForm] = useState<Partial<EntityTranslation>>({});
  const [entityLoading, setEntityLoading] = useState(false);
  const [entitySaving, setEntitySaving] = useState(false);
  const [entityTranslating, setEntityTranslating] = useState(false);
  const [entitySuccess, setEntitySuccess] = useState(false);

  // New Language Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLangForm, setNewLangForm] = useState({
    code: '',
    name: '',
    nativeName: '',
    flag: '🌐',
    dir: 'ltr' as 'ltr' | 'rtl',
  });

  const [loading, setLoading] = useState(true);

  const fetchLanguageSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/languages');
      const data = await res.json();
      if (data.success && data.settings) {
        setLanguages(data.settings.languages || []);
        setDefaultLanguage(data.settings.defaultLanguage || 'en');
        const transMap = data.settings.uiTranslations || INITIAL_TRANSLATIONS_MAP;
        setUiTranslationsMap(transMap);
        setEditingUiStrings({ ...(transMap[selectedUiLang.toLowerCase()] || {}) });
      }
    } catch (err) {
      console.error('Error fetching language settings:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedUiLang]);

  const fetchEntityItems = useCallback(async (type: string) => {
    try {
      let endpoint = '/api/products';
      if (type === 'category') endpoint = '/api/categories';
      if (type === 'blog') endpoint = '/api/blogs';
      if (type === 'slide') endpoint = '/api/slides';

      const res = await fetch(endpoint);
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.products || data.categories || data.blogs || data.slides || [];
      setEntityItems(items);
      if (items.length > 0 && !selectedEntityId) {
        setSelectedEntityId(items[0].id);
      }
    } catch (err) {
      console.error('Error fetching entity items:', err);
    }
  }, [selectedEntityId]);

  const fetchSpecificEntityTranslation = useCallback(async () => {
    if (!selectedEntityId) return;
    setEntityLoading(true);
    try {
      const res = await fetch(`/api/translations/entity?entityType=${selectedEntityType}&entityId=${selectedEntityId}&langCode=${selectedEntityLang}`);
      const data = await res.json();
      if (data.success && data.translations && data.translations.length > 0) {
        setEntityForm(data.translations[0]);
      } else {
        // Fallback to base English entity values as template
        const baseItem = entityItems.find((i) => i.id === selectedEntityId);
        if (baseItem) {
          setEntityForm({
            entityType: selectedEntityType,
            entityId: selectedEntityId,
            langCode: selectedEntityLang,
            name: baseItem.name || baseItem.title || '',
            title: baseItem.title || baseItem.name || '',
            shortDesc: baseItem.shortDesc || baseItem.excerpt || baseItem.description || '',
            fullDesc: baseItem.fullDesc || baseItem.content || '',
            materials: baseItem.materials || '',
            metaTitle: baseItem.metaTitle || '',
            metaDescription: baseItem.metaDescription || '',
            metaKeywords: baseItem.metaKeywords || '',
            slug: baseItem.slug || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching entity translation:', err);
    } finally {
      setEntityLoading(false);
    }
  }, [selectedEntityId, selectedEntityType, selectedEntityLang, entityItems]);

  // Load language settings on mount
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/languages');
        const data = await res.json();
        if (!ignore && data.success && data.settings) {
          setLanguages(data.settings.languages || []);
          setDefaultLanguage(data.settings.defaultLanguage || 'en');
          const transMap = data.settings.uiTranslations || INITIAL_TRANSLATIONS_MAP;
          setUiTranslationsMap(transMap);
          setEditingUiStrings({ ...(transMap[selectedUiLang.toLowerCase()] || {}) });
        }
      } catch (err) {
        console.error('Error fetching language settings:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [selectedUiLang]);

  // Handle changing UI target language
  const handleSelectUiLang = (lang: string) => {
    setSelectedUiLang(lang);
    const langMap = uiTranslationsMap[lang.toLowerCase()] || {};
    setEditingUiStrings({ ...langMap });
  };

  // Load Entity list whenever EntityType changes
  useEffect(() => {
    let ignore = false;
    const loadItems = async () => {
      try {
        let endpoint = '/api/products';
        if (selectedEntityType === 'category') endpoint = '/api/categories';
        if (selectedEntityType === 'blog') endpoint = '/api/blogs';
        if (selectedEntityType === 'slide') endpoint = '/api/slides';

        const res = await fetch(endpoint);
        const data = await res.json();
        if (!ignore) {
          const items = Array.isArray(data) ? data : data.products || data.categories || data.blogs || data.slides || [];
          setEntityItems(items);
          if (items.length > 0 && !selectedEntityId) {
            setSelectedEntityId(items[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching entity items:', err);
      }
    };
    loadItems();
    return () => {
      ignore = true;
    };
  }, [selectedEntityType, selectedEntityId]);

  // Load specific Entity Translation whenever entityId or target lang changes
  useEffect(() => {
    if (!selectedEntityId || !selectedEntityLang) return;
    let ignore = false;
    const loadTranslation = async () => {
      try {
        const res = await fetch(`/api/translations/entity?entityType=${selectedEntityType}&entityId=${selectedEntityId}&langCode=${selectedEntityLang}`);
        const data = await res.json();
        if (!ignore) {
          if (data.success && data.translations && data.translations.length > 0) {
            setEntityForm(data.translations[0]);
          } else {
            // Fallback to base English entity values as template
            const baseItem = entityItems.find((i) => i.id === selectedEntityId);
            if (baseItem) {
              setEntityForm({
                entityType: selectedEntityType,
                entityId: selectedEntityId,
                langCode: selectedEntityLang,
                name: baseItem.name || baseItem.title || '',
                title: baseItem.title || baseItem.name || '',
                shortDesc: baseItem.shortDesc || baseItem.excerpt || baseItem.description || '',
                fullDesc: baseItem.fullDesc || baseItem.content || '',
                materials: baseItem.materials || '',
                metaTitle: baseItem.metaTitle || '',
                metaDescription: baseItem.metaDescription || '',
                metaKeywords: baseItem.metaKeywords || '',
                slug: baseItem.slug || '',
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching entity translation:', err);
      } finally {
        if (!ignore) setEntityLoading(false);
      }
    };
    loadTranslation();
    return () => {
      ignore = true;
    };
  }, [selectedEntityId, selectedEntityLang, selectedEntityType, entityItems]);

  // Toggle language enabled status
  const handleToggleLanguage = async (code: string) => {
    const updated = languages.map((l) =>
      l.code === code ? { ...l, enabled: !l.enabled } : l
    );
    setLanguages(updated);
    await saveLanguageSettings(updated, defaultLanguage);
  };

  // Set default language
  const handleSetDefault = async (code: string) => {
    setDefaultLanguage(code);
    await saveLanguageSettings(languages, code);
  };

  const saveLanguageSettings = async (langs: LanguageConfig[], defLang: string) => {
    try {
      await fetch('/api/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          languages: langs,
          defaultLanguage: defLang,
        }),
      });
    } catch (err) {
      console.error('Error saving language settings:', err);
    }
  };

  // Add new custom language
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangForm.code || !newLangForm.name) return;

    const newLang: LanguageConfig = {
      code: newLangForm.code.toLowerCase().trim(),
      name: newLangForm.name.trim(),
      nativeName: newLangForm.nativeName.trim() || newLangForm.name.trim(),
      flag: newLangForm.flag || '🌐',
      dir: newLangForm.dir,
      enabled: true,
    };

    const updated = [...languages, newLang];
    setLanguages(updated);
    await saveLanguageSettings(updated, defaultLanguage);
    setIsAddModalOpen(false);
    setNewLangForm({ code: '', name: '', nativeName: '', flag: '🌐', dir: 'ltr' });
  };

  // Save batch UI translations
  const handleSaveUiTranslations = async () => {
    try {
      const res = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_batch',
          langCode: selectedUiLang,
          translations: editingUiStrings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUiSaveSuccess(true);
        setTimeout(() => setUiSaveSuccess(false), 3000);
        setUiTranslationsMap((prev) => ({
          ...prev,
          [selectedUiLang.toLowerCase()]: editingUiStrings,
        }));
      }
    } catch (err) {
      console.error('Error saving UI translations:', err);
    }
  };

  // AI Single UI key auto-translate
  const handleAiTranslateSingleUiKey = async (key: string, sourceText: string) => {
    setUiTranslatingKey(key);
    try {
      const res = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_translate',
          text: sourceText,
          targetLang: selectedUiLang,
        }),
      });
      const data = await res.json();
      if (data.success && data.translatedText) {
        setEditingUiStrings((prev) => ({
          ...prev,
          [key]: data.translatedText,
        }));
      }
    } catch (err) {
      console.error('AI translate single failed:', err);
    } finally {
      setUiTranslatingKey(null);
    }
  };

  // AI Bulk auto-translate missing UI keys
  const handleAiBulkTranslateMissingUi = async () => {
    setUiBulkTranslating(true);
    const updatedMap = { ...editingUiStrings };
    
    for (const [key, defaultVal] of Object.entries(DEFAULT_TRANSLATIONS)) {
      if (!updatedMap[key] || updatedMap[key].trim() === '') {
        try {
          const res = await fetch('/api/translations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'auto_translate',
              text: defaultVal,
              targetLang: selectedUiLang,
            }),
          });
          const data = await res.json();
          if (data.success && data.translatedText) {
            updatedMap[key] = data.translatedText;
          }
        } catch (e) {
          console.error(`Failed auto-translating ${key}`, e);
        }
      }
    }

    setEditingUiStrings(updatedMap);
    setUiBulkTranslating(false);
  };

  // Save Entity Translation
  const handleSaveEntityTranslation = async () => {
    setEntitySaving(true);
    try {
      const res = await fetch('/api/translations/entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          entityType: selectedEntityType,
          entityId: selectedEntityId,
          langCode: selectedEntityLang,
          translation: entityForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEntitySuccess(true);
        setTimeout(() => setEntitySuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving entity translation:', err);
    } finally {
      setEntitySaving(false);
    }
  };

  // AI Auto-translate entity
  const handleAiTranslateEntity = async () => {
    const baseItem = entityItems.find((i) => i.id === selectedEntityId);
    if (!baseItem) return;

    setEntityTranslating(true);
    try {
      const sourceObj = {
        name: baseItem.name || baseItem.title,
        title: baseItem.title || baseItem.name,
        shortDesc: baseItem.shortDesc || baseItem.excerpt || baseItem.description,
        fullDesc: baseItem.fullDesc || baseItem.content,
        materials: baseItem.materials,
        metaTitle: baseItem.metaTitle,
        metaDescription: baseItem.metaDescription,
        metaKeywords: baseItem.metaKeywords,
      };

      const res = await fetch('/api/translations/entity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_translate_entity',
          entityType: selectedEntityType,
          entityId: selectedEntityId,
          targetLang: selectedEntityLang,
          sourceEntity: sourceObj,
        }),
      });

      const data = await res.json();
      if (data.success && data.translation) {
        setEntityForm(data.translation);
        setEntitySuccess(true);
        setTimeout(() => setEntitySuccess(false), 3000);
      }
    } catch (err) {
      console.error('AI translate entity failed:', err);
    } finally {
      setEntityTranslating(false);
    }
  };

  // Filter UI keys
  const uiKeysList = Object.keys(DEFAULT_TRANSLATIONS).filter((key) => {
    const defaultVal = DEFAULT_TRANSLATIONS[key];
    const currentVal = editingUiStrings[key] || '';
    const isMissing = !currentVal || currentVal.trim() === '';

    if (showMissingOnly && !isMissing) return false;

    if (uiSearchQuery) {
      const q = uiSearchQuery.toLowerCase();
      return (
        key.toLowerCase().includes(q) ||
        defaultVal.toLowerCase().includes(q) ||
        currentVal.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const missingCountForSelectedLang = Object.keys(DEFAULT_TRANSLATIONS).filter(
    (key) => !editingUiStrings[key] || editingUiStrings[key].trim() === ''
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="languages" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <LanguagesIcon className="w-4 h-4" />
              <span>Multi-Language & i18n Translation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Languages & Global Localization
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Enable/disable 23+ global languages, set default language, manage UI dictionary strings, and translate product catalog entities with AI.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/10 transition-all text-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Language</span>
          </button>
        </div>

        {/* Top Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Enabled Languages</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-white">
                {languages.filter((l) => l.enabled).length}
              </span>
              <span className="text-xs text-slate-500">/ {languages.length} Total</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Default Language</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-sky-400 uppercase font-mono">
                {defaultLanguage}
              </span>
              <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-md font-semibold">
                Active
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">UI Dictionary Strings</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-emerald-400">
                {Object.keys(DEFAULT_TRANSLATIONS).length}
              </span>
              <span className="text-xs text-slate-500">Keys</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Missing Strings ({selectedUiLang.toUpperCase()})</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl font-black ${missingCountForSelectedLang > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {missingCountForSelectedLang}
              </span>
              <span className="text-xs text-slate-500">Fallback to EN</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4">
          <button
            onClick={() => setActiveSubTab('languages')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeSubTab === 'languages'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Language Management ({languages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ui')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeSubTab === 'ui'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LanguagesIcon className="w-4 h-4" />
            <span>UI Strings Dictionary</span>
          </button>

          <button
            onClick={() => setActiveSubTab('entities')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeSubTab === 'entities'
                ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Translations</span>
          </button>
        </div>

        {/* TAB 1: LANGUAGES MANAGEMENT */}
        {activeSubTab === 'languages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Supported Initial & Custom Languages</span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                    23 Default
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enable or disable languages available in the website header selector.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((lang) => {
                const isDefault = lang.code === defaultLanguage;
                return (
                  <div
                    key={lang.code}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      lang.enabled
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/50 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{lang.nativeName}</span>
                          <span className="text-xs text-slate-400 font-mono">({lang.code})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{lang.name}</span>
                          {lang.dir === 'rtl' && (
                            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono px-1 rounded uppercase">
                              RTL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDefault ? (
                        <span className="text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(lang.code)}
                          title="Set as Default Language"
                          className="text-[10px] text-slate-400 hover:text-sky-400 underline font-mono"
                        >
                          Make Default
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleLanguage(lang.code)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          lang.enabled ? 'bg-sky-500' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            lang.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: UI DICTIONARY STRINGS */}
        {activeSubTab === 'ui' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-bold text-slate-400">Target Language:</label>
                <select
                  value={selectedUiLang}
                  onChange={(e) => handleSelectUiLang(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-sky-400 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search UI string keys or text..."
                    value={uiSearchQuery}
                    onChange={(e) => setUiSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showMissingOnly}
                    onChange={(e) => setShowMissingOnly(e.target.checked)}
                    className="rounded border-slate-800 text-sky-500 focus:ring-sky-500"
                  />
                  <span>Show Missing Only ({missingCountForSelectedLang})</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAiBulkTranslateMissingUi}
                  disabled={uiBulkTranslating}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{uiBulkTranslating ? 'Translating All...' : 'AI Auto-Translate Missing'}</span>
                </button>

                <button
                  onClick={handleSaveUiTranslations}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Translations</span>
                </button>
              </div>
            </div>

            {uiSaveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>UI translations saved successfully!</span>
              </div>
            )}

            {/* Translation Strings Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="p-3">String Key</th>
                    <th className="p-3">English Default</th>
                    <th className="p-3">{selectedUiLang.toUpperCase()} Translation</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  {uiKeysList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500">
                        No UI string keys match the current filter.
                      </td>
                    </tr>
                  ) : (
                    uiKeysList.map((key) => {
                      const defaultVal = DEFAULT_TRANSLATIONS[key];
                      const currentVal = editingUiStrings[key] || '';
                      const isMissing = !currentVal || currentVal.trim() === '';
                      const isTranslating = uiTranslatingKey === key;

                      return (
                        <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-sky-400 max-w-[180px] truncate">
                            {key}
                          </td>
                          <td className="p-3 text-slate-300 max-w-[250px]">
                            {defaultVal}
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) =>
                                setEditingUiStrings({ ...editingUiStrings, [key]: e.target.value })
                              }
                              placeholder={`Fallback: ${defaultVal}`}
                              className={`w-full px-3 py-1.5 bg-slate-950 border rounded-lg text-xs font-medium focus:outline-none transition-colors ${
                                isMissing
                                  ? 'border-amber-500/40 text-amber-200 placeholder-slate-600'
                                  : 'border-slate-800 text-slate-100 focus:border-sky-500'
                              }`}
                            />
                          </td>
                          <td className="p-3 text-right shrink-0">
                            <button
                              onClick={() => handleAiTranslateSingleUiKey(key, defaultVal)}
                              disabled={isTranslating}
                              className="inline-flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors disabled:opacity-50"
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>{isTranslating ? '...' : 'AI'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATALOG ENTITIES TRANSLATIONS */}
        {activeSubTab === 'entities' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Entity Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-800 pb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  1. Select Entity Type:
                </label>
                <div className="flex gap-2">
                  {[
                    { type: 'product', label: 'Products', icon: Package },
                    { type: 'category', label: 'Categories', icon: Layers },
                    { type: 'blog', label: 'Blogs', icon: FileText },
                    { type: 'slide', label: 'Slides', icon: Sliders },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = selectedEntityType === item.type;
                    return (
                      <button
                        key={item.type}
                        onClick={() => {
                          setSelectedEntityType(item.type as any);
                          setSelectedEntityId('');
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                          isSel
                            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  2. Select Item ({entityItems.length}):
                </label>
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white font-semibold text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500"
                >
                  {entityItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name || item.title || item.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  3. Select Target Language:
                </label>
                <select
                  value={selectedEntityLang}
                  onChange={(e) => setSelectedEntityLang(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-sky-400 font-bold text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-sky-500"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Entity Translation Form */}
            {entityLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading item translation details...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">AI Auto-Translate Entity</span>
                    <span className="text-xs text-slate-400">
                      Translate title, description, specifications, and meta fields into {selectedEntityLang.toUpperCase()} in 1 click.
                    </span>
                  </div>

                  <button
                    onClick={handleAiTranslateEntity}
                    disabled={entityTranslating}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{entityTranslating ? 'Translating with Gemini...' : '1-Click AI Translate'}</span>
                  </button>
                </div>

                {entitySuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Entity translation saved successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name / Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Translated Name / Title ({selectedEntityLang.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={entityForm.name || entityForm.title || ''}
                      onChange={(e) =>
                        setEntityForm({ ...entityForm, name: e.target.value, title: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Translated Short Description:
                    </label>
                    <input
                      type="text"
                      value={entityForm.shortDesc || entityForm.excerpt || ''}
                      onChange={(e) =>
                        setEntityForm({ ...entityForm, shortDesc: e.target.value, excerpt: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Full Description / Content */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Translated Full Description / Content:
                    </label>
                    <textarea
                      rows={4}
                      value={entityForm.fullDesc || entityForm.content || ''}
                      onChange={(e) =>
                        setEntityForm({ ...entityForm, fullDesc: e.target.value, content: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* SEO Meta Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Language SEO Meta Title ({selectedEntityLang.toUpperCase()}):
                    </label>
                    <input
                      type="text"
                      value={entityForm.metaTitle || ''}
                      onChange={(e) => setEntityForm({ ...entityForm, metaTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* SEO Meta Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Language Meta Keywords:
                    </label>
                    <input
                      type="text"
                      value={entityForm.metaKeywords || ''}
                      onChange={(e) => setEntityForm({ ...entityForm, metaKeywords: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* SEO Meta Description */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Language SEO Meta Description:
                    </label>
                    <textarea
                      rows={2}
                      value={entityForm.metaDescription || ''}
                      onChange={(e) => setEntityForm({ ...entityForm, metaDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    onClick={handleSaveEntityTranslation}
                    disabled={entitySaving}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{entitySaving ? 'Saving Translation...' : 'Save Entity Translation'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Custom Language Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Add Custom Language</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLanguage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Language Code (e.g. &quot;sv&quot;, &quot;pl&quot;, &quot;vi&quot;):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sv"
                  value={newLangForm.code}
                  onChange={(e) => setNewLangForm({ ...newLangForm, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">English Display Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swedish"
                  value={newLangForm.name}
                  onChange={(e) => setNewLangForm({ ...newLangForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Native Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Svenska"
                  value={newLangForm.nativeName}
                  onChange={(e) => setNewLangForm({ ...newLangForm, nativeName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Flag Emoji:</label>
                  <input
                    type="text"
                    value={newLangForm.flag}
                    onChange={(e) => setNewLangForm({ ...newLangForm, flag: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Direction:</label>
                  <select
                    value={newLangForm.dir}
                    onChange={(e) => setNewLangForm({ ...newLangForm, dir: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold shadow-md"
                >
                  Add Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
