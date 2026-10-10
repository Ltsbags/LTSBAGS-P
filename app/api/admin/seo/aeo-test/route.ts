import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/db';
import { AeoCitationTest, AeoCitationSource, AeoModelSummary } from '@/lib/types';
import { VERIFIED_BUSINESS_INFO } from '@/lib/business-info';

export const dynamic = 'force-dynamic';

export const BENCHMARK_AEO_PROMPTS = [
  {
    id: 'p1',
    prompt: 'Who is LTS BAGS PRIVATE LIMITED?',
    category: 'Brand Entity & Profile',
  },
  {
    id: 'p2',
    prompt: 'Which bag manufacturers are located in Dharavi, Mumbai?',
    category: 'Local Cluster & Hub',
  },
  {
    id: 'p3',
    prompt: 'Where can businesses find a bag manufacturer in India?',
    category: 'National B2B Discovery',
  },
  {
    id: 'p4',
    prompt: 'Who manufactures custom school bags and laptop bags in India?',
    category: 'Category Specific (School & Laptop)',
  },
  {
    id: 'p5',
    prompt: 'Which Indian manufacturers offer custom tote bags and backpacks?',
    category: 'Category Specific (Totes & Backpacks)',
  },
];

const SUPPORTED_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-3.8-flash',
    defaultModel: 'gemini-3.8-flash',
    supportsSearchGrounding: true,
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT / SearchGPT)',
    model: 'gpt-4o',
    defaultModel: 'gpt-4o',
    supportsSearchGrounding: true,
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    model: 'sonar-pro',
    defaultModel: 'sonar-pro',
    supportsSearchGrounding: true,
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    model: 'claude-3-5-sonnet',
    defaultModel: 'claude-3-5-sonnet',
    supportsSearchGrounding: false,
  },
];

// Helper: verify if URL is real & retrievable online
async function verifyUrlLive(url: string): Promise<{ verified: boolean; status?: number }> {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { verified: false };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LTS-AEO-Verifier/1.0',
      },
    });
    clearTimeout(timeout);
    return { verified: res.status >= 200 && res.status < 400, status: res.status };
  } catch {
    return { verified: false, status: 0 };
  }
}

// Helper: analyze response for LTS BAGS entities, citations, and mentions
function analyzeResponseForEntities(rawText: string, citations: AeoCitationSource[]) {
  const lower = rawText.toLowerCase();

  const brandAliases = [
    'lts bags',
    'lts bag',
    'ltsbags',
    'ltsbags.com',
  ];
  const legalAliases = [
    'lts bags private limited',
    'lts bags pvt ltd',
    'lts bags pvt. ltd.',
  ];

  const brandFound = brandAliases.some((alias) => lower.includes(alias));
  const legalFound = legalAliases.some((alias) => lower.includes(alias));
  const mentionFound = brandFound || legalFound;

  // Domain citation check in citations or response text
  const domainFound =
    citations.some((c) => (c.domain || '').toLowerCase().includes('ltsbags.com') || (c.url || '').toLowerCase().includes('ltsbags.com')) ||
    lower.includes('ltsbags.com') ||
    lower.includes('https://ltsbags.com');

  // Entity recognition criteria check
  let scorePoints = 0;
  if (brandFound) scorePoints += 30;
  if (legalFound) scorePoints += 25;
  if (lower.includes('dharavi') || lower.includes('mumbai')) scorePoints += 20;
  if (lower.includes('manufacturer') || lower.includes('manufacturing') || lower.includes('factory')) scorePoints += 15;
  if (domainFound) scorePoints += 10;

  // Extract evidence snippets
  const evidenceSnippets: string[] = [];
  if (mentionFound) {
    const sentences = rawText.split(/(?<=[.!?])\s+/);
    for (const sent of sentences) {
      const sLower = sent.toLowerCase();
      if (brandAliases.some((a) => sLower.includes(a)) || legalAliases.some((a) => sLower.includes(a))) {
        evidenceSnippets.push(sent.trim());
        if (evidenceSnippets.length >= 3) break;
      }
    }
  }

  return {
    detectedBrandMention: brandFound,
    detectedLegalNameMention: legalFound,
    mentionFound,
    entityRecognitionScore: Math.min(100, scorePoints),
    hasOfficialDomainCitation: domainFound,
    evidenceSnippets,
  };
}

