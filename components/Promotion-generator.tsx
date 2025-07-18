'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ref, push } from "firebase/database";
import { Lightbulb, Loader2, CalendarDays, Info, Film, Book, Tv, Gamepad2, Save, Archive, Image as ImageIcon, Search, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { generatePromotionIdeas } from '@/ai/flows/generate-promotion-ideas';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { regeneratePromotionIdea } from '@/ai/flows/regenerate-promotion-idea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { IdeaCard } from './IdeaCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import type { Idea, RelevantDate, CrossMediaConnection, SavedCampaign } from '@/lib/types';
import { database } from '@/lib/utils';
import { SaveSetDialog } from './SaveSetDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoCard } from './InfoCard';

const promotionFormSchema = z.object({
  topic: z.string(),
});

interface PromotionGeneratorProps {
  onImageGenerated: (imageUrl: string | null, imageId?: string, prompt?: string) => void;
  onIdeaSelect: (idea: Idea) => void;
  onReset: () => void;
  campaignToLoad: SavedCampaign | null;
  onTopicChange: (topic: string) => void;
}

export function PromotionGenerator({ onImageGenerated, onIdeaSelect, onReset, campaignToLoad, onTopicChange }: PromotionGeneratorProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [relevantDates, setRelevantDates] = useState<RelevantDate[]>([]);
  const [crossMediaConnections, setCrossMediaConnections] = useState<CrossMediaConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTopicImage, setIsGeneratingTopicImage] = useState(false);
  const [shouldGenerateImage, setShouldGenerateImage] = useState(false);
  const [topicImageAspectRatio, setTopicImageAspectRatio] = useState('1:1');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMediaConnectionsDialogOpen, setIsMediaConnectionsDialogOpen] = useState(false);
  const [isSaveSetDialogOpen, setIsSaveSetDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [regeneratingIdeaId, setRegeneratingIdeaId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const promotionForm = useForm<z.infer<typeof promotionFormSchema>>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleReset = () => {
    promotionForm.reset({ topic: '' });
    setIdeas([]);
    setRelevantDates([]);
    setCrossMediaConnections([]);
    setCategories([]);
    setSelectedCategory(null);
    setCurrentTopic('');
    onTopicChange('');
    setIsLoading(false);
    setIsGeneratingTopicImage(false);
    onReset();
  };

  useEffect(() => {
    if (campaignToLoad) {
      promotionForm.setValue('topic', campaignToLoad.topic);
      setCurrentTopic(campaignToLoad.topic);
      onTopicChange(campaignToLoad.topic);
      // Ensure ideas have unique IDs and the correct topic when loaded from a campaign
      const ideasWithTopicAndIds = (campaignToLoad.ideas || []).map(idea => ({ 
          ...idea, 
          id: idea.id || uuidv4(),
          topic: campaignToLoad.topic 
      }));
      setIdeas(ideasWithTopicAndIds);
      setRelevantDates(campaignToLoad.relevantDates || []);
      setCrossMediaConnections(campaignToLoad.crossMediaConnections || []);
      const uniqueCategories = [...new Set((campaignToLoad.ideas || []).map(idea => idea.category))];
      setCategories(uniqueCategories);
      setSelectedCategory(null);
      setIsLoading(false);
      setIsGeneratingTopicImage(false);
    }
  }, [campaignToLoad, promotionForm, onTopicChange]);


  async function onPromotionSubmit(values: z.infer<typeof promotionFormSchema>) {
    if (!values.topic) {
        promotionForm.setError('topic', {
            type: 'manual',
            message: 'A topic is required.',
        });
        return;
    }
     if (values.topic.length < 3) {
        promotionForm.setError('topic', {
            type: 'manual',
            message: 'Topic must be at least 3 characters long.',
        });
        return;
    }
    promotionForm.clearErrors('topic');

    const topic = values.topic;
    setIsLoading(true);
    setCurrentTopic(topic);
    onTopicChange(topic);
    setIsGeneratingTopicImage(shouldGenerateImage);
    setIdeas([]);
    setRelevantDates([]);
    setCrossMediaConnections([]);
    setCategories([]);
    setSelectedCategory(null);
    onReset(); // Clear loaded campaign state on new search

    const imagePrompt = `Create a striking, visually rich promotional image centered around ${topic}. Incorporate vivid, symbolic imagery and meaningful visual metaphors that represent or evoke ${topic}. Use a bold and cohesive color palette that enhances the theme, and ensure the composition is both dynamic and attention-grabbing. Style the image to be modern, polished, and suitable for use in high-quality promotional materials.`;
    
    let topicImageId: string | undefined = undefined;
    if (shouldGenerateImage) {
      topicImageId = uuidv4();
      onImageGenerated(null, topicImageId, imagePrompt);
    }
    
    try {
      const ideasPromise = generatePromotionIdeas({ topic: topic });

      let promptWithRatio = imagePrompt;
      if (topicImageAspectRatio === '1:1') {
        promptWithRatio += ' --square aspect ratio 1:1';
      } else if (topicImageAspectRatio === '16:9') {
        promptWithRatio += ' --wide-aspect ratio 16:9';
      } else if (topicImageAspectRatio === '9:16') {
        promptWithRatio += ' --portrait-aspect-ratio-tall';
      }

      const imagePromise = shouldGenerateImage 
        ? generateImage({ prompt: promptWithRatio })
        : Promise.resolve(null);
      
      const ideasResult = await ideasPromise;
      if (ideasResult) {
        if(ideasResult.ideas) {
          const ideasWithIds = ideasResult.ideas.map(idea => ({ ...idea, id: uuidv4(), topic: topic }));
          setIdeas(ideasWithIds);
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
        if(imageResult && imageResult.imageDataUri && topicImageId) {
          onImageGenerated(imageResult.imageDataUri, topicImageId, imagePrompt);
        }
        setIsGeneratingTopicImage(false);
      }

    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating content. Please try again.',
      });
      setIsLoading(false);
      setIsGeneratingTopicImage(false);
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

  async function handleRegenerateIdea(ideaToRegenerate: Idea) {
    if(!ideaToRegenerate.id) {
      toast({
        variant: 'destructive',
        title: 'Cannot regenerate idea',
        description: 'This idea is missing a unique identifier.',
      });
      return;
    }
    setRegeneratingIdeaId(ideaToRegenerate.id);
    try {
      const result = await regeneratePromotionIdea({
        topic: ideaToRegenerate.topic,
        category: ideaToRegenerate.category,
        existingDescription: ideaToRegenerate.description,
      });

      if (result && result.newDescription) {
        setIdeas(prevIdeas => 
          prevIdeas.map(idea => 
            idea.id === ideaToRegenerate.id 
              ? { ...idea, description: result.newDescription } 
              : idea
          )
        );
        toast({
          title: 'Idea Regenerated!',
          description: `A new idea for ${ideaToRegenerate.category} has been generated.`,
        });
      } else {
        throw new Error('No new idea was generated.');
      }
    } catch (error) {
      console.error("Error regenerating idea:", error);
      toast({
        variant: 'destructive',
        title: 'Regeneration Failed',
        description: 'There was a problem generating a new idea. Please try again.',
      });
    } finally {
      setRegeneratingIdeaId(null);
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

  const showResults = !isLoading && (ideas.length > 0 || relevantDates.length > 0 || crossMediaConnections.length > 0);

  return (
    <>
       <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-[30px]">
          <div className="flex flex-col">
            <div className="bg-card rounded-2xl shadow-lg p-8 flex-grow flex flex-col h-full">
              <p className="font-semibold text-left mb-4 text-lg">What would you like to promote?</p>
              <Form {...promotionForm}>
                <form onSubmit={promotionForm.handleSubmit(onPromotionSubmit)} className="space-y-6 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <FormField
                      control={promotionForm.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="e.g., 'The Great Gatsby', 'Minecraft', 'Stranger Things'"
                                {...field}
                                className="text-base"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-6 flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="image-generation-switch" className="font-bold text-foreground">
                          Generate AI Image with topic
                        </Label>
                      </div>
                      <Switch
                        id="image-generation-switch"
                        checked={shouldGenerateImage}
                        onCheckedChange={setShouldGenerateImage}
                        disabled={isLoading || isGeneratingTopicImage}
                      />
                    </div>

                    {shouldGenerateImage && (
                      <div className="mt-6 flex items-center justify-start gap-4">
                        <Label htmlFor="aspectRatio" className="text-muted-foreground">Aspect Ratio</Label>
                        <Select
                          defaultValue={topicImageAspectRatio}
                          onValueChange={setTopicImageAspectRatio}
                          disabled={isLoading || isGeneratingTopicImage}
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
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="submit" disabled={isLoading || isGeneratingTopicImage} className="w-full rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] py-6 px-7 text-lg font-bold text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)] transition-all duration-300 hover:translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:translate-y-0" size="lg">
                      {isLoading || isGeneratingTopicImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4" strokeWidth={2.5} />
                          Generate Promotion Ideas
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      disabled={isLoading || isGeneratingTopicImage}
                      size="lg"
                      className="rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground py-6 px-7 text-lg font-bold"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="space-y-6">
            <InfoCard 
              title="Quick Tips"
              description="For better results, be specific about your content type and target audience."
              buttonText="Prompting Best Practices"
              href="/prompting-tips"
            />
            <InfoCard 
              title="Export Options"
              description="Save your campaigns as PDF, share via email, or integrate with your calendar."
              buttonText="View Export Options"
              href="/export-options"
            />
          </div>
        </div>
      
       {campaignToLoad && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-sans text-lg">
              <Archive className="h-6 w-6 text-primary" />
              <span>Currently Loaded Campaign</span>
            </CardTitle>
            <CardDescription>
              You are viewing ideas and assets from a saved campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Name:</span> {campaignToLoad.name}</p>
              <p><span className="font-semibold text-foreground">Topic:</span> {campaignToLoad.topic}</p>
              <p><span className="font-semibold text-foreground">Saved:</span> {formatDistanceToNow(new Date(campaignToLoad.createdAt), { addSuffix: true })}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleReset}
              size="sm"
              variant="destructive"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Search
            </Button>
          </CardFooter>
        </Card>
      )}

      {!campaignToLoad && showResults && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-sans text-lg">
              <Search className="h-6 w-6 text-primary" />
              <span>Current Search</span>
            </CardTitle>
             <CardDescription>
              The following ideas and assets were generated for your search topic. Don't forget to save the set if you'd like to use it later!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Topic:</span> {currentTopic}</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => setIsSaveSetDialogOpen(true)}
              size="lg"
              variant="outline"
              className="mt-auto w-full border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Idea Set
            </Button>
             <Button
                onClick={handleReset}
                size="lg"
                variant="destructive"
                className="mt-auto w-full"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset Search
              </Button>
          </CardFooter>
        </Card>
      )}

      {(isLoading || isGeneratingTopicImage) && (
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3 rounded-lg border bg-card p-6">
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

      { showResults && (
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {relevantDates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-sans text-lg">
                    <CalendarDays className="h-6 w-6 text-primary" />
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
                  <CardTitle className="flex items-center gap-3 font-sans text-lg">
                    <Film className="h-6 w-6 text-primary" />
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
              <div className="my-8 flex flex-wrap justify-center gap-2">
                <Badge
                  variant={selectedCategory === null ? 'default' : 'secondary'}
                  onClick={() => setSelectedCategory(null)}
                  className="cursor-pointer px-4 py-2 text-base"
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    onClick={() => setSelectedCategory(category)}
                    className="cursor-pointer px-4 py-2 text-base"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea} 
                    onSelect={onIdeaSelect} 
                    onPin={handlePinIdea}
                    onRegenerate={handleRegenerateIdea}
                    isRegenerating={regeneratingIdeaId === idea.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Dialog open={isMediaConnectionsDialogOpen} onOpenChange={setIsMediaConnectionsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-headline text-2xl">
              <Film className="h-8 w-8 text-primary" />
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
    </>
  );
}
