import { notFound } from 'next/navigation';
import { BusinessNeedsForm } from '@/components/form/business-needs-form';

const STEP_ROUTES = new Set(['step-1', 'step-2', 'step-3', 'step-4', 'step-5']);

export default async function FormStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!STEP_ROUTES.has(step)) notFound();

  return <BusinessNeedsForm initialStep={Number(step.replace('step-', '')) - 1} />;
}
