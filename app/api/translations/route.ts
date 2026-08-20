import { NextRequest, NextResponse } from 'next/server';
import { getLanguageSettings, saveUiTranslation, saveBatchUiTranslations } from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'en';
    const settings = getLanguageSettings();
    const uiTrans = settings.uiTranslations?.[lang.toLowerCase()] || {};
    return NextResponse.json({ success: true, lang, translations: uiTrans });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch translations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, langCode, key, value, translations, text, targetLang } = body;

    if (action === 'save_single') {
      if (!langCode || !key) {
        return NextResponse.json({ success: false, error: 'Missing langCode or key' }, { status: 400 });
      }
      saveUiTranslation(langCode, key, value || '');
      return NextResponse.json({ success: true });
    }

    if (action === 'save_batch') {
      if (!langCode || !translations) {
        return NextResponse.json({ success: false, error: 'Missing langCode or translations map' }, { status: 400 });
      }
      saveBatchUiTranslations(langCode, translations);
      return NextResponse.json({ success: true });
    }

    if (action === 'auto_translate') {
      if (!text || !targetLang) {
        return NextResponse.json({ success: false, error: 'Text and targetLang are required' }, { status: 400 });
      }

      if (targetLang.toLowerCase() === 'en') {
        return NextResponse.json({ success: true, translatedText: text });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured for auto-translation' }, { status: 500 });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a professional B2B corporate bag manufacturing translator. Translate the following text into target language code "${targetLang}". Return ONLY the translated string without quotes or conversational text.\n\nText to translate:\n${text}`;

      let translatedText = text;
      const models = ['gemini-2.5-flash', 'gemini-2.5-pro'];

      for (const model of models) {
        try {
          const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
          });
          if (response.text?.trim()) {
            translatedText = response.text.trim();
            break;
          }
        } catch {
          continue;
        }
      }

      return NextResponse.json({ success: true, translatedText });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Translation operation failed' }, { status: 500 });
  }
}
