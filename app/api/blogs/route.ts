import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const blogs = db.getBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
    }
    const saved = db.saveBlog(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving blog:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
