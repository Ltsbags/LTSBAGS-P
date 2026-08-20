import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  verifyPassword, 
  generateSessionToken, 
  checkLoginRateLimit, 
  recordFailedLogin, 
  clearLoginRateLimit, 
  getClientIp, 
  getUserAgent,
  logAuditActivity 
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const userAgent = getUserAgent(req);
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const rateKey = `${ip}:${email.toLowerCase().trim()}`;
    const rateCheck = checkLoginRateLimit(rateKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateCheck.waitSeconds} seconds.` 
        },
        { status: 429 }
      );
    }

    const user = db.getAdminUserByEmail(email);
    if (!user || !user.isActive) {
      const fail = recordFailedLogin(rateKey);
      return NextResponse.json(
        { 
          error: fail.locked 
            ? `Too many failed attempts. Locked for ${fail.waitSeconds} seconds.` 
            : `Invalid admin credentials. (${fail.remainingAttempts} attempts remaining before lockout)` 
        },
        { status: 401 }
      );
    }

    const isMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      const fail = recordFailedLogin(rateKey);
      return NextResponse.json(
        { 
          error: fail.locked 
            ? `Too many failed attempts. Account locked for ${fail.waitSeconds} seconds.` 
            : `Invalid admin credentials. (${fail.remainingAttempts} attempts remaining)` 
        },
        { status: 401 }
      );
    }

    // Success - Clear failed attempts
    clearLoginRateLimit(rateKey);

    // Create session token (7 days expiry)
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    db.createSession({
      token,
      userId: user.id,
      expiresAt,
      ipAddress: ip,
      userAgent,
      createdAt: new Date().toISOString(),
    });

    // Update last login
    db.saveAdminUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: new Date().toISOString(),
    });

    // Log audit
    logAuditActivity(
      { id: user.id, name: user.name, email: user.email },
      'ADMIN_LOGIN',
      'AUTH',
      user.id,
      { ip, userAgent: userAgent.substring(0, 100) },
      ip
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      expiresAt,
    });

    // Set secure HTTP-Only cookie
    response.cookies.set('lts_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
