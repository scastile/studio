// src/ai/flows/generate-promotion-ideas.ts
'use server';

/**
 * @fileOverview Generates cross-promotional ideas and relevant dates for a given topic in a library setting.
 *
 * - generatePromotionIdeas - A function that generates promotion ideas.
 * - GeneratePromotionIdeasInput - The input type for the generatePromotionIdeas function.
 * - GeneratePromotionIdeasOutput - The return type for the generatePromotionIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromotionIdeasInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate promotion ideas (e.g., a book, movie, game).'),
});
export type GeneratePromotionIdeasInput = z.infer<typeof GeneratePromotionIdeasInputSchema>;

const GeneratePromotionIdeasOutputSchema = z.object({
  ideas: z.array(
    z.object({
      category: z.string().describe('The category of the promotion idea (e.g., Display, Shelf Signage, Social Media, Video, Escape Room).'),
      description: z.string().describe('A detailed description of the promotion idea.'),
    })
  ).describe('A list of creative cross-promotional ideas.'),
  relevantDates: z.array(
    z.object({
      date: z.string().describe('A relevant date (e.g., "July 4th", "December 25th", "Halloween").'),
      reason: z.string().describe('The reason why this date is relevant to the topic.'),
    })
  ).describe('A list of relevant dates associated with the topic, such as release dates, holidays depicted, or author birthdays.')
});
export type GeneratePromotionIdeasOutput = z.infer<typeof GeneratePromotionIdeasOutputSchema>;

export async function generatePromotionIdeas(input: GeneratePromotionIdeasInput): Promise<GeneratePromotionIdeasOutput> {
  return generatePromotionIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionIdeasPrompt',
  input: {schema: GeneratePromotionIdeasInputSchema},
  output: {schema: GeneratePromotionIdeasOutputSchema},
  prompt: `You are a creative marketing expert specializing in library promotions.

  Generate a list of creative cross-promotional ideas for the following topic in a library setting. Include ideas for displays, shelf signage, social media posts, video concepts, escape room themes, as well as any ideas you can think of, patterns, etc.,.

  Also, identify any relevant dates or holidays associated with the topic. For example, for the movie "Jaws", a relevant date would be July 4th. For a book, it could be the author's birthday or a significant date within the story.

  Topic: {{{topic}}}

  Format the output as a JSON object.
  `,
});

const generatePromotionIdeasFlow = ai.defineFlow(
  {
    name: 'generatePromotionIdeasFlow',
    inputSchema: GeneratePromotionIdeasInputSchema,
    outputSchema: GeneratePromotionIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
