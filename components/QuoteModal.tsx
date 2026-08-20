'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Building2, Package, Phone, Mail, User, FileText } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: string;
}

export default function QuoteModal({ isOpen, onClose, preselectedProduct = '' }: QuoteModalProps) {
  const [formData, setFormData] = useState(() => ({
    name: '',
    company: '',
    email: '',
    mobile: '',
    productRequirement: preselectedProduct || '',
    quantity: '100',
    message: '',
  }));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        mobile: '',
        productRequirement: '',
        quantity: '100',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1E293B] px-6 py-5 text-white flex items-center justify-between border-b border-slate-700/80">
          <div>
            <span className="text-[#72AFDB] font-bold text-xs uppercase tracking-wider font-mono">
              B2B Factory Wholesale
            </span>
            <h2 className="text-xl font-black tracking-tight font-sans">
              Request Instant Quote
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {success ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Enquiry Received!</h3>
              <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                Thank you for contacting LTS BAGS PRIVATE LIMITED. Our corporate sales team will review your specifications and send a formal PDF quotation within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Product Requirement & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product / Bag Type *
                  </label>
                  <div className="relative">
                    <Package className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Corporate Backpack / Laptop Bag"
                      value={formData.productRequirement}
                      onChange={(e) => setFormData({ ...formData, productRequirement: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Est. Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none"
                  />
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customization Details / Material Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention target dimensions, fabric preferences (e.g. 1680D nylon, canvas), custom logo type (embroidery, rubber badge), and delivery deadline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#72AFDB] focus:border-[#72AFDB] outline-none text-xs"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#72AFDB] hover:bg-[#5C9BC7] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#72AFDB]/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Specifications...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Wholesale Quote Enquiry</span>
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-slate-500 text-center">
                🔒 We respect your corporate privacy. Your contact info is strictly confidential.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
