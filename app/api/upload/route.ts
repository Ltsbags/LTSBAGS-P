import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/png';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Optionally try to write to public/uploads directory
    try {
      const fileExt = path.extname(file.name) || '.jpg';
      const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9.]/g, '') || '.jpg';
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `upload_${timestamp}_${randomStr}${cleanExt}`;

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
    } catch (diskErr) {
      console.warn('Could not write upload to disk, using data URL fallback:', diskErr);
    }

    // Always return dataUrl which works 100% reliably in Next.js without 404 static asset issues
    return NextResponse.json({ url: dataUrl, success: true });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to process uploaded image' }, { status: 500 });
  }
}
