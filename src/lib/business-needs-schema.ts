import { z } from 'zod';
import type { BusinessNeedsInput } from '@/lib/types';

const trimmedText = (max: number) => z.string().trim().min(1).max(max);

export const businessNeedsSchema = z.object({
  businessName: trimmedText(120),
  businessType: trimmedText(60),
  industry: trimmedText(80),
  location: trimmedText(120),
  stage: z.enum(['idea', 'early', 'growing', 'established']),
  mainGoal: trimmedText(80),
  helpNeeded: trimmedText(80),
  description: z.string().trim().max(500).optional().or(z.literal('')),
});

export type BusinessNeedsErrors = Partial<Record<keyof BusinessNeedsInput, string>>;

export function normalizeBusinessNeeds(input: unknown) {
  const result = businessNeedsSchema.safeParse(input);

  if (result.success) {
    return { success: true as const, data: result.data as BusinessNeedsInput, errors: {} };
  }

  const errors: BusinessNeedsErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof BusinessNeedsInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { success: false as const, data: null, errors };
}
