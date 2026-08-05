'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronDown,
  CircleHelp,
  DollarSign,
  Globe2,
  Handshake,
  Lightbulb,
  MapPin,
  Megaphone,
  Plus,
  Square,
  TrendingUp,
} from 'lucide-react';
import { Globe, FORM_GLOBE_CONFIG } from '@/components/ui/globe';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { TextAnimate } from '@/components/magicui/text-animate';
import { normalizeBusinessNeeds } from '@/lib/business-needs-schema';
import { loadBusinessNeeds, saveBusinessNeeds } from '@/lib/session-store';
import {
  businessTypeOptions,
  helpNeededOptions,
  industryOptions,
  mainGoalOptions,
  stageOptions,
  type FormOption,
} from '@/data/form-options';
import type { BusinessNeedsInput, BusinessStage } from '@/lib/types';
import { cn } from '@/lib/utils';

type FormValues = {
  businessName: string;
  businessType: string;
  industry: string;
  location: string;
  stage: BusinessStage | '';
  mainGoal: string;
  helpNeeded: string;
  description: string;
};

type FieldName = keyof FormValues;

const EMPTY_VALUES: FormValues = {
  businessName: '',
  businessType: '',
  industry: '',
  location: '',
  stage: '',
  mainGoal: '',
  helpNeeded: '',
  description: '',
};

const DRAFT_KEY = 'ludavia-form-draft:v2';
const TOTAL_STEPS = 5;

const STEP_FIELDS: ReadonlyArray<ReadonlyArray<FieldName>> = [
  ['businessName'],
  ['businessType'],
  ['industry', 'location'],
  ['stage'],
  ['mainGoal', 'helpNeeded'],
];

const STEP_META = [
  { eyebrow: 'Start', lead: 'What should we', highlightLead: 'call', highlight: 'your business?', highlightTail: undefined, hint: 'A name gives the snapshot somewhere to begin.' },
  { eyebrow: 'Model', lead: 'What kind of', highlightLead: undefined, highlight: 'business', highlightTail: 'is it?', hint: 'Choose the closest fit. Nothing is permanent.' },
  { eyebrow: 'Market', lead: 'Where do you', highlightLead: undefined, highlight: 'operate?', highlightTail: undefined, hint: 'Tell us your sector and where you call home.' },
  { eyebrow: 'Stage', lead: 'Where are you in', highlightLead: undefined, highlight: 'the journey?', highlightTail: undefined, hint: 'Meet the business where it is today.' },
  { eyebrow: 'Focus', lead: 'What would', highlightLead: undefined, highlight: 'move it forward?', highlightTail: undefined, hint: 'Pick the goal and kind of support that matters most.' },
] as const;

const businessTypeIcons: Record<string, LucideIcon> = {
  'product-saas': Building2,
  'service-agency': Handshake,
  'retail-ecommerce': Globe2,
  marketplace: ArrowUpRight,
  other: CircleHelp,
};

const stageIcons: Record<BusinessStage, LucideIcon> = {
  idea: Lightbulb,
  early: ArrowUpRight,
  growing: TrendingUp,
  established: Square,
};

const mainGoalIcons: Record<string, LucideIcon> = {
  'find-customers': Megaphone,
  'raise-capital': DollarSign,
  'hire-talent': Plus,
  'find-partners': Handshake,
  'expand-market': Globe2,
};

function getDraft(): { step: number; values: FormValues } | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { step?: number; values?: Partial<FormValues> };
    if (typeof parsed.step !== 'number' || !parsed.values) return null;

    const stage = parsed.values.stage;
    const validStage = stage === 'idea' || stage === 'early' || stage === 'growing' || stage === 'established' ? stage : '';

    return {
      step: Math.min(Math.max(Math.round(parsed.step), 0), TOTAL_STEPS - 1),
      values: { ...EMPTY_VALUES, ...parsed.values, stage: validStage },
    };
  } catch {
    return null;
  }
}

function saveDraft(step: number, values: FormValues) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, values }));
  } catch {
    // Draft persistence is best effort in a private prototype.
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore storage restrictions; the session handoff is still attempted.
  }
}

