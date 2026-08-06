import { NextResponse } from 'next/server';
import { businessNeedsSchema } from '@/lib/business-needs-schema';
import { generateGrowthSummary } from '@/server/gemini';
import { geminiApiKey, geminiModel } from '@/server/gemini-config';
import type { GeminiPayload } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = { 'Cache-Control': 'no-store' };
const SUMMARY_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const summaryCache = new Map<string, { result: GeminiPayload; cachedAt: number }>();
const pendingSummaryRequests = new Map<string, Promise<GeminiPayload>>();

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

  const profileKey = JSON.stringify(input.data);
  const cached = summaryCache.get(profileKey);
  if (cached && Date.now() - cached.cachedAt < SUMMARY_CACHE_TTL_MS) {
    return jsonResponse({ ...cached.result, source: 'gemini' }, 200);
  }

  if (cached) summaryCache.delete(profileKey);

  const pending = pendingSummaryRequests.get(profileKey);
  if (pending) {
    try {
      const result = await pending;
      return jsonResponse({ ...result, source: 'gemini' }, 200);
    } catch {
      return jsonResponse({ error: 'Live insight is temporarily unavailable.' }, 502);
    }
  }

  const generation = generateGrowthSummary(input.data);
  pendingSummaryRequests.set(profileKey, generation);

  try {
    const result = await generation;
    summaryCache.set(profileKey, { result, cachedAt: Date.now() });
    return jsonResponse({ ...result, source: 'gemini' }, 200);
  } catch (error) {
    console.error('[generate-summary] Gemini provider failure', {
      error: error instanceof Error ? error.message : 'Unknown provider error',
      model: geminiModel,
    });
    return jsonResponse({ error: 'Live insight is temporarily unavailable.' }, 502);
  } finally {
    if (pendingSummaryRequests.get(profileKey) === generation) {
      pendingSummaryRequests.delete(profileKey);
    }
  }
}
