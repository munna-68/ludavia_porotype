'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Banner } from '@astryxdesign/core/Banner';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Selector } from '@astryxdesign/core/Selector';
import { SelectableCard } from '@astryxdesign/core/SelectableCard';
import { FieldStatus } from '@astryxdesign/core/FieldStatus';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { normalizeBusinessNeeds } from '@/lib/business-needs-schema';
import { loadBusinessNeeds, saveBusinessNeeds } from '@/lib/session-store';
import type { BusinessNeedsInput, BusinessStage } from '@/lib/types';
import { GlobeVisual } from '@/components/motion/globe-visual';
import {
  businessTypeOptions,
  helpNeededOptions,
  industryOptions,
  labelForField,
  mainGoalOptions,
  stageOptions,
} from '@/data/form-options';

type Values = BusinessNeedsInput;

type OptionIconProps = { className?: string };

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

function CubeIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M12 3 3 7.5v9L12 21l9-4.5v-9Z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </svg>
  );
}
function BriefcaseIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M3 8h18v11H3zM8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </svg>
  );
}
function CartIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M3 4h2l2.2 11.4a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20 8H6M9 20h.01M17 20h.01" />
    </svg>
  );
}
function SwapIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 8h12l-3-3M20 16H8l3 3" />
    </svg>
  );
}
function DotsIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
  );
}
function SeedIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M12 20v-8M12 12c0-3 2-5 6-5 0 4-2 6-6 6ZM12 14c0-2-1.5-3-4-3 0 2 1.5 3 4 3Z" />
    </svg>
  );
}
function SproutIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M12 20v-7M12 13c0-2 1.5-3 4-3 0 2-1.5 3-4 3ZM12 15c0-2.5-2-4-5-4 0 2.5 2 4 5 4Z" />
    </svg>
  );
}
function ChartUpIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 19h16M5 16l4-4 3 3 6-7" />
    </svg>
  );
}
function BuildingIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 21V11h4a1 1 0 0 1 1 1v9M8 8h.01M8 12h.01M8 16h.01" />
    </svg>
  );
}
function MegaphoneIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1ZM15 9a3 3 0 0 1 0 6" />
    </svg>
  );
}
function CapitalIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M12 3v18M7 7c0-1.7 2.2-3 5-3s5 1.3 5 3-2.2 3-5 3-5 1.3-5 3 2.2 3 5 3 5-1.3 5-3" />
    </svg>
  );
}
function UserPlusIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M11 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 21v-1a5 5 0 0 1 5-5h3M18 13v6M21 16h-6" />
    </svg>
  );
}
function HandshakeIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="m11 8 3-2 4 2 3 2-2 4-3-2M8 11l3-3 3 3M3 13l3-2 3 3-2 3-3-1M14 17l-2 2-3-3" />
    </svg>
  );
}
function GlobeIcon({ className }: OptionIconProps) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}
const businessTypeIcons: Record<string, (p: OptionIconProps) => ReactElement> = {
  'product-saas': CubeIcon,
  'service-agency': BriefcaseIcon,
  'retail-ecommerce': CartIcon,
  marketplace: SwapIcon,
  other: DotsIcon,
};

const stageIcons: Record<BusinessStage, (p: OptionIconProps) => ReactElement> = {
  idea: SeedIcon,
  early: SproutIcon,
  growing: ChartUpIcon,
  established: BuildingIcon,
};

const mainGoalIcons: Record<string, (p: OptionIconProps) => ReactElement> = {
  'find-customers': MegaphoneIcon,
  'raise-capital': CapitalIcon,
  'hire-talent': UserPlusIcon,
  'find-partners': HandshakeIcon,
  'expand-market': GlobeIcon,
};

const DRAFT_KEY = 'ludavia-form-draft:v1';

const STEP_FIELDS: (keyof Values)[][] = [
  ['businessName'],
  ['businessType'],
  ['industry', 'location'],
  ['stage'],
  ['mainGoal', 'helpNeeded'],
  [],
];

const STEP_META = [
  { eyebrow: 'Start', question: 'What should we call your business?', hint: 'A name gives the snapshot somewhere to begin.' },
  { eyebrow: 'Model', question: 'What kind of business is it?', hint: 'Choose the closest fit. Nothing is permanent.' },
  { eyebrow: 'Market', question: 'Where do you operate?', hint: 'Tell us your sector and where you call home.' },
  { eyebrow: 'Stage', question: 'Where are you in the journey?', hint: 'Meet the business where it is today.' },
  { eyebrow: 'Focus', question: 'What would move it forward?', hint: 'Pick the goal and kind of support that matters most.' },
  { eyebrow: 'Review', question: 'Check your snapshot.', hint: 'One last look before we map the next step.' },
] as const;

