export type SampleOpportunity = {
  id: string;
  title: string;
  organization: string;
  type: 'grant' | 'pilot' | 'partnership' | 'accelerator';
  scope: string;
  timeframe: string;
  whyItFits: string;
  ctaLabel: string;
  illustrativeLabel: string;
};

export const sampleOpportunity: SampleOpportunity = {
  id: 'sample-opportunity-1',
  title: 'Founder Pilot Cohort',
  organization: 'Harborline Labs',
  type: 'pilot',
  scope: 'A six-month cohort for early-stage {{industry}} companies building in {{location}}.',
  timeframe: 'Six months · rolling intake',
  whyItFits:
    'You are at the {{stage}} stage and focused on {{goal}} — the cohort exists to move companies like yours from that starting point to their first clear win.',
  ctaLabel: 'View pilot details',
  illustrativeLabel: 'Illustrative opportunity',
};
