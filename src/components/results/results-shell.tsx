'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Flag,
  Landmark,
  MapPin,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { sampleConnection } from '@/data/sample-connection';
import { sampleOpportunity } from '@/data/sample-opportunity';
import { labelForField } from '@/data/form-options';
import { loadBusinessNeeds } from '@/lib/session-store';
import { personalize } from '@/lib/personalize';
import type { BusinessNeedsInput } from '@/lib/types';

const REVIEW_ROWS = [
  { field: 'businessName', label: 'Business name', icon: UserRound },
  { field: 'businessType', label: 'Business type', icon: BriefcaseBusiness },
  { field: 'industry', label: 'Sector', icon: Landmark },
  { field: 'location', label: 'Location', icon: MapPin },
  { field: 'stage', label: 'Stage', icon: TrendingUp },
  { field: 'mainGoal', label: 'Main goal', icon: Flag },
] as const;

export function ResultsShell() {
  const router = useRouter();
  const [values, setValues] = useState<BusinessNeedsInput | null>(null);
  const [ready, setReady] = useState(false);
  const [showOpportunities, setShowOpportunities] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = loadBusinessNeeds();
      if (!saved) {
        router.replace('/form');
        return;
      }
      setValues(saved);
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  if (!ready || !values) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-white">
        <div className="w-full max-w-md space-y-4" aria-label="Loading your snapshot" role="status">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-14 w-4/5 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-36 animate-pulse rounded-3xl bg-white/5" />
        </div>
      </main>
    );
  }

  const opportunityScope = personalize(sampleOpportunity.scope, values);
  const opportunityFit = personalize(sampleOpportunity.whyItFits, values);
  const connectionLocation = personalize(sampleConnection.location, values);
  const connectionContext = personalize(sampleConnection.mutualContext, values);
  const connectionWhy = personalize(sampleConnection.whyConnect, values);

  return (
    <main className="snapshot-page relative min-h-[100dvh] overflow-hidden bg-ink text-warm">
      <div className="noise-layer" />
      <DotPattern width={22} height={22} cx={1} cy={1} cr={0.75} className="snapshot-dot-pattern" />

      <section className="snapshot-shell relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[72rem] flex-col overflow-hidden">
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

        <div className="snapshot-body flex w-full max-w-[46rem] flex-1 flex-col px-5 pb-10 pt-[clamp(2.75rem,6vh,4.5rem)] sm:mx-auto sm:px-6 sm:pb-14">
          <div className="onboarding-heading snapshot-heading mb-[1.8rem]">
            <p className="onboarding-eyebrow text-violet-gradient">Review</p>
            <h1>
              <span className="onboarding-heading__line">Check your</span>
              <span className="onboarding-heading__line onboarding-heading__line--answer">
                <span className="onboarding-heading__accent text-violet-gradient">snapshot.</span>
              </span>
            </h1>
            <p className="onboarding-hint">One last look before we map the next step.</p>
          </div>

          <div className="snapshot-card overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">
            {REVIEW_ROWS.map(({ field, label, icon: Icon }) => {
              const raw = values[field as keyof BusinessNeedsInput];
              const display = labelForField(field, typeof raw === 'string' ? raw : undefined) || 'Not provided';
              const step = field === 'businessName' ? 0 : field === 'businessType' ? 1 : field === 'industry' || field === 'location' ? 2 : field === 'stage' ? 3 : 4;

              return (
                <div className="snapshot-row grid min-h-[3.7rem] grid-cols-[1.5rem_minmax(0,7.25rem)_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:grid-cols-[1.5rem_minmax(0,8.25rem)_minmax(0,1fr)_auto] sm:px-5 sm:py-3.5" key={field}>
                  <Icon className="h-5 w-5 text-violet-bright" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/50 sm:text-[0.68rem]">{label}</span>
                  <span className="min-w-0 truncate text-sm font-medium text-white sm:text-base">{display}</span>
                  <button type="button" className="snapshot-edit inline-flex items-center gap-1 text-xs font-semibold sm:text-sm" aria-label={`Edit ${label}`} onClick={() => router.push(`/form?step=${step + 1}`)}>
                    <span>Edit</span>
                    <ArrowRight className="h-4 w-4 text-white/55" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-10">
            <button type="button" className="onboarding-action" onClick={() => setShowOpportunities(true)}>
              <span>{showOpportunities ? 'Opportunities mapped' : 'See opportunities'}</span>
              <span className="onboarding-action__arrow" aria-hidden="true">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </div>

          {showOpportunities ? (
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="opportunity-reveal mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
              <article className="rounded-2xl border border-violet-bright/25 bg-violet-soft p-5 sm:p-6">
                <p className="text-violet-gradient text-[0.65rem] font-semibold uppercase tracking-[0.18em]">{sampleOpportunity.illustrativeLabel}</p>
                <h2 className="mt-4 font-sans text-2xl font-semibold text-white">{sampleOpportunity.title}</h2>
                <p className="mt-2 text-sm font-medium text-white/70">{sampleOpportunity.organization}</p>
                <p className="mt-4 text-sm leading-6 text-white/60">{opportunityScope}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-white/70">{opportunityFit}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/45">{sampleConnection.illustrativeLabel}</p>
                <h2 className="mt-4 font-sans text-2xl font-semibold text-white">{sampleConnection.name}</h2>
                <p className="mt-2 text-sm font-medium text-white/70">{sampleConnection.role}</p>
                <p className="mt-1 text-sm text-white/45">{sampleConnection.organization} · {connectionLocation}</p>
                <p className="mt-4 text-sm leading-6 text-white/60">{connectionContext}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-white/70">{connectionWhy}</p>
              </article>
            </motion.section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
