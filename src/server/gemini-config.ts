import 'server-only';

export const geminiApiKey = process.env.GEMINI_API_KEY;
export const geminiModel = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
