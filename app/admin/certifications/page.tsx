'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Certification } from '@/lib/types';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    issuingOrganization: string;
    certificateNumber: string;
    issueDate: string;
    expiryDate: string;
    imageUrl: string;
    pdfUrl: string;
    description: string;
    displayOrder: number;
    isActive: boolean;
  }>({
    name: '',
    issuingOrganization: '',
    certificateNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-12-31',
    imageUrl: '',
    pdfUrl: '',
    description: '',
    displayOrder: 1,
    isActive: true,
  });

  const loadCertifications = useCallback(async () => {
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) {
        const data = await res.json();
        setCerts(data);
      }
    } catch (err) {
      console.error('Failed to load certifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/certifications')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setCerts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load certifications:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuingOrganization: '',
      certificateNumber: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-12-31',
      imageUrl: '',
      pdfUrl: '',
      description: '',
      displayOrder: certs.length + 1,
      isActive: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      id: cert.id,
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      certificateNumber: cert.certificateNumber,
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate,
      imageUrl: cert.imageUrl || '',
      pdfUrl: cert.pdfUrl || '',
      description: cert.description || '',
      displayOrder: cert.displayOrder,
      isActive: cert.isActive,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete certification "${name}"?`)) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCerts((prev) => prev.filter((c) => c.id !== id));
        setSuccessMsg('Certification deleted successfully');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to delete certification:', err);
    }
  };

  const handleToggleActive = async (cert: Certification) => {
    try {
      const updated = { ...cert, isActive: !cert.isActive };
      const res = await fetch(`/api/certifications/${cert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setCerts((prev) => prev.map((c) => (c.id === cert.id ? { ...c, isActive: !c.isActive } : c)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.issuingOrganization || !formData.certificateNumber || !formData.expiryDate) {
      setError('Please fill in all required fields (Name, Issuing Body, Certificate Number, Expiry Date)');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const endpoint = formData.id ? `/api/certifications/${formData.id}` : '/api/certifications';
      const method = formData.id ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to save certification');
      }

      await loadCertifications();
      setIsModalOpen(false);
      setSuccessMsg(formData.id ? 'Certification updated!' : 'Certification added!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving certification');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="certifications" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
                <Award className="w-4 h-4" />
                <span>Compliance & Audit Records</span>
              </div>
              <h1 className="text-2xl font-black text-white font-serif">
                Quality & Factory Certifications
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Manage your verified compliance certificates (ISO 9001:2015, AQL 2.5 protocol, MSME, Export Inspection) displayed on product pages & trust badges.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition-all text-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>

          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3" />
              Loading factory certifications...
            </div>
          ) : certs.length === 0 ? (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center space-y-4">
              <Award className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-300">No Certifications Recorded</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Add your ISO, quality control, or government registration credentials to boost enterprise trust.
              </p>
              <button
                onClick={openCreateModal}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add First Certificate
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert) => (
                <div
                  key={cert.id}
                  className={`bg-slate-900 rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-5 ${
                    cert.isActive ? 'border-slate-800 hover:border-amber-500/50 shadow-sm' : 'border-red-900/40 opacity-70'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                        Order #{cert.displayOrder}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white font-serif leading-snug">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium mt-1">
                        {cert.issuingOrganization}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Cert No:</span>
                        <span className="font-mono text-slate-200 font-bold">{cert.certificateNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Valid Until:</span>
                        <span className="font-mono text-emerald-400 font-bold">{cert.expiryDate}</span>
                      </div>
                    </div>

                    {cert.description && (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleToggleActive(cert)}
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border font-medium ${
                        cert.isActive
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/80'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {cert.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{cert.isActive ? 'Active' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id, cert.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-colors"
                        title="Delete"
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{editingCert ? 'Edit Certification' : 'Add Certification'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Certificate Name & Standard <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ISO 9001:2015 Quality Management System"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              {/* Issuing Organization */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Issuing Body / Registrar / Accreditation Agency <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.issuingOrganization}
                  onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                  placeholder="e.g. TUV NORD / Bureau of Indian Standards"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              {/* Cert Number & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Certificate Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    placeholder="e.g. ISO-9001-2015-LTS-8842"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Expiry Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Scope & Compliance Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Certified for bulk pattern cutting, heavy stitching, and global export of executive luggage."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Image URL & PDF URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Badge Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Audit PDF Document URL</label>
                  <input
                    type="url"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="https://.../iso-cert.pdf"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded bg-slate-950 border-slate-800"
                    />
                    <span>Active on Website</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingCert ? 'Update Certificate' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
