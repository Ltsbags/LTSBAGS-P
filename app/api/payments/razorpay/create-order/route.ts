import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayClient, isRazorpayConfigured, getPublicRazorpayKey } from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes, clientName, quoteNumber, purpose } = body;

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required' }, { status: 400 });
    }

    const cleanReceipt = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Check if Razorpay keys are provided
    if (!isRazorpayConfigured()) {
      // In development or test without live keys, return informative sandbox response
      const mockOrderId = `order_sim_${crypto.randomBytes(6).toString('hex')}`;
      return NextResponse.json({
        simulated: true,
        orderId: mockOrderId,
        amount: Math.round(numericAmount * 100),
        currency,
        receipt: cleanReceipt,
        keyId: getPublicRazorpayKey() || 'rzp_test_placeholder',
        message: 'Razorpay keys not yet set in environment. Set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET to enable live payments.',
      });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100), // Amount in paise
      currency: currency.toUpperCase(),
      receipt: cleanReceipt.substring(0, 40),
      notes: {
        clientName: clientName || 'Anonymous Client',
        quoteNumber: quoteNumber || 'N/A',
        purpose: purpose || 'Bag Order / Sample Advance',
        ...notes,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: getPublicRazorpayKey(),
      simulated: false,
    });
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
