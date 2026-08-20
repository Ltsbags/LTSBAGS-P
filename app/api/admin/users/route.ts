import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, hashPassword, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req, 'SUPER_ADMIN');
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = db.getAdminUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req, 'SUPER_ADMIN');
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role, isActive } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    const existing = db.getAdminUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An admin user with this email already exists' }, { status: 400 });
    }

    const passToHash = password && password.trim().length >= 8 ? password.trim() : 'admin123';
    const { hash, salt } = hashPassword(passToHash);

    const created = db.saveAdminUser({
      name,
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      salt,
      role,
      isActive: isActive !== undefined ? isActive : true,
    });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CREATE_ADMIN_USER',
      'USER',
      created.id,
      { email: created.email, role: created.role }
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
