import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required to duplicate' }, { status: 400 });
    }

    const duplicate = db.duplicateProduct(id);
    if (!duplicate) {
      return NextResponse.json({ error: 'Original product not found' }, { status: 404 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'DUPLICATE_PRODUCT',
      'PRODUCT',
      duplicate.id,
      { originalId: id, newName: duplicate.name }
    );

    return NextResponse.json({ success: true, product: duplicate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to duplicate product' }, { status: 500 });
  }
}
