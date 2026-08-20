import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, hashPassword, logAuditActivity } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req, 'SUPER_ADMIN');
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, email, role, isActive, password } = body;

    const existing = db.getAdminUserById(id);
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let passwordHash = existing.passwordHash;
    let salt = existing.salt;

    if (password && password.trim().length >= 8) {
      const hashed = hashPassword(password.trim());
      passwordHash = hashed.hash;
      salt = hashed.salt;
    }

    const updated = db.saveAdminUser({
      id,
      name: name || existing.name,
      email: email ? email.toLowerCase().trim() : existing.email,
      role: role || existing.role,
      isActive: isActive !== undefined ? isActive : existing.isActive,
      passwordHash,
      salt,
    });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_ADMIN_USER',
      'USER',
      id,
      { email: updated.email, role: updated.role }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req, 'SUPER_ADMIN');
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (id === auth.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    const targetUser = db.getAdminUserById(id);
    if (targetUser?.email === 'admin@ltsbags.com') {
      return NextResponse.json({ error: 'Primary system super admin cannot be deleted.' }, { status: 400 });
    }

    const deleted = db.deleteAdminUser(id);
    if (deleted) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_ADMIN_USER',
        'USER',
        id
      );
      return NextResponse.json({ message: 'User deleted successfully' });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
