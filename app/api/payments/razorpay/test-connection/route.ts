import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getRazorpayCredentials } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let keyId = body.keyId?.trim();
    let keySecret = body.keySecret?.trim();

    if (!keyId || !keySecret) {
      const stored = getRazorpayCredentials();
      if (stored) {
        if (!keyId) keyId = stored.keyId;
        if (!keySecret) keySecret = stored.keySecret;
      }
    }

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        status: 'not_configured',
        message: 'Razorpay Key ID and Key Secret are missing. Please enter your keys in Admin Settings or .env file.',
      }, { status: 400 });
    }

    const testClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const startTime = Date.now();
    // Test API call to Razorpay to verify credentials
    const testOrders = await testClient.orders.all({ count: 1 });
    const latencyMs = Date.now() - startTime;

    const isTestKey = keyId.startsWith('rzp_test_');

    return NextResponse.json({
      success: true,
      status: 'connected',
      mode: isTestKey ? 'TEST_SANDBOX' : 'LIVE_PRODUCTION',
      keyId: keyId,
      latencyMs,
      message: `Successfully connected to Razorpay Gateway in ${isTestKey ? 'Test / Sandbox' : 'Live Production'} mode (${latencyMs}ms)!`,
      ordersCount: testOrders?.items?.length ?? 0,
    });
  } catch (error: any) {
    console.error('Razorpay test connection error:', error);
    const errMsg = error?.error?.description || error?.message || 'Authentication with Razorpay failed. Please check your Key ID and Secret.';
    return NextResponse.json({
      success: false,
      status: 'error',
      message: errMsg,
      statusCode: error?.statusCode || 401,
    }, { status: 200 });
  }
}
