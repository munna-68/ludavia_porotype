import type { BusinessStage } from '@/lib/types';

export const businessTypeOptions = [
  { value: 'product-saas', label: 'Product / SaaS' },
  { value: 'service-agency', label: 'Service / agency' },
  { value: 'retail-ecommerce', label: 'Retail / e-commerce' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'other', label: 'Other' },
] as const;

export const industryOptions = [
  { value: 'health', label: 'Health' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'education', label: 'Education' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'b2b-services', label: 'B2B services' },
  { value: 'other', label: 'Other' },
] as const;

export const stageOptions: ReadonlyArray<{ value: BusinessStage; label: string }> = [
  { value: 'idea', label: 'Idea' },
  { value: 'early', label: 'Early' },
  { value: 'growing', label: 'Growing' },
  { value: 'established', label: 'Established' },
];

export const mainGoalOptions = [
  { value: 'find-customers', label: 'Find customers' },
  { value: 'raise-capital', label: 'Raise capital' },
  { value: 'hire-talent', label: 'Hire talent' },
  { value: 'find-partners', label: 'Find partners' },
  { value: 'expand-market', label: 'Expand market' },
] as const;

export const helpNeededOptions = [
  { value: 'introductions', label: 'Introductions' },
  { value: 'go-to-market', label: 'Go-to-market' },
  { value: 'product-feedback', label: 'Product feedback' },
  { value: 'strategic-advice', label: 'Strategic advice' },
] as const;
