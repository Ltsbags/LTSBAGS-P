import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const duplicated = db.duplicateBlog(id);

    if (!duplicated) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'DUPLICATE_BLOG',
      'BLOG',
      duplicated.id,
      { originalId: id, title: duplicated.title }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error('Duplicate blog error:', error);
    return NextResponse.json({ error: 'Failed to duplicate blog post' }, { status: 500 });
  }
}