const EMPTY_VALUES: Values = {
  businessName: '',
  businessType: '',
  industry: '',
  location: '',
  stage: 'idea',
  mainGoal: '',
  helpNeeded: '',
  description: '',
};

function getDraft(): { step: number; values: Values } | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { step?: number; values?: Partial<Values> };
    if (typeof parsed.step !== 'number' || !parsed.values) return null;
    return { step: parsed.step, values: { ...EMPTY_VALUES, ...parsed.values } };
  } catch {
    return null;
  }
}

function saveDraft(step: number, values: Values) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, values }));
  } catch {
    /* ignore */
  }
}

function clearDraft() {
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

function focusFirstInvalid(field: keyof Values) {
  if (typeof document === 'undefined') return;
  const wrapper = document.querySelector(`[data-field="${field}"]`);
  if (!wrapper) return;
  const target = wrapper.querySelector<HTMLElement>(
    'input:not([type=hidden]),textarea,select,button,[role="radiogroup"],[tabindex]:not([tabindex="-1"])',
  );
  target?.focus({ preventScroll: false });
  wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

export function BusinessNeedsForm() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const progressId = useId();

  const stageRef = useRef<HTMLElement>(null);

  const totalSteps = STEP_FIELDS.length;

  useEffect(() => {
    const saved = loadBusinessNeeds();
    const draft = saved ? null : getDraft();
    const frame = window.requestAnimationFrame(() => {
      if (draft) {
        setStep(Math.min(Math.max(draft.step, 0), totalSteps - 1));
        setValues(draft.values);
      } else if (saved) {
        setValues(saved);
        setStep(totalSteps - 1);
      }
      setHydrated(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [totalSteps]);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(step, values);
  }, [step, values, hydrated]);

  const visibleErrors = useMemo(() => {
    if (!attempted) return {};
    const shown: Partial<Record<keyof Values, string>> = {};
    const fields = STEP_FIELDS[step];
    for (const f of fields) {
      if (errors[f]) shown[f] = errors[f];
    }
    return shown;
  }, [attempted, errors, step]);

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (storageError) setStorageError(null);
  }

  function validateCurrentStep(): boolean {
    const fields = STEP_FIELDS[step];
    if (fields.length === 0) return true;
    const result = normalizeBusinessNeeds(values);
    const shown: Partial<Record<keyof Values, string>> = {};
    let firstInvalid: keyof Values | null = null;
    for (const f of fields) {
      if (!result.success && result.errors[f]) {
        shown[f] = result.errors[f];
        if (firstInvalid === null) firstInvalid = f;
      }
    }
    setErrors((prev) => ({ ...prev, ...shown }));
    if (firstInvalid) {
      setAttempted(true);
      focusFirstInvalid(firstInvalid);
      return false;
    }
    return true;
  }

  function goNext() {
    setAttempted(true);
    if (!validateCurrentStep()) return;
    setAttempted(false);
    setErrors({});
    setStep((s) => Math.min(s + 1, totalSteps - 1));
    requestAnimationFrame(() => stageRef.current?.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function goToStep(target: number) {
    setAttempted(false);
    setErrors({});
    setStep(Math.min(Math.max(target, 0), totalSteps - 1));
  }

  function handleSubmit() {
    if (isNavigating) return;
    const result = normalizeBusinessNeeds(values);
    if (!result.success) {
      const fieldOrder: (keyof Values)[] = ['businessName', 'businessType', 'industry', 'location', 'stage', 'mainGoal', 'helpNeeded'];
      let firstInvalid: keyof Values | null = null;
      const shown: Partial<Record<keyof Values, string>> = {};
      for (const f of fieldOrder) {
        if (result.errors[f]) {
          shown[f] = result.errors[f];
          if (firstInvalid === null) firstInvalid = f;
        }
      }
      setErrors(shown);
      setAttempted(true);
      if (firstInvalid) {
        const targetStep = STEP_FIELDS.findIndex((fields) => fields.includes(firstInvalid as keyof Values));
        if (targetStep >= 0) setStep(targetStep);
        focusFirstInvalid(firstInvalid);
      }
      return;
    }
    clearDraft();
    const saved = saveBusinessNeeds(result.data);
    if (!saved) {
      setStorageError('Your snapshot could not be saved in this browser. Your answers are still here — try again.');
      return;
    }
    setStorageError(null);
    setIsNavigating(true);
    router.push('/results');
  }

  const meta = STEP_META[step];
  const isLast = step === totalSteps - 1;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <main className="form-wizard" aria-labelledby={progressId}>
      <GlobeVisual className="form-wizard__globe" />

      <section className="form-wizard__layout">
        <header className="form-wizard__topline">
          <Text type="label" color="accent">
            {meta.eyebrow}
          </Text>
        </header>

        {storageError ? (
          <section className="form-wizard__storage-error">
            <Banner status="error" title="Couldn't save your snapshot" description={storageError} container="card" />
          </section>
        ) : null}

        <section className="form-wizard__stage" ref={stageRef} tabIndex={-1}>
          <article key={step} className="form-wizard__step" data-step={step}>
            <header className="form-wizard__intro">
              <Heading level={1} id={progressId} className="form-wizard__question" textWrap="balance">
                {meta.question}
              </Heading>
              <Text as="p" type="large" color="secondary" className="form-wizard__hint" textWrap="balance">
                {meta.hint}
              </Text>
            </header>

            <fieldset className="form-wizard__fields">
              <legend className="form-wizard__sr-only">{meta.question}</legend>

              {step === 0 && (
                <section data-field="businessName">
                  <TextInput
                    label="Business name"
                    isLabelHidden
                    size="lg"
                    value={values.businessName}
                    placeholder="e.g. Halcyon Studio"
                    hasAutoFocus
                    hasClear
                    status={visibleErrors.businessName ? { type: 'error', message: visibleErrors.businessName } : undefined}
                    statusVariant="attached"
                    onChange={(v) => update('businessName', v)}
                    onEnter={goNext}
                  />
                </section>
              )}

              {step === 1 && (
                <OptionGrid
                  field="businessType"
                  ariaLabel="Business type"
                  options={businessTypeOptions}
                  value={values.businessType}
                  onSelect={(v) => update('businessType', v)}
                  renderIcon={(value) => {
                    const Icon = businessTypeIcons[value];
                    return Icon ? <Icon className="option-card__icon" /> : null;
                  }}
                  error={visibleErrors.businessType}
                />
              )}

              {step === 2 && (
                <VStack gap={4} data-field="industry-location">
                  <section data-field="industry">
                    <Selector
                      label="Sector"
                      placeholder="Choose a sector"
                      size="lg"
                      hasSearch
                      searchPlaceholder="Search sectors..."
                      value={values.industry}
                      options={industryOptions.map((o) => ({ value: o.value, label: o.label }))}
                      onChange={(v) => update('industry', v)}
                      status={visibleErrors.industry ? { type: 'error', message: visibleErrors.industry } : undefined}
                    />
                  </section>
                  <section data-field="location">
                    <TextInput
                      label="Location"
                      size="lg"
                      value={values.location}
                      placeholder="City, region, or country"
                      hasClear
                      status={visibleErrors.location ? { type: 'error', message: visibleErrors.location } : undefined}
                      statusVariant="attached"
                      onChange={(v) => update('location', v)}
                      onEnter={goNext}
                    />
                  </section>
                </VStack>
              )}

              {step === 3 && (
                <OptionGrid
                  field="stage"
                  ariaLabel="Business stage"
                  options={stageOptions}
                  value={values.stage}
                  onSelect={(v) => update('stage', v as BusinessStage)}
                  renderIcon={(value) => {
                    const Icon = stageIcons[value as BusinessStage];
                    return Icon ? <Icon className="option-card__icon" /> : null;
                  }}
                  error={visibleErrors.stage}
                />
              )}

              {step === 4 && (
                <VStack gap={5}>
                  <OptionGrid
                    field="mainGoal"
                    ariaLabel="Main goal"
                    options={mainGoalOptions}
                    value={values.mainGoal}
                    onSelect={(v) => update('mainGoal', v)}
                    renderIcon={(value) => {
                      const Icon = mainGoalIcons[value];
                      return Icon ? <Icon className="option-card__icon" /> : null;
                    }}
                    error={visibleErrors.mainGoal}
                  />
                  <section data-field="helpNeeded">
                    <Selector
                      label="Where do you need help?"
                      placeholder="Choose one"
                      size="lg"
                      hasSearch
                      searchPlaceholder="Search..."
                      value={values.helpNeeded}
                      options={helpNeededOptions.map((o) => ({ value: o.value, label: o.label }))}
                      onChange={(v) => update('helpNeeded', v)}
                      status={visibleErrors.helpNeeded ? { type: 'error', message: visibleErrors.helpNeeded } : undefined}
                    />
                  </section>
                </VStack>
              )}

              {isLast && <ReviewSummary values={values} onEdit={goToStep} />}
            </fieldset>

            <nav className="form-wizard__actions" aria-label={isLast ? 'Submit navigation' : 'Step navigation'}>
              <Button
                variant="primary"
                size="lg"
                label={isLast ? 'See opportunities' : 'Continue'}
                className="form-wizard__continue"
                isLoading={isNavigating}
                onClick={isLast ? handleSubmit : goNext}
                endContent={
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                }
              />
            </nav>
          </article>
        </section>
      </section>

      <footer className="form-wizard__dock" aria-label="Journey progress">
        <HStack hAlign="between" vAlign="center" className="form-wizard__dock-head">
          <Text type="label" color="secondary">
            Journey
          </Text>
          <Text type="label" color="primary">
            {progress}%
          </Text>
        </HStack>
        <progress className="form-wizard__progress-bar" value={progress} max="100" aria-label={`Journey progress: ${progress}%`}>
          {progress}%
        </progress>
      </footer>
    </main>
  );
}

type OptionGridProps = {
  field: keyof Values;
  ariaLabel: string;
  options: ReadonlyArray<{ value: string; label: string; description?: string; isFull?: boolean }>;
  value: string;
  onSelect: (value: string) => void;
  renderIcon: (value: string) => React.ReactNode;
  error?: string;
};

function OptionGrid({ field, ariaLabel, options, value, onSelect, renderIcon, error }: OptionGridProps) {
  return (
    <VStack gap={3} data-field={field} role="group" aria-label={ariaLabel}>
      <VStack gap={2} className="option-list">
        {options.map((option, index) => {
          const selected = value === option.value;
          return (
            <article
              className="option-card"
              key={option.value}
              style={{ '--option-index': index } as CSSProperties}
            >
              <SelectableCard
                label={option.label}
                isSelected={selected}
                onChange={(isSelected) => {
                  if (isSelected) onSelect(option.value);
                }}
                variant="transparent"
                padding={0}
              >
                <section className="option-card__body">
                  {renderIcon(option.value)}
                  <section className="option-card__text">
                    <Text type="body" weight="medium" className="option-card__label">
                      {option.label}
                    </Text>
                    {option.description ? (
                      <Text type="supporting" className="option-card__desc" textWrap="balance">
                        {option.description}
                      </Text>
                    ) : null}
                  </section>
                  <i className="option-card__check" aria-hidden="true">
                    <svg {...iconProps}>
                      <path d="m5 12 4 4 10-10" />
                    </svg>
                  </i>
                </section>
              </SelectableCard>
            </article>
          );
        })}
      </VStack>
      {error ? <FieldStatus type="error" message={error} variant="detached" /> : null}
    </VStack>
  );
}

type ReviewSummaryProps = {
  values: Values;
  onEdit: (step: number) => void;
};

const REVIEW_ROWS: Array<{ field: keyof Values; label: string; step: number; optional?: boolean }> = [
  { field: 'businessName', label: 'Business name', step: 0 },
  { field: 'businessType', label: 'Business type', step: 1 },
  { field: 'industry', label: 'Sector', step: 2 },
  { field: 'location', label: 'Location', step: 2 },
  { field: 'stage', label: 'Stage', step: 3 },
  { field: 'mainGoal', label: 'Main goal', step: 4 },
  { field: 'helpNeeded', label: 'Help needed', step: 4 },
];

function ReviewSummary({ values, onEdit }: ReviewSummaryProps) {
  return (
    <ul className="review">
      {REVIEW_ROWS.map((row) => {
        const raw = values[row.field];
        const display = labelForField(row.field, typeof raw === 'string' ? raw : undefined) || 'Not provided';
        const isPlaceholder = display === 'Not provided';
        return (
          <li className="review__row" key={row.field}>
            <Text as="p" type="label" color="secondary" className="review__label">
              {row.label}
            </Text>
            <Text as="p" type="body" color={isPlaceholder ? 'disabled' : 'primary'} className="review__value" textWrap="balance">
              {display}
            </Text>
            <Button variant="ghost" size="sm" label="Edit" onClick={() => onEdit(row.step)} className="review__edit" />
          </li>
        );
      })}
    </ul>
  );
}
