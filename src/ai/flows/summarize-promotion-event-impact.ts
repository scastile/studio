// Summarizes the impact of a promotion event based on input data.
'use server';

/**
 * @fileOverview Summarizes the impact of a promotion event using provided data.
 *
 * - summarizePromotionEventImpact - A function that summarizes the promotion event impact.
 * - SummarizePromotionEventImpactInput - The input type for the summarizePromotionEventImpact function.
 * - SummarizePromotionEventImpactOutput - The return type for the summarizePromotionEventImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePromotionEventImpactInputSchema = z.object({
  eventData: z
    .string()
    .describe(
      'Data from the promotion event, including attendance numbers, feedback, and other relevant metrics.'
    ),
});
export type SummarizePromotionEventImpactInput = z.infer<
  typeof SummarizePromotionEventImpactInputSchema
>;

const SummarizePromotionEventImpactOutputSchema = z.object({
  summary: z.string().describe('A summary of the event impact, highlighting key successes and failures.'),
  keyLearnings: z
    .string()
    .describe('Key learnings and insights gained from the event data.'),
  recommendations: z
    .string()
    .describe('Recommendations for improving future promotion events.'),
});
export type SummarizePromotionEventImpactOutput = z.infer<
  typeof SummarizePromotionEventImpactOutputSchema
>;

export async function summarizePromotionEventImpact(
  input: SummarizePromotionEventImpactInput
): Promise<SummarizePromotionEventImpactOutput> {
  return summarizePromotionEventImpactFlow(input);
}

const summarizePromotionEventImpactPrompt = ai.definePrompt({
  name: 'summarizePromotionEventImpactPrompt',
  input: {schema: SummarizePromotionEventImpactInputSchema},
  output: {schema: SummarizePromotionEventImpactOutputSchema},
  prompt: `You are an experienced librarian tasked with analyzing the impact of past promotion events.

  Analyze the following data from a promotion event and provide a summary of its impact, key learnings, and recommendations for future events.

  Event Data:
  {{eventData}}

  Summary:
  Key Learnings:
  Recommendations: `,
});

const summarizePromotionEventImpactFlow = ai.defineFlow(
  {
    name: 'summarizePromotionEventImpactFlow',
    inputSchema: SummarizePromotionEventImpactInputSchema,
    outputSchema: SummarizePromotionEventImpactOutputSchema,
  },
  async input => {
    const {output} = await summarizePromotionEventImpactPrompt(input);
    return output!;
  }
);
