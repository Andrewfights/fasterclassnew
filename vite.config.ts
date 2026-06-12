import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { generateGuideResponse } from './server/aiGuide';

const readJsonBody = (req: IncomingMessage): Promise<any> =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });

// Dev-server middleware that serves /api/ai-guide using the server-side key.
// The key is read here in Node and never exposed to the client bundle.
const aiGuidePlugin = (apiKey: string): Plugin => ({
  name: 'ai-guide-api',
  configureServer(server) {
    server.middlewares.use('/api/ai-guide', async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
      }
      try {
        if (!apiKey) {
          res.end(JSON.stringify({ text: "The AI Guide isn't configured yet. Add a GEMINI_API_KEY to .env.local to enable it." }));
          return;
        }
        const body = await readJsonBody(req);
        const text = await generateGuideResponse(apiKey, body.prompt || '', body.videos || []);
        res.end(JSON.stringify({ text }));
      } catch (err) {
        console.error('AI Guide error:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ text: "I'm having trouble connecting right now. Please try again later." }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // NOTE: the Gemini key is intentionally NOT exposed via `define` — it must never
  // be compiled into the client bundle. It is used only server-side (above / in /api).
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), aiGuidePlugin(env.GEMINI_API_KEY || '')],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
