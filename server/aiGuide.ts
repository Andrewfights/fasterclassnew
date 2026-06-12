import { GoogleGenAI } from '@google/genai';

/**
 * Server-only AI Guide handler. The Gemini API key is read from the server
 * environment and NEVER shipped to the browser. Used by both the Vite dev-server
 * middleware (local) and the serverless function in /api (production).
 */

const SYSTEM_INSTRUCTION = `
You are the AI Guide for "Fasterclass", a curated video platform for startup founders.
Your goal is to provide specific, actionable, and timeless advice to entrepreneurs based on the wisdom of experts like Paul Graham, Peter Thiel, and other seasoned builders.

Tone: Professional, direct, encouraging, but realistic. Avoid fluff. Focus on "Signal, not Noise".

When a user asks a question:
1. Provide a concise answer (2-3 paragraphs max).
2. If relevant, recommend they watch a video about the topic (generic recommendation if you don't have specific data, or specific if provided in context).

Do not hallucinate specific URLs unless they are popular YC or standard startup canon videos you know for sure.
`;

export interface GuideVideoRef {
  title: string;
  expert: string;
}

export async function generateGuideResponse(
  apiKey: string,
  userPrompt: string,
  videos: GuideVideoRef[] = [],
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const videoContext = videos.map(v => `- "${v.title}" by ${v.expert}`).join('\n');
  const prompt = `
    Context: The user has access to these videos in our library:
    ${videoContext}

    User Question: ${userPrompt}
    `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  });

  return response.text || "I couldn't generate a response at this time.";
}
