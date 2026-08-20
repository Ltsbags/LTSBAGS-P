import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const nav = db.getNavigation();
    return NextResponse.json(nav);
  } catch (error) {
    console.error('Fetch navigation error:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const saved = db.saveNavigation(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_NAVIGATION',
      'NAVIGATION',
      'nav-config'
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Save navigation error:', error);
    return NextResponse.json({ error: 'Failed to save navigation' }, { status: 500 });
  }
}
