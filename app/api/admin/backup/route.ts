import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req, 'SUPER_ADMIN');
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = db.createBackupSnapshot();

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'EXPORT_DATABASE_BACKUP',
      'SYSTEM',
      'snapshot'
    );

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error('Backup snapshot error:', error);
    return NextResponse.json({ error: 'Failed to generate database backup' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req, 'SUPER_ADMIN');
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const backupData = body.data || body;

    const restored = db.restoreFromBackup(backupData);
    if (!restored) {
      return NextResponse.json({ error: 'Failed to restore database from backup file' }, { status: 400 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'RESTORE_DATABASE_BACKUP',
      'SYSTEM',
      'snapshot'
    );

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: 'Database restored successfully' });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}
