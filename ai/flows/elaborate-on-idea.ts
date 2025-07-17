'use server';

/**
 * @fileOverview Elaborates on a specific promotion idea.
 *
 * - elaborateOnIdea - A function that provides more detail on a promotion idea.
 * - ElaborateOnIdeaInput - The input type for the elaborateOnIdea function.
 * - ElaborateOnIdeaOutput - The return type for the elaborateOnIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ElaborateOnIdeaInputSchema = z.object({
  category: z.string().describe('The category of the promotion idea.'),
  description: z.string().describe('The description of the promotion idea to elaborate on.'),
});
export type ElaborateOnIdeaInput = z.infer<typeof ElaborateOnIdeaInputSchema>;

const ElaborateOnIdeaOutputSchema = z.object({
  elaboratedIdea: z.string().describe('The detailed elaboration of the promotion idea, formatted as Markdown.'),
});
export type ElaborateOnIdeaOutput = z.infer<typeof ElaborateOnIdeaOutputSchema>;

export async function elaborateOnIdea(input: ElaborateOnIdeaInput): Promise<ElaborateOnIdeaOutput> {
  return elaborateOnIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'elaborateOnIdeaPrompt',
  input: {schema: ElaborateOnIdeaInputSchema},
  output: {schema: ElaborateOnIdeaOutputSchema},
  prompt: `You are a creative marketing expert for libraries. A user has selected a promotion idea and wants more detail.
  
  Please elaborate on the following idea, providing a more detailed plan, potential steps, materials needed, or other useful information to help a librarian implement it.
  
  Idea Category: {{{category}}}
  Idea Description: {{{description}}}
  
  Provide the output as a single block of well-formatted Markdown text. Use headings, bold text, and lists to make the content easy to read and scan.`,
});

const elaborateOnIdeaFlow = ai.defineFlow(
  {
    name: 'elaborateOnIdeaFlow',
    inputSchema: ElaborateOnIdeaInputSchema,
    outputSchema: ElaborateOnIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
