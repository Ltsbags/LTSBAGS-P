import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { isRazorpayConfigured } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      clientName,
      companyName,
      amount,
      quoteNumber,
      quotationId,
      purpose,
      email,
      phone,
      simulated,
    } = body;

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (!simulated && isRazorpayConfigured()) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return NextResponse.json({ error: 'RAZORPAY_KEY_SECRET is missing' }, { status: 500 });
      }

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing payment signature verification parameters' }, { status: 400 });
      }

      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature. Verification failed.' }, { status: 400 });
      }
    }

    const transactionRef = razorpay_payment_id || `pay_sim_${Date.now()}`;
    const paymentRecord = db.savePayment({
      clientName: clientName || 'Online Client',
      companyName: companyName || '',
      amount: numericAmount,
      quoteNumber: quoteNumber || '',
      quotationId: quotationId || '',
      paymentMethod: 'RAZORPAY',
      transactionRef: transactionRef,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'VERIFIED',
      notes: `Online Payment via Razorpay Gateway (${purpose || 'Manufacturing Advance / Sample Charge'})${email ? ` | Email: ${email}` : ''}${phone ? ` | Phone: ${phone}` : ''}`,
    });

    // If quotationId is provided, check if quote should be marked as paid or updated
    if (quotationId) {
      try {
        const quote = db.getQuotationById(quotationId);
        if (quote) {
          db.saveQuotation({
            ...quote,
            status: 'PAID',
            notes: `${quote.notes || ''}\n[Payment Verified: ₹${numericAmount} via Razorpay (Ref: ${transactionRef})]`.trim(),
          });
        }
      } catch (err) {
        console.warn('Could not auto-update quotation status:', err);
      }
    }

    return NextResponse.json({
      success: true,
      payment: paymentRecord,
      transactionRef,
      message: 'Payment verified and recorded successfully.',
    });
  } catch (error: any) {
    console.error('[Razorpay Verify Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
