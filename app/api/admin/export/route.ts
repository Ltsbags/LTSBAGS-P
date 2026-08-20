import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'products';

    let csvContent = '';
    let filename = `export-${type}-${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'products') {
      const products = db.getProducts();
      const headers = ['ID', 'Name', 'Category', 'SKU', 'Materials', 'MOQ', 'Status', 'Featured', 'Short Description', 'Created At'];
      const rows = products.map((p) => [
        escapeCsvValue(p.id),
        escapeCsvValue(p.name),
        escapeCsvValue(p.categoryName || p.categoryId),
        escapeCsvValue(p.sku || ''),
        escapeCsvValue(p.materials || ''),
        escapeCsvValue(p.moq || 100),
        escapeCsvValue(p.status || 'PUBLISHED'),
        escapeCsvValue(p.isFeatured ? 'YES' : 'NO'),
        escapeCsvValue(p.shortDesc || ''),
        escapeCsvValue(p.createdAt || ''),
      ].join(','));
      csvContent = [headers.join(','), ...rows].join('\n');
    } else if (type === 'categories') {
      const categories = db.getCategories();
      const headers = ['ID', 'Name', 'Slug', 'Description', 'Meta Title', 'Created At'];
      const rows = categories.map((c) => [
        escapeCsvValue(c.id),
        escapeCsvValue(c.name),
        escapeCsvValue(c.slug),
        escapeCsvValue(c.description || ''),
        escapeCsvValue(c.metaTitle || ''),
        escapeCsvValue(c.createdAt || ''),
      ].join(','));
      csvContent = [headers.join(','), ...rows].join('\n');
    } else if (type === 'enquiries') {
      const enquiries = db.getEnquiries();
      const headers = ['ID', 'Customer Name', 'Company', 'Email', 'Mobile', 'Product Requirement', 'Quantity', 'Status', 'Source', 'Message', 'Created At'];
      const rows = enquiries.map((e) => [
        escapeCsvValue(e.id),
        escapeCsvValue(e.name || e.customerName || ''),
        escapeCsvValue(e.company || e.companyName || ''),
        escapeCsvValue(e.email || ''),
        escapeCsvValue(e.mobile || e.phone || ''),
        escapeCsvValue(e.productRequirement || e.product || ''),
        escapeCsvValue(e.quantity || ''),
        escapeCsvValue(e.status || 'NEW'),
        escapeCsvValue(e.source || 'FORM'),
        escapeCsvValue(e.message || ''),
        escapeCsvValue(e.createdAt || ''),
      ].join(','));
      csvContent = [headers.join(','), ...rows].join('\n');
    } else if (type === 'blogs') {
      const blogs = db.getBlogs();
      const headers = ['ID', 'Title', 'Slug', 'Category', 'Author', 'Status', 'Published At'];
      const rows = blogs.map((b) => [
        escapeCsvValue(b.id),
        escapeCsvValue(b.title),
        escapeCsvValue(b.slug),
        escapeCsvValue(b.category || ''),
        escapeCsvValue(b.author || ''),
        escapeCsvValue(b.status || 'PUBLISHED'),
        escapeCsvValue(b.publishedAt || ''),
      ].join(','));
      csvContent = [headers.join(','), ...rows].join('\n');
    } else {
      return NextResponse.json({ error: 'Invalid export type requested' }, { status: 400 });
    }

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'EXPORT_CSV',
      type.toUpperCase(),
      type
    );

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    return NextResponse.json({ error: 'Failed to generate CSV export' }, { status: 500 });
  }
}
