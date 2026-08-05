'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadBusinessNeeds } from '@/lib/session-store';
import type { BusinessNeedsInput } from '@/lib/types';
import { ResultsShell } from '@/components/results/results-shell';

type GateState = 'loading' | 'redirecting' | 'ready';

export function ResultsSessionGate() {
  const router = useRouter();
  const [state, setState] = useState<GateState>('loading');
  const [values, setValues] = useState<BusinessNeedsInput | null>(null);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      const saved = loadBusinessNeeds();
      if (cancelled) return;

      if (!saved) {
        setState('redirecting');
        router.replace('/form');
        return;
      }

      setValues(saved);
      setState('ready');
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [router]);

  if (state === 'ready' && values) {
    return <ResultsShell values={values} />;
  }

  return <ResultsLoadingShell redirecting={state === 'redirecting'} />;
}

function ResultsLoadingShell({ redirecting }: { redirecting: boolean }) {
  return (
    <main className="snapshot-page results-loading-page min-h-[100dvh] overflow-hidden bg-ink text-warm">
      <section className="results-loading-shell mx-auto flex min-h-[100dvh] w-full max-w-[72rem] flex-col px-5 sm:px-9">
        <header className="form-header flex items-center gap-4">
          <span className="results-loading-circle" aria-hidden="true" />
          <span className="results-loading-line results-loading-line--wide" aria-hidden="true" />
          <span className="results-loading-line results-loading-line--short" aria-hidden="true" />
        </header>

        <section className="results-loading-content" aria-label={redirecting ? 'Returning to your details' : 'Loading your growth snapshot'} role="status">
          <span className="results-loading-kicker" aria-hidden="true" />
          <span className="results-loading-title" aria-hidden="true" />
          <span className="results-loading-title results-loading-title--short" aria-hidden="true" />
          <span className="results-loading-copy" aria-hidden="true" />
          <span className="results-loading-copy results-loading-copy--short" aria-hidden="true" />
          <p className="sr-only">{redirecting ? 'Returning to your details.' : 'Loading your growth snapshot.'}</p>

          <section className="results-loading-grid" aria-hidden="true">
            <span className="results-loading-card" />
            <span className="results-loading-card" />
          </section>
        </section>
      </section>
    </main>
  );
}
