import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ltsbags.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const isValidEmail = email === adminEmail || email === 'admin@apexbags.com';

    if (isValidEmail && password === adminPassword) {
      return NextResponse.json({
        success: true,
        token: 'apex_admin_authenticated_session_token',
        user: {
          email: email,
          name: 'LTS BAGS Operations Manager',
          role: 'ADMIN',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET() {
  const stats = db.getStats();
  return NextResponse.json(stats);
}
