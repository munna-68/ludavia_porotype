'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { TextArea } from '@astryxdesign/core/TextArea';
import { Selector } from '@astryxdesign/core/Selector';
import { SelectableCard } from '@astryxdesign/core/SelectableCard';
import { FieldStatus } from '@astryxdesign/core/FieldStatus';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { GridSpan } from '@astryxdesign/core/Grid';
import { normalizeBusinessNeeds } from '@/lib/business-needs-schema';
import { loadBusinessNeeds } from '@/lib/session-store';
import type { BusinessNeedsInput, BusinessStage } from '@/lib/types';
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
  ['description'],
  [],
];

const STEP_META = [
  { eyebrow: 'Start', question: 'What should we call your business?', hint: 'Your business name sets the stage. You can change it later.' },
  { eyebrow: 'About', question: 'What best describes your business?', hint: 'Pick the one that feels closest.' },
  { eyebrow: 'Market', question: 'Where do you operate?', hint: 'Your sector and the place you call home.' },
  { eyebrow: 'Stage', question: 'How far along is your business?', hint: 'There is no wrong answer — we meet you where you are.' },
  { eyebrow: 'Goal', question: 'What are you working toward right now?', hint: 'Your headline aim, and the help that would move the needle.' },
  { eyebrow: 'Context', question: 'Anything else we should know?', hint: 'Optional. A line or two can sharpen your growth snapshot.' },
  { eyebrow: 'Review', question: 'Review your details', hint: 'Make sure everything looks right, then see your opportunities.' },
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

const DESCRIPTION_LIMIT = 500;

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

export type BusinessNeedsFormProps = {
  onSubmit?: (values: Values) => void;
};

export function BusinessNeedsForm({ onSubmit }: BusinessNeedsFormProps) {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const progressId = useId();

  const stageRef = useRef<HTMLDivElement>(null);

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

  function goBack() {
    setAttempted(false);
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function goToStep(target: number) {
    setAttempted(false);
    setErrors({});
    setStep(Math.min(Math.max(target, 0), totalSteps - 1));
  }

  function handleSubmit() {
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
    onSubmit?.(result.data as Values);
  }

  const meta = STEP_META[step];
  const isLast = step === totalSteps - 1;
  const isFirst = step === 0;
  const progress = Math.round((step / (totalSteps - 1)) * 100);

  return (
    <main className="form-wizard" aria-labelledby={progressId}>
      <VStack gap={2} className="form-wizard__progress">
        <HStack hAlign="between" vAlign="center" className="form-wizard__progress-head">
          <Text type="label" color="accent">
            {meta.eyebrow}
          </Text>
          <Text type="label" color="secondary">
            Step {step + 1} / {totalSteps}
          </Text>
        </HStack>
        <div className="form-wizard__track" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label="Form progress">
          <span className="form-wizard__track-fill" style={{ width: `${progress}%` }} />
        </div>
      </VStack>

      <div className="form-wizard__stage" ref={stageRef} tabIndex={-1}>
        <div key={step} className="form-wizard__step" data-step={step}>
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
              <div data-field="businessName">
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
              </div>
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
                <span data-field="industry">
                  <Selector
                    label="Sector"
                    placeholder="Choose a sector"
                    size="lg"
                    hasSearch
                    searchPlaceholder="Search sectors…"
                    value={values.industry}
                    options={industryOptions.map((o) => ({ value: o.value, label: o.label }))}
                    onChange={(v) => update('industry', v)}
                    status={visibleErrors.industry ? { type: 'error', message: visibleErrors.industry } : undefined}
                  />
                </span>
                <span data-field="location">
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
                </span>
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
                minColWidth={200}
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
                  minColWidth={200}
                  error={visibleErrors.mainGoal}
                />
                <span data-field="helpNeeded">
                  <Selector
                    label="Where do you need help?"
                    placeholder="Choose one"
                    size="lg"
                    hasSearch
                    searchPlaceholder="Search…"
                    value={values.helpNeeded}
                    options={helpNeededOptions.map((o) => ({ value: o.value, label: o.label }))}
                    onChange={(v) => update('helpNeeded', v)}
                    status={visibleErrors.helpNeeded ? { type: 'error', message: visibleErrors.helpNeeded } : undefined}
                  />
                </span>
              </VStack>
            )}

            {step === 5 && (
              <div data-field="description">
                <TextArea
                  label="Anything else?"
                  isLabelHidden
                  size="lg"
                  rows={4}
                  maxLength={DESCRIPTION_LIMIT}
                  value={values.description ?? ''}
                  placeholder="A sentence on what makes your business unique, what you are stuck on, or who your customer is."
                  onChange={(v) => update('description', v.slice(0, DESCRIPTION_LIMIT))}
                  width="100%"
                />
              </div>
            )}

            {step === 6 && (
              <ReviewSummary values={values} onEdit={goToStep} />
            )}
          </fieldset>

          {!isLast && (
            <nav className="form-wizard__actions" aria-label="Step navigation">
              <Button
                variant="ghost"
                size="lg"
                label="Back"
                isDisabled={isFirst}
                onClick={goBack}
              />
              <Button variant="primary" size="lg" label="Continue" onClick={goNext} />
            </nav>
          )}

          {isLast && (
            <nav className="form-wizard__actions" aria-label="Submit navigation">
              <Button variant="ghost" size="lg" label="Back" onClick={goBack} />
              <Button variant="primary" size="lg" label="See opportunities" onClick={handleSubmit} />
            </nav>
          )}
        </div>
      </div>
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
  minColWidth?: number;
  error?: string;
};

function OptionGrid({ field, ariaLabel, options, value, onSelect, renderIcon, minColWidth = 220, error }: OptionGridProps) {
  return (
    <VStack gap={3} data-field={field} role="group" aria-label={ariaLabel}>
      <Grid columns={{ minWidth: minColWidth }} gap={3} align="stretch">
        {options.map((option) => {
          const selected = value === option.value;
          const card = (
            <SelectableCard
              key={option.value}
              label={option.label}
              isSelected={selected}
              onChange={(isSelected) => {
                if (isSelected) onSelect(option.value);
              }}
              variant="default"
              padding={0}
            >
              <span className="option-card__body">
                {renderIcon(option.value)}
                <span className="option-card__text">
                  <Text type="body" weight="medium" className="option-card__label">
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text type="supporting" className="option-card__desc" textWrap="balance">
                      {option.description}
                    </Text>
                  ) : null}
                </span>
                <span className="option-card__check" aria-hidden="true">
                  <svg {...iconProps}>
                    <path d="m5 12 4 4 10-10" />
                  </svg>
                </span>
              </span>
            </SelectableCard>
          );
          return option.isFull ? <GridSpan key={option.value} columns="full">{card}</GridSpan> : card;
        })}
      </Grid>
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
  { field: 'description', label: 'Notes', step: 5, optional: true },
];

function ReviewSummary({ values, onEdit }: ReviewSummaryProps) {
  return (
    <dl className="review">
      {REVIEW_ROWS.map((row) => {
        const raw = values[row.field];
        const display =
          row.field === 'description'
            ? raw && raw.trim() ? raw : 'Not provided'
            : labelForField(row.field, typeof raw === 'string' ? raw : undefined) || 'Not provided';
        const isPlaceholder = display === 'Not provided';
        return (
          <div className="review__row" key={row.field}>
            <div className="review__label">
              <Text type="label" color="secondary">
                {row.label}
              </Text>
              {row.optional ? <Text type="label" color="disabled">Optional</Text> : null}
            </div>
            <Text as="div" type="body" color={isPlaceholder ? 'disabled' : 'primary'} className="review__value" textWrap="balance">
              {display}
            </Text>
            <Button variant="ghost" size="sm" label="Edit" onClick={() => onEdit(row.step)} className="review__edit" />
          </div>
        );
      })}
    </dl>
  );
}
