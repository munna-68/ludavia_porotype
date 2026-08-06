'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { Sparkles } from 'lucide-react';
import { growthSummarySchema } from '@/lib/growth-summary-schema';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';

type PanelState =
  | { profileKey: string; status: 'loading' }
  | { profileKey: string; status: 'success'; result: GrowthSummaryResult }
  | { profileKey: string; status: 'error' };

type AiSummaryPanelProps = {
  values: BusinessNeedsInput;
  fallbackResult: GrowthSummaryResult;
  onResult?: (result: GrowthSummaryResult) => void;
};

const REQUEST_TIMEOUT_MS = 9_000;

export function AiSummaryPanel({ values, fallbackResult, onResult }: AiSummaryPanelProps) {
  const profileKey = JSON.stringify(values);
  const [state, setState] = useState<PanelState>({ profileKey, status: 'loading' });
  const visibleState = state.profileKey === profileKey ? state : { profileKey, status: 'loading' as const };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    async function loadSummary() {
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

        if (!parsed.success || !active) throw new Error('Invalid summary response');

        const result: GrowthSummaryResult = { ...parsed.data, source: 'gemini' };
        onResult?.(result);
        setState({ profileKey, status: 'success', result });
      } catch {
        if (!active || (!timedOut && controller.signal.aborted)) return;
        setState({ profileKey, status: 'error' });
      } finally {
        window.clearTimeout(timeout);
      }
    }

    queueMicrotask(() => {
      if (active) void loadSummary();
    });

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [onResult, profileKey]);

  return (
    <section className="ai-summary-panel" aria-labelledby="ai-summary-heading">
      <div className="ai-summary-panel__header">
        <div className="ai-summary-panel__label">
          <Sparkles aria-hidden="true" />
          <span>{visibleState.status === 'success' ? 'Live insight' : 'Prepared insight'}</span>
        </div>
        <span className="ai-summary-panel__signal" aria-hidden="true" />
      </div>

      {visibleState.status === 'loading' ? <LoadingSummary fallbackResult={fallbackResult} /> : null}

      {visibleState.status === 'success' ? (
        <div className="ai-summary-panel__content">
          <h2 id="ai-summary-heading">A clearer view of what comes next.</h2>
          <p>{visibleState.result.summary}</p>
        </div>
      ) : null}

      {visibleState.status === 'error' ? (
        <div className="ai-summary-panel__content">
          <h2 id="ai-summary-heading">A focused view of what comes next.</h2>
          <p>{fallbackResult.summary}</p>
          <p className="ai-summary-panel__status" role="status">Showing a prepared insight while live generation is unavailable.</p>
        </div>
      ) : null}
    </section>
  );
}

function LoadingSummary({ fallbackResult }: { fallbackResult: GrowthSummaryResult }) {
  return (
    <div className="ai-summary-panel__content" role="status" aria-label="Reading your growth context">
      <h2 id="ai-summary-heading">A focused view of what comes next.</h2>
      <p>{fallbackResult.summary}</p>
      <div className="ai-summary-panel__skeletons" aria-hidden="true">
        <Skeleton width="100%" height="0.85rem" radius={2} index={0} />
        <Skeleton width="94%" height="0.85rem" radius={2} index={1} />
        <Skeleton width="72%" height="0.85rem" radius={2} index={2} />
      </div>
    </div>
  );
}
