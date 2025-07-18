
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
  imageDataUri: z.string().optional().describe('An optional image for context, as a data URI.'),
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
  ).describe('A list of relevant dates associated with the topic, such as release dates, holidays depicted, or author birthdays.'),
  crossMediaConnections: z.array(
    z.object({
      type: z.string().describe('The type of media (e.g., Book, Movie, TV Show, Game).'),
      title: z.string().describe('The title of the item in that media type.'),
      year: z.string().describe('The release year of the item.')
    })
  ).describe('A list of connections to other media formats if they exist.')
});
export type GeneratePromotionIdeasOutput = z.infer<typeof GeneratePromotionIdeasOutputSchema>;

export async function generatePromotionIdeas(input: GeneratePromotionIdeasInput): Promise<GeneratePromotionIdeasOutput> {
  return generatePromotionIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionIdeasPrompt',
  input: {schema: GeneratePromotionIdeasInputSchema},
  output: {schema: GeneratePromotionIdeasOutputSchema},
  prompt: `You are a creative marketing expert specializing in library promotions for the Northeast Regional Library in Corinth, MS.

  First, analyze the provided topic. Search thoroughly for its presence across all major media formats (Book, Movie, TV Show, Game, etc.). Populate the crossMediaConnections array with ALL relevant versions you find. It is crucial that you include the original source material (e.g., the book a movie was based on) and any significant adaptations. For each connection, provide its type, title, and release year.
  
  Then, generate a list of creative cross-promotional ideas for the following topic in a library setting. Include ideas for displays, shelf signage, video concepts, escape room themes, games, crafts, and signs (one idea for each of these categories). For the 'Social Media' category, please generate two distinct ideas. Also include any other ideas you can think of, especially those that tie into current events or culture.

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

