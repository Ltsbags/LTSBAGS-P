import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET() {
  try {
    const rawSettings = db.getSettings();
    
    // Mask sensitive API keys before sending to browser
    const sanitizedSettings = {
      ...rawSettings,
      paymentGateway: rawSettings.paymentGateway
        ? {
            ...rawSettings.paymentGateway,
            hasKeySecret: Boolean(
              rawSettings.paymentGateway.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET
            ),
            razorpayKeyId: rawSettings.paymentGateway.razorpayKeyId || process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            razorpayKeySecret: '', // never expose raw secret
          }
        : undefined,
      imageProcessing: rawSettings.imageProcessing
        ? {
            ...rawSettings.imageProcessing,
            hasBgRemovalApiKey: Boolean(
              rawSettings.imageProcessing.bgRemovalApiKey || process.env.BACKGROUND_REMOVAL_API_KEY
            ),
            hasUpscalingApiKey: Boolean(
              rawSettings.imageProcessing.upscalingApiKey || process.env.UPSCALING_API_KEY
            ),
            bgRemovalApiKeyMasked: rawSettings.imageProcessing.bgRemovalApiKey
              ? '••••••••••••••••'
              : process.env.BACKGROUND_REMOVAL_API_KEY
              ? '•••••••• (From .env)'
              : '',
            upscalingApiKeyMasked: rawSettings.imageProcessing.upscalingApiKey
              ? '••••••••••••••••'
              : process.env.UPSCALING_API_KEY
              ? '•••••••• (From .env)'
              : '',
            bgRemovalApiKey: '', // never expose raw key
            upscalingApiKey: '', // never expose raw key
          }
        : undefined,
    };

    return NextResponse.json(sanitizedSettings);
  } catch (error) {
    console.error('API Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updated = db.updateSettings(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_SETTINGS',
      'SETTINGS',
      'global-settings',
      { companyName: updated.contactInfo?.companyName || updated.logoText, phone: updated.contactInfo?.phone1 }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('API Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
