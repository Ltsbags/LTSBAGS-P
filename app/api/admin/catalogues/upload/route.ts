import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { saveDocToFirestore } from '@/lib/firestore-sync';
import { coreImageProcessor } from '@/lib/image-processing/core-processor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fileType = formData.get('type') as string | null; // 'pdf' | 'cover' | 'auto'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalName = file.name || 'document.pdf';
    const ext = path.extname(originalName).toLowerCase();
    const isPdf = ext === '.pdf' || file.type === 'application/pdf' || fileType === 'pdf';

    // Format file size nicely
    const formatBytes = (bytesNum: number) => {
      if (bytesNum < 1024) return bytesNum + ' B';
      if (bytesNum < 1024 * 1024) return (bytesNum / 1024).toFixed(1) + ' KB';
      return (bytesNum / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formattedSize = formatBytes(buffer.length);

    if (isPdf) {
      // 1. Sanitize file name
      const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-');
      const timestamp = Date.now();
      const fileName = `${cleanBase || 'lts-catalogue'}-${timestamp}.pdf`;

      // 2. Write to public/uploads/catalogues/
      const targetDir = path.join(process.cwd(), 'public', 'uploads', 'catalogues');
      await mkdir(targetDir, { recursive: true });
      const targetPath = path.join(targetDir, fileName);
      await writeFile(targetPath, buffer);

      const fileUrl = `/uploads/catalogues/${fileName}`;

      // 3. Fallback Firestore Sync (stores base64 for persistent cloud sync)
      try {
        const base64Content = buffer.toString('base64');
        const docId = `pdf_${fileName.replace(/\.pdf$/, '')}`;
        // Store in uploaded_images collection so /uploads/catalogues/ route fallback works automatically
        await saveDocToFirestore('uploaded_images', docId, {
          fileName,
          folder: 'catalogues',
          mimeType: 'application/pdf',
          size: buffer.length,
          base64: base64Content,
          updatedAt: new Date().toISOString(),
        });
      } catch (syncErr) {
        console.warn('[PDF Upload] Firestore backup warning:', syncErr);
      }

      return NextResponse.json({
        success: true,
        type: 'pdf',
        url: fileUrl,
        fileName,
        originalFileName: originalName,
        fileSize: formattedSize,
        fileSizeBytes: buffer.length,
        mimeType: 'application/pdf',
      });
    }

    // If it is an image (e.g. Cover Thumbnail)
    const isImage = ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.svg' || file.type.startsWith('image/');
    if (isImage) {
      try {
        const processResult = await coreImageProcessor.processAndOptimize(buffer, {
          preset: 'category_banner',
          contextName: originalName.replace(/\.[^/.]+$/, ''),
          categoryName: 'Catalogue Covers',
          altText: 'LTS Bags Catalogue Cover Thumbnail',
        });

        if (processResult.success && processResult.url) {
          return NextResponse.json({
            success: true,
            type: 'image',
            url: processResult.url,
            thumbnailUrl: processResult.thumbnailUrl,
            fileName: processResult.fileName,
            originalFileName: originalName,
            fileSize: formattedSize,
            fileSizeBytes: buffer.length,
            mimeType: 'image/webp',
          });
        }
      } catch (imgErr) {
        console.warn('Image optimizer fallback to direct write:', imgErr);
      }

      // Direct image save fallback
      const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '-');
      const fileName = `cover-${cleanBase}-${Date.now()}${ext || '.jpg'}`;
      const targetDir = path.join(process.cwd(), 'public', 'uploads', 'catalogues');
      await mkdir(targetDir, { recursive: true });
      await writeFile(path.join(targetDir, fileName), buffer);

      return NextResponse.json({
        success: true,
        type: 'image',
        url: `/uploads/catalogues/${fileName}`,
        fileName,
        originalFileName: originalName,
        fileSize: formattedSize,
        fileSizeBytes: buffer.length,
        mimeType: file.type || 'image/jpeg',
      });
    }

    return NextResponse.json({ error: 'Unsupported file format. Please upload a PDF or image file.' }, { status: 400 });
  } catch (error: any) {
    console.error('[Catalogue Upload API Error]:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
