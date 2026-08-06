import type { BusinessNeedsInput, BusinessStage } from '@/lib/types';

export type FormOption = {
  value: string;
  label: string;
  description?: string;
  isFull?: boolean;
};

export const businessTypeOptions: ReadonlyArray<FormOption> = [
  {
    value: 'product-saas',
    label: 'Product / SaaS',
    description: 'Software you sell as a product or service.',
  },
  {
    value: 'service-agency',
    label: 'Service / agency',
    description: 'Work you deliver for clients.',
  },
  {
    value: 'retail-ecommerce',
    label: 'Retail / e-commerce',
    description: 'Selling goods to customers.',
  },
  {
    value: 'marketplace',
    label: 'Marketplace',
    description: 'Connecting buyers and sellers.',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Something a little different.',
    isFull: true,
  },
];

export const industryOptions: ReadonlyArray<FormOption> = [
  { value: 'health', label: 'Health', description: 'Care, wellness, and life sciences.' },
  { value: 'fintech', label: 'Fintech', description: 'Money, banking, and financial tools.' },
  { value: 'education', label: 'Education', description: 'Learning, training, and schools.' },
  { value: 'consumer', label: 'Consumer', description: 'Products for everyday customers.' },
  { value: 'b2b-services', label: 'B2B services', description: 'Services built for other businesses.' },
  { value: 'other', label: 'Other', description: 'Something outside these categories.' },
];

export const stageOptions: ReadonlyArray<{ value: BusinessStage; label: string; description?: string }> = [
  { value: 'idea', label: 'Idea', description: 'Validating the concept.' },
  { value: 'early', label: 'Early', description: 'First customers, early revenue.' },
  { value: 'growing', label: 'Growing', description: 'Scaling repeatable growth.' },
  { value: 'established', label: 'Established', description: 'Mature and refining.' },
];

export const mainGoalOptions: ReadonlyArray<FormOption> = [
  {
    value: 'find-customers',
    label: 'Find customers',
    description: 'Reach and win more buyers.',
  },
  {
    value: 'raise-capital',
    label: 'Raise capital',
    description: 'Fund the next phase.',
  },
  {
    value: 'hire-talent',
    label: 'Hire talent',
    description: 'Build the team out.',
  },
  {
    value: 'find-partners',
    label: 'Find partners',
    description: 'Meet the right partners.',
  },
  {
    value: 'expand-market',
    label: 'Expand market',
    description: 'Enter a new market.',
    isFull: true,
  },
];

export const helpNeededOptions: ReadonlyArray<FormOption> = [
  {
    value: 'introductions',
    label: 'Introductions',
    description: 'Warm intros to the right people.',
  },
  {
    value: 'go-to-market',
    label: 'Go-to-market',
    description: 'Reach and convert customers.',
  },
  {
    value: 'product-feedback',
    label: 'Product feedback',
    description: 'Sharpen the product.',
  },
  {
    value: 'strategic-advice',
    label: 'Strategic advice',
    description: 'Guidance on the big calls.',
  },
];

function sharedOptionValue(options: ReadonlyArray<FormOption>, value: string): string {
  return options.find((option) => option.value === value)?.value ?? '';
}

export const presenterSampleBusiness = {
  businessName: 'Morrow Care',
  businessType: sharedOptionValue(businessTypeOptions, 'product-saas'),
  industry: sharedOptionValue(industryOptions, 'health'),
  location: 'Austin, Texas',
  stage: stageOptions.find((option) => option.value === 'early')?.value ?? 'early',
  mainGoal: sharedOptionValue(mainGoalOptions, 'find-customers'),
  helpNeeded: sharedOptionValue(helpNeededOptions, 'go-to-market'),
  description: 'A care navigation platform helping independent clinics guide new parents through postpartum support.',
} satisfies BusinessNeedsInput;

const businessTypeLabels: Record<string, string> = Object.fromEntries(
  businessTypeOptions.map((o) => [o.value, o.label]),
);
const industryLabels: Record<string, string> = Object.fromEntries(
  industryOptions.map((o) => [o.value, o.label]),
);
const stageLabels: Record<string, string> = Object.fromEntries(
  stageOptions.map((o) => [o.value, o.label]),
);
const mainGoalLabels: Record<string, string> = Object.fromEntries(
  mainGoalOptions.map((o) => [o.value, o.label]),
);
const helpNeededLabels: Record<string, string> = Object.fromEntries(
  helpNeededOptions.map((o) => [o.value, o.label]),
);

export function labelForField(field: string, value: string | undefined): string {
  if (!value) return '';
  switch (field) {
    case 'businessType':
      return businessTypeLabels[value] ?? value;
    case 'industry':
      return industryLabels[value] ?? value;
    case 'stage':
      return stageLabels[value] ?? value;
    case 'mainGoal':
      return mainGoalLabels[value] ?? value;
    case 'helpNeeded':
      return helpNeededLabels[value] ?? value;
    default:
      return value;
  }
}
