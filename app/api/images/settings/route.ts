import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ImageProcessingSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';

const DEFAULT_IMAGE_SETTINGS: ImageProcessingSettings = {
  autoProcessing: true,
  autoBackgroundRemoval: true,
  autoUpscaling: true,
  targetResolution: 2000,
  outputFormat: 'webp',
  quality: 'high',
  paddingPercent: 8,
  bgRemovalProvider: 'smart_ai',
  upscaleProvider: 'smart_ai',
  preserveOriginals: true,
};

export async function GET() {
  try {
    const settings = db.getSettings();
    const imageSettings = settings.imageProcessing || DEFAULT_IMAGE_SETTINGS;
    return NextResponse.json({ success: true, settings: imageSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentSettings = db.getSettings();
    const updatedImageSettings: ImageProcessingSettings = {
      ...(currentSettings.imageProcessing || DEFAULT_IMAGE_SETTINGS),
      ...body,
    };

    db.updateSettings({
      imageProcessing: updatedImageSettings,
    });

    return NextResponse.json({ success: true, settings: updatedImageSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
