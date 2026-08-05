'use client';

import { useRef, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { ArrowUpRight } from 'lucide-react';
import { sampleOpportunity } from '@/data/sample-opportunity';
import { personalize } from '@/lib/personalize';
import type { BusinessNeedsInput } from '@/lib/types';

function opportunityTypeLabel(type: typeof sampleOpportunity.type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function OpportunityCard({ values }: { values: BusinessNeedsInput }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const scrollTopRef = useRef(0);
  const scope = personalize(sampleOpportunity.scope, values);
  const fit = personalize(sampleOpportunity.whyItFits, values);

  function toggleDetails(open: boolean) {
    if (open) {
      scrollTopRef.current = window.scrollY;
      setDetailsOpen(true);
      return;
    }

    setDetailsOpen(false);
    restoreScrollPosition();
    window.requestAnimationFrame(restoreScrollPosition);
  }

  function restoreScrollPosition() {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, scrollTopRef.current);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  }

  return (
    <>
      <Card className="result-card result-card--opportunity" padding={0} variant="transparent">
        <article>
          <header className="result-card__header">
            <p className="result-card__eyebrow">{sampleOpportunity.illustrativeLabel}</p>
            <h2 className="result-card__title">{sampleOpportunity.title}</h2>
            <p className="result-card__organization">{sampleOpportunity.organization}</p>
          </header>

          <dl className="result-card__meta">
            <dt>Format</dt>
            <dd>{opportunityTypeLabel(sampleOpportunity.type)}</dd>
            <dt>Scope</dt>
            <dd>{scope}</dd>
            <dt>Timing</dt>
            <dd>{sampleOpportunity.timeframe}</dd>
          </dl>

          <section className="result-card__section" aria-labelledby="opportunity-fit-heading">
            <h3 id="opportunity-fit-heading">Why this fits</h3>
            <p>{fit}</p>
          </section>

          <footer className="result-card__footer">
            <Button
              className="result-card__action"
              label={sampleOpportunity.ctaLabel}
              variant="secondary"
              size="sm"
              endContent={<ArrowUpRight aria-hidden="true" />}
              onClick={() => toggleDetails(true)}
            />
          </footer>
        </article>
      </Card>

      <Dialog
        isOpen={detailsOpen}
        onOpenChange={toggleDetails}
        purpose="info"
        className="result-dialog"
        padding={0}
        width="min(32rem, calc(100vw - 2.5rem))"
      >
        <DialogHeader
          className="result-dialog__header"
          title={sampleOpportunity.title}
          subtitle={`${sampleOpportunity.organization} · Illustrative only`}
          onOpenChange={toggleDetails}
        />
        <section className="result-dialog__content">
          <p>{scope}</p>
          <p>{fit}</p>
          <p className="result-dialog__note">This is a prototype example, not a live program or application.</p>
        </section>
      </Dialog>
    </>
  );
}
