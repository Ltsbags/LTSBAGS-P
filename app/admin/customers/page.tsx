'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useTransition } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Customer } from '@/lib/types';
import { 
  Users, 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileSpreadsheet, 
  ExternalLink,
  MessageSquare,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function CustomersAdminPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: '',
    website: '',
    industry: 'Corporate Gifting',
    customerType: 'CORPORATE',
    leadSource: 'Website Enquiry',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      whatsapp: '',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      address: '',
      website: '',
      industry: 'Corporate Gifting',
      customerType: 'CORPORATE',
      leadSource: 'Website Enquiry',
      notes: '',
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMsg('Customer name and email are required');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingCustomer?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save customer');
      }

      setSuccessMsg(`Customer ${editingCustomer ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        setShowModal(false);
        fetchCustomers();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete customer');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete customer');
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (typeFilter === 'ALL') return true;
    return c.customerType === typeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="customers" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>CRM & Client Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-serif">Customer CRM</h1>
            <p className="text-xs text-slate-400 mt-1">
              Maintain verified B2B customer accounts, corporate procurement officers, purchase histories, and contact info.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/customers?export=csv"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
              download
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={handleOpenCreate}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/80 border border-slate-800/80 p-4 rounded-xl">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, company, email, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 pl-10 pr-4 py-2 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'CORPORATE', 'WHOLESALER', 'RETAILER', 'INSTITUTION', 'EXPORTER'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  typeFilter === type
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">Loading customer directory...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-12 h-12 mx-auto text-slate-600" />
              <div className="text-slate-300 font-bold text-sm">No customers found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your first corporate procurement contact or wait for incoming RFQ submissions.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Client / Company</th>
                    <th className="py-3.5 px-4 font-bold">Contact Info</th>
                    <th className="py-3.5 px-4 font-bold">Location</th>
                    <th className="py-3.5 px-4 font-bold">Category & Type</th>
                    <th className="py-3.5 px-4 font-bold">Source</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-850/50 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        {c.companyName && (
                          <div className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{c.companyName}</span>
                          </div>
                        )}
                        {c.industry && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{c.industry}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${c.email}`} className="hover:text-amber-400 transition-colors">{c.email}</a>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <a href={`tel:${c.phone}`} className="hover:text-amber-400 transition-colors">{c.phone}</a>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{[c.city, c.state, c.country].filter(Boolean).join(', ') || 'India'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-slate-950 border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                          {c.customerType || 'CORPORATE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-400">{c.leadSource || 'Website'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${(c.whatsapp || c.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                            title="Edit Customer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white font-serif mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{editingCustomer ? 'Edit Customer Profile' : 'Add New Customer Profile'}</span>
              </h2>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Acme Corp India"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@acmecorp.com"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Phone / Mobile Number</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Customer Type</label>
                    <select
                      value={formData.customerType || 'CORPORATE'}
                      onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="CORPORATE">Corporate Client</option>
                      <option value="WHOLESALER">Wholesale Distributor</option>
                      <option value="RETAILER">Retail Brand / Chain</option>
                      <option value="INSTITUTION">School / University</option>
                      <option value="EXPORTER">Export Merchant</option>
                      <option value="INDIVIDUAL">Individual Buyer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Industry Sector</label>
                    <input
                      type="text"
                      value={formData.industry || ''}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. IT & Software / Banking"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Lead Source</label>
                    <input
                      type="text"
                      value={formData.leadSource || ''}
                      onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                      placeholder="e.g. Google Search / Direct RFQ"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai / Delhi / Bengaluru"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="India / UAE / USA"
                      className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Internal Notes & Purchase Preferences</label>
                  <textarea
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Specific branding requirements, material preferences, MOQ history, target budgets..."
                    className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingCustomer ? 'Update Customer' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
