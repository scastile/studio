
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ref, push } from "firebase/database";
import { Lightbulb, Loader2, CalendarDays, Info, Film, Book, Tv, Gamepad2, Save, RotateCcw } from 'lucide-react';

import { generatePromotionIdeas } from '@/ai/flows/generate-promotion-ideas';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { IdeaCard } from './IdeaCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import type { Idea, RelevantDate, CrossMediaConnection, SavedCampaign } from '@/lib/types';
import { database } from '@/lib/utils';
import { SaveSetDialog } from './SaveSetDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SavedCampaignsSheet } from './SavedCampaignsSheet';


const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters long.',
  }),
});

interface PromotionGeneratorProps {
  onImageGenerated: (imageUrl: string | null, imageId?: string, prompt?: string) => void;
  onIdeaSelect: (idea: Idea) => void;
  onReset: () => void;
  campaignToLoad: SavedCampaign | null;
  onCampaignLoad: (campaign: SavedCampaign) => void;
}

export function PromotionGenerator({ onImageGenerated, onIdeaSelect, onReset, campaignToLoad, onCampaignLoad }: PromotionGeneratorProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [relevantDates, setRelevantDates] = useState<RelevantDate[]>([]);
  const [crossMediaConnections, setCrossMediaConnections] = useState<CrossMediaConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shouldGenerateImage, setShouldGenerateImage] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMediaConnectionsDialogOpen, setIsMediaConnectionsDialogOpen] = useState(false);
  const [isSaveSetDialogOpen, setIsSaveSetDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleReset = () => {
    form.reset({ topic: '' });
    setIdeas([]);
    setRelevantDates([]);
    setCrossMediaConnections([]);
    setCategories([]);
    setSelectedCategory(null);
    setCurrentTopic('');
    setIsLoading(false);
    setIsGeneratingImage(false);
    onReset();
  };

  useEffect(() => {
    if (campaignToLoad) {
      form.setValue('topic', campaignToLoad.topic);
      setCurrentTopic(campaignToLoad.topic);
      setIdeas(campaignToLoad.ideas || []);
      setRelevantDates(campaignToLoad.relevantDates || []);
      setCrossMediaConnections(campaignToLoad.crossMediaConnections || []);
      const uniqueCategories = [...new Set((campaignToLoad.ideas || []).map(idea => idea.category))];
      setCategories(uniqueCategories);
      setSelectedCategory(null);
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  }, [campaignToLoad, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setCurrentTopic(values.topic);
    setIsGeneratingImage(shouldGenerateImage);
    setIdeas([]);
    setRelevantDates([]);
    setCrossMediaConnections([]);
    setCategories([]);
    setSelectedCategory(null);
    const imagePrompt = `Create a vibrant, eye-catching image for a campaign about ${values.topic}. You may use visual elements and symbols that naturally connect to ${values.topic} . The setting should use a rich, engaging color palette that complements the ${values.topic} theme.`;
    onImageGenerated(null, undefined, imagePrompt);
    
    try {
      const ideasPromise = generatePromotionIdeas({ topic: values.topic });

      const imagePromise = shouldGenerateImage 
        ? generateImage({ prompt: imagePrompt, aspectRatio: aspectRatio })
        : Promise.resolve(null);
      
      const ideasResult = await ideasPromise;
      if (ideasResult) {
        if(ideasResult.ideas) {
          const ideasWithTopic = ideasResult.ideas.map(idea => ({ ...idea, topic: values.topic }));
          setIdeas(ideasWithTopic);
          const uniqueCategories = [...new Set(ideasResult.ideas.map(idea => idea.category))];
          setCategories(uniqueCategories);
        }
        if(ideasResult.relevantDates) {
          setRelevantDates(ideasResult.relevantDates);
        }
        if (ideasResult.crossMediaConnections) {
          setCrossMediaConnections(ideasResult.crossMediaConnections);
        }
      } else {
        throw new Error('No ideas were generated.');
      }
      setIsLoading(false);

      if (shouldGenerateImage) {
        const imageResult = await imagePromise;
        if(imageResult && imageResult.imageDataUri) {
          onImageGenerated(imageResult.imageDataUri, undefined, imagePrompt);
        }
        setIsGeneratingImage(false);
      }

    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating content. Please try again.',
      });
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  }

  async function handlePinIdea(idea: Idea) {
    try {
      const pinnedIdeasRef = ref(database, 'pinnedIdeas');
      const ideaToPin = {
        ...idea,
        topic: currentTopic
      };
      await push(pinnedIdeasRef, ideaToPin);
      toast({
        title: 'Idea Pinned!',
        description: `"${idea.description.substring(0, 30)}..." has been saved.`,
      });
    } catch (error) {
      console.error("Error pinning idea:", error);
      toast({
        variant: 'destructive',
        title: 'Pinning Failed',
        description: 'There was a problem saving your idea. Please try again.',
      });
    }
  }

  async function handleSaveSet(campaignName: string) {
    const campaignData = {
      name: campaignName,
      topic: currentTopic,
      ideas,
      relevantDates,
      crossMediaConnections,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedCampaignsRef = ref(database, 'savedCampaigns');
      await push(savedCampaignsRef, campaignData);
      toast({
        title: 'Campaign Saved!',
        description: `The campaign "${campaignName}" has been saved successfully.`,
      });
      setIsSaveSetDialogOpen(false);
    } catch (error) {
      console.error("Error saving campaign set:", error);
      toast({
        variant: 'destructive',
        title: 'Saving Failed',
        description: 'There was a problem saving your campaign. Please try again.',
      });
    }
  }


  const filteredIdeas = selectedCategory
    ? ideas.filter((idea) => idea.category === selectedCategory)
    : ideas;

  const getCrossMediaIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('movie') || normalizedType.includes('film')) return <Film className="w-5 h-5 text-accent" />;
    if (normalizedType.includes('book')) return <Book className="w-5 h-5 text-accent" />;
    if (normalizedType.includes('tv') || normalizedType.includes('series')) return <Tv className="w-5 h-5 text-accent" />;
    if (normalizedType.includes('game')) return <Gamepad2 className="w-5 h-5 text-accent" />;
    return <Info className="w-5 h-5 text-accent" />;
  };

  const CrossMediaConnectionItem = ({ connection }: { connection: CrossMediaConnection }) => (
    <li className="flex items-center gap-4 text-muted-foreground">
      {getCrossMediaIcon(connection.type)}
      <div>
        <span className="font-bold text-foreground">{connection.title}</span> ({connection.year})
        <p className="text-sm">{connection.type}</p>
      </div>
    </li>
  );

  return (
    <section id="generator" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 'The Great Gatsby', 'Minecraft', 'Stranger Things'" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <Switch
                      id="image-generation-switch"
                      checked={shouldGenerateImage}
                      onCheckedChange={setShouldGenerateImage}
                      disabled={isLoading || isGeneratingImage}
                    />
                    <Label htmlFor="image-generation-switch" className="text-muted-foreground">Generate AI Image with topic</Label>
                  </div>
                  {shouldGenerateImage && (
                    <div className="flex justify-center items-center gap-4">
                       <Label htmlFor="aspectRatio" className="text-muted-foreground">Aspect Ratio</Label>
                      <Select
                        defaultValue={aspectRatio}
                        onValueChange={setAspectRatio}
                        disabled={isLoading || isGeneratingImage}
                      >
                        <SelectTrigger id="aspectRatio" className="w-[120px]">
                          <SelectValue placeholder="Ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">Square</SelectItem>
                          <SelectItem value="16:9">Wide</SelectItem>
                          <SelectItem value="9:16">Tall</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" disabled={isLoading || isGeneratingImage} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Ideas...
                        </>
                      ) : isGeneratingImage ? (
                          <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Ideas & Image...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Generate Promotion Ideas
                        </>
                      )}
                    </Button>
                     <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      New Search
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-4">
            <SavedCampaignsSheet onCampaignLoad={onCampaignLoad} />
          </div>
        </div>
        

        {(isLoading || isGeneratingImage) && (
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

        { !isLoading && (ideas.length > 0 || relevantDates.length > 0 || crossMediaConnections.length > 0) && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {relevantDates.length > 0 && (
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
              )}
               {crossMediaConnections.length > 0 && (
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg font-headline">
                      <Film className="w-6 h-6 text-primary" />
                      <span>Media Connections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {crossMediaConnections.slice(0, 5).map((c, i) => (
                        <CrossMediaConnectionItem key={i} connection={c} />
                      ))}
                    </ul>
                  </CardContent>
                  {crossMediaConnections.length > 5 && (
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsMediaConnectionsDialogOpen(true)}
                      >
                        Show all {crossMediaConnections.length} connections
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}
            </div>
            
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
                    <IdeaCard key={index} idea={idea} onSelect={onIdeaSelect} onPin={handlePinIdea} />
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <Button
                    onClick={() => setIsSaveSetDialogOpen(true)}
                    size="lg"
                    variant="outline"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Idea Set
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        <Dialog open={isMediaConnectionsDialogOpen} onOpenChange={setIsMediaConnectionsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-headline">
                <Film className="w-8 h-8 text-primary" />
                All Media Connections
              </DialogTitle>
              <DialogDescription>
                A complete list of related media found for this topic.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[50vh] w-full rounded-md border p-4">
              <ul className="space-y-4">
                {crossMediaConnections.map((c, i) => (
                  <CrossMediaConnectionItem key={i} connection={c} />
                ))}
              </ul>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <SaveSetDialog 
          isOpen={isSaveSetDialogOpen}
          onClose={() => setIsSaveSetDialogOpen(false)}
          onSave={handleSaveSet}
          topic={currentTopic}
        />
      </div>
    </section>
  );
}

    
    