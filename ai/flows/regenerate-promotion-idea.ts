'use server';

/**
 * @fileOverview Regenerates a single promotional idea for a given topic and category.
 *
 * - regeneratePromotionIdea - A function that handles regenerating a single promotion idea.
 * - RegeneratePromotionIdeaInput - The input type for the regeneratePromotionIdea function.
 * - RegeneratePromotionIdeaOutput - The return type for the regeneratePromotionIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegeneratePromotionIdeaInputSchema = z.object({
  topic: z.string().describe('The original topic for the promotion (e.g., a book, movie, game).'),
  category: z.string().describe('The category of the promotion idea to regenerate (e.g., Display, Social Media).'),
  existingDescription: z.string().describe('The description of the idea to be replaced, to ensure a new one is generated.'),
});
export type RegeneratePromotionIdeaInput = z.infer<typeof RegeneratePromotionIdeaInputSchema>;

const RegeneratePromotionIdeaOutputSchema = z.object({
  newDescription: z.string().describe('A new, detailed description for the promotional idea.'),
});
export type RegeneratePromotionIdeaOutput = z.infer<typeof RegeneratePromotionIdeaOutputSchema>;

export async function regeneratePromotionIdea(input: RegeneratePromotionIdeaInput): Promise<RegeneratePromotionIdeaOutput> {
  return regeneratePromotionIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regeneratePromotionIdeaPrompt',
  input: {schema: RegeneratePromotionIdeaInputSchema},
  output: {schema: RegeneratePromotionIdeaOutputSchema},
  prompt: `You are a creative marketing expert specializing in library promotions. Think outside the box and try to tie into relevant news or current entertainment trends if applicable.
  
  Generate a new and different promotional idea for the given topic and category. The new idea must be distinct from the existing one provided, and it should not be overly complicated to implement.
  
  Topic: {{{topic}}}
  Category: {{{category}}}
  Existing Idea to Avoid: {{{existingDescription}}}
  
  Provide only the new description for the idea.
  `,
});

const regeneratePromotionIdeaFlow = ai.defineFlow(
  {
    name: 'regeneratePromotionIdeaFlow',
    inputSchema: RegeneratePromotionIdeaInputSchema,
    outputSchema: RegeneratePromotionIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
