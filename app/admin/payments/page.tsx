'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Payment } from '@/lib/types';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Building, 
  QrCode, 
  X, 
  DollarSign, 
  Receipt,
  Download,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    paymentNumber: '',
    quoteNumber: '',
    clientName: '',
    companyName: '',
    amount: 0,
    paymentMethod: 'BANK_TRANSFER' as Payment['paymentMethod'],
    transactionRef: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'VERIFIED' as Payment['status'],
    notes: '',
  });

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/payments');
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setPayments(data);
          }
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
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
    if (!confirm(`Are you sure you want to delete payment record ${num}?`)) return;
    try {
      const res = await fetch(`/api/payments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete payment:', err);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.amount) return;

    try {
      setSaving(true);
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newPay = await res.json();
        setPayments((prev) => [newPay, ...prev]);
        setIsAddModalOpen(false);
        setFormData({
          paymentNumber: '',
          quoteNumber: '',
          clientName: '',
          companyName: '',
          amount: 0,
          paymentMethod: 'BANK_TRANSFER',
          transactionRef: '',
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'VERIFIED',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Failed to save payment:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;
    const matchesSearch = 
      p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (p.transactionRef && p.transactionRef.toLowerCase().includes(search.toLowerCase())) ||
      (p.quoteNumber && p.quoteNumber.toLowerCase().includes(search.toLowerCase()));
    return matchesMethod && matchesSearch;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'VERIFIED')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <AdminHeader activeTab="payments" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <CreditCard className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">Payment Collections & Receipts</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Record advance deposits, bank wire transfers, NEFT/RTGS references, and payment verification logs.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({
                paymentNumber: `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`,
                quoteNumber: 'QT-2026-102',
                clientName: '',
                companyName: '',
                amount: 100000,
                paymentMethod: 'BANK_TRANSFER',
                transactionRef: 'UTR' + Math.floor(Math.random() * 1000000000),
                paymentDate: new Date().toISOString().split('T')[0],
                status: 'VERIFIED',
                notes: 'Advance 50% deposit received via NEFT.',
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">Total Verified Collections</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">Verified Transactions</span>
            <div className="text-2xl font-black text-white mt-1">
              {payments.filter((p) => p.status === 'VERIFIED').length} Receipts
            </div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-amber-400">Pending Clearances</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {payments.filter((p) => p.status === 'PENDING').length} Pending
            </div>
          </div>
        </div>

        {/* Bank Wire Details Box */}
        <div className="mt-6 bg-slate-900/90 p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-extrabold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Building className="w-4 h-4" /> Company Bank Account Wire Details
            </h4>
            <div className="text-xs text-slate-300 space-y-1 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">Account Name:</span> LTS BAGS PRIVATE LIMITED</div>
              <div><span className="text-slate-500">Bank Name:</span> Yes Bank (Lower Parel, Mumbai Branch)</div>
              <div><span className="text-slate-500">Current A/C #:</span> 041961900001163</div>
              <div><span className="text-slate-500">IFSC Code:</span> YESB0000419</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <QrCode className="w-4 h-4" /> Merchant UPI QR &amp; Tax ID
            </h4>
            <div className="text-xs text-slate-300 space-y-1 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">UPI ID:</span> ltsbags@yesbank</div>
              <div><span className="text-slate-500">GSTIN:</span> 27AAGCL1568H1ZC</div>
              <div><span className="text-slate-500">PAN Card:</span> AAGCL1568H</div>
              <div><span className="text-slate-500">Tax Residency:</span> Maharashtra, India</div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['ALL', 'RAZORPAY', 'BANK_TRANSFER', 'UPI', 'CREDIT_CARD', 'CHEQUE', 'CASH'].map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  methodFilter === m
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/pay"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20"
            >
              <span>Open Online Payment Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reference or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 mt-6">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No payment receipts recorded</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Record advance deposits and bank transfers to track invoice clearances.
            </p>
          </div>
        ) : (
          <div className="mt-6 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Payment #</th>
                    <th className="p-3.5">Quote Ref</th>
                    <th className="p-3.5">Client / Company</th>
                    <th className="p-3.5">Amount (₹)</th>
                    <th className="p-3.5">Method & UTR</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-sky-400">{p.paymentNumber}</td>
                      <td className="p-3.5 font-mono text-slate-300">{p.quoteNumber || 'N/A'}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-200">{p.clientName}</div>
                        <div className="text-[11px] text-slate-400">{p.companyName || 'N/A'}</div>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400 text-sm">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {p.paymentMethod.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">Ref: {p.transactionRef}</div>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">{p.paymentDate}</td>
                      <td className="p-3.5">
                        {p.status === 'VERIFIED' ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            Verified
                          </span>
                        ) : p.status === 'PENDING' ? (
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            Pending
                          </span>
                        ) : (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDelete(p.id, p.paymentNumber)}
                          className="p-2 bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-sky-400" />
                  <span>Record Client Payment</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Receipt Number</label>
                    <input
                      type="text"
                      required
                      value={formData.paymentNumber}
                      onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Quote # Ref</label>
                    <input
                      type="text"
                      placeholder="QT-2026-101"
                      value={formData.quoteNumber}
                      onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Rajesh Sharma"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="Infosys Limited"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Amount Received (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono font-bold text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Payment Date</label>
                    <input
                      type="date"
                      required
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    >
                      <option value="RAZORPAY">Razorpay Online Gateway</option>
                      <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                      <option value="UPI">UPI Payment</option>
                      <option value="CHEQUE">Cheque</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="CASH">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Transaction / UTR #</label>
                    <input
                      type="text"
                      placeholder="e.g. UTR9823148123"
                      value={formData.transactionRef}
                      onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 font-black shadow-lg shadow-sky-500/20"
                  >
                    {saving ? 'Recording...' : 'Record Receipt'}
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
