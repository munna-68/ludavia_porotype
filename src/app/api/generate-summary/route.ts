import { NextResponse } from 'next/server';
import { businessNeedsSchema } from '@/lib/business-needs-schema';
import { generateGrowthSummary } from '@/server/gemini';
import { geminiApiKey, geminiModel } from '@/server/gemini-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = { 'Cache-Control': 'no-store' };

function jsonResponse(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

function getFieldErrors(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  const fields: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path.map(String).join('.') || 'profile';
    if (!fields[field]) fields[field] = issue.message;
  }

  return fields;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.', fields: { body: 'Invalid JSON' } }, 400);
  }

  const input = businessNeedsSchema.safeParse(body);
  if (!input.success) {
    return jsonResponse(
      { error: 'Please check the business details and try again.', fields: getFieldErrors(input.error) },
      400,
    );
  }

  if (!geminiApiKey) {
    return jsonResponse({ error: 'Live insight is not configured.' }, 503);
  }

  try {
    const result = await generateGrowthSummary(input.data);
    return jsonResponse({ ...result, source: 'gemini' }, 200);
  } catch (error) {
    console.error('[generate-summary] Gemini provider failure', {
      error: error instanceof Error ? error.message : 'Unknown provider error',
      model: geminiModel,
    });
    return jsonResponse({ error: 'Live insight is temporarily unavailable.' }, 502);
  }
}
