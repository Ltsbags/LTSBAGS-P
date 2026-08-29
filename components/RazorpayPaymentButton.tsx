'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  X, 
  Sparkles,
  Smartphone,
  Building2,
  Lock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayPaymentButtonProps {
  amount: number;
  clientName?: string;
  companyName?: string;
  clientEmail?: string;
  clientPhone?: string;
  quoteNumber?: string;
  quotationId?: string;
  purpose?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (data: { paymentId: string; orderId: string; paymentRecord?: any }) => void;
  onError?: (error: string) => void;
}

export default function RazorpayPaymentButton({
  amount,
  clientName = '',
  companyName = '',
  clientEmail = '',
  clientPhone = '',
  quoteNumber = '',
  quotationId = '',
  purpose = 'B2B Custom Bag Order Advance',
  buttonText,
  className = '',
  onSuccess,
  onError,
}: RazorpayPaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulation / Test Sandbox Modal State
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [simulatedOrderData, setSimulatedOrderData] = useState<any>(null);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  const cleanPhone = (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      // Check if script element already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSimulatePaymentAction = async (simulateSuccess: boolean) => {
    if (!simulatedOrderData) return;
    setSimulatingPayment(true);
    setErrorMessage(null);

    try {
      if (!simulateSuccess) {
        setErrorMessage('Payment simulation was declined by user test action.');
        onError?.('Payment simulation was declined.');
        setSimulationModalOpen(false);
        setSimulatingPayment(false);
        return;
      }

      const mockPaymentId = `pay_sim_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: simulatedOrderData.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: 'simulated_test_signature',
          clientName: clientName || 'Verified Corporate Client',
          companyName,
          amount,
          quoteNumber,
          quotationId,
          purpose,
          email: clientEmail,
          phone: clientPhone,
          simulated: true,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        setSuccess(true);
        setPaymentRef(verifyData.transactionRef);
        setSimulationModalOpen(false);
        onSuccess?.({
          paymentId: verifyData.transactionRef,
          orderId: simulatedOrderData.orderId,
          paymentRecord: verifyData.payment,
        });
      } else {
        throw new Error(verifyData.error || 'Payment verification failed');
      }
    } catch (err: any) {
      console.error('Simulation verification error:', err);
      setErrorMessage(err.message || 'Payment simulation failed');
      onError?.(err.message || 'Payment simulation failed');
    } finally {
      setSimulatingPayment(false);
    }
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setErrorMessage('Please enter a valid payment amount greater than ₹0.');
      return;
    }

    if (!clientName && !companyName) {
      setErrorMessage('Please provide your name or company name to generate the payment order.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          clientName: clientName || companyName || 'Corporate Client',
          companyName,
          quoteNumber,
          purpose,
          currency: 'INR',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway order');
      }

      // If in simulated sandbox mode (keys not yet configured or sandbox fallback)
      if (orderData.simulated) {
        setSimulatedOrderData(orderData);
        setSimulationModalOpen(true);
        setLoading(false);
        return;
      }

      // 2. Load Razorpay Checkout SDK script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay Checkout SDK could not load. Please check your internet connection or browser ad-blocker.');
      }

      // 3. Configure Razorpay options modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'LTS BAGS PRIVATE LIMITED',
        description: purpose || 'B2B Custom Bag Order Payment',
        image: '/icon-192.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                clientName,
                companyName,
                amount,
                quoteNumber,
                quotationId,
                purpose,
                email: clientEmail,
                phone: clientPhone,
                simulated: false,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
              setPaymentRef(response.razorpay_payment_id);
              onSuccess?.({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentRecord: verifyData.payment,
              });
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            setErrorMessage(err?.message || 'Payment signature verification failed. Please contact LTS Bags finance support.');
            onError?.(err?.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: clientName || companyName || '',
          email: clientEmail || '',
          contact: cleanPhone(clientPhone) || '',
        },
        notes: {
          quoteNumber: quoteNumber || 'N/A',
          purpose: purpose || 'B2B Bag Manufacturing Advance',
        },
        theme: {
          color: '#0284c7', // Sky Blue brand primary
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Razorpay payment failed:', response.error);
        const failReason = response?.error?.description || response?.error?.reason || 'Payment was declined or cancelled.';
        setErrorMessage(`Payment declined: ${failReason}`);
        onError?.(failReason);
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Payment launch error:', err);
      const msg = err?.message || 'Failed to initiate Razorpay checkout';
      setErrorMessage(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <div>Payment Verified &amp; Recorded</div>
          <div className="text-[11px] font-mono text-emerald-300 font-normal">Ref: {paymentRef}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold">Payment Notice:</span> {errorMessage}
          </div>
          <button 
            type="button" 
            onClick={() => setErrorMessage(null)} 
            className="text-rose-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed ${
          className || 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Connecting to Razorpay...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>{buttonText || `Pay ₹${(amount || 0).toLocaleString('en-IN')} via Razorpay`}</span>
            <ArrowRight className="w-4 h-4 opacity-80" />
          </>
        )}
      </button>

      {/* Sandbox / Simulation Interactive Modal (Iframe-Safe) */}
      {simulationModalOpen && simulatedOrderData && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left text-slate-100 overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-400 to-blue-600" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <CreditCard className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white">Razorpay Test Gateway Simulator</h3>
              </div>
              <button
                type="button"
                onClick={() => setSimulationModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Order ID:</span>
                  <span className="text-sky-400 font-bold">{simulatedOrderData.orderId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payable Amount:</span>
                  <span className="text-emerald-400 font-bold font-sans text-sm">₹{(amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Client / Brand:</span>
                  <span className="text-slate-200 font-sans">{clientName || companyName || 'B2B Client'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Purpose:</span>
                  <span className="text-slate-300 font-sans truncate max-w-[200px]">{purpose}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 text-[11px] text-sky-200 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-sky-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Gateway Sandbox Active</span>
                </div>
                You are testing in gateway simulation mode. Click &quot;Simulate Success&quot; to test instant payment receipt generation and verification.
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePaymentAction(true)}
                  disabled={simulatingPayment}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  {simulatingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Simulate Successful Payment (₹{(amount || 0).toLocaleString('en-IN')})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulatePaymentAction(false)}
                  disabled={simulatingPayment}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Simulate Payment Failure / Decline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
