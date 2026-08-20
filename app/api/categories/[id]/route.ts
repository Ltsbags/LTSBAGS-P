import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = db.getCategoryById(id) || db.getCategoryBySlug(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
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
    const existing = db.getCategoryById(id);

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updated = db.saveCategory({ ...body, id });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPDATE_CATEGORY',
      'CATEGORY',
      id,
      { name: updated.name }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = db.getCategoryById(id);

    const success = db.deleteCategory(id);
    if (success) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_CATEGORY',
        'CATEGORY',
        id,
        { name: existing?.name }
      );

      revalidatePath('/', 'layout');
      return NextResponse.json({ message: 'Category deleted successfully' });
    }
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
