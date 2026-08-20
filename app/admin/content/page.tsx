'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { SiteSettings } from '@/lib/types';
import { 
  Globe, 
  Save, 
  Check, 
  Building2, 
  Award, 
  HelpCircle, 
  Factory, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

export default function AdminContentPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'about' | 'manufacturing' | 'quality' | 'faq'>('about');

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setSettings(data);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save content settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminHeader activeTab="content" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Globe className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">Website Content CMS</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Edit About Us copy, manufacturing highlights, quality compliance standards, and FAQ text.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-sky-500/20"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : savedSuccess ? 'Saved Successfully!' : 'Save Content Changes'}</span>
          </button>
        </div>

        {/* Content Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>About LTS Bags</span>
          </button>
          <button
            onClick={() => setActiveTab('manufacturing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'manufacturing'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Manufacturing Capabilities</span>
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quality'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Quality & Certification</span>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'faq'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>B2B FAQs</span>
          </button>
        </div>

        {/* Content Form Panels */}
        {loading || !settings ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading website content...
          </div>
        ) : (
          <div className="mt-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
            {activeTab === 'about' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" /> Company Profile & Vision
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Company Headline / Tagline</label>
                  <input
                    type="text"
                    value={settings.about?.headline || ''}
                    onChange={(e) => setSettings({ ...settings, about: { ...settings.about, headline: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">About LTS Bags Story & Overview</label>
                  <textarea
                    rows={5}
                    value={settings.about?.storyContent || ''}
                    onChange={(e) => setSettings({ ...settings, about: { ...settings.about, storyContent: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mission Title</label>
                    <input
                      type="text"
                      value={settings.about?.missionTitle || ''}
                      onChange={(e) => setSettings({ ...settings, about: { ...settings.about, missionTitle: e.target.value } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Vision Title</label>
                    <input
                      type="text"
                      value={settings.about?.visionTitle || ''}
                      onChange={(e) => setSettings({ ...settings, about: { ...settings.about, visionTitle: e.target.value } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manufacturing' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Factory className="w-4 h-4 text-amber-400" /> Factory Machinery & Plant Specifications
                </h3>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Key Machinery Highlight 1</span>
                    <span className="text-amber-400 font-mono">Automated Juki Sewing Machines</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="150+ Heavy-duty computerized Juki stitching lines for high-density 1680D fabrics."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  />

                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-2">
                    <span>Key Machinery Highlight 2</span>
                    <span className="text-amber-400 font-mono">Laser Fabric Cutting Tables</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="Precision computer-guided multi-layer laser cutters ensuring zero fabric distortion."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  />

                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 pt-2">
                    <span>Key Machinery Highlight 3</span>
                    <span className="text-amber-400 font-mono">3D Computerized Embroidery</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="Japanese Tajima 12-head embroidery machinery for crisp 3D corporate branding."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Quality Testing & Compliance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-emerald-400">Tensile Strap Test (Kg)</label>
                    <input
                      type="text"
                      defaultValue="Tested up to 35 Kg pull-stress"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-emerald-400">Water Resistance Rating</label>
                    <input
                      type="text"
                      defaultValue="Hydrostatic pressure tested 5000mm water column"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" /> Frequently Asked Questions
                </h3>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Q1: What is the Minimum Order Quantity (MOQ)?</label>
                    <input
                      type="text"
                      defaultValue="Standard MOQ is 100 units for stock styles with custom logo, and 250 units for fully custom bag designs."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Q2: How do physical samples work?</label>
                    <input
                      type="text"
                      defaultValue="We provide a physical branded pre-production sample within 5 working days before bulk manufacturing."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
