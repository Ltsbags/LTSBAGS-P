'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Customer } from '@/lib/types';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  FileSpreadsheet, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  X, 
  PlusCircle, 
  Send,
  Sparkles,
  RefreshCw,
  Tag
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminCustomersPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Activity Log State for detail drawer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState('NOTE');
  const [newActivityDesc, setNewActivityDesc] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
        if (selectedCustomer) {
          const updatedSelected = data.find((c: Customer) => c.id === selectedCustomer.id);
          if (updatedSelected) setSelectedCustomer(updatedSelected);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenAddModal = () => {
    setEditingCustomer({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      whatsapp: '',
      city: '',
      state: '',
      country: 'India',
      gstNumber: '',
      status: 'NEW_LEAD',
      leadSource: 'Direct B2B Enquiry',
      assignedSalesPerson: user?.name || 'Sales Desk',
      tags: ['Corporate B2B'],
      notes: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cust: Customer) => {
    setEditingCustomer({ ...cust });
    setError('');
    setShowModal(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.name || !editingCustomer?.email) {
      setError('Contact name and email address are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCustomer),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save customer record');
      }

      setShowModal(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      setError(err.message || 'Error saving customer');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer account? All associated timeline logs will be removed.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedCustomer?.id === id) setSelectedCustomer(null);
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newActivityTitle.trim()) return;

    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newActivityType,
          title: newActivityTitle,
          description: newActivityDesc,
          author: user?.name || 'Sales Rep',
        }),
      });

      if (res.ok) {
        setNewActivityTitle('');
        setNewActivityDesc('');
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW_LEAD':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">NEW LEAD</span>;
      case 'CONTACTED':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">CONTACTED</span>;
      case 'REQUIREMENT_GATHERED':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">REQUIREMENT GATHERED</span>;
      case 'SAMPLE_REQUESTED':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SAMPLE SENT</span>;
      case 'ACTIVE_CLIENT':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">ACTIVE CLIENT</span>;
      case 'VIP_CLIENT':
        return <span className="bg-amber-500/30 text-amber-200 border border-amber-400/50 text-[10px] font-mono px-2 py-0.5 rounded font-extrabold shadow-sm shadow-amber-500/20">★ VIP CLIENT</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      <AdminHeader activeTab="customers" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                B2B RELATIONSHIP HUB
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Customer CRM & Corporate Accounts
            </h1>
            <p className="text-xs text-slate-400">
              Manage buyers, institutional clients, order histories, and sales interactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by company name, contact, email, phone, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Account Stages</option>
              <option value="NEW_LEAD">New Leads</option>
              <option value="CONTACTED">Contacted</option>
              <option value="REQUIREMENT_GATHERED">Requirement Gathered</option>
              <option value="SAMPLE_REQUESTED">Sample Sent</option>
              <option value="ACTIVE_CLIENT">Active Clients</option>
              <option value="VIP_CLIENT">VIP Clients</option>
              <option value="INACTIVE">Inactive</option>
            </select>

            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); fetchCustomers(); }}
              className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Customer Cards & Activity Drawer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Customers List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 font-mono text-xs">
                Loading B2B accounts...
              </div>
            ) : customers.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-sm font-bold text-slate-300">No Customers Found</div>
                <p className="text-xs text-slate-500">Add a new corporate buyer or adjust your search filter.</p>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Customer
                </button>
              </div>
            ) : (
              customers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-4 bg-slate-900 border rounded-2xl transition-all cursor-pointer ${
                    selectedCustomer?.id === cust.id
                      ? 'border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                        {cust.companyName ? cust.companyName[0].toUpperCase() : cust.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{cust.companyName || cust.name}</h3>
                          {getStatusBadge(cust.status)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {cust.name} {cust.customerNumber ? `• ${cust.customerNumber}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditModal(cust); }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(cust.id); }}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-xs"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{cust.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{cust.city ? `${cust.city}, ${cust.state || 'India'}` : 'India'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-slate-500">Spend:</span>
                      <span className="font-bold text-emerald-400">₹{Number(cust.totalSpend || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {cust.tags && cust.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-3">
                      {cust.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-500 ml-auto font-mono">
                        Rep: {cust.assignedSalesPerson || 'Sales'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Customer Activity & Interaction Timeline Drawer (1 col) */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 sticky top-24">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white text-sm">Account Timeline & History</h2>
                  <p className="text-[11px] text-slate-400">
                    {selectedCustomer ? (selectedCustomer.companyName || selectedCustomer.name) : 'Select a customer to view history'}
                  </p>
                </div>
              </div>

              {selectedCustomer ? (
                <>
                  {/* Add Quick Activity Note */}
                  <form onSubmit={handleAddActivity} className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Log Interaction</span>
                      <select
                        value={newActivityType}
                        onChange={(e) => setNewActivityType(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-0.5 text-[11px]"
                      >
                        <option value="NOTE">Internal Note</option>
                        <option value="CALL">Phone Call</option>
                        <option value="EMAIL">Email Sent</option>
                        <option value="MEETING">Buyer Meeting</option>
                        <option value="SAMPLE">Sample Dispatched</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Interaction subject (e.g., Called regarding 5000 pcs quote)"
                      value={newActivityTitle}
                      onChange={(e) => setNewActivityTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                    <textarea
                      placeholder="Optional notes or agreed next steps..."
                      value={newActivityDesc}
                      onChange={(e) => setNewActivityDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Log Activity
                    </button>
                  </form>

                  {/* Activity Stream */}
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-1 text-xs">
                    {selectedCustomer.timeline && selectedCustomer.timeline.length > 0 ? (
                      selectedCustomer.timeline.map((act) => (
                        <div key={act.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{act.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(act.timestamp).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-[11px] text-slate-400">{act.description}</p>
                          )}
                          <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-900">
                            <span className="font-mono">{act.type}</span>
                            <span>By: {act.author || 'System'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-500 text-xs">
                        No activity records logged yet.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                  <Clock className="w-6 h-6 mx-auto text-slate-600" />
                  <p>Click on any customer card to review interaction logs, GST details, and follow-ups.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Customer Create / Edit Modal */}
      {showModal && editingCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {editingCustomer.id ? 'Edit Customer Account' : 'New Corporate Customer'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    value={editingCustomer.companyName || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, companyName: e.target.value })}
                    placeholder="e.g., Reliance Retail Ltd"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    value={editingCustomer.name || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    placeholder="e.g., Rajesh Sharma (Procurement)"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    placeholder="rajesh@relianceretail.com"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="+91 98110 00000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={editingCustomer.city || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    placeholder="Mumbai / Delhi"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={editingCustomer.state || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={editingCustomer.gstNumber || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, gstNumber: e.target.value })}
                    placeholder="27AAACL1234A1Z5"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lifecycle Stage</label>
                  <select
                    value={editingCustomer.status || 'NEW_LEAD'}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="NEW_LEAD">New Lead</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="REQUIREMENT_GATHERED">Requirement Gathered</option>
                    <option value="SAMPLE_REQUESTED">Sample Sent</option>
                    <option value="ACTIVE_CLIENT">Active Client</option>
                    <option value="VIP_CLIENT">VIP Client</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Sales Executive</label>
                  <input
                    type="text"
                    value={editingCustomer.assignedSalesPerson || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, assignedSalesPerson: e.target.value })}
                    placeholder="Sales Team Member"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Strategic Notes</label>
                <textarea
                  value={editingCustomer.notes || ''}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                  rows={3}
                  placeholder="Key bag requirements, custom logo preferences, target delivery dates..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
