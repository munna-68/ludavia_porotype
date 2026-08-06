'use client';

import { Button } from '@astryxdesign/core/Button';
import { ArrowRight } from 'lucide-react';
import type { GrowthSummaryResult } from '@/lib/types';

export function NextStepPanel({ result }: { result: GrowthSummaryResult }) {
  const isFallback = result.source === 'fallback';

  function focusOpportunity() {
    document.getElementById('opportunity-reveal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section className="next-step-panel" aria-labelledby="next-step-heading">
      <header className="next-step-panel__header">
        <p className="next-step-panel__label">Recommended next step</p>
        <span className="next-step-panel__source">{isFallback ? 'Prepared insight' : 'Live insight'}</span>
      </header>
      <h2 id="next-step-heading">{result.recommendedNextStep.title}</h2>
      <p className="next-step-panel__detail">{result.recommendedNextStep.detail}</p>
      <Button
        className="next-step-panel__action"
        label="Start with this step"
        variant="primary"
        size="md"
        endContent={<ArrowRight aria-hidden="true" />}
        onClick={focusOpportunity}
      />
    </section>
  );
}
