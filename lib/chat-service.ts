import { GoogleGenAI } from '@google/genai';

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AIProvider {
  name: string;
  generateResponse(params: {
    prompt: string;
    systemInstruction: string;
    history?: ChatHistoryMessage[];
  }): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  name = 'Google Gemini API';

  private getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  async generateResponse(params: {
    prompt: string;
    systemInstruction: string;
    history?: ChatHistoryMessage[];
  }): Promise<string> {
    const ai = this.getClient();

    // Format previous multi-turn conversation contents for SDK
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (params.history && params.history.length > 0) {
      for (const h of params.history.slice(-8)) {
        if (!h.content) continue;
        formattedContents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        });
      }
    }

    // Ensure prompt is added if not in history
    if (!formattedContents.length || formattedContents[formattedContents.length - 1].parts[0].text !== params.prompt) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: params.prompt }],
      });
    }

    // Model fallback sequence in case of 503 (high demand) or transient failures
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: formattedContents,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${model} attempt failed:`, err?.message || err);
        // If it's a 503 or transient error, proceed to try next candidate model
        continue;
      }
    }

    // If all models encountered temporary high demand (503), return an informative factory response
    console.error('All Gemini model candidates failed. Returning factory fallback response:', lastError);
    return "Thank you for reaching out to LTS BAGS PRIVATE LIMITED. We are Mumbai's premier custom B2B bag manufacturer specializing in corporate backpacks, laptop bags, duffels, and tote bags. For instant bulk pricing, customized samples, or immediate assistance, please click 'Request Quote' above or contact our sales team directly at +91 98335 98338 (WhatsApp available).";
  }
}

// Modular AI Provider Factory
export function getAIProvider(): AIProvider {
  // Can easily be swapped to other providers in future without changing API route logic
  return new GeminiProvider();
}
