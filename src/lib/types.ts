export type BusinessStage = 'idea' | 'early' | 'growing' | 'established';

export type BusinessNeedsInput = {
  businessName: string;
  businessType: string;
  industry: string;
  location: string;
  stage: BusinessStage;
  mainGoal: string;
  helpNeeded: string;
  description?: string;
};

export type RecommendedNextStep = {
  title: string;
  detail: string;
};

export type GrowthSummaryResult = {
  summary: string;
  recommendedNextStep: RecommendedNextStep;
  source: 'gemini' | 'fallback';
};

export type GeminiPayload = Omit<GrowthSummaryResult, 'source'>;
