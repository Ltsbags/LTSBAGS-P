import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const exportCsv = searchParams.get('export') === 'csv';

  const customers = db.getCustomers(search);

  if (exportCsv) {
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'WhatsApp', 'City', 'State', 'Type', 'Industry', 'Total Orders', 'Total Spent (INR)', 'Created At'];
    const rows = customers.map(c => [
      c.id,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.companyName || '').replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      c.whatsapp || '',
      `"${(c.city || '').replace(/"/g, '""')}"`,
      `"${(c.state || '').replace(/"/g, '""')}"`,
      c.customerType || 'CORPORATE',
      c.industry || '',
      c.totalOrders || 0,
      c.totalSpent || 0,
      c.createdAt || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="LTS-Customers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  }

  return NextResponse.json({ customers, total: customers.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (auth.errorResponse || !auth.user) {
    return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Customer name and email are required' }, { status: 400 });
    }

    const customer = db.saveCustomer(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      body.id ? 'UPDATE_CUSTOMER' : 'CREATE_CUSTOMER',
      'CUSTOMER',
      customer.id,
      { name: customer.name, company: customer.companyName }
    );

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save customer' }, { status: 500 });
  }
}
