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
  Pencil,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { Meteors } from '@/components/magicui/meteors';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { BrandLogo } from '@/components/chrome/brand-logo';
import { ThemeToggle } from '@/components/chrome/theme-toggle';
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
    <main className="relative min-h-screen overflow-hidden bg-ink px-3 py-3 text-warm sm:px-6 sm:py-6">
      <Meteors />
      <div className="noise-layer" />
      <div className="dot-layer" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[48rem] flex-col overflow-hidden rounded-[1.55rem] border border-white/15 bg-[#0b0b0f]/90 shadow-2xl shadow-black/40 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[2rem]">
        <header className="flex items-center justify-between px-5 pb-5 pt-5 sm:px-9 sm:pb-7 sm:pt-8">
          <button type="button" className="icon-button inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white transition hover:border-white/30 hover:bg-white/[0.08]" aria-label="Back to your journey" onClick={() => router.push('/form')}>
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <BrandLogo />
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col px-5 pb-8 sm:px-9 sm:pb-9">
          <div className="mb-8 sm:mb-10">
            <p className="text-violet-gradient mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em]">Review</p>
            <h1 className="max-w-[13ch] font-display text-[clamp(3rem,8vw,5rem)] font-normal leading-[0.92] tracking-[-0.06em] text-white">
              Check your <span className="text-violet-gradient">snapshot.</span>
            </h1>
            <p className="mt-6 max-w-[38ch] text-base leading-7 text-white/60 sm:text-lg">One last look before we map the next step.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            {REVIEW_ROWS.map(({ field, label, icon: Icon }) => {
              const raw = values[field as keyof BusinessNeedsInput];
              const display = labelForField(field, typeof raw === 'string' ? raw : undefined) || 'Not provided';
              const step = field === 'businessName' ? 0 : field === 'businessType' ? 1 : field === 'industry' || field === 'location' ? 2 : field === 'stage' ? 3 : 4;

              return (
                <div className="snapshot-row grid grid-cols-[auto_minmax(0,0.85fr)_minmax(0,1.35fr)_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[auto_minmax(0,0.8fr)_minmax(0,1.35fr)_auto] sm:gap-4 sm:px-5 sm:py-5" key={field}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-soft text-violet-bright">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-white/45 sm:text-xs">{label}</span>
                  <span className="min-w-0 truncate text-sm font-medium text-white sm:text-base">{display}</span>
                  <button type="button" className="snapshot-edit inline-flex items-center gap-1 text-xs font-semibold sm:text-sm" onClick={() => router.push(`/form?step=${step + 1}`)}>
                    <span className="text-violet-gradient hidden sm:inline">Edit</span>
                    <Pencil className="h-3.5 w-3.5 sm:hidden" aria-label="Edit" />
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-10">
            <ShimmerButton className="w-full justify-between" onClick={() => setShowOpportunities(true)}>
              <span>{showOpportunities ? 'Opportunities mapped' : 'See opportunities'}</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-bright text-white shadow-[0_0_24px_rgba(164,109,255,0.38)] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </ShimmerButton>
          </div>

          {showOpportunities ? (
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="opportunity-reveal mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
              <article className="rounded-2xl border border-violet-bright/25 bg-violet-soft p-5 sm:p-6">
                <p className="text-violet-gradient text-[0.65rem] font-semibold uppercase tracking-[0.18em]">{sampleOpportunity.illustrativeLabel}</p>
                <h2 className="mt-4 font-display text-2xl text-white">{sampleOpportunity.title}</h2>
                <p className="mt-2 text-sm font-medium text-white/70">{sampleOpportunity.organization}</p>
                <p className="mt-4 text-sm leading-6 text-white/60">{opportunityScope}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-white/70">{opportunityFit}</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/45">{sampleConnection.illustrativeLabel}</p>
                <h2 className="mt-4 font-display text-2xl text-white">{sampleConnection.name}</h2>
                <p className="mt-2 text-sm font-medium text-white/70">{sampleConnection.role}</p>
                <p className="mt-1 text-sm text-white/45">{sampleConnection.organization} · {connectionLocation}</p>
                <p className="mt-4 text-sm leading-6 text-white/60">{connectionContext}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-white/70">{connectionWhy}</p>
              </article>
            </motion.section>
          ) : null}
        </div>

        <footer className="mt-auto border-t border-white/10 px-5 pb-6 pt-5 sm:px-9 sm:pb-8">
          <div className="mb-3 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/55">
            <span>Journey</span>
            <span className="text-white">100%</span>
          </div>
          <div className="journey-track" role="progressbar" aria-label="Journey progress: 100%" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
            <div className="journey-track__fill w-full" />
          </div>
        </footer>
      </section>
    </main>
  );
}
