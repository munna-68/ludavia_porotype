export type SampleConnection = {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  mutualContext: string;
  expertise: readonly string[];
  whyConnect: string;
  illustrativeLabel: string;
};

export const sampleConnection: SampleConnection = {
  id: 'sample-connection-1',
  name: 'Amara Chen',
  role: 'Director, Partner Ecosystems',
  organization: 'Northstar Partners',
  location: 'Works with founders across {{location}}',
  mutualContext: 'You both focus on early-stage {{industry}} companies — the kind of business {{businessName}} is becoming.',
  expertise: ['Early-stage growth', 'Go-to-market', 'Founder networks'],
  whyConnect:
    'Amara regularly connects founders who want to {{goal}} with the right programs and operators for their {{stage}} stage.',
  illustrativeLabel: 'Illustrative connection',
};
