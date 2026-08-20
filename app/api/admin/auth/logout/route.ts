import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { extractSessionToken, getAuthenticatedAdmin, logAuditActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedAdmin(req);
    const token = extractSessionToken(req);

    if (token) {
      db.deleteSession(token);
    }

    if (auth) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'ADMIN_LOGOUT',
        'AUTH',
        auth.user.id
      );
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear cookie
    response.cookies.set('lts_admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout cleanly' }, { status: 500 });
  }
}
