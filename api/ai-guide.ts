import { generateGuideResponse } from '../server/aiGuide';

/**
 * Production serverless function (Vercel-style) for the AI Guide.
 * Reads GEMINI_API_KEY from the server environment — never exposed to the client.
 * Mirrors the Vite dev middleware in vite.config.ts.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    res.status(200).json({ text: "The AI Guide isn't configured yet." });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const text = await generateGuideResponse(apiKey, body.prompt || '', body.videos || []);
    res.status(200).json({ text });
  } catch (err) {
    console.error('AI Guide error:', err);
    res.status(500).json({ text: "I'm having trouble connecting right now. Please try again later." });
  }
}
