import { NextRequest, NextResponse } from 'next/server';
import { getEntityTranslations, getEntityTranslation, saveEntityTranslation } from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType') || undefined;
    const entityId = searchParams.get('entityId') || undefined;
    const langCode = searchParams.get('langCode') || undefined;

    const list = getEntityTranslations(entityType, entityId, langCode);
    return NextResponse.json({ success: true, translations: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch entity translations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, entityType, entityId, langCode, translation, sourceEntity, targetLang } = body;

    if (action === 'save') {
      if (!entityType || !entityId || !langCode) {
        return NextResponse.json({ success: false, error: 'entityType, entityId, and langCode are required' }, { status: 400 });
      }
      const saved = saveEntityTranslation({
        entityType,
        entityId,
        langCode,
        ...translation,
      });
      return NextResponse.json({ success: true, translation: saved });
    }

    if (action === 'auto_translate_entity') {
      if (!sourceEntity || !targetLang || !entityType || !entityId) {
        return NextResponse.json({ success: false, error: 'sourceEntity, targetLang, entityType, entityId are required' }, { status: 400 });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a B2B bag manufacturing translation system. Translate the given object fields into target language code "${targetLang}". Return ONLY a valid JSON object matching the input keys without markdown backticks or commentary.\n\nInput Object to translate:\n${JSON.stringify(sourceEntity, null, 2)}`;

      let rawText = '{}';
      const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-pro'];

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
          });

          if (response.text?.trim()) {
            rawText = response.text.trim();
            break;
          }
        } catch {
          continue;
        }
      }

      if (rawText.startsWith('```json')) {
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      let translatedObj: any = {};
      try {
        translatedObj = JSON.parse(rawText);
      } catch {
        translatedObj = {};
      }

      const saved = saveEntityTranslation({
        entityType,
        entityId,
        langCode: targetLang,
        name: translatedObj.name || translatedObj.title || sourceEntity.name || sourceEntity.title,
        title: translatedObj.title || translatedObj.name || sourceEntity.title || sourceEntity.name,
        shortDesc: translatedObj.shortDesc || translatedObj.description || sourceEntity.shortDesc || sourceEntity.description,
        fullDesc: translatedObj.fullDesc || translatedObj.content || sourceEntity.fullDesc || sourceEntity.content,
        excerpt: translatedObj.excerpt || sourceEntity.excerpt,
        content: translatedObj.content || sourceEntity.content,
        materials: translatedObj.materials || sourceEntity.materials,
        metaTitle: translatedObj.metaTitle || sourceEntity.metaTitle,
        metaDescription: translatedObj.metaDescription || sourceEntity.metaDescription,
        metaKeywords: translatedObj.metaKeywords || sourceEntity.metaKeywords,
        specifications: translatedObj.specifications || sourceEntity.specifications,
        features: translatedObj.features || sourceEntity.features,
      });

      return NextResponse.json({ success: true, translation: saved });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Entity translation operation failed' }, { status: 500 });
  }
}