function focusFirstInvalid(field: FieldName) {
  const wrapper = document.querySelector<HTMLElement>(`[data-field="${field}"]`);
  if (!wrapper) return;
  const target = wrapper.querySelector<HTMLElement>('input, select, textarea, button');
  target?.focus({ preventScroll: true });
  wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

export function BusinessNeedsForm({ initialStep = 0 }: { initialStep?: number }) {
  const router = useRouter();
  const headingId = useId();
  const startingStep = Math.min(Math.max(Math.round(initialStep), 0), TOTAL_STEPS - 1);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(startingStep);
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = loadBusinessNeeds();
      const draft = getDraft();
      const requestedStep = Number(new URLSearchParams(window.location.search).get('step')) - 1;
      const hasRequestedStep = Number.isInteger(requestedStep) && requestedStep >= 0 && requestedStep < TOTAL_STEPS;

      if (draft) {
        setStep(hasRequestedStep ? requestedStep : draft.step);
        setValues(draft.values);
      } else if (saved) {
        setStep(hasRequestedStep ? requestedStep : startingStep);
        setValues({ ...saved, description: saved.description ?? '' });
      } else {
        setStep(hasRequestedStep ? requestedStep : startingStep);
      }

      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [startingStep]);

  useEffect(() => {
    if (hydrated) saveDraft(step, values);
  }, [hydrated, step, values]);

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStorageError(null);
  }

  function validateCurrentStep() {
    const result = normalizeBusinessNeeds(values);
    const nextErrors: Partial<Record<FieldName, string>> = {};
    let firstInvalid: FieldName | null = null;

    for (const field of STEP_FIELDS[step]) {
      const message = result.success ? undefined : result.errors[field as keyof BusinessNeedsInput];
      if (message) {
        nextErrors[field] = message;
        if (!firstInvalid) firstInvalid = field;
      }
    }

    setErrors(nextErrors);
    if (firstInvalid) {
      setAttempted(true);
      focusFirstInvalid(firstInvalid);
      return false;
    }

    return true;
  }

  function submitSnapshot() {
    const result = normalizeBusinessNeeds(values);
    if (!result.success) {
      const nextErrors: Partial<Record<FieldName, string>> = {};
      const fieldOrder: FieldName[] = ['businessName', 'businessType', 'industry', 'location', 'stage', 'mainGoal', 'helpNeeded'];
      const firstInvalid = fieldOrder.find((field) => result.errors[field as keyof BusinessNeedsInput]);

      for (const field of fieldOrder) {
        const message = result.errors[field as keyof BusinessNeedsInput];
        if (message) nextErrors[field] = message;
      }

      setErrors(nextErrors);
      setAttempted(true);
      if (firstInvalid) {
        const targetStep = STEP_FIELDS.findIndex((fields) => fields.includes(firstInvalid));
        setStep(targetStep < 0 ? 0 : targetStep);
        requestAnimationFrame(() => focusFirstInvalid(firstInvalid));
      }
      return;
    }

    clearDraft();
    if (!saveBusinessNeeds(result.data)) {
      setStorageError('Your snapshot could not be saved in this browser. Try again or allow session storage.');
      return;
    }

    setStorageError(null);
    setIsNavigating(true);
    router.push('/results');
  }

  function handleContinue() {
    setAttempted(true);
    if (!validateCurrentStep()) return;

    setAttempted(false);
    setErrors({});
    if (step === TOTAL_STEPS - 1) {
      submitSnapshot();
      return;
    }

    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack() {
    if (step === 0) {
      router.push('/');
      return;
    }
    setAttempted(false);
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const meta = STEP_META[step];

  return (
    <main className="form-page relative min-h-[100dvh] overflow-hidden bg-ink text-warm">
      <div className="noise-layer" />
      <DotPattern width={20} height={20} cx={1} cy={1} cr={0.75} className="form-dot-pattern" />
      <section className="form-shell relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[72rem] flex-col overflow-hidden">
        {step === 0 ? (
          <div className="form-globe-stage" aria-hidden="true">
            <Globe config={FORM_GLOBE_CONFIG} className="form-globe pointer-events-none left-1/2 z-0 -translate-x-1/2" />
          </div>
        ) : null}

        <header className="form-header relative z-20 flex items-center gap-4 px-5 pb-5 pt-5 sm:gap-7 sm:px-9 sm:pb-7 sm:pt-8">
          <button type="button" className="form-back icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white transition hover:border-white/30 hover:bg-white/[0.08]" aria-label={step === 0 ? 'Back to welcome page' : 'Go to previous step'} onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="form-progress flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, index) => (
              <button
                type="button"
                key={index}
                className="progress-segment min-w-0 flex-1"
                data-complete={index <= step}
                aria-label={`Go to step ${index + 1}`}
                onClick={() => {
                  if (index < step) {
                    setAttempted(false);
                    setErrors({});
                    setStep(index);
                  }
                }}
              />
            ))}
          </div>
          <div className="form-step-count flex shrink-0 items-center gap-2">
            <p className="text-xs text-white/70 sm:text-sm">Step {step + 1} <span className="text-white/35">of</span> {TOTAL_STEPS}</p>
          </div>
        </header>

        <form className="form-body flex min-h-0 flex-1 flex-col" onSubmit={(event) => { event.preventDefault(); handleContinue(); }}>
          <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className={cn('form-step-content flex flex-1 flex-col px-5 pb-8 sm:px-9 sm:pb-9', step > 0 && 'form-step-content--detail')}>
            <StepHeading id={headingId} meta={meta} />

            <fieldset className="min-w-0 flex-1" aria-labelledby={headingId}>
              <legend className="sr-only">{meta.lead} {meta.highlightLead ? `${meta.highlightLead} ` : ''}{meta.highlight}{meta.highlightTail ? ` ${meta.highlightTail}` : ''}</legend>
              {step === 0 ? (
                <div data-field="businessName">
                  <TextField
                    id="businessName"
                    label="Business name"
                    placeholder="e.g. Halcyon Studio"
                    value={values.businessName}
                    error={attempted ? errors.businessName : undefined}
                    autoFocus
                    onChange={(value) => update('businessName', value)}
                  />
                </div>
              ) : null}

              {step === 1 ? (
                <ChoiceGrid
                  field="businessType"
                  ariaLabel="Business type"
                  options={businessTypeOptions}
                  value={values.businessType}
                  icons={businessTypeIcons}
                  error={attempted ? errors.businessType : undefined}
                  onSelect={(value) => update('businessType', value)}
                />
              ) : null}

              {step === 2 ? (
                <div className="grid gap-4" data-field="industry-location">
                  <SelectField
                    id="industry"
                    label="Sector"
                    placeholder="Choose a sector"
                    options={industryOptions}
                    value={values.industry}
                    icon={Building2}
                    error={attempted ? errors.industry : undefined}
                    onChange={(value) => update('industry', value)}
                  />
                  <div data-field="location">
                    <TextField
                      id="location"
                      label="Location"
                      placeholder="City, region, or country"
                      value={values.location}
                      icon={MapPin}
                      error={attempted ? errors.location : undefined}
                      onChange={(value) => update('location', value)}
                    />
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <ChoiceGrid
                  field="stage"
                  ariaLabel="Business stage"
                  options={stageOptions}
                  value={values.stage}
                  icons={stageIcons}
                  error={attempted ? errors.stage : undefined}
                  onSelect={(value) => update('stage', value as BusinessStage)}
                />
              ) : null}

              {step === 4 ? (
                <div className="grid gap-5">
                  <ChoiceGrid
                    field="mainGoal"
                    ariaLabel="Main goal"
                    options={mainGoalOptions}
                    value={values.mainGoal}
                    icons={mainGoalIcons}
                    error={attempted ? errors.mainGoal : undefined}
                    onSelect={(value) => update('mainGoal', value)}
                  />
                  <div data-field="helpNeeded">
                    <SelectField
                      id="helpNeeded"
                      label="Where do you need help?"
                      placeholder="Choose one"
                      options={helpNeededOptions}
                      value={values.helpNeeded}
                      icon={CircleHelp}
                      error={attempted ? errors.helpNeeded : undefined}
                      onChange={(value) => update('helpNeeded', value)}
                    />
                  </div>
                  <TextAreaField
                    id="description"
                    label="Anything else? (optional)"
                    placeholder="A little more context can sharpen the snapshot."
                    value={values.description}
                    maxLength={500}
                    onChange={(value) => update('description', value)}
                  />
                </div>
              ) : null}
            </fieldset>

            {storageError ? (
              <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-rose-300" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {storageError}
              </p>
            ) : null}

            <div className="mt-8 sm:mt-10">
              <button type="submit" className="onboarding-action" disabled={isNavigating}>
                <span>{isNavigating ? 'Saving snapshot' : 'Continue'}</span>
                <span className="onboarding-action__arrow" aria-hidden="true"><ArrowRight /></span>
              </button>
            </div>
          </motion.div>
        </form>

      </section>
    </main>
  );
}

