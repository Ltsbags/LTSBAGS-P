import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, action, status, isFeatured, categoryId } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs array is required' }, { status: 400 });
    }

    let updatedCount = 0;

    if (action === 'STATUS_UPDATE' && status) {
      updatedCount = db.bulkUpdateProducts(ids, { status });
    } else if (action === 'FEATURE_TOGGLE' && typeof isFeatured === 'boolean') {
      updatedCount = db.bulkUpdateProducts(ids, { isFeatured });
    } else if (action === 'CHANGE_CATEGORY' && categoryId) {
      const cat = db.getCategoryById(categoryId);
      updatedCount = db.bulkUpdateProducts(ids, {
        categoryId,
        categoryName: cat ? cat.name : undefined,
      });
    } else if (action === 'SOFT_DELETE') {
      ids.forEach((id) => db.softDeleteProduct(id));
      updatedCount = ids.length;
    } else if (action === 'RESTORE') {
      ids.forEach((id) => db.restoreProduct(id));
      updatedCount = ids.length;
    } else {
      return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'BULK_UPDATE_PRODUCTS',
      'PRODUCT',
      ids.join(','),
      { action, count: updatedCount }
    );

    return NextResponse.json({ success: true, count: updatedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to perform bulk action' }, { status: 500 });
  }
}
