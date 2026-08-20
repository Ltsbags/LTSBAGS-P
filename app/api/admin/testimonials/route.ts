import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const testimonials = db.getTestimonials(publishedOnly);
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, company, content, review, rating, source, verificationStatus, publishStatus, avatarUrl, photoUrl, displayOrder } = body;

    if (!name || !company || (!content && !review)) {
      return NextResponse.json({ error: 'Name, company, and review content are required' }, { status: 400 });
    }

    const created = db.saveTestimonial({
      name,
      company,
      content: content || review,
      review: review || content,
      rating: rating || 5,
      source: source || 'Verified Customer',
      verificationStatus: verificationStatus || 'VERIFIED',
      publishStatus: publishStatus || 'PUBLISHED',
      avatarUrl: avatarUrl || photoUrl || '',
      photoUrl: photoUrl || avatarUrl || '',
      displayOrder: displayOrder !== undefined ? displayOrder : 1,
    });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CREATE_TESTIMONIAL',
      'TESTIMONIAL',
      created.id,
      { client: `${created.name} (${created.company})` }
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
