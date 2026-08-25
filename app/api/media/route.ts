import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminAuth, logAuditActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const mediaList = db.getMedia(category, search);

    // Attach usage count to each asset for admin visibility
    const enriched = mediaList.map((m) => {
      const refs = db.getImageUsageReferences(m.id);
      return {
        ...m,
        usageCount: refs.length,
        references: refs,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Failed to fetch media assets:', error);
    return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    const saved = db.saveMedia(body);

    logAuditActivity(
      { id: auth.user.id, name: auth.user.name, email: auth.user.email },
      'UPLOAD_MEDIA',
      'MEDIA',
      saved.id,
      { title: saved.title, category: saved.category }
    );

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Failed to save media asset:', error);
    return NextResponse.json({ error: 'Failed to save media asset' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    // Check usage references before deleting
    const usageRefs = db.getImageUsageReferences(id);
    if (usageRefs.length > 0 && !force) {
      return NextResponse.json({
        error: 'IMAGE_IN_USE',
        message: `This image is actively used in ${usageRefs.length} location(s) across your website.`,
        usageCount: usageRefs.length,
        references: usageRefs,
      }, { status: 409 });
    }

    const success = db.deleteMedia(id);
    if (success) {
      logAuditActivity(
        { id: auth.user.id, name: auth.user.name, email: auth.user.email },
        'DELETE_MEDIA',
        'MEDIA',
        id,
        { forceDeleted: force, previousUsageCount: usageRefs.length }
      );
      return NextResponse.json({ success: true, message: 'Media asset deleted successfully' });
    }
    return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to delete media asset:', error);
    return NextResponse.json({ error: 'Failed to delete media asset' }, { status: 500 });
  }
}

