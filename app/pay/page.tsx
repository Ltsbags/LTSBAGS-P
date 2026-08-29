'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RazorpayPaymentButton from '@/components/RazorpayPaymentButton';
import { 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Receipt, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  Smartphone, 
  Globe2, 
  Banknote,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function PaymentGatewayPage() {
  const [payType, setPayType] = useState<'SAMPLE' | 'ADVANCE' | 'QUOTE' | 'CUSTOM'>('SAMPLE');
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [amount, setAmount] = useState<number>(2500);
  const [purposeNote, setPurposeNote] = useState('Custom Sample Prototyping & Courier Charges');
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);
  const [gatewayStatus, setGatewayStatus] = useState<{ configured: boolean; keyId: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/payments/razorpay/config')
      .then((res) => res.json())
      .then((data) => setGatewayStatus(data))
      .catch(() => setGatewayStatus({ configured: false, keyId: null }));
  }, []);

  const handleTypeChange = (type: 'SAMPLE' | 'ADVANCE' | 'QUOTE' | 'CUSTOM') => {
    setPayType(type);
    if (type === 'SAMPLE') {
      setAmount(2500);
      setPurposeNote('Custom Sample Prototyping & Courier Charges');
    } else if (type === 'ADVANCE') {
      setAmount(50000);
      setPurposeNote('50% Bulk Production Advance Deposit');
    } else if (type === 'QUOTE') {
      setPurposeNote(quoteNumber ? `Settlement for Quote #${quoteNumber}` : 'Quotation Advance / Settlement');
    } else {
      setAmount(10000);
      setPurposeNote('Custom Manufacturing Milestone Payment');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>256-Bit Encrypted B2B Payment Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Secure Payment Portal
          </h1>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Direct online settlements for LTS Bags sample development, advance bulk orders, and commercial quotations via Razorpay.
          </p>
        </div>

        {paymentSuccessData ? (
          /* Payment Success Confirmation Card */
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-white">Payment Received Successfully</h2>
            <p className="text-sm text-slate-300 mt-2">
              Your transaction has been verified and registered in our manufacturing accounting system.
            </p>

            <div className="mt-6 bg-slate-950/80 rounded-xl p-5 border border-slate-800 text-left space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Transaction Reference:</span>
                <span className="font-mono font-bold text-sky-400">{paymentSuccessData.paymentId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-emerald-400">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Client / Payer:</span>
                <span className="font-medium text-white">{clientName} {companyName ? `(${companyName})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Purpose:</span>
                <span className="text-slate-200">{purposeNote}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Print Tax Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentSuccessData(null);
                  setClientName('');
                  setCompanyName('');
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span>Make Another Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment Configuration Form */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <span>Select Payment Type & Details</span>
              </h2>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
                {[
                  { id: 'SAMPLE', label: 'Sample Fee', desc: '₹2,500' },
                  { id: 'ADVANCE', label: 'Bulk Advance', desc: '50% Deposit' },
                  { id: 'QUOTE', label: 'Quotation #', desc: 'Custom Ref' },
                  { id: 'CUSTOM', label: 'Custom Pay', desc: 'Any Amount' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTypeChange(tab.id as any)}
                    className={`py-2.5 px-3 rounded-lg text-left transition-all text-xs font-bold ${
                      payType === tab.id
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="truncate">{tab.label}</div>
                    <div className={`text-[10px] font-normal mt-0.5 ${payType === tab.id ? 'text-sky-100' : 'text-slate-400'}`}>
                      {tab.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {payType === 'QUOTE' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Quotation Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. QT-2026-001"
                      value={quoteNumber}
                      onChange={(e) => {
                        setQuoteNumber(e.target.value);
                        setPurposeNote(`Settlement for Quote #${e.target.value}`);
                      }}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. TechCorp Retail LLP"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email (for Tax Invoice)</label>
                    <input
                      type="email"
                      placeholder="rajesh@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Payment Amount (INR ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-4 py-3 text-lg font-mono font-bold text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Purpose / Notes</label>
                  <input
                    type="text"
                    value={purposeNote}
                    onChange={(e) => setPurposeNote(e.target.value)}
                    placeholder="e.g. 500 pcs Executive Backpack Sample Advance"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Submit / Pay CTA Button */}
                <div className="pt-4">
                  <RazorpayPaymentButton
                    amount={amount}
                    clientName={clientName}
                    companyName={companyName}
                    clientEmail={clientEmail}
                    clientPhone={clientPhone}
                    quoteNumber={quoteNumber}
                    purpose={purposeNote}
                    buttonText={`Pay ₹${(amount || 0).toLocaleString('en-IN')} Securely via Razorpay`}
                    className="w-full py-4 text-base bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-xl shadow-sky-600/20"
                    onSuccess={(data) => setPaymentSuccessData(data)}
                  />
                </div>

                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SSL 256-bit Encrypted</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                    <span>UPI / GPay / Cards / NetBanking</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>GST Input Tax Credit Compliant</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar Summary & Alternate Bank Wire Instructions */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Summary Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-sky-400" />
                  <span>Order Settlement Summary</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Selected Category:</span>
                    <span className="font-semibold text-white">
                      {payType === 'SAMPLE' ? 'Sample Prototyping' : payType === 'ADVANCE' ? 'Bulk Production Advance' : payType === 'QUOTE' ? 'Quotation Order' : 'Custom Milestone'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Currency:</span>
                    <span className="font-mono text-white">INR (₹)</span>
                  </div>
                  <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-white">Total Payable:</span>
                    <span className="text-2xl font-black font-mono text-sky-400">
                      ₹{(amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supported Payment Channels */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Supported Online Methods
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>UPI (GPay / PhonePe / Paytm)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span>Debit & Credit Cards (Visa/MC/RuPay)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span>Net Banking (50+ Banks)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Corporate / Commercial Cards</span>
                  </div>
                </div>
              </div>

              {/* Offline Wire / NEFT Alternative */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Direct RTGS / NEFT Wire Details</span>
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  For large transactions exceeding ₹2,00,000, you can also transfer directly to our corporate bank account:
                </p>
                <div className="space-y-2 text-xs font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Beneficiary:</span>
                    <span className="text-white font-sans font-bold">LTS BAGS PRIVATE LIMITED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Type:</span>
                    <span>Current Account</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="text-sky-400 font-bold">HDFC0000123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
