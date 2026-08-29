import { NextResponse } from 'next/server';
import { isRazorpayConfigured, getPublicRazorpayKey } from '@/lib/razorpay';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const isConfigured = isRazorpayConfigured();
    const keyId = getPublicRazorpayKey();
    const settings = db.getSettings();

    return NextResponse.json({
      configured: isConfigured,
      keyId: keyId || null,
      companyName: settings?.contactInfo?.companyName || 'LTS BAGS PRIVATE LIMITED',
      supportEmail: settings?.contactInfo?.email1 || 'contact@ltsbags.com',
      supportPhone: settings?.contactInfo?.phone1 || '+91 99999 99999',
      currency: 'INR',
    });
  } catch (error: any) {
    console.error('Error fetching Razorpay config:', error);
    return NextResponse.json({
      configured: false,
      keyId: null,
      error: error?.message || 'Failed to retrieve payment configuration',
    }, { status: 500 });
  }
}
