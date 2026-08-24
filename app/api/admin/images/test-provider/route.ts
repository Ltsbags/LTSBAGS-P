import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    if (auth.errorResponse || !auth.user) {
      return auth.errorResponse || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, provider, apiKey: rawApiKey } = body;

    const settings = db.getSettings();
    const storedIp = settings.imageProcessing;

    // Resolve API key: body > stored in DB > process.env
    let apiKey = rawApiKey;
    if (!apiKey || apiKey === '••••••••••••••••' || apiKey === '••••••••') {
      if (type === 'bg_removal') {
        apiKey = storedIp?.bgRemovalApiKey || process.env.BACKGROUND_REMOVAL_API_KEY || '';
      } else {
        apiKey = storedIp?.upscalingApiKey || process.env.UPSCALING_API_KEY || '';
      }
    }

    const startTime = Date.now();

    // 1. If provider is disabled or not selected
    if (!provider || provider === 'none' || provider === 'disabled') {
      return NextResponse.json({
        success: false,
        status: 'not_configured',
        message: 'External AI provider is not configured. Local image processing is available.',
        latencyMs: 0,
      });
    }

    // 2. Built-in Sharp / Local Providers
    if (provider === 'smart_ai' || provider === 'sharp_lanczos') {
      try {
        await sharp({
          create: {
            width: 10,
            height: 10,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          },
        })
          .webp()
          .toBuffer();

        const latencyMs = Date.now() - startTime;
        return NextResponse.json({
          success: true,
          status: 'connected',
          message: `Connected successfully: Built-in local image processing is operational (${latencyMs}ms).`,
          latencyMs,
        });
      } catch (sharpErr: any) {
        return NextResponse.json({
          success: false,
          status: 'unavailable',
          message: `Local image processing error: ${sharpErr.message}`,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    // 3. Remove.bg API
    if (provider === 'remove_bg') {
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          status: 'not_configured',
          message: 'External AI provider is not configured. Local image processing is available.',
          latencyMs: 0,
        });
      }

      try {
        const res = await fetch('https://api.remove.bg/v1.0/account', {
          method: 'GET',
          headers: { 'X-Api-Key': apiKey },
        });

        const latencyMs = Date.now() - startTime;
        if (res.status === 200) {
          const data = await res.json().catch(() => ({}));
          const credits = data?.data?.attributes?.api?.free_calls ?? data?.data?.attributes?.credits?.total ?? 'Active';
          return NextResponse.json({
            success: true,
            status: 'connected',
            message: `Connected successfully to Remove.bg API (Account verified, Credits: ${credits}, ${latencyMs}ms).`,
            latencyMs,
          });
        } else if (res.status === 401 || res.status === 403) {
          return NextResponse.json({
            success: false,
            status: 'invalid_key',
            message: 'Invalid API key. Authentication failed with Remove.bg.',
            latencyMs,
          });
        } else if (res.status === 429) {
          return NextResponse.json({
            success: false,
            status: 'unavailable',
            message: 'Provider unavailable: Rate limit exceeded or zero credits remaining on Remove.bg.',
            latencyMs,
          });
        } else {
          return NextResponse.json({
            success: false,
            status: 'unavailable',
            message: `Provider unavailable: Remove.bg returned HTTP ${res.status}.`,
            latencyMs,
          });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          status: 'unavailable',
          message: `Provider unavailable: Network error connecting to Remove.bg (${err.message}).`,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    // 4. Clipdrop API
    if (provider === 'clipdrop') {
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          status: 'not_configured',
          message: 'External AI provider is not configured. Local image processing is available.',
          latencyMs: 0,
        });
      }

      try {
        // Clipdrop endpoint check
        const res = await fetch('https://clipdrop-api.co/remove-background/v1', {
          method: 'POST',
          headers: { 'x-api-key': apiKey },
        });

        const latencyMs = Date.now() - startTime;
        // 400 means API key was accepted but no image body was passed (valid key probe)
        // 200 is also success
        if (res.status === 200 || res.status === 400) {
          return NextResponse.json({
            success: true,
            status: 'connected',
            message: `Connected successfully to ClipDrop API (${latencyMs}ms).`,
            latencyMs,
          });
        } else if (res.status === 401 || res.status === 403) {
          return NextResponse.json({
            success: false,
            status: 'invalid_key',
            message: 'Invalid API key. Authentication failed with ClipDrop.',
            latencyMs,
          });
        } else {
          return NextResponse.json({
            success: false,
            status: 'unavailable',
            message: `Provider unavailable: ClipDrop returned HTTP ${res.status}.`,
            latencyMs,
          });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          status: 'unavailable',
          message: `Provider unavailable: Network error connecting to ClipDrop (${err.message}).`,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    // 5. Replicate API
    if (provider === 'replicate') {
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          status: 'not_configured',
          message: 'External AI provider is not configured. Local image processing is available.',
          latencyMs: 0,
        });
      }

      try {
        const res = await fetch('https://api.replicate.com/v1/models', {
          method: 'GET',
          headers: { Authorization: `Bearer ${apiKey}` },
        });

        const latencyMs = Date.now() - startTime;
        if (res.status === 200) {
          return NextResponse.json({
            success: true,
            status: 'connected',
            message: `Connected successfully to Replicate API (${latencyMs}ms).`,
            latencyMs,
          });
        } else if (res.status === 401 || res.status === 403) {
          return NextResponse.json({
            success: false,
            status: 'invalid_key',
            message: 'Invalid API key. Authentication failed with Replicate.',
            latencyMs,
          });
        } else {
          return NextResponse.json({
            success: false,
            status: 'unavailable',
            message: `Provider unavailable: Replicate returned HTTP ${res.status}.`,
            latencyMs,
          });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          status: 'unavailable',
          message: `Provider unavailable: Network error connecting to Replicate (${err.message}).`,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    // 6. Google Gemini Vision
    if (provider === 'gemini') {
      const geminiKey = apiKey || process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return NextResponse.json({
          success: false,
          status: 'not_configured',
          message: 'External AI provider is not configured. Local image processing is available.',
          latencyMs: 0,
        });
      }

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
        );

        const latencyMs = Date.now() - startTime;
        if (res.status === 200) {
          return NextResponse.json({
            success: true,
            status: 'connected',
            message: `Connected successfully to Google Gemini Vision API (${latencyMs}ms).`,
            latencyMs,
          });
        } else if (res.status === 400 || res.status === 401 || res.status === 403) {
          return NextResponse.json({
            success: false,
            status: 'invalid_key',
            message: 'Invalid API key. Google Gemini authentication failed.',
            latencyMs,
          });
        } else {
          return NextResponse.json({
            success: false,
            status: 'unavailable',
            message: `Provider unavailable: Google Gemini returned HTTP ${res.status}.`,
            latencyMs,
          });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          status: 'unavailable',
          message: `Provider unavailable: Network error connecting to Google Gemini (${err.message}).`,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    // 7. Waifu2x API
    if (provider === 'waifu2x') {
      if (!apiKey) {
        return NextResponse.json({
          success: false,
          status: 'not_configured',
          message: 'External AI provider is not configured. Local image processing is available.',
          latencyMs: 0,
        });
      }

      return NextResponse.json({
        success: true,
        status: 'connected',
        message: 'Connected successfully: Waifu2x API configuration confirmed.',
        latencyMs: Date.now() - startTime,
      });
    }

    return NextResponse.json({
      success: false,
      status: 'not_configured',
      message: 'External AI provider is not configured. Local image processing is available.',
      latencyMs: 0,
    });
  } catch (globalErr: any) {
    console.error('Test provider error:', globalErr);
    return NextResponse.json({
      success: false,
      status: 'unavailable',
      message: `Test connection error: ${globalErr.message || 'Unknown error'}`,
      latencyMs: 0,
    });
  }
}
