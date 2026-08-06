import 'client-only';

import type { GrowthSummaryResult } from '@/lib/types';

const STORAGE_PREFIX = 'ludavia-growth-summary:v1';
const SUCCESS_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const UNAVAILABLE_CACHE_TTL_MS = 10 * 60 * 1_000;

type CachedSummary = {
  profileKey: string;
  status: 'success' | 'unavailable';
  result?: GrowthSummaryResult;
  cachedAt: number;
};

const memoryCache = new Map<string, CachedSummary>();
const pendingRequests = new Map<string, Promise<GrowthSummaryResult | null>>();

export function requestCachedSummary(
  profileKey: string,
  loader: () => Promise<GrowthSummaryResult | null>,
): Promise<GrowthSummaryResult | null> {
  const cached = readCachedSummary(profileKey);
  if (cached) return Promise.resolve(cached.status === 'success' ? cached.result ?? null : null);

  const pending = pendingRequests.get(profileKey);
  if (pending) return pending;

  const request = loader()
    .then((result) => {
      writeCachedSummary(profileKey, result ? { status: 'success', result } : { status: 'unavailable' });
      return result;
    })
    .catch(() => {
      writeCachedSummary(profileKey, { status: 'unavailable' });
      return null;
    })
    .finally(() => {
      pendingRequests.delete(profileKey);
    });

  pendingRequests.set(profileKey, request);
  return request;
}

function readCachedSummary(profileKey: string): CachedSummary | null {
  const memoryEntry = memoryCache.get(profileKey);
  if (memoryEntry && isFresh(memoryEntry)) return memoryEntry;
  if (memoryEntry) memoryCache.delete(profileKey);

  try {
    const raw = window.sessionStorage.getItem(storageKey(profileKey));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CachedSummary>;
    if (parsed.profileKey !== profileKey || (parsed.status !== 'success' && parsed.status !== 'unavailable') || typeof parsed.cachedAt !== 'number') {
      window.sessionStorage.removeItem(storageKey(profileKey));
      return null;
    }

    const entry = parsed as CachedSummary;
    if (!isFresh(entry)) {
      window.sessionStorage.removeItem(storageKey(profileKey));
      return null;
    }

    memoryCache.set(profileKey, entry);
    return entry;
  } catch {
    return null;
  }
}

function writeCachedSummary(profileKey: string, value: Omit<CachedSummary, 'profileKey' | 'cachedAt'>) {
  const entry: CachedSummary = {
    ...value,
    profileKey,
    cachedAt: Date.now(),
  };

  memoryCache.set(profileKey, entry);
  try {
    window.sessionStorage.setItem(storageKey(profileKey), JSON.stringify(entry));
  } catch {
  }
}

function isFresh(entry: CachedSummary) {
  const maxAge = entry.status === 'success' ? SUCCESS_CACHE_TTL_MS : UNAVAILABLE_CACHE_TTL_MS;
  return Date.now() - entry.cachedAt < maxAge;
}

function storageKey(profileKey: string) {
  let hash = 0;
  for (let index = 0; index < profileKey.length; index += 1) {
    hash = (hash * 31 + profileKey.charCodeAt(index)) | 0;
  }

  return `${STORAGE_PREFIX}:${Math.abs(hash).toString(36)}`;
}
