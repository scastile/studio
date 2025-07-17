// Summarizes marketing campaign feedback to identify successes and areas for improvement.
'use server';

/**
 * @fileOverview Summarizes marketing campaign feedback data for library cross-promotions.
 *
 * - summarizeMarketingCampaign - A function that summarizes feedback data.
 * - SummarizeMarketingCampaignInput - The input type for the summarizeMarketingCampaign function.
 * - SummarizeMarketingCampaignOutput - The return type for the summarizeMarketingCampaign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketingCampaignInputSchema = z.object({
  feedbackData: z
    .string()
    .describe(
      'The feedback data from the marketing campaign. This should be a string containing all feedback entries.'
    ),
});
export type SummarizeMarketingCampaignInput = z.infer<
  typeof SummarizeMarketingCampaignInputSchema
>;

const SummarizeMarketingCampaignOutputSchema = z.object({
  summary: z.string().describe('A summary of the feedback data.'),
  suggestions: z
    .string()
    .describe('Suggestions for improving future marketing campaigns.'),
});
export type SummarizeMarketingCampaignOutput = z.infer<
  typeof SummarizeMarketingCampaignOutputSchema
>;

export async function summarizeMarketingCampaign(
  input: SummarizeMarketingCampaignInput
): Promise<SummarizeMarketingCampaignOutput> {
  return summarizeMarketingCampaignFlow(input);
}

const summarizeMarketingCampaignPrompt = ai.definePrompt({
  name: 'summarizeMarketingCampaignPrompt',
  input: {schema: SummarizeMarketingCampaignInputSchema},
  output: {schema: SummarizeMarketingCampaignOutputSchema},
  prompt: `You are a marketing expert tasked with summarizing feedback data from library cross-promotion marketing campaigns.

  Analyze the following feedback data and provide a summary of what worked well and what didn't. Also, provide suggestions for improving future marketing campaigns.

  Feedback Data:
  {{feedbackData}}

  Summary:
  Suggestions: `,
});

const summarizeMarketingCampaignFlow = ai.defineFlow(
  {
    name: 'summarizeMarketingCampaignFlow',
    inputSchema: SummarizeMarketingCampaignInputSchema,
    outputSchema: SummarizeMarketingCampaignOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketingCampaignPrompt(input);
    return output!;
  }
);
