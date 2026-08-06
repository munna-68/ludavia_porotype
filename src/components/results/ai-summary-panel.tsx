'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { growthSummarySchema } from '@/lib/growth-summary-schema';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';
import { fadeUpTransition, fadeUpVariants, reducedMotionTransition } from '@/lib/motion';
import { requestCachedSummary } from '@/lib/summary-cache';

type PanelState =
  | { profileKey: string; status: 'thinking' }
  | { profileKey: string; status: 'prepared' }
  | { profileKey: string; status: 'success'; result: GrowthSummaryResult }
  | { profileKey: string; status: 'error' };

type AiSummaryPanelProps = {
  values: BusinessNeedsInput;
  fallbackResult: GrowthSummaryResult;
  onResult?: (result: GrowthSummaryResult) => void;
};

const REQUEST_TIMEOUT_MS = 9_000;
const THINKING_SEQUENCE_MS = 3_000;

export function AiSummaryPanel({ values, fallbackResult, onResult }: AiSummaryPanelProps) {
  const profileKey = JSON.stringify(values);
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<PanelState>({ profileKey, status: 'thinking' });
  const visibleState = state.profileKey === profileKey ? state : { profileKey, status: 'thinking' as const };

  useEffect(() => {
    const thinkingDuration = shouldReduceMotion ? 0 : THINKING_SEQUENCE_MS;
    const timeout = window.setTimeout(() => {
      setState((current) => (
        current.profileKey === profileKey && current.status === 'thinking'
          ? { profileKey, status: 'prepared' }
          : current
      ));
    }, thinkingDuration);

    return () => window.clearTimeout(timeout);
  }, [profileKey, shouldReduceMotion]);

  useEffect(() => {
    let active = true;
    void requestCachedSummary(profileKey, async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: profileKey,
          signal: controller.signal,
        });

        if (!response.ok) throw new Error('Summary request failed');

        const body: unknown = await response.json();
        if (!body || typeof body !== 'object') throw new Error('Invalid summary response');

        const responseBody = body as {
          summary?: unknown;
          recommendedNextStep?: unknown;
        };
        const parsed = growthSummarySchema.safeParse({
          summary: responseBody.summary,
          recommendedNextStep: responseBody.recommendedNextStep,
        });

        if (!parsed.success) throw new Error('Invalid summary response');

        return { ...parsed.data, source: 'gemini' } satisfies GrowthSummaryResult;
      } finally {
        window.clearTimeout(timeout);
      }
    }).then((result) => {
      if (!active) return;
      if (!result) {
        setState({ profileKey, status: 'error' });
        return;
      }

      onResult?.(result);
      setState({ profileKey, status: 'success', result });
    });

    return () => {
      active = false;
    };
  }, [onResult, profileKey]);

  return (
    <section className="ai-summary-panel" aria-labelledby="ai-summary-heading">
      <div className="ai-summary-panel__header">
        <div className="ai-summary-panel__label">
          <Sparkles aria-hidden="true" />
          <span>
            {visibleState.status === 'thinking'
              ? 'Via21 is reading'
              : visibleState.status === 'success'
                ? 'Live insight'
                : 'Prepared insight'}
          </span>
        </div>
        <span className="ai-summary-panel__signal" data-thinking={visibleState.status === 'thinking'} aria-hidden="true" />
      </div>

      <AnimatePresence mode="wait">
        {visibleState.status === 'thinking' ? (
          <motion.div
            key="thinking"
            className="ai-summary-panel__content ai-summary-panel__content--thinking"
            role="status"
            aria-label="Reading your growth context"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
            <ThinkingSummary />
          </motion.div>
        ) : null}

        {visibleState.status === 'prepared' || visibleState.status === 'error' ? (
          <motion.div
            key={visibleState.status}
            className="ai-summary-panel__content"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
            <h2 id="ai-summary-heading">A focused view of what comes next.</h2>
            <p>{fallbackResult.summary}</p>
            {visibleState.status === 'error' ? <p className="ai-summary-panel__status" role="status">Showing a prepared insight while live generation is unavailable.</p> : null}
          </motion.div>
        ) : null}

        {visibleState.status === 'success' ? (
          <motion.div
            key="success"
            className="ai-summary-panel__content"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
            <h2 id="ai-summary-heading">A clearer view of what comes next.</h2>
            <p>{visibleState.result.summary}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function ThinkingSummary() {
  return (
    <>
      <h2 id="ai-summary-heading">Reading the shape of your next move.</h2>
      <p>Via21 is connecting your focus, stage, and market into one practical direction.</p>
      <ol className="ai-summary-panel__thinking-steps" aria-label="Via21 thinking sequence">
        <li><span aria-hidden="true">01</span> Finding the signal in your brief</li>
        <li><span aria-hidden="true">02</span> Looking for the useful leverage</li>
        <li><span aria-hidden="true">03</span> Preparing one clear next move</li>
      </ol>
    </>
  );
}
