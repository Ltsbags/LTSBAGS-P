import Razorpay from 'razorpay';
import { db } from './db';

let razorpayInstance: Razorpay | null = null;
let lastKeyId = '';
let lastKeySecret = '';

export function getRazorpayCredentials(): { keyId: string; keySecret: string } | null {
  let keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
  let keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  // If not found in process.env, check DB settings
  if (!keyId || !keySecret) {
    try {
      const settings = db.getSettings();
      const pg = settings?.paymentGateway;
      if (pg) {
        if (!keyId && pg.razorpayKeyId) keyId = pg.razorpayKeyId.trim();
        if (!keySecret && pg.razorpayKeySecret) keySecret = pg.razorpayKeySecret.trim();
      }
    } catch (e) {
      // ignore
    }
  }

  if (keyId && keySecret) {
    return { keyId, keySecret };
  }
  return null;
}

export function getRazorpayClient(): Razorpay {
  const creds = getRazorpayCredentials();

  if (!creds || !creds.keyId || !creds.keySecret) {
    throw new Error('Razorpay API keys (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured.');
  }

  if (!razorpayInstance || lastKeyId !== creds.keyId || lastKeySecret !== creds.keySecret) {
    razorpayInstance = new Razorpay({
      key_id: creds.keyId,
      key_secret: creds.keySecret,
    });
    lastKeyId = creds.keyId;
    lastKeySecret = creds.keySecret;
  }

  return razorpayInstance;
}

export function isRazorpayConfigured(): boolean {
  const creds = getRazorpayCredentials();
  return Boolean(creds && creds.keyId && creds.keySecret);
}

export function getPublicRazorpayKey(): string | null {
  const envKey = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '').trim();
  if (envKey) return envKey;

  try {
    const settings = db.getSettings();
    if (settings?.paymentGateway?.razorpayKeyId) {
      return settings.paymentGateway.razorpayKeyId.trim();
    }
  } catch (e) {
    // ignore
  }

  return null;
}
