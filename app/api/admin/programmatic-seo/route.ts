import { NextRequest, NextResponse } from 'next/server';
import { seoStorage } from '@/lib/programmatic-seo/storage';
import { generateProgrammaticPage } from '@/lib/programmatic-seo/page-generator';
import { getSeoLeadEvents } from '@/lib/programmatic-seo/lead-tracker';
import { SEO_PRODUCTS } from '@/lib/programmatic-seo/data/products';
import { SEO_LOCATIONS } from '@/lib/programmatic-seo/data/locations';
import { SEO_INDUSTRIES } from '@/lib/programmatic-seo/data/industries';
import { SEO_MATERIALS } from '@/lib/programmatic-seo/data/materials';
import { SEO_APPLICATIONS } from '@/lib/programmatic-seo/data/applications';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = seoStorage.getStats();
      return NextResponse.json(stats);
    }

    if (action === 'leads') {
      const leads = getSeoLeadEvents(50);
      return NextResponse.json(leads);
    }

    if (action === 'meta') {
      return NextResponse.json({
        products: SEO_PRODUCTS,
        locations: SEO_LOCATIONS,
        industries: SEO_INDUSTRIES,
        materials: SEO_MATERIALS,
        applications: SEO_APPLICATIONS,
      });
    }

    const status = searchParams.get('status') as any;
    const page_type = searchParams.get('page_type') as any;
    const search = searchParams.get('search') || undefined;

    const pages = seoStorage.getPages({
      status: status || undefined,
      page_type: page_type || undefined,
      search,
    });

    return NextResponse.json({
      pages,
      stats: seoStorage.getStats(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching SEO pages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, options, page, id, status } = body;

    if (action === 'generate') {
      const existing = seoStorage.getAllPages();
      const generated = generateProgrammaticPage(options, existing);
      return NextResponse.json({ success: true, page: generated });
    }

    if (action === 'seed') {
      const result = seoStorage.seedInitialCurated();
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'audit') {
      const auditResults = seoStorage.runFullAudit();
      return NextResponse.json({ success: true, results: auditResults, stats: seoStorage.getStats() });
    }

    if (action === 'update_status' && id && status) {
      const updated = seoStorage.updateStatus(id, status);
      if (!updated) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      return NextResponse.json({ success: true, page: updated });
    }

    // Default create page
    if (page) {
      const saved = seoStorage.savePage(page);
      return NextResponse.json({ success: true, page: saved });
    }

    return NextResponse.json({ error: 'Invalid action or payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing request' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ error: 'Missing page ID' }, { status: 400 });
    }
    const saved = seoStorage.savePage(body);
    return NextResponse.json({ success: true, page: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating page' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing page ID' }, { status: 400 });

    const ok = seoStorage.deletePage(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error deleting page' }, { status: 500 });
  }
}
