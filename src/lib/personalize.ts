import { labelForField } from '@/data/form-options';
import type { BusinessNeedsInput } from '@/lib/types';

const PLACEHOLDER_FALLBACKS: Record<string, string> = {
  businessName: 'your business',
  businessType: 'your business',
  industry: 'your sector',
  location: 'your market',
  stage: 'current',
  mainGoal: 'your main goal',
  helpNeeded: 'the right support',
};

const FIELD_ALIASES: Record<string, keyof BusinessNeedsInput> = {
  goal: 'mainGoal',
  sector: 'industry',
};

export function personalize(template: string, input: Partial<BusinessNeedsInput>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, field: string) => {
    const key = FIELD_ALIASES[field] ?? field;
    const value = input[key as keyof BusinessNeedsInput];
    if (typeof value === 'string' && value.trim()) {
      return labelForField(key, value);
    }
    return PLACEHOLDER_FALLBACKS[field] ?? '';
  });
}
