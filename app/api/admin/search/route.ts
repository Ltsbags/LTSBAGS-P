import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdminAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase().trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        products: [],
        enquiries: [],
        quotations: [],
        customers: [],
        followUps: [],
        blogs: [],
      });
    }

    const allProducts = db.getProducts();
    const allEnquiries = db.getEnquiries();
    const allQuotations = db.getQuotations();
    const allCustomers = db.getCustomers();
    const allFollowUps = db.getFollowUps();
    const allBlogs = db.getBlogs();

    const products = allProducts
      .filter((p) => p.name.toLowerCase().includes(q) || p.slug.includes(q) || (p.materials && p.materials.toLowerCase().includes(q)))
      .slice(0, 5)
      .map((p) => ({ id: p.id, name: p.name, categorySlug: p.categorySlug, isFeatured: p.isFeatured }));

    const enquiries = allEnquiries
      .filter((e) => e.name.toLowerCase().includes(q) || (e.company && e.company.toLowerCase().includes(q)) || (e.productRequirement && e.productRequirement.toLowerCase().includes(q)) || e.email.toLowerCase().includes(q))
      .slice(0, 5)
      .map((e) => ({ id: e.id, name: e.name, company: e.company, productRequirement: e.productRequirement, status: e.status }));

    const quotations = allQuotations
      .filter((qt) => qt.quoteNumber.toLowerCase().includes(q) || qt.clientName.toLowerCase().includes(q) || (qt.companyName && qt.companyName.toLowerCase().includes(q)))
      .slice(0, 5)
      .map((qt) => ({ id: qt.id, quoteNumber: qt.quoteNumber, clientName: qt.clientName, totalAmount: qt.totalAmount, status: qt.status }));

    const customers = allCustomers
      .filter((c) => c.name.toLowerCase().includes(q) || c.companyName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q))
      .slice(0, 5)
      .map((c) => ({ id: c.id, name: c.name, companyName: c.companyName, status: c.status, email: c.email }));

    const followUps = allFollowUps
      .filter((f) => f.title.toLowerCase().includes(q) || f.customerName.toLowerCase().includes(q) || f.assignedEmployee.toLowerCase().includes(q))
      .slice(0, 5)
      .map((f) => ({ id: f.id, title: f.title, customerName: f.customerName, followUpDate: f.followUpDate, status: f.status }));

    const blogs = allBlogs
      .filter((b) => b.title.toLowerCase().includes(q) || b.slug.includes(q))
      .slice(0, 5)
      .map((b) => ({ id: b.id, title: b.title, slug: b.slug }));

    return NextResponse.json({
      products,
      enquiries,
      quotations,
      customers,
      followUps,
      blogs,
    });
  } catch (error) {
    console.error('Admin search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
