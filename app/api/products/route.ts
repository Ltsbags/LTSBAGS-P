import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase().trim();
    const exportCsv = searchParams.get('export') === 'csv';
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    let products = db.getProducts();

    if (!includeDeleted) {
      products = products.filter((p) => !p.isDeleted);
    }

    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId);
    }
    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }
    if (status) {
      products = products.filter((p) => (p.status || 'PUBLISHED').toUpperCase() === status.toUpperCase());
    }
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          (p.sku && p.sku.toLowerCase().includes(search)) ||
          p.materials.toLowerCase().includes(search) ||
          p.shortDesc.toLowerCase().includes(search) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(search))
      );
    }

    if (exportCsv) {
      const headers = ['ID', 'SKU', 'Product Name', 'Category', 'MOQ', 'Materials', 'Status', 'Is Featured', 'Meta Title', 'Created Date'];
      const rows = products.map((p) => [
        p.id,
        p.sku || '',
        `"${p.name.replace(/"/g, '""')}"`,
        `"${(p.categoryName || '').replace(/"/g, '""')}"`,
        p.moq || 100,
        `"${(p.materials || '').replace(/"/g, '""')}"`,
        p.status || 'ACTIVE',
        p.isFeatured ? 'YES' : 'NO',
        `"${(p.metaTitle || '').replace(/"/g, '""')}"`,
        p.createdAt ? p.createdAt.split('T')[0] : '',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="LTS-Products-Catalog-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.categoryId) {
      return NextResponse.json({ error: 'Product name and category are required' }, { status: 400 });
    }

    const saved = db.saveProduct(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CREATE_PRODUCT',
      'PRODUCT',
      saved.id,
      { name: saved.name, category: saved.categoryName }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
