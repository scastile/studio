
'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Header } from '@/components/Header';
import { PromotionGenerator } from '@/components/PromotionGenerator';
import { Gallery, type GeneratedImage } from '@/components/Gallery';
import { v4 as uuidv4 } from 'uuid';
import { PinnedIdeasBar } from '@/components/PinnedIdeasBar';
import type { PinnedIdea, Idea, SavedCampaign } from '@/lib/types';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/utils';
import { elaborateOnIdea } from '@/ai/flows/elaborate-on-idea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Info } from 'lucide-react';
import { getIconForCategory } from '@/components/icons';


export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [pinnedIdeas, setPinnedIdeas] = useState<PinnedIdea[]>([]);
  
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isElaborating, setIsElaborating] = useState(false);
  const [elaboratedIdea, setElaboratedIdea] = useState<string | null>(null);
  const [loadedCampaign, setLoadedCampaign] = useState<SavedCampaign | null>(null);
  const [initialImageId, setInitialImageId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const pinnedIdeasRef = ref(database, 'pinnedIdeas');
    const unsubscribe = onValue(pinnedIdeasRef, (snapshot) => {
        const data = snapshot.val();
        const loadedIdeas: PinnedIdea[] = [];
        if (data) {
            for (const id in data) {
                loadedIdeas.push({ id, ...data[id] });
            }
        }
        setPinnedIdeas(loadedIdeas);
    });

    return () => unsubscribe();
  }, []);

  const handleInitialImageGenerated = (imageUrl: string | null, imageId?: string, prompt?: string) => {
    if (imageUrl) {
      const newId = uuidv4();
      setGeneratedImages(prev => [...prev, { id: newId, url: imageUrl, prompt: prompt || 'Initial Topic Image' }]);
      setInitialImageId(newId);
    } else if (imageId) {
      // Used for updating a loading image
       setGeneratedImages(prev => prev.map(img => img.id === imageId ? { ...img, url: imageUrl, prompt: prompt || img.prompt } : img));
    }
  };
  
  const handleResetSearch = () => {
    if (initialImageId) {
      removeImageFromList(initialImageId);
      setInitialImageId(null);
    }
    setLoadedCampaign(null);
  };

  const handleCampaignLoad = (campaign: SavedCampaign) => {
    setLoadedCampaign(campaign);
    // Clear any previous images when loading a new campaign
    setGeneratedImages([]);
    setInitialImageId(null);
    toast({
      title: 'Campaign Loaded',
      description: `The "${campaign.name}" campaign has been loaded.`,
    });
  };

  const addImageToList = (image: GeneratedImage) => {
    setGeneratedImages(prev => [...prev, image]);
  };
  
  const updateImageInList = (id: string, url: string) => {
    setGeneratedImages(prev => prev.map(img => img.id === id ? { ...img, url } : img));
  };

  const removeImageFromList = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  async function handleIdeaSelect(idea: Idea) {
    setSelectedIdea(idea);
    setIsElaborating(true);
    setElaboratedIdea(null);
    try {
      const result = await elaborateOnIdea(idea);
      if (result && result.elaboratedIdea) {
        setElaboratedIdea(result.elaboratedIdea);
      } else {
        throw new Error('No elaboration was generated.');
      }
    } catch (error) {
      console.error('Error elaborating on idea:', error);
      toast({
        variant: 'destructive',
        title: 'Elaboration Failed',
        description: 'There was a problem getting more details. Please try again.',
      });
      setSelectedIdea(null); // Close dialog on error
    } finally {
      setIsElaborating(false);
    }
  }

  const handleCopyToClipboard = () => {
    if (elaboratedIdea) {
      // Use marked to convert markdown to HTML, then get text content
      const html = marked.parse(elaboratedIdea);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const textToCopy = tempDiv.textContent || tempDiv.innerText || '';

      navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The elaborated idea has been copied.',
      });
    }
  };

  const SelectedIdeaIcon = selectedIdea ? getIconForCategory(selectedIdea.category) : Info;

  const getElaboratedIdeaAsHtml = () => {
    if (!elaboratedIdea) return '';
    return marked.parse(elaboratedIdea);
  };


  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-0">
        <PromotionGenerator 
          onImageGenerated={handleInitialImageGenerated} 
          onIdeaSelect={handleIdeaSelect}
          onReset={handleResetSearch}
          campaignToLoad={loadedCampaign}
          onCampaignLoad={handleCampaignLoad}
        />
      </div>
      
      <Gallery
        images={generatedImages}
        onAddImage={addImageToList}
        onUpdateImage={updateImageInList}
        onRemoveImage={removeImageFromList}
      />
      <PinnedIdeasBar pinnedIdeas={pinnedIdeas} onIdeaSelect={handleIdeaSelect} />
      <footer className="text-center py-6 bg-background text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
        </div>
      </footer>

      <Dialog open={!!selectedIdea} onOpenChange={(isOpen) => { if (!isOpen) setSelectedIdea(null); }}>
        <DialogContent className="sm:max-w-2xl">
          {selectedIdea && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-headline">
                  <SelectedIdeaIcon className="w-8 h-8 text-primary" />
                  {selectedIdea.category}
                </DialogTitle>
                <DialogDescription>
                  {selectedIdea.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[50vh] w-full rounded-md border p-4">
                <article className="prose prose-sm dark:prose-invert max-w-none">
                  {isElaborating ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: getElaboratedIdeaAsHtml() }} />
                  )}
                </article>
              </ScrollArea>
              <DialogFooter>
                <Button
                  onClick={handleCopyToClipboard}
                  disabled={isElaborating || !elaboratedIdea}
                  variant="outline"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
