'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';

import { generatePromotionIdeas } from '@/ai/flows/generate-promotion-ideas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { IdeaCard } from './IdeaCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters long.',
  }),
});

type Idea = {
  category: string;
  description: string;
};

export function PromotionGenerator() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
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
    setCategories([]);
    setSelectedCategory(null);
    try {
      const result = await generatePromotionIdeas({ topic: values.topic });
      if (result && result.ideas) {
        setIdeas(result.ideas);
        const uniqueCategories = [...new Set(result.ideas.map(idea => idea.category))];
        setCategories(uniqueCategories);
      } else {
        throw new Error('No ideas were generated.');
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating ideas. Please try again.',
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

        {ideas.length > 0 && !isLoading && (
          <div className="mt-12">
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
          </div>
        )}
      </div>
    </section>
  );
}
