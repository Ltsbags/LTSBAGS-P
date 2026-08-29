import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const exportCsv = searchParams.get('export') === 'csv';
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase().trim();

    let enquiries = db.getEnquiries();

    if (status) {
      enquiries = enquiries.filter((e) => e.status.toUpperCase() === status.toUpperCase());
    }

    if (search) {
      enquiries = enquiries.filter(
        (e) =>
          e.name.toLowerCase().includes(search) ||
          e.company.toLowerCase().includes(search) ||
          e.email.toLowerCase().includes(search) ||
          e.mobile.includes(search) ||
          (e.productRequirement && e.productRequirement.toLowerCase().includes(search))
      );
    }

    if (exportCsv) {
      const headers = ['ID', 'Customer Name', 'Company', 'Email', 'Mobile', 'WhatsApp', 'Product Requirement', 'Quantity', 'Status', 'Priority', 'Assigned To', 'Follow-up Date', 'Created At'];
      const rows = enquiries.map((e) => [
        e.id,
        `"${(e.name || '').replace(/"/g, '""')}"`,
        `"${(e.company || '').replace(/"/g, '""')}"`,
        e.email || '',
        e.mobile || '',
        e.whatsapp || '',
        `"${(e.productRequirement || '').replace(/"/g, '""')}"`,
        e.quantity || 100,
        e.status || 'NEW',
        e.priority || 'MEDIUM',
        `"${(e.assignedTo || '').replace(/"/g, '""')}"`,
        e.followUpDate || '',
        e.createdAt || '',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="LTS-Enquiries-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      company,
      email,
      mobile,
      whatsapp,
      country,
      productRequirement,
      productId,
      category,
      quantity,
      targetPrice,
      material,
      size,
      color,
      logoBranding,
      printingType,
      embroideryType,
      sampleRequired,
      deliveryDate,
      deliveryLocation,
      deliveryAddress,
      referenceImageUrl,
      message,
      items,
      source,
    } = body;

    if (!name || !email || !mobile) {
      return NextResponse.json(
        { error: 'Please fill in all required contact fields (Name, Email, Phone/Mobile)' },
        { status: 400 }
      );
    }

    const newEnquiry = db.createEnquiry({
      name,
      company: company || 'Not Specified',
      email,
      mobile,
      whatsapp: whatsapp || mobile,
      country: country || 'India',
      productRequirement: productRequirement || (items && items.length > 0 ? items.map((i: any) => `${i.productName} (Qty: ${i.quantity})`).join(', ') : 'Custom Bag Requirement'),
      productId: productId || undefined,
      category: category || undefined,
      quantity: quantity ? Number(quantity) : (items && items.length > 0 ? items.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0) : 100),
      targetPrice: targetPrice || undefined,
      material: material || undefined,
      size: size || undefined,
      color: color || undefined,
      logoBranding: logoBranding || undefined,
      printingType: printingType || undefined,
      embroideryType: embroideryType || undefined,
      sampleRequired: !!sampleRequired,
      deliveryDate: deliveryDate || undefined,
      deliveryLocation: deliveryLocation || undefined,
      deliveryAddress: deliveryAddress || undefined,
      referenceImageUrl: referenceImageUrl || undefined,
      message: message || 'Direct B2B Request for Quote submitted via web portal.',
      items: Array.isArray(items) ? items : undefined,
      source: source || 'FORM',
    });

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully. Our manufacturing sales team will contact you within 24 hours.', enquiry: newEnquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
