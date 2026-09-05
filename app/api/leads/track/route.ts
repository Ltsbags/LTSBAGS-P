import { NextRequest, NextResponse } from 'next/server';
import { logSeoLeadEvent } from '@/lib/programmatic-seo/lead-tracker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_type, page_slug, page_title, product, location, industry, referrer } = body;

    if (!event_type || !page_slug) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    const leadEvent = logSeoLeadEvent({
      event_type,
      page_slug,
      page_title,
      product,
      location,
      industry,
      referrer,
      user_agent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true, event: leadEvent });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error tracking event' }, { status: 500 });
  }
}
