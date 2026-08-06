'use client';

import { FormEvent, useRef, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { TextArea } from '@astryxdesign/core/TextArea';
import { ArrowRight } from 'lucide-react';
import type { GrowthSummaryResult } from '@/lib/types';

type ShapeState = 'idle' | 'confirming' | 'confirmed' | 'correcting' | 'corrected';

export function NextStepPanel({ result }: { result: GrowthSummaryResult }) {
  const isFallback = result.source === 'fallback';
  const [shapeState, setShapeState] = useState<ShapeState>('idle');
  const [correction, setCorrection] = useState('');
  const confirmationRef = useRef<HTMLDivElement>(null);
  const correctionRef = useRef<HTMLTextAreaElement>(null);

  function shapeOpportunity() {
    setShapeState('confirming');
    window.requestAnimationFrame(() => {
      confirmationRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    });
  }

  function openCorrection() {
    setShapeState('correcting');
    window.requestAnimationFrame(() => correctionRef.current?.focus());
  }

  function confirmRecommendation() {
    setShapeState('confirmed');
  }

  function submitCorrection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!correction.trim()) return;
    setCorrection(correction.trim());
    setShapeState('corrected');
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
        label="Shape this opportunity"
        variant="primary"
        size="md"
        endContent={<ArrowRight aria-hidden="true" />}
        onClick={shapeOpportunity}
        isDisabled={shapeState !== 'idle'}
      />

      {shapeState === 'confirming' ? (
        <div ref={confirmationRef} className="next-step-panel__confirmation" aria-labelledby="next-step-confirmation-heading">
          <p id="next-step-confirmation-heading" className="next-step-panel__confirmation-copy">Does this direction feel right for your business?</p>
          <div className="next-step-panel__confirmation-actions" role="group" aria-label="Confirm the recommended next step">
            <Button label="Yes, help me shape it" variant="secondary" size="sm" onClick={confirmRecommendation} />
            <Button label="Not quite" variant="ghost" size="sm" onClick={openCorrection} />
          </div>
        </div>
      ) : null}

      {shapeState === 'correcting' ? (
        <form className="next-step-panel__correction" onSubmit={submitCorrection}>
          <TextArea
            ref={correctionRef}
            label="What should Via21 reconsider?"
            description="Keep the correction focused on this recommendation."
            value={correction}
            placeholder="I need to prioritize..."
            rows={3}
            maxLength={280}
            onChange={(value) => setCorrection(value.slice(0, 280))}
          />
          <Button label="Refine this direction" type="submit" variant="secondary" size="sm" isDisabled={!correction.trim()} />
        </form>
      ) : null}

      {shapeState === 'confirmed' ? (
        <div className="next-step-panel__local-status" role="status">
          <strong>Direction confirmed.</strong>
          <p>Via21 will keep the first pass focused on this opportunity. This prototype does not send a message, create an account, or contact anyone.</p>
        </div>
      ) : null}

      {shapeState === 'corrected' ? (
        <div className="next-step-panel__local-status" role="status">
          <strong>Updated direction.</strong>
          <p>For this prototype, Via21 will keep the next pass focused on: {correction}</p>
        </div>
      ) : null}
    </section>
  );
}
