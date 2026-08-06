'use client';

import { FormEvent, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@astryxdesign/core/Button';
import { TextArea } from '@astryxdesign/core/TextArea';
import { ArrowRight } from 'lucide-react';
import { PlanExport } from '@/components/results/plan-export';
import { fadeUpTransition, fadeUpVariants, reducedMotionTransition } from '@/lib/motion';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';

type ShapeState = 'idle' | 'confirming' | 'confirmed' | 'correcting' | 'corrected';

export function NextStepPanel({ values, result }: { values: BusinessNeedsInput; result: GrowthSummaryResult }) {
  const isFallback = result.source === 'fallback';
  const shouldReduceMotion = useReducedMotion();
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
      <div className="next-step-panel__secondary-actions">
        <PlanExport values={values} result={result} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {shapeState === 'confirming' ? (
          <motion.div
            key="confirming"
            ref={confirmationRef}
            className="next-step-panel__confirmation"
            aria-labelledby="next-step-confirmation-heading"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
            <p id="next-step-confirmation-heading" className="next-step-panel__confirmation-copy">Does this direction feel right for your business?</p>
            <div className="next-step-panel__confirmation-actions" role="group" aria-label="Confirm the recommended next step">
              <Button label="Yes, help me shape it" variant="secondary" size="sm" onClick={confirmRecommendation} />
              <Button label="Not quite" variant="ghost" size="sm" onClick={openCorrection} />
            </div>
          </motion.div>
        ) : null}

        {shapeState === 'correcting' ? (
          <motion.form
            key="correcting"
            className="next-step-panel__correction"
            onSubmit={submitCorrection}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
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
          </motion.form>
        ) : null}

        {shapeState === 'confirmed' ? (
          <motion.div
            key="confirmed"
            className="next-step-panel__local-status"
            role="status"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
            <strong>Direction confirmed.</strong>
            <p>Via21 will keep the first pass focused on this opportunity. This prototype does not send a message, create an account, or contact anyone.</p>
          </motion.div>
        ) : null}

        {shapeState === 'corrected' ? (
          <motion.div
            key="corrected"
            className="next-step-panel__local-status"
            role="status"
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUpVariants}
            transition={shouldReduceMotion ? reducedMotionTransition : fadeUpTransition}
          >
            <strong>Updated direction.</strong>
            <p>For this prototype, Via21 will keep the next pass focused on: {correction}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
