import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = db.getProductById(id) || db.getProductBySlug(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const existing = db.getProductById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = db.saveProduct({ ...body, id });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_PRODUCT',
      'PRODUCT',
      id,
      { name: updated.name, status: updated.status }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = db.getProductById(id);

    const success = db.deleteProduct(id);
    if (success) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_PRODUCT',
        'PRODUCT',
        id,
        { name: existing?.name }
      );

      revalidatePath('/', 'layout');
      return NextResponse.json({ message: 'Product deleted successfully' });
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
