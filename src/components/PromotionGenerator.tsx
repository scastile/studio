
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ref, push } from "firebase/database";
import { Lightbulb, Loader2, CalendarDays, Info, Film, Book, Tv, Gamepad2, Save, RotateCcw, Camera, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { generatePromotionIdeas } from '@/ai/flows/generate-promotion-ideas';
import { generateImage } from '@/ai/flows/generate-image-flow';
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
import type { Idea, RelevantDate, CrossMediaConnection, SavedCampaign, SavedImage } from '@/lib/types';
import { database } from '@/lib/utils';
import { SaveSetDialog } from './SaveSetDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SavedCampaignsSheet } from './SavedCampaignsSheet';
import { SavedImagesSheet } from './SavedImagesSheet';
import { v4 as uuidv4 } from 'uuid';

const promotionFormSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters long.',
  }),
});

const imageFormSchema = z.object({
  prompt: z.string().min(3, {
    message: 'Prompt must be at least 3 characters long.',
  }),
  aspectRatio: z.string(),
});

interface PromotionGeneratorProps {
  onImageGenerated: (imageUrl: string | null, imageId?: string, prompt?: string) => void;
  onIdeaSelect: (idea: Idea) => void;
  onReset: () => void;
  campaignToLoad: SavedCampaign | null;
  onCampaignLoad: (campaign: SavedCampaign) => void;
  onAddImage: (image: { id: string, url: string | null, prompt: string }) => void;
  onUpdateImage: (id: string, url: string) => void;
  onRemoveImage: (id: string) => void;
  savedImages: SavedImage[];
  onLoadSavedImage: (image: SavedImage) => void;
  onImageClick: (image: SavedImage) => void;
}

