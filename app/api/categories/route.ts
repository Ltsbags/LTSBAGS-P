import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET() {
  try {
    const categories = db.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const saved = db.saveCategory(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CREATE_CATEGORY',
      'CATEGORY',
      saved.id,
      { name: saved.name }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
