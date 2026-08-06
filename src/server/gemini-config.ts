import 'server-only';

export const geminiApiKey = process.env.GEMINI_API_KEY;
export const geminiModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash';
