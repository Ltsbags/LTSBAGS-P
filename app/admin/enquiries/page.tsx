'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Enquiry, EnquiryStatus } from '@/lib/types';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  Package,
  Check,
  Bot,
  FileText,
  FileSpreadsheet,
  Sparkles,
  Download,
  ExternalLink,
  MessageCircle,
  Eye,
  X,
  Send,
  Calendar,
  MapPin,
  DollarSign,
  Layers,
  Edit,
  Save,
  Tag
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  NEW: { label: 'New Lead', color: 'text-amber-400', bg: 'bg-amber-950/70 border-amber-800' },
  CONTACTED: { label: 'Contacted', color: 'text-sky-400', bg: 'bg-sky-950/70 border-sky-800' },
  QUOTE_SENT: { label: 'Quote Sent', color: 'text-indigo-400', bg: 'bg-indigo-950/70 border-indigo-800' },
  SAMPLE_REQUESTED: { label: 'Sample Requested', color: 'text-purple-400', bg: 'bg-purple-950/70 border-purple-800' },
  SAMPLE_SENT: { label: 'Sample Dispatched', color: 'text-teal-400', bg: 'bg-teal-950/70 border-teal-800' },
  ORDER_CONFIRMED: { label: 'Order Confirmed', color: 'text-emerald-400', bg: 'bg-emerald-950/70 border-emerald-800' },
  CLOSED: { label: 'Completed', color: 'text-slate-400', bg: 'bg-slate-900 border-slate-700' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-950/70 border-red-800' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-950/70 border-blue-800' },
  QUOTED: { label: 'Quoted', color: 'text-indigo-400', bg: 'bg-indigo-950/70 border-indigo-800' },
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadEnquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/enquiries')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setEnquiries(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load enquiries:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id: string, newStatus: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internalNotes,
          assignedTo,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedEnquiry(updated);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  const openDetails = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setInternalNotes(enq.internalNotes || '');
    setAssignedTo(enq.assignedTo || '');
  };

  const exportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'WhatsApp', 'Product/Requirement', 'Quantity', 'Target Price', 'Material', 'Sample Required', 'Delivery Location', 'Status', 'Source'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${(e.company || '').replace(/"/g, '""')}"`,
      `"${e.email}"`,
      `"${e.mobile}"`,
      `"${e.whatsapp || e.mobile}"`,
      `"${(e.productRequirement || '').replace(/"/g, '""')}"`,
      `"${e.quantity}"`,
      `"${e.targetPrice || ''}"`,
      `"${e.material || ''}"`,
      `"${e.sampleRequired ? 'YES' : 'NO'}"`,
      `"${e.deliveryLocation || ''}"`,
      `"${e.status}"`,
      `"${e.source || 'FORM'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LTS_Bags_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateWhatsAppLink = (enq: Enquiry) => {
    const phone = (enq.whatsapp || enq.mobile || '').replace(/[^0-9]/g, '');
    const validPhone = phone.startsWith('91') ? phone : phone.length === 10 ? `91${phone}` : phone;
    const text = encodeURIComponent(
      `Hello ${enq.name}, Thank you for your B2B manufacturing enquiry with LTS BAGS PRIVATE LIMITED.\n\nRegarding: ${enq.productRequirement} (Qty: ${enq.quantity} units)\n\nWe have reviewed your specifications and are ready to share the official factory quotation. When would be a good time for a quick discussion?`
    );
    return `https://wa.me/${validPhone}?text=${text}`;
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(search.toLowerCase())) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.mobile.includes(search) ||
      e.productRequirement.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    
    let matchesSource = true;
    if (sourceFilter === 'AI_CHATBOT') {
      matchesSource = e.source === 'AI_CHATBOT';
    } else if (sourceFilter === 'SAMPLE_REQUEST') {
      matchesSource = e.source === 'SAMPLE_REQUEST' || !!e.sampleRequired;
    } else if (sourceFilter === 'FORM') {
      matchesSource = e.source === 'FORM' || (!e.source && !e.sampleRequired);
    }

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="enquiries" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase tracking-wider font-bold mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>B2B Inbound Lead & RFQ Pipeline</span>
              </div>
              <h1 className="text-2xl font-black text-white font-serif">
                Wholesale Enquiries & Quote Requests
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Track enterprise RFQs, target budgets, sample requests, specifications, and follow up directly via WhatsApp or Email.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all text-xs"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Export CSV ({enquiries.length})</span>
              </button>
            </div>
          </div>

          {/* Metrics summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Total RFQs</span>
              <p className="text-2xl font-black text-white font-serif">{enquiries.length}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-amber-900/40">
              <span className="text-[11px] text-amber-400 font-medium">New Leads</span>
              <p className="text-2xl font-black text-amber-400 font-serif">
                {enquiries.filter((e) => e.status === 'NEW').length}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-purple-900/40">
              <span className="text-[11px] text-purple-400 font-medium">Sample Requests</span>
              <p className="text-2xl font-black text-purple-400 font-serif">
                {enquiries.filter((e) => e.sampleRequired || e.status === 'SAMPLE_REQUESTED').length}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-indigo-900/40">
              <span className="text-[11px] text-indigo-400 font-medium">Quotes Sent</span>
              <p className="text-2xl font-black text-indigo-400 font-serif">
                {enquiries.filter((e) => e.status === 'QUOTE_SENT' || e.status === 'QUOTED').length}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-emerald-900/40">
              <span className="text-[11px] text-emerald-400 font-medium">Confirmed Orders</span>
              <p className="text-2xl font-black text-emerald-400 font-serif">
                {enquiries.filter((e) => e.status === 'ORDER_CONFIRMED').length}
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-blue-900/40">
              <span className="text-[11px] text-blue-400 font-medium">AI Bot Leads</span>
              <p className="text-2xl font-black text-blue-400 font-serif">
                {enquiries.filter((e) => e.source === 'AI_CHATBOT').length}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by client, company, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-hidden focus:border-sky-500 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New Leads</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUOTE_SENT">Quote Sent</option>
                <option value="SAMPLE_REQUESTED">Sample Requested</option>
                <option value="SAMPLE_SENT">Sample Dispatched</option>
                <option value="ORDER_CONFIRMED">Order Confirmed</option>
                <option value="CLOSED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-hidden focus:border-sky-500 font-medium"
              >
                <option value="ALL">All Sources</option>
                <option value="FORM">Web Form Quotes</option>
                <option value="SAMPLE_REQUEST">Sample Requests</option>
                <option value="AI_CHATBOT">AI Assistant Leads</option>
              </select>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm">
                <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
                Loading quote records...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No matching quote enquiries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="py-3.5 px-4">Date / Source</th>
                      <th className="py-3.5 px-4">Client & Company</th>
                      <th className="py-3.5 px-4">Product Requirement</th>
                      <th className="py-3.5 px-4">Qty & Specs</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filtered.map((enq) => {
                      const cfg = STATUS_CONFIG[enq.status] || STATUS_CONFIG.NEW;
                      return (
                        <tr key={enq.id} className="hover:bg-slate-800/50 transition-colors">
                          
                          {/* Date & Source */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono text-slate-300">
                              {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="mt-1 flex items-center gap-1">
                              {enq.source === 'AI_CHATBOT' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/60">
                                  <Bot className="w-3 h-3" /> AI Chat
                                </span>
                              ) : enq.sampleRequired ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900/60 font-bold">
                                  <Package className="w-3 h-3" /> Sample Req
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                  Web RFQ
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Client */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white font-serif">{enq.name}</div>
                            {enq.company && enq.company !== 'Not Specified' && (
                              <div className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-500" />
                                {enq.company}
                              </div>
                            )}
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              {enq.email} • {enq.mobile}
                            </div>
                          </td>

                          {/* Requirement */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-slate-200 font-medium line-clamp-1">
                              {enq.productRequirement}
                            </div>
                            <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                              {enq.message}
                            </div>
                          </td>

                          {/* Qty & Specs */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-sky-400 font-mono">
                              {enq.quantity} Units
                            </div>
                            {enq.targetPrice && (
                              <div className="text-emerald-400 text-[11px] font-mono">
                                Target: {enq.targetPrice}
                              </div>
                            )}
                            {enq.material && (
                              <div className="text-slate-400 text-[10px]">
                                {enq.material}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={enq.status}
                              onChange={(e) => updateStatus(enq.id, e.target.value as EnquiryStatus)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${cfg.bg} ${cfg.color}`}
                            >
                              <option value="NEW">New Lead</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="QUOTE_SENT">Quote Sent</option>
                              <option value="SAMPLE_REQUESTED">Sample Requested</option>
                              <option value="SAMPLE_SENT">Sample Dispatched</option>
                              <option value="ORDER_CONFIRMED">Order Confirmed</option>
                              <option value="CLOSED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={generateWhatsAppLink(enq)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 transition-colors"
                                title="Reply via WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => openDetails(enq)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
                                title="View Full RFQ Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(enq.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* FULL RFQ DETAILS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  RFQ Reference: {selectedEnquiry.id}
                </span>
                <h2 className="text-lg font-bold text-white font-serif">
                  {selectedEnquiry.name} {selectedEnquiry.company ? `(${selectedEnquiry.company})` : ''}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
              
              {/* Contact Grid */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 text-[10px]">Contact Person</span>
                  <p className="text-white font-bold">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Company / Organization</span>
                  <p className="text-white font-bold">{selectedEnquiry.company || 'Not Specified'}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Email Address</span>
                  <p className="text-sky-400">
                    <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline">{selectedEnquiry.email}</a>
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Phone & WhatsApp</span>
                  <p className="text-emerald-400 font-mono">
                    <a href={`tel:${selectedEnquiry.mobile}`} className="hover:underline">{selectedEnquiry.mobile}</a>
                  </p>
                </div>
              </div>

              {/* Requirement & Specs */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white font-serif flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-sky-400" />
                  <span>Manufacturing Specifications</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px]">Quantity</span>
                    <p className="text-sky-400 font-mono font-bold text-sm">{selectedEnquiry.quantity} Units</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Target Unit Price</span>
                    <p className="text-emerald-400 font-mono font-bold">{selectedEnquiry.targetPrice || 'Open to Quote'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Sample Required?</span>
                    <p className="font-bold">
                      {selectedEnquiry.sampleRequired ? (
                        <span className="text-purple-400">YES (Sample Batch)</span>
                      ) : (
                        <span className="text-slate-400">NO</span>
                      )}
                    </p>
                  </div>
                  {selectedEnquiry.material && (
                    <div>
                      <span className="text-slate-500 text-[10px]">Target Material</span>
                      <p className="text-slate-200">{selectedEnquiry.material}</p>
                    </div>
                  )}
                  {selectedEnquiry.printingType && (
                    <div>
                      <span className="text-slate-500 text-[10px]">Branding / Printing</span>
                      <p className="text-slate-200">{selectedEnquiry.printingType}</p>
                    </div>
                  )}
                  {selectedEnquiry.deliveryLocation && (
                    <div>
                      <span className="text-slate-500 text-[10px]">Delivery City / Port</span>
                      <p className="text-slate-200">{selectedEnquiry.deliveryLocation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Item Breakdown Table if provided */}
              {selectedEnquiry.items && selectedEnquiry.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300">Multi-Product RFQ Items</h4>
                  <div className="border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px]">
                        <tr>
                          <th className="p-2.5">Product Name</th>
                          <th className="p-2.5">Qty</th>
                          <th className="p-2.5">Material</th>
                          <th className="p-2.5">Target Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {selectedEnquiry.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="p-2.5 font-bold text-white">{item.productName}</td>
                            <td className="p-2.5 font-mono text-sky-400">{item.quantity}</td>
                            <td className="p-2.5 text-slate-400">{item.material || '-'}</td>
                            <td className="p-2.5 text-emerald-400">{item.targetPrice || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Client Message */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px]">Client Description & Notes:</span>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-line leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Internal Notes & Assignment */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Internal Sales Follow-up Notes</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Assigned Sales Executive</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-hidden focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Internal Notes & Quote Draft</label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="e.g. Sent PDF quotation with 500 unit tier @ ₹480/pc including 3D embroidery. Sample bag dispatched via BlueDart tracking #..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-hidden focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingNotes ? 'Saving...' : 'Save Internal Notes'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`/admin/quotations?action=convert&rfqId=${selectedEnquiry.id}&customerName=${encodeURIComponent(selectedEnquiry.name)}&company=${encodeURIComponent(selectedEnquiry.company || '')}&email=${encodeURIComponent(selectedEnquiry.email)}&phone=${encodeURIComponent(selectedEnquiry.mobile)}&productName=${encodeURIComponent(selectedEnquiry.productRequirement || 'Custom B2B Bag Order')}&quantity=${selectedEnquiry.quantity || 100}`}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Create Quotation</span>
                </a>

                <a
                  href={`/admin/follow-ups?action=new&name=${encodeURIComponent(selectedEnquiry.name)}&company=${encodeURIComponent(selectedEnquiry.company || '')}&phone=${encodeURIComponent(selectedEnquiry.mobile)}&email=${encodeURIComponent(selectedEnquiry.email)}`}
                  className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Log Follow-up</span>
                </a>

                <a
                  href={generateWhatsAppLink(selectedEnquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
