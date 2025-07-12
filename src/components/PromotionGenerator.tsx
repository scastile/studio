'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, Loader2, CalendarDays } from 'lucide-react';

import { generatePromotionIdeas } from '@/ai/flows/generate-promotion-ideas';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { IdeaCard } from './IdeaCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters long.',
  }),
});

type Idea = {
  category: string;
  description: string;
};

type RelevantDate = {
  date: string;
  reason: string;
};

interface PromotionGeneratorProps {
  onImageGenerated: (imageUrl: string | null) => void;
}

export function PromotionGenerator({ onImageGenerated }: PromotionGeneratorProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [relevantDates, setRelevantDates] = useState<RelevantDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIdeas([]);
    setRelevantDates([]);
    setCategories([]);
    setSelectedCategory(null);
    onImageGenerated(null);
    
    try {
      // Kick off both requests in parallel
      const ideasPromise = generatePromotionIdeas({ topic: values.topic });
      const imagePromise = generateImage({ topic: `A creative, artistic, visually-appealing promotional image for a library about: ${values.topic}` });
      
      const [ideasResult, imageResult] = await Promise.all([ideasPromise, imagePromise]);

      if (ideasResult) {
        if(ideasResult.ideas) {
          setIdeas(ideasResult.ideas);
          const uniqueCategories = [...new Set(ideasResult.ideas.map(idea => idea.category))];
          setCategories(uniqueCategories);
        }
        if(ideasResult.relevantDates) {
          setRelevantDates(ideasResult.relevantDates);
        }
      } else {
        throw new Error('No ideas were generated.');
      }

      if(imageResult && imageResult.imageDataUri) {
        onImageGenerated(imageResult.imageDataUri);
      }

    } catch (error) {
      console.error('Error generating ideas or image:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const filteredIdeas = selectedCategory
    ? ideas.filter((idea) => idea.category === selectedCategory)
    : ideas;

  return (
    <section id="generator" className="py-12 sm:py-16 bg-white dark:bg-card">
      <div className="container mx-auto">
        <div className="max-w-xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg sr-only">Enter a topic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 'The Great Gatsby', 'Minecraft', 'Stranger Things'" 
                        {...field} 
                        className="py-6 text-center text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full py-6 text-lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-6 w-6" />
                    Generate Promotion Ideas
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {isLoading && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-6 border rounded-lg bg-card">
                  <div className="flex items-center space-x-4">
                     <Skeleton className="h-8 w-8 rounded-full" />
                     <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        )}

        { !isLoading && (ideas.length > 0 || relevantDates.length > 0) && (
          <div className="mt-12">
            {relevantDates.length > 0 && (
              <div className="mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-headline">
                      <CalendarDays className="w-6 h-6 text-primary" />
                      <span>Relevant Dates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {relevantDates.map((d, i) => (
                        <li key={i} className="text-muted-foreground">
                          <span className="font-bold text-foreground">{d.date}:</span> {d.reason}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {ideas.length > 0 && (
              <>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  <Badge
                    variant={selectedCategory === null ? 'default' : 'secondary'}
                    onClick={() => setSelectedCategory(null)}
                    className="cursor-pointer text-base px-4 py-2"
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'secondary'}
                      onClick={() => setSelectedCategory(category)}
                      className="cursor-pointer text-base px-4 py-2"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIdeas.map((idea, index) => (
                    <IdeaCard key={index} idea={idea} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
