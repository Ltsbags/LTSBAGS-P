import { NextRequest, NextResponse } from 'next/server';
import { getUploadedImageFromFirestore } from '@/lib/firestore-sync';
import path from 'path';
import { existsSync } from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const folder = (pathSegments[0] || 'optimized') as 'optimized' | 'thumb' | 'original';
    const fileName = pathSegments[pathSegments.length - 1];

    // Check disk first
    const diskPath = path.join(process.cwd(), 'public', 'uploads', ...pathSegments);
    if (existsSync(diskPath)) {
      const fileBuffer = await readFile(diskPath);
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'image/webp';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.svg') contentType = 'image/svg+xml';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Fallback: Fetch from Firestore uploaded_images collection
    const firestoreImg = await getUploadedImageFromFirestore(fileName, folder);
    if (firestoreImg && firestoreImg.base64) {
      const buffer = Buffer.from(firestoreImg.base64, 'base64');
      
      // Write back to disk cache
      try {
        const dir = path.dirname(diskPath);
        await mkdir(dir, { recursive: true });
        await writeFile(diskPath, buffer);
      } catch (cacheErr) {
        console.warn('[Upload Route] Failed to cache image to disk:', cacheErr);
      }

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': firestoreImg.mimeType || 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Image Not Found', { status: 404 });
  } catch (error) {
    console.error('[Upload Fallback Route] Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
