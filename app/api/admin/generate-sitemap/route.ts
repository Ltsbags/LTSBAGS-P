import { NextResponse } from 'next/server';
import { generateSitemap } from '@/scripts/generate-sitemap.mjs';

export async function POST() {
  try {
    const result = await generateSitemap();
    return NextResponse.json({
      message: 'Sitemap.xml generated and updated successfully',
      ...result,
    });
  } catch (error: any) {
    console.error('Failed to generate sitemap:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal error while generating sitemap',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await generateSitemap();
    return NextResponse.json({
      message: 'Sitemap.xml generated and updated successfully',
      ...result,
    });
  } catch (error: any) {
    console.error('Failed to generate sitemap:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal error while generating sitemap',
      },
      { status: 500 }
    );
  }
}
