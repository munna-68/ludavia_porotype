import { labelForField } from '@/data/form-options';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';

export function createFallbackSummary(values: BusinessNeedsInput): GrowthSummaryResult {
  const businessName = values.businessName.trim() || 'Your business';
  const industry = labelForField('industry', values.industry);
  const goal = labelForField('mainGoal', values.mainGoal).toLowerCase();
  const stage = labelForField('stage', values.stage).toLowerCase();
  const support = labelForField('helpNeeded', values.helpNeeded).toLowerCase();

  return {
    summary: `${businessName} has a clear near-term opportunity to make progress on ${goal} within the ${industry} sector. At the ${stage} stage, the strongest next move is a small, visible experiment that turns ${support} into evidence: one audience, one offer, and one result to learn from. That focus keeps the next decision practical while creating a stronger foundation for the growth you want to build.`,
    recommendedNextStep: {
      title: 'Define one focused growth experiment',
      detail: `Write down one audience, one offer, and one success signal for ${businessName}. Use the result to decide what to repeat, refine, or stop before adding more complexity.`,
    },
    source: 'fallback',
  };
}
