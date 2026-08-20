import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedAdmin(req);
    if (!auth) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
        lastLogin: auth.user.lastLogin,
      },
      session: {
        expiresAt: auth.session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.json({ authenticated: false, error: 'Authentication check failed' }, { status: 500 });
  }
}