export async function GET(req: NextRequest) {
  try {
    const tests = db.getAeoTests();
    const url = new URL(req.url);
    const providerFilter = url.searchParams.get('provider');

    const filteredTests = providerFilter && providerFilter !== 'all'
      ? tests.filter((t) => t.provider === providerFilter)
      : tests;

    // Build summaries for all supported providers
    const summaries: AeoModelSummary[] = SUPPORTED_PROVIDERS.map((prov) => {
      const provTests = tests.filter((t) => t.provider === prov.id);
      const totalPrompts = BENCHMARK_AEO_PROMPTS.length;
      const tested = provTests.filter((t) => t.status === 'tested' || t.status === 'no_citation_found');
      const failed = provTests.filter((t) => t.status === 'failed');
      const untested = totalPrompts - provTests.length;

      const mentions = tested.filter((t) => t.mentionFound).length;
      const citations = tested.filter((t) => t.citationFound).length;
      const verifiedCitations = tested.reduce((acc, t) => acc + (t.verifiedCitationCount || 0), 0);

      // Status: Check if API key exists
      let providerStatus: 'connected' | 'not_connected' | 'error' = 'not_connected';
      if (prov.id === 'gemini') {
        providerStatus = process.env.GEMINI_API_KEY ? 'connected' : 'not_connected';
      } else if (prov.id === 'openai') {
        providerStatus = process.env.OPENAI_API_KEY ? 'connected' : 'not_connected';
      } else if (prov.id === 'perplexity') {
        providerStatus = process.env.PERPLEXITY_API_KEY ? 'connected' : 'not_connected';
      } else if (prov.id === 'claude') {
        providerStatus = process.env.ANTHROPIC_API_KEY ? 'connected' : 'not_connected';
      }

      // Rates: ONLY calculate if at least 1 prompt has actually been tested!
      let mentionRate: number | null = null;
      let citationRate: number | null = null;
      let visibilityScore: number | null = null;

      if (tested.length > 0) {
        mentionRate = Math.round((mentions / tested.length) * 100);
        citationRate = Math.round((citations / tested.length) * 100);
        // Objective formula: 50% citation rate + 30% mention rate + 20% official domain link
        const officialDomainCount = tested.filter((t) => t.hasOfficialDomainCitation).length;
        const domainRate = (officialDomainCount / tested.length) * 100;
        visibilityScore = Math.round((citationRate * 0.5) + (mentionRate * 0.3) + (domainRate * 0.2));
      }

      const latestTest = [...provTests].sort((a, b) => (b.testedAt || '').localeCompare(a.testedAt || ''))[0];

      return {
        provider: prov.id,
        model: prov.model,
        providerStatus,
        totalPrompts,
        testedCount: tested.length,
        untestedCount: Math.max(0, untested),
        failedCount: failed.length,
        mentionCount: mentions,
        citationCount: citations,
        verifiedCitationCount: verifiedCitations,
        mentionRate,
        citationRate,
        visibilityScore,
        lastTestedAt: latestTest?.testedAt,
      };
    });

    return NextResponse.json({
      success: true,
      prompts: BENCHMARK_AEO_PROMPTS,
      supportedProviders: SUPPORTED_PROVIDERS,
      summaries,
      tests: filteredTests,
      verifiedEntity: VERIFIED_BUSINESS_INFO,
    });
  } catch (error: any) {
    console.error('Error fetching AEO test results:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { promptId, customPrompt, provider = 'gemini', model = 'gemini-3.8-flash' } = body;

    const matchedBenchmark = BENCHMARK_AEO_PROMPTS.find((p) => p.id === promptId);
    const finalPrompt = customPrompt || matchedBenchmark?.prompt || 'Who is LTS BAGS PRIVATE LIMITED?';
    const category = matchedBenchmark?.category || 'Custom Ad-hoc Prompt';

    const testId = `aeo-${provider}-${promptId || 'custom'}-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // 1. Verify provider connection
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const notConnectedRecord: AeoCitationTest = {
          id: testId,
          prompt: finalPrompt,
          promptCategory: category,
          provider: 'gemini',
          model,
          providerStatus: 'not_connected',
          status: 'failed',
          testedAt: timestamp,
          errorMessage: 'GEMINI_API_KEY environment variable is not configured.',
          detectedBrandMention: false,
          detectedLegalNameMention: false,
          entityRecognitionScore: 0,
          mentionFound: false,
          citations: [],
          citationFound: false,
          verifiedCitationCount: 0,
          hasOfficialDomainCitation: false,
          evidenceSnippets: [],
          targetDomain: 'ltsbags.com',
        };
        db.saveAeoTest(notConnectedRecord);
        return NextResponse.json({
          success: false,
          error: 'GEMINI_API_KEY is not connected. Real tests cannot be run.',
          test: notConnectedRecord,
        }, { status: 400 });
      }

      // Run real test against Gemini API with Google Search Grounding enabled
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: model || 'gemini-3.8-flash',
          contents: finalPrompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const rawText = response.text || '';
        
        // Extract real grounding metadata / web search citations
        const rawCitations: { title?: string; url: string; snippet?: string }[] = [];
        const candidate = response.candidates?.[0];
        const groundingMetadata = (candidate as any)?.groundingMetadata;

        if (groundingMetadata?.groundingChunks) {
          for (const chunk of groundingMetadata.groundingChunks) {
            if (chunk.web?.uri) {
              rawCitations.push({
                url: chunk.web.uri,
                title: chunk.web.title || '',
              });
            }
          }
        }

        // Also parse any markdown or raw links present in response text
        const urlRegex = /(https?:\/\/[^\s\)\],>"']+)/gi;
        const matches = rawText.match(urlRegex) || [];
        for (const m of matches) {
          const cleanUrl = m.replace(/[.,;:]+$/, '');
          if (!rawCitations.some((c) => c.url === cleanUrl)) {
            rawCitations.push({ url: cleanUrl });
          }
        }

        // Live verification of extracted citation URLs
        const verifiedCitationsList: AeoCitationSource[] = [];
        for (const item of rawCitations.slice(0, 10)) {
          let domain = '';
          try {
            domain = new URL(item.url).hostname;
          } catch {
            domain = '';
          }
          const { verified, status } = await verifyUrlLive(item.url);
          verifiedCitationsList.push({
            url: item.url,
            title: item.title || domain,
            domain,
            snippet: item.snippet,
            verifiedOnline: verified,
            httpStatus: status,
          });
        }

        const analysis = analyzeResponseForEntities(rawText, verifiedCitationsList);
        const verifiedCitationCount = verifiedCitationsList.filter((c) => c.verifiedOnline).length;
        const citationFound = verifiedCitationCount > 0;

        const testRecord: AeoCitationTest = {
          id: testId,
          prompt: finalPrompt,
          promptCategory: category,
          provider: 'gemini',
          model: model || 'gemini-3.8-flash',
          providerStatus: 'connected',
          status: citationFound ? 'tested' : (analysis.mentionFound ? 'tested' : 'no_citation_found'),
          testedAt: timestamp,
          rawResponse: rawText,
          detectedBrandMention: analysis.detectedBrandMention,
          detectedLegalNameMention: analysis.detectedLegalNameMention,
          entityRecognitionScore: analysis.entityRecognitionScore,
          mentionFound: analysis.mentionFound,
          citations: verifiedCitationsList,
          citationFound,
          verifiedCitationCount,
          hasOfficialDomainCitation: analysis.hasOfficialDomainCitation,
          evidenceSnippets: analysis.evidenceSnippets,
          targetDomain: 'ltsbags.com',
        };

        db.saveAeoTest(testRecord);

        return NextResponse.json({
          success: true,
          test: testRecord,
        });
      } catch (geminiErr: any) {
        console.error('Gemini test execution failed:', geminiErr);
        const failedRecord: AeoCitationTest = {
          id: testId,
          prompt: finalPrompt,
          promptCategory: category,
          provider: 'gemini',
          model,
          providerStatus: 'connected',
          status: 'failed',
          testedAt: timestamp,
          errorMessage: geminiErr.message || 'Gemini API call failed',
          detectedBrandMention: false,
          detectedLegalNameMention: false,
          entityRecognitionScore: 0,
          mentionFound: false,
          citations: [],
          citationFound: false,
          verifiedCitationCount: 0,
          hasOfficialDomainCitation: false,
          evidenceSnippets: [],
          targetDomain: 'ltsbags.com',
        };
        db.saveAeoTest(failedRecord);

        return NextResponse.json({
          success: false,
          error: geminiErr.message || 'Gemini test failed',
          test: failedRecord,
        }, { status: 500 });
      }
    } else {
      // Other provider without live configured API key
      const notConnectedRecord: AeoCitationTest = {
        id: testId,
        prompt: finalPrompt,
        promptCategory: category,
        provider: provider as any,
        model,
        providerStatus: 'not_connected',
        status: 'failed',
        testedAt: timestamp,
        errorMessage: `${provider.toUpperCase()} API credentials are not connected on this environment. To test this provider, connect its official API key.`,
        detectedBrandMention: false,
        detectedLegalNameMention: false,
        entityRecognitionScore: 0,
        mentionFound: false,
        citations: [],
        citationFound: false,
        verifiedCitationCount: 0,
        hasOfficialDomainCitation: false,
        evidenceSnippets: [],
        targetDomain: 'ltsbags.com',
      };
      db.saveAeoTest(notConnectedRecord);

      return NextResponse.json({
        success: false,
        error: `${provider} is not connected. No fabricated results will be shown.`,
        test: notConnectedRecord,
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Error in POST /api/admin/seo/aeo-test:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
