import 'client-only';

import { businessNeedsSchema } from '@/lib/business-needs-schema';
import type { BusinessNeedsInput } from '@/lib/types';

const STORAGE_KEY = 'ludavia-business-needs:v1';

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveBusinessNeeds(input: BusinessNeedsInput): boolean {
  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(input));
    return true;
  } catch {
    return false;
  }
}

export function loadBusinessNeeds(): BusinessNeedsInput | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const result = businessNeedsSchema.safeParse(parsed);
    if (!result.success) throw new Error('Invalid session data');
    return result.data as BusinessNeedsInput;
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {}
    return null;
  }
}

export function clearBusinessNeeds(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {}
}
