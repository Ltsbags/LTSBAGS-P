'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Quotation, QuotationItem } from '@/lib/types';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Eye, 
  Edit3, 
  Printer, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  X, 
  Send, 
  Download,
  Building2,
  Phone,
  Mail,
  Calendar,
  FileText,
  CreditCard
} from 'lucide-react';
import RazorpayPaymentButton from '@/components/RazorpayPaymentButton';

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Printable Preview State
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => ({
    quoteNumber: '',
    clientName: '',
    companyName: '',
    clientEmail: '',
    clientMobile: '',
    status: 'DRAFT' as Quotation['status'],
    validUntil: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    termsAndConditions: '1. 50% Advance along with Purchase Order, balance 50% prior to dispatch.\n2. Delivery timeline: 12-15 days after physical sample approval.\n3. Goods once sold will not be returned.',
    notes: '',
    discount: 0,
    items: [
      {
        id: 'item-1',
        productName: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack',
        description: '1680D Ballistic Nylon, 3D Embroidered Logo',
        quantity: 500,
        unitPrice: 850,
        gstPercent: 18,
        amount: 425000,
      },
    ] as QuotationItem[],
  }));

  const fetchQuotations = useCallback(async () => {
    try {
      const res = await fetch('/api/quotations');
      if (res.ok) {
        const data = await res.json();
        setQuotations(data);
      }
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/quotations');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setQuotations(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch quotations:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Are you sure you want to delete quotation ${num}?`)) return;
    try {
      const res = await fetch(`/api/quotations?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotations((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete quotation:', err);
    }
  };

  const calculateTotals = (items: QuotationItem[], discount: number) => {
    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const gstAmount = items.reduce((acc, item) => {
      const lineSub = item.quantity * item.unitPrice;
      return acc + (lineSub * (item.gstPercent / 100));
    }, 0);
    const totalAmount = Math.max(0, subtotal + gstAmount - discount);
    return { subtotal, gstAmount, totalAmount };
  };

  const handleOpenCreateModal = () => {
    setActiveQuoteId(null);
    setFormData({
      quoteNumber: `QT-2026-${101 + quotations.length}`,
      clientName: '',
      companyName: '',
      clientEmail: '',
      clientMobile: '',
      status: 'DRAFT',
      validUntil: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      termsAndConditions: '1. 50% Advance along with Purchase Order, balance 50% prior to dispatch.\n2. Delivery timeline: 12-15 days after physical sample approval.\n3. Prices inclusive of logo embroidery.',
      notes: '',
      discount: 0,
      items: [
        {
          id: 'item-1',
          productName: 'Apex Pro Tech 15.6 Inch Executive Laptop Backpack',
          description: '1680D Ballistic Nylon, Custom Logo',
          quantity: 100,
          unitPrice: 850,
          gstPercent: 18,
          amount: 85000,
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Quotation) => {
    setActiveQuoteId(q.id);
    setFormData({
      quoteNumber: q.quoteNumber,
      clientName: q.clientName,
      companyName: q.companyName || '',
      clientEmail: q.clientEmail || '',
      clientMobile: q.clientMobile || '',
      status: q.status,
      validUntil: q.validUntil,
      termsAndConditions: q.termsAndConditions || '',
      notes: q.notes || '',
      discount: q.discount || 0,
      items: q.items || [],
    });
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: 'item-' + Date.now(),
          productName: '',
          description: '',
          quantity: 100,
          unitPrice: 500,
          gstPercent: 18,
          amount: 50000,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, val: any) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      const item = { ...updatedItems[index], [field]: val };
      if (field === 'quantity' || field === 'unitPrice') {
        item.amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      }
      updatedItems[index] = item;
      return { ...prev, items: updatedItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName) return;

    const { subtotal, gstAmount, totalAmount } = calculateTotals(formData.items, formData.discount);

    const payload = {
      id: activeQuoteId || undefined,
      quoteNumber: formData.quoteNumber,
      clientName: formData.clientName,
      companyName: formData.companyName,
      clientEmail: formData.clientEmail,
      clientMobile: formData.clientMobile,
      status: formData.status,
      validUntil: formData.validUntil,
      termsAndConditions: formData.termsAndConditions,
      notes: formData.notes,
      discount: Number(formData.discount) || 0,
      items: formData.items,
      subtotal,
      gstAmount,
      totalAmount,
    };

    try {
      setSaving(true);
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (activeQuoteId) {
          setQuotations((prev) => prev.map((q) => (q.id === activeQuoteId ? saved : q)));
        } else {
          setQuotations((prev) => [saved, ...prev]);
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save quotation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: Quotation['status']) => {
    const quote = quotations.find((q) => q.id === id);
    if (!quote) return;
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...quote, status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuotations((prev) => prev.map((q) => (q.id === id ? updated : q)));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredQuotes = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const matchesSearch = 
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (q.companyName && q.companyName.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalAcceptedValue = quotations
    .filter((q) => q.status === 'ACCEPTED' || q.status === 'PAID')
    .reduce((acc, q) => acc + q.totalAmount, 0);

  const totalPendingValue = quotations
    .filter((q) => q.status === 'SENT' || q.status === 'DRAFT')
    .reduce((acc, q) => acc + q.totalAmount, 0);

  const getStatusBadge = (status: Quotation['status']) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Draft</span>;
      case 'SENT':
        return <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Sent</span>;
      case 'ACCEPTED':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Accepted</span>;
      case 'PAID':
        return <span className="bg-green-500 text-slate-950 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Paid</span>;
      case 'REJECTED':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md text-[10px] font-black uppercase">Rejected</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminHeader activeTab="quotations" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">Quotations & Proforma Invoices</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Create, issue, track, and convert bulk wholesale B2B quotes for corporate clients.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quotation</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">Total Quotes Issued</span>
            <div className="text-2xl font-black text-white mt-1">{quotations.length} Quotes</div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-emerald-400">Accepted Pipeline Value</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ₹{totalAcceptedValue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-sky-400">Pending Quotes Value</span>
            <div className="text-2xl font-black text-sky-400 mt-1">
              ₹{totalPendingValue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['ALL', 'DRAFT', 'SENT', 'ACCEPTED', 'PAID', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by quote # or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Quotations Table */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading quotations...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 mt-6">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No quotations found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first formal quotation to generate proforma invoices with GST breakdown.
            </p>
          </div>
        ) : (
          <div className="mt-6 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Quote #</th>
                    <th className="p-3.5">Client & Company</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Valid Until</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-sky-400">
                        {q.quoteNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-200">{q.clientName}</div>
                        <div className="text-[11px] text-slate-400">{q.companyName || 'N/A'} • {q.clientMobile}</div>
                      </td>
                      <td className="p-3.5 font-bold text-amber-400 text-sm">
                        ₹{q.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">
                        {q.validUntil}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(q.status)}
                          <select
                            value={q.status}
                            onChange={(e) => handleQuickStatusChange(q.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 rounded px-1.5 py-0.5"
                          >
                            <option value="DRAFT">DRAFT</option>
                            <option value="SENT">SENT</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="PAID">PAID</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewQuote(q)}
                            title="View / Print Proforma Invoice"
                            className="p-2 bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(q)}
                            title="Edit Quote"
                            className="p-2 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id, q.quoteNumber)}
                            title="Delete Quote"
                            className="p-2 bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white rounded-lg transition-colors"
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
          </div>
        )}

        {/* Edit/Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>{activeQuoteId ? 'Edit Quotation' : 'Create New Quotation'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Quote Number</label>
                    <input
                      type="text"
                      required
                      value={formData.quoteNumber}
                      onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Valid Until</label>
                    <input
                      type="date"
                      required
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Infosys Talent Engagement"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="r.sharma@infosys-example.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mobile / Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={formData.clientMobile}
                      onChange={(e) => setFormData({ ...formData, clientMobile: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Line Items</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, idx) => (
                      <div key={item.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Product Name"
                            value={item.productName}
                            onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 mb-1"
                          />
                          <input
                            type="text"
                            placeholder="Specs / Custom branding notes"
                            value={item.description || ''}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-400"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-500 block">Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-500 block">Unit Price (₹)</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-slate-500 block">GST %</label>
                          <input
                            type="number"
                            value={item.gstPercent}
                            onChange={(e) => handleItemChange(idx, 'gstPercent', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100"
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms and Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="SENT">SENT</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="PAID">PAID</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    value={formData.termsAndConditions}
                    onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black shadow-lg shadow-emerald-500/20"
                  >
                    {saving ? 'Saving...' : 'Save Quotation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Printable Invoice Modal */}
        {previewQuote && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">PROFORMA QUOTATION</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">LTS BAGS PRIVATE LIMITED ®</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setPreviewQuote(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Company & Client Details */}
              <div className="grid grid-cols-2 gap-6 my-6 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">ISSUED BY:</h4>
                  <div className="font-bold text-slate-900 text-sm">LTS BAGS PRIVATE LIMITED</div>
                  <div className="text-slate-600 mt-1">FLOOR- G, A341/2/3, GANESH SAI KRIPA CHS SANT ROHIDAS MARG, MUKUND NAGAR, DHARAVI, MUMBAI 400017</div>
                  <div className="text-slate-600 mt-0.5">GSTIN: 27AAGCL1568H1ZC • ISO 9001:2015</div>
                  <div className="text-slate-600 mt-0.5">Email: sales@ltsbags.com • Mobile: +91 98335 98338</div>
                </div>
                <div className="text-right">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">PREPARED FOR:</h4>
                  <div className="font-bold text-slate-900 text-sm">{previewQuote.clientName}</div>
                  <div className="text-slate-700 font-bold">{previewQuote.companyName}</div>
                  <div className="text-slate-600 mt-0.5">{previewQuote.clientEmail} • {previewQuote.clientMobile}</div>
                  <div className="mt-3 font-mono font-bold text-sky-700">Quote #: {previewQuote.quoteNumber}</div>
                  <div className="text-slate-500">Date: {previewQuote.createdAt.split('T')[0]} • Valid Until: {previewQuote.validUntil}</div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-left text-xs my-6 border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-800 uppercase">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Product Specification</th>
                    <th className="p-2.5 border-b border-slate-200 text-center">Qty</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Unit Price (₹)</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">GST %</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewQuote.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        {item.description && <div className="text-slate-500 text-[11px]">{item.description}</div>}
                      </td>
                      <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-mono">{item.gstPercent}%</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end my-4">
                <div className="w-64 space-y-1 text-xs text-right border-t border-slate-200 pt-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{previewQuote.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18%):</span>
                    <span className="font-mono">₹{previewQuote.gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {previewQuote.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span className="font-mono">- ₹{previewQuote.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-slate-950 border-t border-slate-900 pt-2">
                    <span>Total Amount:</span>
                    <span className="font-mono text-sky-700">₹{previewQuote.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Payment Action */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <h5 className="font-bold text-slate-900 uppercase">Terms & Conditions:</h5>
                  <p className="whitespace-pre-line">{previewQuote.termsAndConditions}</p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Instant Online Settlement:</span>
                  <RazorpayPaymentButton
                    amount={previewQuote.totalAmount}
                    clientName={previewQuote.clientName}
                    companyName={previewQuote.companyName}
                    clientEmail={previewQuote.clientEmail}
                    clientPhone={previewQuote.clientMobile}
                    quoteNumber={previewQuote.quoteNumber}
                    quotationId={previewQuote.id}
                    purpose={`Settlement for Quote ${previewQuote.quoteNumber}`}
                    buttonText={`Pay ₹${previewQuote.totalAmount.toLocaleString('en-IN')} via Razorpay`}
                    className="py-2.5 px-4 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow"
                    onSuccess={() => {
                      fetchQuotations();
                      alert('Payment verified and quotation status marked as PAID!');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
