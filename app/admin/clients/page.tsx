'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import ImageUploader from '@/components/ImageUploader';
import { Client } from '@/lib/types';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Search, 
  ExternalLink,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientLogoUrl, setClientLogoUrl] = useState('');
  const [clientWebsiteUrl, setClientWebsiteUrl] = useState('');
  const [clientIsActive, setClientIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (Array.isArray(data)) {
        setClients(data);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/clients');
        const data = await res.json();
        if (!ignore && Array.isArray(data)) {
          setClients(data);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setClientName('');
    setClientLogoUrl('');
    setClientWebsiteUrl('');
    setClientIsActive(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setClientName(client.name);
    setClientLogoUrl(client.logoUrl);
    setClientWebsiteUrl(client.websiteUrl || '');
    setClientIsActive(client.isActive);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setFormError('Client Name is required.');
      return;
    }
    if (!clientLogoUrl) {
      setFormError('Please upload a client logo image from your device.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingClient ? editingClient.id : undefined,
          name: clientName.trim(),
          logoUrl: clientLogoUrl,
          websiteUrl: clientWebsiteUrl.trim(),
          isActive: clientIsActive,
          displayOrder: editingClient ? editingClient.displayOrder : clients.length + 1,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchClients();
      } else {
        setFormError(data.error || 'Failed to save client.');
      }
    } catch (err) {
      console.error('Save client error:', err);
      setFormError('Network error while saving client.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...client,
          isActive: !client.isActive,
        }),
      });
      if (res.ok) {
        fetchClients();
      }
    } catch (err) {
      console.error('Error toggling client status:', err);
    }
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete client "${client.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/clients?id=${client.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchClients();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete client.');
      }
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Error deleting client.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clients.length) return;

    const newClients = [...clients];
    const temp = newClients[index];
    newClients[index] = newClients[targetIndex];
    newClients[targetIndex] = temp;

    // Recalculate displayOrders
    const orders = newClients.map((c, idx) => ({
      id: c.id,
      displayOrder: idx + 1,
    }));

    setClients(newClients);

    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          orders,
        }),
      });
    } catch (err) {
      console.error('Error reordering clients:', err);
      fetchClients();
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.websiteUrl && c.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="clients" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white font-serif tracking-tight">
                  Our Corporate Clients & Brand Partners
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Manage client logos, reorder display hierarchy, toggle active status, and add company links.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client Logo</span>
            </button>
          </div>

          {/* Search & Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search clients by name or website..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <div>
                Total: <span className="font-bold text-white">{clients.length}</span>
              </div>
              <div>
                Active: <span className="font-bold text-emerald-400">{clients.filter((c) => c.isActive).length}</span>
              </div>
              <div>
                Disabled: <span className="font-bold text-slate-500">{clients.filter((c) => !c.isActive).length}</span>
              </div>
            </div>
          </div>

          {/* Client Logos Grid / List */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
              <p className="text-xs font-mono">Loading client database...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-16 text-center bg-slate-800/40 border border-slate-800 rounded-2xl p-8 space-y-4">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white font-serif">No Clients Found</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {searchQuery ? 'No client matches your search query.' : 'Get started by uploading your first corporate client logo.'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={handleOpenAddModal}
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
                >
                  Upload First Client Logo
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client, index) => (
                <div
                  key={client.id}
                  className={`bg-slate-800/90 border rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl relative flex flex-col justify-between ${
                    client.isActive
                      ? 'border-slate-700/80 hover:border-amber-500/50'
                      : 'border-slate-800 opacity-60 bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Order Badge & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
                        Order #{index + 1}
                      </span>

                      <button
                        onClick={() => handleToggleActive(client)}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border transition-colors ${
                          client.isActive
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {client.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-500" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Logo Box Preview */}
                    <div className="w-full h-32 bg-white rounded-xl p-4 flex items-center justify-center border border-slate-200 overflow-hidden shadow-inner relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={client.logoUrl}
                        alt={client.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Client Name & Website */}
                    <div>
                      <h3 className="font-bold text-white text-base font-serif tracking-tight truncate">
                        {client.name}
                      </h3>
                      {client.websiteUrl ? (
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 mt-0.5 truncate"
                        >
                          <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                          <span className="truncate">{client.websiteUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono italic">No website URL specified</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2 text-xs">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === filteredClients.length - 1}
                        title="Move Down"
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(client)}
                        className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(client)}
                        className="bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white font-serif">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>{editingClient ? 'Edit Corporate Client' : 'Add New Corporate Client'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-950/80 border border-red-500/50 p-3 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Client / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infosys Limited, TCS, Reliance Retail"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Client Logo Image Upload (Device/Gallery Upload) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Client Logo Image *
                </label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <ImageUploader
                    value={clientLogoUrl}
                    onChange={(url) => setClientLogoUrl(url)}
                    label=""
                    aspectRatio="video"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Direct upload from device. Supports PNG, JPG, JPEG, WEBP with transparent or white background.
                </p>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Client Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://www.company.com"
                  value={clientWebsiteUrl}
                  onChange={(e) => setClientWebsiteUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="block text-xs font-bold text-white">Display Status</span>
                  <span className="block text-[11px] text-slate-400">Show this client logo on public website</span>
                </div>

                <button
                  type="button"
                  onClick={() => setClientIsActive(!clientIsActive)}
                  className={`px-4 py-1.5 rounded-full font-bold text-xs border transition-colors ${
                    clientIsActive
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-700'
                  }`}
                >
                  {clientIsActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Client...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{editingClient ? 'Update Client Logo' : 'Save Client Logo'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
