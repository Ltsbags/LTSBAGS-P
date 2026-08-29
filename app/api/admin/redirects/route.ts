import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const redirects = db.getRedirects();
  return NextResponse.json({ redirects, total: redirects.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.sourceUrl || !body.targetUrl) {
      return NextResponse.json({ error: 'Source URL and Target URL are required' }, { status: 400 });
    }

    const redirect = db.saveRedirect(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      body.id ? 'UPDATE_REDIRECT' : 'CREATE_REDIRECT',
      'REDIRECT',
      redirect.id,
      { source: redirect.sourceUrl, target: redirect.targetUrl, status: redirect.statusCode }
    );

    return NextResponse.json({ success: true, redirect });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save redirect rule' }, { status: 500 });
  }
}
