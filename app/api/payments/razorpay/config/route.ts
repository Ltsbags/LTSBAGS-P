import { NextResponse } from 'next/server';
import { isRazorpayConfigured, getPublicRazorpayKey } from '@/lib/razorpay';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const isConfigured = isRazorpayConfigured();
    const keyId = getPublicRazorpayKey();
    const settings = db.getSettings();
    const pg = settings?.paymentGateway;
    const contact = settings?.contactInfo;

    return NextResponse.json({
      configured: isConfigured,
      keyId: keyId || null,
      testMode: keyId?.startsWith('rzp_test_') || pg?.testMode || false,
      companyName: pg?.accountName || contact?.legalCompanyName || contact?.companyName || 'LTS BAGS PRIVATE LIMITED',
      supportEmail: contact?.email1 || 'sales@ltsbags.com',
      supportPhone: contact?.phone1 || '+91 98335 98338',
      currency: 'INR',
      bankDetails: {
        accountName: pg?.accountName || 'LTS BAGS PRIVATE LIMITED',
        bankName: pg?.bankName || 'Yes Bank (Lower Parel, Mumbai Branch)',
        accountNumber: pg?.accountNumber || '041961900001163',
        ifscCode: pg?.ifscCode || 'YESB0000419',
        upiId: pg?.upiId || 'ltsbags@yesbank',
        gstNumber: pg?.gstNumber || contact?.gstNumber || '27AAGCL1568H1ZC',
        panNumber: pg?.panNumber || 'AAGCL1568H',
      }
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
