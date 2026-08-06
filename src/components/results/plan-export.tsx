'use client';

import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Check, Download } from 'lucide-react';
import { labelForField } from '@/data/form-options';
import { sampleConnection } from '@/data/sample-connection';
import { sampleOpportunity } from '@/data/sample-opportunity';
import { personalize } from '@/lib/personalize';
import type { BusinessNeedsInput, GrowthSummaryResult } from '@/lib/types';

type ExportState = 'idle' | 'saving' | 'saved' | 'error';

type PlanExportProps = {
  values: BusinessNeedsInput;
  result: GrowthSummaryResult;
};

const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 42,
};

const COLORS = {
  ink: [10, 9, 13] as const,
  panel: [21, 20, 27] as const,
  panelRaised: [27, 23, 31] as const,
  warm: [243, 241, 237] as const,
  muted: [167, 163, 174] as const,
  subtle: [112, 107, 121] as const,
  line: [72, 67, 80] as const,
  violet: [78, 29, 142] as const,
  violetBright: [164, 109, 255] as const,
};

export function PlanExport({ values, result }: PlanExportProps) {
  const [state, setState] = useState<ExportState>('idle');

  async function savePlan() {
    if (state === 'saving') return;

    setState('saving');

    try {
      const { jsPDF } = await import('jspdf');
      const document = new jsPDF({ unit: 'pt', format: 'a4' });
      const industry = labelForField('industry', values.industry) || 'Your sector';
      const businessType = labelForField('businessType', values.businessType) || 'Business';
      const stage = labelForField('stage', values.stage) || 'Current';
      const goal = labelForField('mainGoal', values.mainGoal) || 'Move forward';
      const support = labelForField('helpNeeded', values.helpNeeded) || 'Focused support';
      const opportunityScope = personalize(sampleOpportunity.scope, values);
      const connectionContext = personalize(sampleConnection.mutualContext, values);
      const connectionWhy = personalize(sampleConnection.whyConnect, values);

      drawPage(document, {
        businessName: values.businessName.trim() || 'Your business',
        businessType,
        industry,
        location: values.location.trim() || 'Your market',
        stage,
        goal,
        support,
        summary: result.summary,
        source: result.source === 'gemini' ? 'Live insight' : 'Prepared insight',
        nextStep: result.recommendedNextStep,
        opportunityScope,
        connectionContext,
        connectionWhy,
      });

      document.save(`${toFilename(values.businessName)}-ludavia-plan.pdf`);
      setState('saved');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="plan-export">
      <Button
        className="next-step-panel__save"
        label={state === 'saving' ? 'Preparing plan...' : 'Save the plan'}
        variant="secondary"
        size="sm"
        isDisabled={state === 'saving'}
        isLoading={state === 'saving'}
        icon={state === 'saved' ? <Check aria-hidden="true" /> : <Download aria-hidden="true" />}
        onClick={savePlan}
      />
      {state === 'saved' ? <p className="plan-export__status" role="status">Your one-page plan was downloaded.</p> : null}
      {state === 'error' ? <p className="plan-export__status" role="status">The plan could not be downloaded. Try again.</p> : null}
    </div>
  );
}

type BriefData = {
  businessName: string;
  businessType: string;
  industry: string;
  location: string;
  stage: string;
  goal: string;
  support: string;
  summary: string;
  source: string;
  nextStep: GrowthSummaryResult['recommendedNextStep'];
  opportunityScope: string;
  connectionContext: string;
  connectionWhy: string;
};

function drawPage(document: import('jspdf').jsPDF, data: BriefData) {
  const contentWidth = PAGE.width - PAGE.margin * 2;
  let y = PAGE.margin;

  document.setFillColor(...COLORS.ink);
  document.rect(0, 0, PAGE.width, PAGE.height, 'F');
  document.setFillColor(...COLORS.violet);
  document.rect(0, 0, PAGE.width, 7, 'F');

  document.setTextColor(...COLORS.warm);
  document.setFont('helvetica', 'bold');
  document.setFontSize(24);
  document.text('LudaVia', PAGE.margin, y + 8);
  document.setTextColor(...COLORS.violetBright);
  document.setFont('helvetica', 'bold');
  document.setFontSize(8);
  document.text('EXECUTIVE BRIEF', PAGE.width - PAGE.margin, y + 5, { align: 'right' });
  document.setTextColor(...COLORS.subtle);
  document.setFont('helvetica', 'normal');
  document.setFontSize(8);
  document.text('A focused growth snapshot for the next decision', PAGE.width - PAGE.margin, y + 18, { align: 'right' });
  y += 54;

  document.setTextColor(...COLORS.violetBright);
  document.setFont('helvetica', 'bold');
  document.setFontSize(8);
  document.text('BUSINESS SNAPSHOT', PAGE.margin, y);
  y += 14;
  drawPanel(document, PAGE.margin, y, contentWidth, 82, COLORS.panel);
  document.setTextColor(...COLORS.warm);
  document.setFont('helvetica', 'bold');
  document.setFontSize(16);
  document.text(toPdfText(data.businessName), PAGE.margin + 16, y + 23);
  document.setTextColor(...COLORS.muted);
  document.setFont('helvetica', 'normal');
  document.setFontSize(9);
  document.text(`${toPdfText(data.businessType)}  /  ${toPdfText(data.industry)}  /  ${toPdfText(data.location)}`, PAGE.margin + 16, y + 40);
  document.setTextColor(...COLORS.subtle);
  document.setFontSize(8);
  document.text(`Stage: ${toPdfText(data.stage)}    Focus: ${toPdfText(data.goal)}    Support: ${toPdfText(data.support)}`, PAGE.margin + 16, y + 61);
  y += 110;

  document.setTextColor(...COLORS.violetBright);
  document.setFont('helvetica', 'bold');
  document.setFontSize(8);
  document.text(`VIA21  /  ${toPdfText(data.source).toUpperCase()}`, PAGE.margin, y);
  y += 14;
  drawPanel(document, PAGE.margin, y, contentWidth, 132, COLORS.panelRaised);
  document.setTextColor(...COLORS.warm);
  document.setFont('helvetica', 'bold');
  document.setFontSize(15);
  document.text('A clearer view of what comes next.', PAGE.margin + 16, y + 24);
  y = writeClamped(document, data.summary, PAGE.margin + 16, y + 44, contentWidth - 32, 10, 14, COLORS.muted, 6);
  y = Math.max(y, PAGE.margin + 54 + 110 + 14 + 132 - 16);
  y += 32;

  document.setTextColor(...COLORS.violetBright);
  document.setFont('helvetica', 'bold');
  document.setFontSize(8);
  document.text('ILLUSTRATIVE PATHS', PAGE.margin, y);
  y += 14;
  const columnGap = 12;
  const columnWidth = (contentWidth - columnGap) / 2;
  drawPanel(document, PAGE.margin, y, columnWidth, 146, COLORS.panel);
  drawPanel(document, PAGE.margin + columnWidth + columnGap, y, columnWidth, 146, COLORS.panel);

  drawSmallHeading(document, 'Illustrative opportunity', PAGE.margin + 14, y + 20);
  drawText(document, sampleOpportunity.title, PAGE.margin + 14, y + 43, columnWidth - 28, 12, 15, COLORS.warm, true, 2);
  drawText(document, sampleOpportunity.organization, PAGE.margin + 14, y + 73, columnWidth - 28, 8, 12, COLORS.subtle, false, 1);
  writeClamped(document, data.opportunityScope, PAGE.margin + 14, y + 94, columnWidth - 28, 8, 11, COLORS.muted, 3);

  const connectionX = PAGE.margin + columnWidth + columnGap + 14;
  drawSmallHeading(document, 'Illustrative connection', connectionX, y + 20);
  drawText(document, sampleConnection.name, connectionX, y + 43, columnWidth - 28, 12, 15, COLORS.warm, true, 2);
  drawText(document, `${sampleConnection.role} / ${sampleConnection.organization}`, connectionX, y + 73, columnWidth - 28, 8, 11, COLORS.subtle, false, 1);
  writeClamped(document, `${data.connectionContext} ${data.connectionWhy}`, connectionX, y + 94, columnWidth - 28, 8, 11, COLORS.muted, 3);
  y += 174;

  document.setTextColor(...COLORS.violetBright);
  document.setFont('helvetica', 'bold');
  document.setFontSize(8);
  document.text('RECOMMENDED NEXT MOVE', PAGE.margin, y);
  y += 14;
  drawPanel(document, PAGE.margin, y, contentWidth, 112, COLORS.panelRaised, COLORS.violetBright);
  document.setTextColor(...COLORS.warm);
  document.setFont('helvetica', 'bold');
  document.setFontSize(14);
  document.text(toPdfText(data.nextStep.title), PAGE.margin + 16, y + 24);
  writeClamped(document, data.nextStep.detail, PAGE.margin + 16, y + 47, contentWidth - 32, 9, 13, COLORS.muted, 4);

  document.setTextColor(...COLORS.subtle);
  document.setFont('helvetica', 'normal');
  document.setFontSize(7.5);
  document.text('Illustrative prototype content. No introduction is sent and no account or contact is created.', PAGE.margin, PAGE.height - 28);
  document.text('LudaVia  /  Via21 growth briefing', PAGE.width - PAGE.margin, PAGE.height - 28, { align: 'right' });
}

function drawPanel(
  document: import('jspdf').jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: readonly [number, number, number],
  leftRule?: readonly [number, number, number],
) {
  document.setFillColor(...fill);
  document.setDrawColor(...COLORS.line);
  document.setLineWidth(0.6);
  document.roundedRect(x, y, width, height, 8, 8, 'FD');

  if (leftRule) {
    document.setFillColor(...leftRule);
    document.roundedRect(x, y, 3, height, 1.5, 1.5, 'F');
  }
}

function drawSmallHeading(document: import('jspdf').jsPDF, text: string, x: number, y: number) {
  document.setTextColor(...COLORS.violetBright);
  document.setFont('helvetica', 'bold');
  document.setFontSize(7);
  document.text(toPdfText(text).toUpperCase(), x, y);
}

function drawText(
  document: import('jspdf').jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  lineHeight: number,
  color: readonly [number, number, number],
  bold: boolean,
  maxLines: number,
) {
  writeClamped(document, text, x, y, width, fontSize, lineHeight, color, maxLines, bold);
}

function writeClamped(
  document: import('jspdf').jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  lineHeight: number,
  color: readonly [number, number, number],
  maxLines: number,
  bold = false,
) {
  document.setTextColor(...color);
  document.setFont('helvetica', bold ? 'bold' : 'normal');
  document.setFontSize(fontSize);
  const lines = document.splitTextToSize(toPdfText(text), width).slice(0, maxLines);
  document.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function toPdfText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function toFilename(value: string) {
  const slug = toPdfText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return slug || 'business';
}
