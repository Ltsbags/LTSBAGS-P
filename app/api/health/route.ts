import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const memoryUsage = process.memoryUsage();
    
    // Environment check without exposing actual secret values
    const envCheck = {
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      siteUrl: process.env.SITE_URL || 'https://ltsbags.com',
      nodeEnv: process.env.NODE_ENV || 'production',
    };

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        service: 'LTS BAGS B2B Portal',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        diagnostics: {
          memory: {
            heapUsedMB: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
            heapTotalMB: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
            rssMB: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
          },
          envStatus: envCheck,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown server error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
