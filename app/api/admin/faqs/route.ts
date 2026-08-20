import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';
    const faqs = db.getFaqs(activeOnly);
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Fetch FAQs error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { question, answer, category, displayOrder, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const created = db.saveFaq({
      question,
      answer,
      category: category || 'General',
      displayOrder: displayOrder !== undefined ? displayOrder : 1,
      isActive: isActive !== undefined ? isActive : true,
    });

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CREATE_FAQ',
      'FAQ',
      created.id,
      { question: created.question }
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
