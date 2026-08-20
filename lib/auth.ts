import 'server-only';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { AdminRole, AdminUser, AdminSession, AuditLog } from './types';
import { db } from './db';

// Rate Limiter / Brute Force Tracker (In-memory)
interface RateLimitEntry {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginRateLimits = new Map<string, RateLimitEntry>();
const apiRateLimits = new Map<string, { count: number; resetAt: number }>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Hash password with PBKDF2 (100,000 iterations SHA-512)
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

/**
 * Timing-safe password verification
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedHashBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedHashBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedHashBuffer);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Generate cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Check rate limit for login attempts by IP or email key
 */
export function checkLoginRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginRateLimits.get(key);

  if (!entry) return { allowed: true };

  if (entry.lockedUntil && now < entry.lockedUntil) {
    const waitSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // If lockout expired or window reset
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    loginRateLimits.delete(key);
    return { allowed: true };
  }

  if (now - entry.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginRateLimits.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(key: string): { locked: boolean; remainingAttempts: number; waitSeconds?: number } {
  const now = Date.now();
  let entry = loginRateLimits.get(key);

  if (!entry || now - entry.lastAttempt > ATTEMPT_WINDOW_MS) {
    entry = { attempts: 1, lastAttempt: now };
  } else {
    entry.attempts += 1;
    entry.lastAttempt = now;
  }

  if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginRateLimits.set(key, entry);
    return {
      locked: true,
      remainingAttempts: 0,
      waitSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  loginRateLimits.set(key, entry);
  return {
    locked: false,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - entry.attempts,
  };
}

/**
 * Clear failed login attempts after successful authentication
 */
export function clearLoginRateLimit(key: string): void {
  loginRateLimits.delete(key);
}

/**
 * General API Rate Limiting (e.g. 120 requests / min per IP)
 */
export function checkApiRateLimit(ip: string, maxRequests = 120, windowMs = 60000): boolean {
  const now = Date.now();
  let entry = apiRateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    apiRateLimits.set(ip, entry);
    return true;
  }

  entry.count += 1;
  if (entry.count > maxRequests) {
    return false;
  }
  return true;
}

/**
 * Extract client IP from headers
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * Extract user-agent from headers
 */
export function getUserAgent(req: NextRequest): string {
  return req.headers.get('user-agent') || 'Unknown';
}

/**
 * Extract admin session token from request (Cookie or Authorization header)
 */
export function extractSessionToken(req: NextRequest): string | null {
  // 1. Try Cookie
  const cookie = req.cookies.get('lts_admin_session');
  if (cookie?.value) return cookie.value;

  // 2. Try Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 3. Fallback for legacy clients if provided
  const legacyHeader = req.headers.get('x-admin-token');
  if (legacyHeader) return legacyHeader.trim();

  return null;
}

/**
 * Verify admin session from request
 */
export async function getAuthenticatedAdmin(req: NextRequest): Promise<{ user: AdminUser; session: AdminSession } | null> {
  const token = extractSessionToken(req);
  if (!token) return null;

  const session = db.getSessionByToken(token);
  if (!session) return null;

  // Check expiry
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    db.deleteSession(token);
    return null;
  }

  const user = db.getAdminUserById(session.userId);
  if (!user || !user.isActive) {
    db.deleteSession(token);
    return null;
  }

  return { user, session };
}

/**
 * Check role permissions
 */
export function hasPermission(role: AdminRole, action: 'manage_products' | 'manage_categories' | 'manage_enquiries' | 'manage_blogs' | 'manage_content' | 'manage_media' | 'manage_settings' | 'manage_users' | 'export_data'): boolean {
  if (role === 'SUPER_ADMIN') return true;

  switch (action) {
    case 'manage_products':
    case 'manage_categories':
      return role === 'CONTENT_MANAGER' || role === 'EDITOR' || role === 'SEO_SPECIALIST';
    case 'manage_blogs':
    case 'manage_media':
    case 'manage_content':
      return role === 'CONTENT_MANAGER' || role === 'EDITOR' || role === 'SEO_SPECIALIST';
    case 'manage_enquiries':
      return role === 'SALES_MANAGER';
    case 'export_data':
      return role === 'SALES_MANAGER' || role === 'CONTENT_MANAGER';
    case 'manage_settings':
    case 'manage_users':
      return false;
    default:
      return false;
  }
}

/**
 * Enforce admin authentication on API routes
 */
export async function requireAdminAuth(
  req: NextRequest,
  requiredRole?: AdminRole | AdminRole[]
): Promise<{ errorResponse?: NextResponse; user?: AdminUser; session?: AdminSession }> {
  // Rate limit check
  const ip = getClientIp(req);
  if (!checkApiRateLimit(ip, 200, 60000)) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      ),
    };
  }

  const auth = await getAuthenticatedAdmin(req);
  if (!auth) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized. Valid admin authentication session required.' },
        { status: 401 }
      ),
    };
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(auth.user.role) && auth.user.role !== 'SUPER_ADMIN') {
      return {
        errorResponse: NextResponse.json(
          { error: 'Forbidden. You do not have permission for this resource.' },
          { status: 403 }
        ),
      };
    }
  }

  return { user: auth.user, session: auth.session };
}

/**
 * Log an audit activity securely (no passwords or secrets stored)
 */
export function logAuditActivity(
  user: { id: string; name: string; email: string },
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>,
  ipAddress?: string
): AuditLog {
  const sanitizedDetails = details ? { ...details } : {};
  // Strip any accidental sensitive keys
  delete (sanitizedDetails as any).password;
  delete (sanitizedDetails as any).passwordHash;
  delete (sanitizedDetails as any).token;

  return db.createAuditLog({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    action,
    resource,
    resourceId: resourceId || '',
    details: sanitizedDetails,
    ipAddress: ipAddress || '127.0.0.1',
  });
}
