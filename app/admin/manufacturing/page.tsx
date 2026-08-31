'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { ManufacturingConfig } from '@/lib/types';
import { 
  Factory, 
  Settings, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Clock, 
  PackageCheck, 
  Plus, 
  Trash2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminManufacturingPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [config, setConfig] = useState<ManufacturingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Local helper states for adding materials / lines
  const [newMaterial, setNewMaterial] = useState('');
  const [newPrintType, setNewPrintType] = useState('');

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/manufacturing');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const res = await fetch('/api/admin/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error('Failed to update manufacturing specifications');
      }

      const updated = await res.json();
      setConfig(updated);
      setMessage('Manufacturing parameters and plant capacities successfully updated!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.trim() || !config) return;
    if (!config.supportedMaterials.includes(newMaterial.trim())) {
      setConfig({
        ...config,
        supportedMaterials: [...config.supportedMaterials, newMaterial.trim()],
      });
    }
    setNewMaterial('');
  };

  const handleRemoveMaterial = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      supportedMaterials: config.supportedMaterials.filter((_, i) => i !== index),
    });
  };

  const handleAddPrintType = () => {
    if (!newPrintType.trim() || !config) return;
    if (!config.customizationOptions.brandingMethods.includes(newPrintType.trim())) {
      setConfig({
        ...config,
        customizationOptions: {
          ...config.customizationOptions,
          brandingMethods: [...config.customizationOptions.brandingMethods, newPrintType.trim()],
        },
      });
    }
    setNewPrintType('');
  };

  const handleRemovePrintType = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      customizationOptions: {
        ...config.customizationOptions,
        brandingMethods: config.customizationOptions.brandingMethods.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      <AdminHeader activeTab="manufacturing" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                PLANT CAPABILITY & OPERATIONAL SPECS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Factory & Manufacturing Capacity Management
            </h1>
            <p className="text-xs text-slate-400">
              Configure daily production throughput, assembly lines, lead times, and supported raw materials.
            </p>
          </div>
        </div>

        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2 shadow-lg">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading || !config ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs font-mono">
            Loading manufacturing configuration...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Plant Infrastructure & Production Capacity */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Factory className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-white text-base">Factory Details & Daily Capacity</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Factory Name / Facility ID</label>
                  <input
                    type="text"
                    value={config.factoryName || ''}
                    onChange={(e) => setConfig({ ...config, factoryName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Facility Address / Location</label>
                  <input
                    type="text"
                    value={config.factoryLocation || ''}
                    onChange={(e) => setConfig({ ...config, factoryLocation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Plant Floor Area (Sq. Ft.)</label>
                  <input
                    type="text"
                    value={config.totalSquareFootage || ''}
                    onChange={(e) => setConfig({ ...config, totalSquareFootage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Daily Bag Production Capacity (Pcs)</label>
                  <input
                    type="number"
                    value={config.dailyCapacityBags || 5000}
                    onChange={(e) => setConfig({ ...config, dailyCapacityBags: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Active Assembly Lines</label>
                  <input
                    type="number"
                    value={config.activeAssemblyLines || 8}
                    onChange={(e) => setConfig({ ...config, activeAssemblyLines: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Capacity Utilization (%)</label>
                  <input
                    type="number"
                    value={config.capacityUtilizationPercentage || 82}
                    onChange={(e) => setConfig({ ...config, capacityUtilizationPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Lead Times & MOQs */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="w-5 h-5 text-sky-400" />
                <h2 className="font-bold text-white text-base">Standard Order MOQs & Lead Times</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Standard B2B MOQ (Pcs)</label>
                  <input
                    type="number"
                    value={config.minimumOrderQuantity || 100}
                    onChange={(e) => setConfig({ ...config, minimumOrderQuantity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Custom OEM / ODM MOQ (Pcs)</label>
                  <input
                    type="number"
                    value={config.customMpq || 500}
                    onChange={(e) => setConfig({ ...config, customMpq: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sampling Turnaround (Days)</label>
                  <input
                    type="text"
                    value={config.standardSamplingDays || '3 to 5 Days'}
                    onChange={(e) => setConfig({ ...config, standardSamplingDays: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bulk Production Lead Time</label>
                  <input
                    type="text"
                    value={config.standardBulkLeadDays || '12 to 18 Days'}
                    onChange={(e) => setConfig({ ...config, standardBulkLeadDays: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Raw Fabrics & Customization Capabilities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Materials */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h2 className="font-bold text-white text-base">Supported Fabric & Materials</h2>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add material (e.g. 1000D Cordura, Vegan Leather)..."
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {config.supportedMaterials?.map((mat, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2"
                    >
                      <span>{mat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Branding & Logo Customization Methods */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-bold text-white text-base">Branding & Logo Methods</h2>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add method (e.g. Rubber 3D Patch, Metal Tag)..."
                    value={newPrintType}
                    onChange={(e) => setNewPrintType(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrintType}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {config.customizationOptions?.brandingMethods?.map((bm, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2"
                    >
                      <span>{bm}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrintType(idx)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Save Controls */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Specs...' : 'Save Manufacturing Configuration'}</span>
              </button>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}
