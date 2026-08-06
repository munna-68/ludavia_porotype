'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { GuidedBriefing } from '@/components/results/guided-briefing';
import { createFallbackSummary } from '@/data/fallback-summary';
import { labelForField } from '@/data/form-options';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';

export function ResultsShell({ values }: { values: BusinessNeedsInput }) {
  const router = useRouter();
  const [growthSummary, setGrowthSummary] = useState<GrowthSummaryResult | null>(null);
  const fallbackSummary = createFallbackSummary(values);
  const visibleSummary = growthSummary ?? fallbackSummary;
  const industry = labelForField('industry', values.industry) || 'your sector';

  return (
    <main className="snapshot-page results-page relative min-h-[100dvh] overflow-x-hidden bg-ink text-warm">
      <div className="noise-layer" />
      <DotPattern width={22} height={22} cx={1} cy={1} cr={0.75} className="snapshot-dot-pattern" />

      <section className="snapshot-shell relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[72rem] flex-col">
        <header className="form-header relative z-20 flex items-center gap-4 px-5 pb-5 pt-5 sm:gap-7 sm:px-9 sm:pb-7 sm:pt-8">
          <button type="button" className="form-back icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white transition hover:border-white/30 hover:bg-white/[0.08]" aria-label="Back to your journey" onClick={() => router.push('/form')}>
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="form-progress flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2" role="progressbar" aria-label="Journey progress: 100%" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
            {Array.from({ length: 5 }, (_, index) => (
              <span className="progress-segment min-w-0 flex-1" data-complete="true" key={index} />
            ))}
          </div>
          <div className="form-step-count flex shrink-0 items-center gap-2">
            <p className="text-xs text-white/70 sm:text-sm">Step 5 <span className="text-white/35">of</span> 5</p>
          </div>
        </header>

        <div className="snapshot-body results-body flex w-full max-w-[46rem] flex-1 flex-col px-5 pb-10 pt-[clamp(2.75rem,6vh,4.5rem)] sm:mx-auto sm:px-6 sm:pb-14">
          <div className="onboarding-heading results-intro">
            <p className="onboarding-eyebrow text-violet-gradient">Via21 briefing</p>
            <h1>
              <span className="onboarding-heading__line">Your growth</span>
              <span className="onboarding-heading__line onboarding-heading__line--answer">
                <span className="onboarding-heading__accent text-violet-gradient">snapshot.</span>
              </span>
            </h1>
            <p className="onboarding-hint">A short read of the context you shared, followed by one clear next move.</p>
          </div>

          <div className="results-recap">
            <p>Growth snapshot for <strong>{values.businessName}</strong> <span aria-hidden="true">·</span> {industry} <span aria-hidden="true">·</span> {values.location}</p>
            <Link href="/form" className="results-recap__edit">
              Edit details
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <GuidedBriefing
            values={values}
            fallbackResult={fallbackSummary}
            result={visibleSummary}
            onResult={setGrowthSummary}
          />
        </div>
      </section>
    </main>
  );
}
