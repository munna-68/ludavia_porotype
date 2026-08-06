'use client';

import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { ArrowRight } from 'lucide-react';
import { AskVia21 } from '@/components/results/ask-via21';
import { AiSummaryPanel } from '@/components/results/ai-summary-panel';
import { ConnectionCard } from '@/components/results/connection-card';
import { NextStepPanel } from '@/components/results/next-step-panel';
import { OpportunityCard } from '@/components/results/opportunity-card';
import { labelForField } from '@/data/form-options';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';

type GuidedBriefingProps = {
  values: BusinessNeedsInput;
  fallbackResult: GrowthSummaryResult;
  result: GrowthSummaryResult;
  onResult: (result: GrowthSummaryResult) => void;
};

const LAST_BEAT = 3;
const CONTINUE_LABELS = ['Continue to the leverage', 'Continue to the opportunity', 'Continue to the next move'];

export function GuidedBriefing({ values, fallbackResult, result, onResult }: GuidedBriefingProps) {
  const [revealedThrough, setRevealedThrough] = useState(0);
  const context = createBriefingContext(values);

  function revealBeat(nextBeat: number) {
    setRevealedThrough(nextBeat);
    window.requestAnimationFrame(() => {
      document.getElementById(`guided-beat-${nextBeat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function continueBriefing() {
    revealBeat(Math.min(revealedThrough + 1, LAST_BEAT));
  }

  function skipBriefing() {
    revealBeat(LAST_BEAT);
  }

  return (
    <section className="guided-briefing" aria-label="Via21 growth briefing">
      <article
        id="guided-beat-0"
        className="guided-briefing__beat"
        aria-labelledby="guided-beat-heading-0"
      >
        <BriefingBeatHeader number="01" label="Observation" headingId="guided-beat-heading-0">
          Here&apos;s what I see
        </BriefingBeatHeader>
        <div className="via21-note">
          <div className="via21-note__meta">
            <span>Via21</span>
            <span>First read</span>
          </div>
          <p>{context.observation}</p>
        </div>
        <dl className="briefing-context">
          <div className="briefing-context__row">
            <dt>Focus</dt>
            <dd>{context.goal}</dd>
          </div>
          <div className="briefing-context__row">
            <dt>Stage</dt>
            <dd>{context.stage} stage</dd>
          </div>
          <div className="briefing-context__row">
            <dt>Market</dt>
            <dd>{context.industry} · {context.location}</dd>
          </div>
        </dl>
        {revealedThrough === 0 ? <BriefingControls label={CONTINUE_LABELS[0]} onContinue={continueBriefing} onSkip={skipBriefing} /> : null}
      </article>

      <article
        id="guided-beat-1"
        className="guided-briefing__beat"
        aria-labelledby="guided-beat-heading-1"
        hidden={revealedThrough < 1}
      >
        <BriefingBeatHeader number="02" label="Leverage" headingId="guided-beat-heading-1">
          Here&apos;s where the leverage is
        </BriefingBeatHeader>
        <AiSummaryPanel values={values} fallbackResult={fallbackResult} onResult={onResult} />
        <AskVia21 />
        {revealedThrough === 1 ? <BriefingControls label={CONTINUE_LABELS[1]} onContinue={continueBriefing} onSkip={skipBriefing} /> : null}
      </article>

      <article
        id="guided-beat-2"
        className="guided-briefing__beat"
        aria-labelledby="guided-beat-heading-2"
        hidden={revealedThrough < 2}
      >
        <BriefingBeatHeader number="03" label="Potential match" headingId="guided-beat-heading-2">
          Here&apos;s a potential opportunity or connection
        </BriefingBeatHeader>
        <p className="guided-briefing__lead">One illustrative path to explore, paired with one illustrative perspective. Nothing here represents a live introduction.</p>
        <div className="guided-briefing__cards">
          <OpportunityCard values={values} />
          <ConnectionCard values={values} />
        </div>
        {revealedThrough === 2 ? <BriefingControls label={CONTINUE_LABELS[2]} onContinue={continueBriefing} onSkip={skipBriefing} /> : null}
      </article>

      <article
        id="guided-beat-3"
        className="guided-briefing__beat"
        aria-labelledby="guided-beat-heading-3"
        hidden={revealedThrough < 3}
      >
        <BriefingBeatHeader number="04" label="Next move" headingId="guided-beat-heading-3">
          Here&apos;s the next move I recommend
        </BriefingBeatHeader>
        <NextStepPanel result={result} />
      </article>
    </section>
  );
}

function BriefingBeatHeader({
  number,
  label,
  headingId,
  children,
}: {
  number: string;
  label: string;
  headingId: string;
  children: string;
}) {
  return (
    <header className="guided-briefing__beat-header">
      <p className="guided-briefing__kicker"><span>{number}</span> / {label}</p>
      <h2 id={headingId}>{children}</h2>
    </header>
  );
}

function BriefingControls({ label, onContinue, onSkip }: { label: string; onContinue: () => void; onSkip: () => void }) {
  return (
    <div className="guided-briefing__controls">
      <button type="button" className="onboarding-action" onClick={onContinue}>
        <span>{label}</span>
        <span className="onboarding-action__arrow" aria-hidden="true"><ArrowRight /></span>
      </button>
      <Button
        className="guided-briefing__skip"
        label="Skip to the full briefing"
        variant="ghost"
        size="sm"
        onClick={onSkip}
      />
    </div>
  );
}

function createBriefingContext(values: BusinessNeedsInput) {
  const industry = labelForField('industry', values.industry) || 'your sector';
  const location = values.location.trim() || 'your market';
  const stage = labelForField('stage', values.stage) || 'current';
  const goal = labelForField('mainGoal', values.mainGoal) || 'move forward';

  return {
    industry,
    location,
    stage,
    goal,
    observation: `The direction is specific: ${goal.toLowerCase()} in ${industry} from ${location}. At the ${stage.toLowerCase()} stage, the useful move is to make one choice visible enough to learn from before widening the brief.`,
  };
}
