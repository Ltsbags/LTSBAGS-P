import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const settings = db.getSettings();
    const customCatalogueUrl = settings?.cataloguePdfUrl;

    if (customCatalogueUrl && customCatalogueUrl.startsWith('http')) {
      return NextResponse.redirect(customCatalogueUrl);
    }

    // Return HTML or downloadable document representation
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LTS BAGS PRIVATE LIMITED - Product Catalogue 2026</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
    .card { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: #0f172a; margin-bottom: 8px; font-size: 28px; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .item { border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; }
    .item h3 { margin: 0 0 4px 0; font-size: 16px; }
    .item p { margin: 0; font-size: 13px; color: #64748b; }
    .btn { display: inline-block; background: #72AFDB; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">LTS BAGS PRIVATE LIMITED</span>
    <h1>B2B Custom Bag Catalogue & Manufacturing Guide</h1>
    <p>Manufacturer of Custom Backpacks, Laptop Bags, Travel Duffels, School Bags, and Eco Totes in Mumbai, India.</p>
    
    <div class="grid">
      <div class="item"><h3>Executive Laptop Bags</h3><p>1680D Ballistic Nylon, EVA shock protection, custom logo.</p></div>
      <div class="item"><h3>Corporate Tech Backpacks</h3><p>USB charging ports, anti-theft compartments, 3D embroidery.</p></div>
      <div class="item"><h3>Duffel & Travel Bags</h3><p>Heavy-duty gym and travel holdalls with shoe compartments.</p></div>
      <div class="item"><h3>Eco Canvas & Jute Bags</h3><p>100% organic cotton and golden jute totes with screen print.</p></div>
      <div class="item"><h3>School & College Bags</h3><p>Reinforced bar-tack stitching, ergonomic air-mesh straps.</p></div>
      <div class="item"><h3>Promotional Bags</h3><p>Drawstring bags and cinch sacks for events and marathons.</p></div>
    </div>

    <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 13px;">
      <strong>Factory Contact:</strong> +91 98335 98338 | info@ltsbags.com | Mumbai, India
    </div>

    <a href="/products" class="btn">Explore All Products Online &rarr;</a>
  </div>
  <script>
    // Trigger print dialog if user wants to save as PDF
    window.onload = function() {
      // setTimeout(() => window.print(), 500);
    };
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate catalogue' }, { status: 500 });
  }
}