function StepHeading({ id, meta }: { id: string; meta: (typeof STEP_META)[number] }) {
  return (
    <div className="onboarding-heading">
      <p className="onboarding-eyebrow">{meta.eyebrow}</p>
      <h1 id={id}>
        <span className="onboarding-heading__line"><TextAnimate>{meta.lead}</TextAnimate></span>
        <span className="onboarding-heading__line onboarding-heading__line--answer">
          {meta.highlightLead ? <span className="onboarding-heading__plain"><TextAnimate>{meta.highlightLead}</TextAnimate></span> : null}
          <span className="onboarding-heading__accent"><TextAnimate>{meta.highlight}</TextAnimate></span>
          {meta.highlightTail ? <span className="onboarding-heading__plain"><TextAnimate>{meta.highlightTail}</TextAnimate></span> : null}
        </span>
      </h1>
      <p className="onboarding-hint">{meta.hint}</p>
    </div>
  );
}

type ChoiceGridProps = {
  field: FieldName;
  ariaLabel: string;
  options: ReadonlyArray<FormOption>;
  value: string;
  icons: Record<string, LucideIcon>;
  error?: string;
  onSelect: (value: string) => void;
};

function ChoiceGrid({ field, ariaLabel, options, value, icons, error, onSelect }: ChoiceGridProps) {
  return (
    <div data-field={field}>
      <div className="grid gap-2.5" role="radiogroup" aria-label={ariaLabel}>
        {options.map((option) => {
          const selected = option.value === value;
          const Icon = icons[option.value];

          return (
            <button
              type="button"
              key={option.value}
              className="choice-card group flex min-h-[4.75rem] w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left sm:px-5"
              data-selected={selected}
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(option.value)}
            >
              <span className="radio-dot inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full" aria-hidden="true" />
              {Icon ? (
                <span className="choice-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.035] text-white/60 transition-colors">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block text-[0.98rem] font-semibold text-white">{option.label}</span>
                {option.description ? <span className="mt-1 block text-sm leading-5 text-white/55">{option.description}</span> : null}
              </span>
              {selected ? <span className="choice-selected-indicator h-2.5 w-2.5 shrink-0 rounded-full bg-violet-bright shadow-[0_0_14px_rgba(164,109,255,0.75)]" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-3 flex items-center gap-2 text-sm text-rose-300" role="alert"><AlertCircle className="h-4 w-4" aria-hidden="true" />{error}</p> : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  autoFocus?: boolean;
  icon?: LucideIcon;
  onChange: (value: string) => void;
};

function TextField({ id, label, placeholder, value, error, autoFocus, icon: Icon, onChange }: TextFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <span className="relative block">
        {Icon ? <Icon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-bright" strokeWidth={1.5} aria-hidden="true" /> : null}
        <input id={id} className={cn('form-input rounded-2xl px-5 py-5 text-base sm:text-lg', Icon && 'pl-14')} value={value} placeholder={placeholder} autoFocus={autoFocus} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} />
      </span>
      {error ? <span id={`${id}-error`} className="mt-2 block text-sm text-rose-300" role="alert">{error}</span> : null}
    </label>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  options: ReadonlyArray<FormOption>;
  value: string;
  error?: string;
  icon: LucideIcon;
  onChange: (value: string) => void;
};

function SelectField({ id, label, placeholder, options, value, error, icon: Icon, onChange }: SelectFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-violet-bright" strokeWidth={1.5} aria-hidden="true" />
        <select id={id} className="form-select appearance-none rounded-2xl px-5 py-5 pl-14 pr-12 text-base text-white sm:text-lg" value={value} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)}>
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/75" aria-hidden="true" />
      </span>
      {error ? <span id={`${id}-error`} className="mt-2 block text-sm text-rose-300" role="alert">{error}</span> : null}
    </label>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
};

function TextAreaField({ id, label, placeholder, value, maxLength, onChange }: TextAreaFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{label}</span>
      <textarea id={id} className="form-textarea min-h-24 resize-y rounded-2xl px-5 py-4 text-base leading-6" value={value} placeholder={placeholder} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
      <span className="mt-2 block text-right text-xs text-white/35">{value.length}/{maxLength}</span>
    </label>
  );
}