export function PromotionGenerator({ onImageGenerated, onIdeaSelect, onReset, campaignToLoad, onCampaignLoad, onAddImage, onUpdateImage, onRemoveImage, savedImages, onLoadSavedImage, onImageClick }: PromotionGeneratorProps) {
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
  const [isGeneratingNewImage, setIsGeneratingNewImage] = useState(false);
  
  const { toast } = useToast();

  const promotionForm = useForm<z.infer<typeof promotionFormSchema>>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      topic: '',
    },
  });

  const imageForm = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: '',
      aspectRatio: '1:1',
    },
  });


  const handleReset = () => {
    promotionForm.reset({ topic: '' });
    imageForm.reset();
    setIdeas([]);
    setRelevantDates([]);
    setCrossMediaConnections([]);
    setCategories([]);
    setSelectedCategory(null);
    setCurrentTopic('');
    setIsLoading(false);
    setIsGeneratingTopicImage(false);
    setIsGeneratingNewImage(false);
    onReset();
  };

  useEffect(() => {
    if (campaignToLoad) {
      promotionForm.setValue('topic', campaignToLoad.topic);
      setCurrentTopic(campaignToLoad.topic);
      setIdeas(campaignToLoad.ideas || []);
      setRelevantDates(campaignToLoad.relevantDates || []);
      setCrossMediaConnections(campaignToLoad.crossMediaConnections || []);
      const uniqueCategories = [...new Set((campaignToLoad.ideas || []).map(idea => idea.category))];
      setCategories(uniqueCategories);
      setSelectedCategory(null);
      setIsLoading(false);
      setIsGeneratingTopicImage(false);
    }
  }, [campaignToLoad, promotionForm]);


  async function onPromotionSubmit(values: z.infer<typeof promotionFormSchema>) {
    setIsLoading(true);
    setCurrentTopic(values.topic);
    setIsGeneratingTopicImage(shouldGenerateImage);
    setIdeas([]);
    setRelevantDates([]);
    setCrossMediaConnections([]);
    setCategories([]);
    setSelectedCategory(null);
    const imagePrompt = `Create a vibrant, eye-catching promotional image for a library campaign about ${values.topic}. Include visual elements and symbols that naturally connect to ${values.topic} while maintaining a library atmosphere. The setting should feel modern yet timeless, with natural lighting and an inviting environment. Use a rich, engaging color palette that complements the ${values.topic} theme. `;
    if(shouldGenerateImage) {
      onImageGenerated(null, undefined, imagePrompt);
    }
    
    try {
      const ideasPromise = generatePromotionIdeas({ topic: values.topic });

      const imagePromise = shouldGenerateImage 
        ? generateImage({ prompt: imagePrompt, aspectRatio: topicImageAspectRatio })
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

  async function onImageSubmit(values: z.infer<typeof imageFormSchema>) {
    setIsGeneratingNewImage(true);
    const newImageId = uuidv4();
    onAddImage({ id: newImageId, url: null, prompt: values.prompt });
    imageForm.reset();

    try {
      const result = await generateImage({ prompt: values.prompt, aspectRatio: values.aspectRatio });
      if (result && result.imageDataUri) {
        onUpdateImage(newImageId, result.imageDataUri);
      } else {
        throw new Error('Image generation failed to return a valid image.');
      }
    } catch (error) {
      console.error("Error generating new image:", error);
      toast({
        variant: 'destructive',
        title: 'Image Generation Failed',
        description: 'There was a problem generating the image. Please try again.',
      });
      onRemoveImage(newImageId); // Clean up the placeholder
    } finally {
      setIsGeneratingNewImage(false);
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
    <section id="generator" className="py-12 sm:py-16">
      <div className="container mx-auto">
        <div className="max-w-xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-6">
              <p className="font-bold text-left mb-4 text-lg">What would you like to promote?</p>
              <Form {...promotionForm}>
                <form onSubmit={promotionForm.handleSubmit(onPromotionSubmit)} className="space-y-4">
                  <FormField
                    control={promotionForm.control}
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
                  <div className="flex items-center justify-start space-x-2 pt-2">
                    <Switch
                      id="image-generation-switch"
                      checked={shouldGenerateImage}
                      onCheckedChange={setShouldGenerateImage}
                      disabled={isLoading || isGeneratingTopicImage}
                    />
                    <Label htmlFor="image-generation-switch" className="text-muted-foreground">Generate AI Image with topic</Label>
                  </div>
                  {shouldGenerateImage && (
                    <div className="flex justify-start items-center gap-4">
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
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" disabled={isLoading || isGeneratingTopicImage} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Ideas...
                        </>
                      ) : isGeneratingTopicImage ? (
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
            <CardFooter className="flex justify-center">
               <SavedCampaignsSheet onCampaignLoad={onCampaignLoad} />
            </CardFooter>
          </Card>
          
          {campaignToLoad && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-headline">
                  <Archive className="w-6 h-6 text-primary" />
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
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
               <div className="text-center mb-6">
                <h2 className="font-headline text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
                  <Camera className="w-7 h-7 text-primary" />
                  Image Generation
                </h2>
                <p className="mt-2 text-md text-muted-foreground">
                  Generate and manage unique AI images for your promotional campaigns.
                </p>
              </div>

              <Form {...imageForm}>
                <form onSubmit={imageForm.handleSubmit(onImageSubmit)} className="space-y-4">
                  <FormField
                    control={imageForm.control}
                    name="prompt"
                     render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Enter a prompt for a new image..." 
                              {...field}
                              disabled={isGeneratingNewImage}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                  />
                  <div className="flex items-center gap-4">
                      <Label htmlFor="aspectRatioGallery" className="text-muted-foreground">Aspect Ratio</Label>
                      <FormField
                          control={imageForm.control}
                          name="aspectRatio"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isGeneratingNewImage}
                            >
                              <FormControl>
                                <SelectTrigger id="aspectRatioGallery" className="w-[120px]">
                                  <SelectValue placeholder="Ratio" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1:1">Square</SelectItem>
                                <SelectItem value="16:9">Wide</SelectItem>
                                <SelectItem value="9:16">Tall</SelectItem>
                              </SelectContent>
                            </Select>
                         )}
                      />
                  </div>
                   <Button type="submit" disabled={isGeneratingNewImage} className="w-full">
                    {isGeneratingNewImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : 'Generate New Image'}
                   </Button>
                </form>
              </Form>
              <div className="flex justify-center mt-4">
                <SavedImagesSheet savedImages={savedImages} onImageLoad={onLoadSavedImage} onImageClick={onImageClick} />
              </div>
            </CardContent>
          </Card>
        </div>
        

        {(isLoading || isGeneratingTopicImage) && (
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
