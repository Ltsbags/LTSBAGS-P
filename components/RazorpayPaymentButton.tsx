'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
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

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          clientName,
          quoteNumber,
          purpose,
          currency: 'INR',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      // If keys aren't configured and we're in sandbox/simulation mode
      if (orderData.simulated) {
        // Handle sandbox simulation for development/testing
        const confirmPay = window.confirm(
          `[Razorpay Test Gateway Mode]\n\nAmount: ₹${amount.toLocaleString('en-IN')}\nPurpose: ${purpose}\nOrder ID: ${orderData.orderId}\n\nClick OK to simulate a successful payment verification.`
        );

        if (!confirmPay) {
          setLoading(false);
          return;
        }

        const verifyRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'simulated_signature',
            clientName: clientName || 'Demo Client',
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
        if (verifyRes.ok) {
          setSuccess(true);
          setPaymentRef(verifyData.transactionRef);
          onSuccess?.({
            paymentId: verifyData.transactionRef,
            orderId: orderData.orderId,
            paymentRecord: verifyData.payment,
          });
        } else {
          throw new Error(verifyData.error || 'Simulation verification failed');
        }
        setLoading(false);
        return;
      }

      // 2. Load script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay Checkout SDK failed to load. Check your internet connection.');
      }

      // 3. Open Razorpay options modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LTS BAGS PRIVATE LIMITED',
        description: purpose || 'Custom Bag Manufacturing Payment',
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
            if (verifyRes.ok) {
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
            onError?.(err?.message || 'Payment verification failed');
            alert(err?.message || 'Payment verification failed. Please contact LTS Bags support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: clientName || '',
          email: clientEmail || '',
          contact: clientPhone || '',
        },
        theme: {
          color: '#0284c7', // Sky blue brand color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        onError?.(response.error.description || 'Payment was declined or failed.');
        alert(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Payment launch error:', err);
      onError?.(err?.message || 'Failed to initiate Razorpay checkout');
      alert(err?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Paid Successfully (Ref: {paymentRef})</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
        className || 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing Gateway...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>{buttonText || `Pay ₹${amount.toLocaleString('en-IN')} via Razorpay`}</span>
          <ArrowRight className="w-4 h-4 opacity-80" />
        </>
      )}
    </button>
  );
}
