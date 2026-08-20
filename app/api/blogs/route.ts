import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase().trim();

    let blogs = db.getBlogs();

    if (status) {
      blogs = blogs.filter((b) => (b.status || 'PUBLISHED').toUpperCase() === status.toUpperCase());
    }

    if (search) {
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.excerpt.toLowerCase().includes(search) ||
          b.category.toLowerCase().includes(search) ||
          b.author.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
    }

    const saved = db.saveBlog(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'CREATE_BLOG',
      'BLOG',
      saved.id,
      { title: saved.title }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving blog:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
