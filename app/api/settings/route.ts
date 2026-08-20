import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET() {
  try {
    const settings = db.getSettings();
    return NextResponse.json(settings);
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
