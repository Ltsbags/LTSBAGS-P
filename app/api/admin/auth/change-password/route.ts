import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, verifyPassword, hashPassword, logAuditActivity, getClientIp } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long for security' },
        { status: 400 }
      );
    }

    // Get fresh user record with salt/hash from db
    const freshUser = db.getAdminUserById(auth.user.id);
    if (!freshUser) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = verifyPassword(currentPassword, freshUser.salt, freshUser.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    // Hash new password
    const { hash, salt } = hashPassword(newPassword);
    const updated = db.updateAdminPassword(auth.user.id, hash, salt);

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    const ip = getClientIp(req);
    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CHANGE_PASSWORD',
      'AUTH',
      auth.user.id,
      { success: true },
      ip
    );

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Failed to process password change' }, { status: 500 });
  }
}
