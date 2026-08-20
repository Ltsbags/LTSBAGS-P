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
    const duplicated = db.duplicateProduct(id);

    if (!duplicated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'DUPLICATE_PRODUCT',
      'PRODUCT',
      duplicated.id,
      { originalId: id, name: duplicated.name }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error('Duplicate product error:', error);
    return NextResponse.json({ error: 'Failed to duplicate product' }, { status: 500 });
  }
}
