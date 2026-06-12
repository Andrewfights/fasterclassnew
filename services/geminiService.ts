import { Video } from "../types";

/**
 * Client-side AI Guide caller. Sends the question to our own server endpoint
 * (/api/ai-guide), which holds the Gemini key. The key is NEVER in the browser bundle.
 */
export const getAIResponse = async (userPrompt: string, availableVideos: Video[]): Promise<string> => {
  try {
    const res = await fetch('/api/ai-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: userPrompt,
        videos: availableVideos.map(v => ({ title: v.title, expert: v.expert })),
      }),
    });

    if (!res.ok) throw new Error(`AI Guide request failed: ${res.status}`);

    const data = await res.json();
    return data.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Guide error:", error);
    return "I'm having trouble connecting to the expert database right now. Please try again later.";
  }
};
