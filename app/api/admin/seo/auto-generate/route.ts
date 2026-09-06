import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface AutoSeoRequest {
  type: 'category' | 'product' | 'image';
  name: string;
  parentName?: string;
  description?: string;
  useAi?: boolean;
}

function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const body: AutoSeoRequest = await req.json();
    const { type = 'category', name = '', parentName = '', description = '', useAi = false } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required to generate SEO' }, { status: 400 });
    }

    const cleanName = name.trim();
    const slug = cleanSlug(cleanName);

    // Rule-based high-CTR B2B generator
    let metaTitle = '';
    let metaDescription = '';
    let metaKeywords = '';
    let imageAlt = '';

    if (type === 'category') {
      // 1. Meta Title (Optimal 45-60 chars for Google SERP)
      if (parentName && parentName.trim()) {
        metaTitle = `${cleanName} Manufacturer in India | LTS Bags`;
        if (metaTitle.length > 60) {
          metaTitle = `${cleanName} | LTS Bags Mumbai`;
        }
      } else {
        metaTitle = `${cleanName} Manufacturer & Wholesale | LTS Bags`;
        if (metaTitle.length > 60) {
          metaTitle = `${cleanName} Manufacturer in India | LTS Bags`;
        }
      }

      // 2. Meta Description (Optimal 140-155 chars for Google SERP)
      if (description && description.trim().length > 30) {
        const trimmed = description.trim();
        if (trimmed.length <= 145) {
          metaDescription = trimmed.endsWith('.')
            ? `${trimmed} Bulk wholesale manufacturing by LTS Bags Mumbai.`
            : `${trimmed}. Bulk wholesale manufacturing by LTS Bags Mumbai.`;
        } else {
          metaDescription = trimmed.slice(0, 147) + '...';
        }
      } else {
        metaDescription = `Wholesale manufacturer of custom ${cleanName.toLowerCase()} in India. Direct factory bulk pricing, OEM branding, certified fabrics & fast sampling by LTS Bags.`;
      }
      if (metaDescription.length > 160) {
        metaDescription = metaDescription.slice(0, 157) + '...';
      }

      // 3. Meta Keywords
      const keywords = [
        cleanName.toLowerCase(),
        `${cleanName.toLowerCase()} manufacturer`,
        `custom ${cleanName.toLowerCase()}`,
        `wholesale ${cleanName.toLowerCase()} india`,
        `bulk ${cleanName.toLowerCase()} supplier`,
        `${cleanName.toLowerCase()} factory mumbai`,
        parentName ? `${parentName.toLowerCase()} wholesale` : '',
        'oem bag manufacturer india',
        'lts bags private limited',
      ].filter(Boolean);
      metaKeywords = Array.from(new Set(keywords)).join(', ');

      // 4. Image Alt
      imageAlt = `Custom ${cleanName} manufactured in bulk by LTS Bags Mumbai India`;
    } else {
      // Product SEO
      metaTitle = `${cleanName} | Custom Bag Manufacturer | LTS Bags`;
      if (metaTitle.length > 60) {
        metaTitle = `${cleanName} | LTS Bags India`;
      }

      metaDescription = description && description.length > 25
        ? (description.length > 150 ? description.slice(0, 147) + '...' : `${description} Direct factory wholesale pricing by LTS Bags.`)
        : `Wholesale custom ${cleanName} manufactured by LTS Bags. High grade durable fabrics, custom logo printing, rapid sampling & direct factory dispatch.`;

      const keywords = [
        cleanName.toLowerCase(),
        `${cleanName.toLowerCase()} bulk`,
        `${cleanName.toLowerCase()} manufacturer`,
        'custom bags wholesale',
        'oem corporate bags mumbai',
        'lts bags b2b',
      ];
      metaKeywords = keywords.join(', ');
      imageAlt = `${cleanName} customized with brand logo by LTS Bags Mumbai`;
    }

    // Optional AI enhancement using Gemini if requested and key is present
    let aiEnhanced = false;
    if (useAi && process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are a Senior Technical SEO Specialist for "LTS Bags", a leading B2B custom bag manufacturing factory in Mumbai, India.
Generate high-CTR, Google SERP optimized SEO metadata for this ${type}:
Name: "${cleanName}"
Parent Hierarchy: "${parentName || 'None'}"
Description: "${description || 'None'}"

Return ONLY a valid JSON object matching this exact schema:
{
  "metaTitle": "Title between 50-60 characters with high B2B commercial intent",
  "metaDescription": "Description strictly between 140-155 characters highlighting factory pricing, custom branding, and fast turnaround",
  "metaKeywords": "8-10 comma-separated targeted keywords for wholesale buyers",
  "imageAlt": "Google Images descriptive alt text including location and brand name (under 90 chars)"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.metaTitle) metaTitle = parsed.metaTitle;
          if (parsed.metaDescription) metaDescription = parsed.metaDescription;
          if (parsed.metaKeywords) metaKeywords = parsed.metaKeywords;
          if (parsed.imageAlt) imageAlt = parsed.imageAlt;
          aiEnhanced = true;
        }
      } catch (aiErr) {
        console.warn('Gemini SEO generation fallback to rule-based:', aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      imageAlt,
      aiEnhanced,
    });
  } catch (err: any) {
    console.error('Auto SEO error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate Auto SEO' }, { status: 500 });
  }
}
