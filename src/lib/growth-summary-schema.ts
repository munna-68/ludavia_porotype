import { z } from 'zod';

const nonEmptyText = z.string().trim().min(1);

export const growthSummarySchema = z
  .object({
    summary: nonEmptyText.max(1_800),
    recommendedNextStep: z
      .object({
        title: nonEmptyText
          .max(100)
          .refine((value) => value.split(/\s+/).filter(Boolean).length <= 8, {
            message: 'Title must be 8 words or fewer',
          }),
        detail: nonEmptyText.max(500),
      })
      .strict(),
  })
  .strict();

export type GrowthSummaryPayload = z.infer<typeof growthSummarySchema>;
