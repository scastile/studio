
'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Header } from '../components/Header';
import { PromotionGenerator } from '../components/PromotionGenerator';
import { ImageGenerator } from '../components/ImageGenerator';
import { Gallery, type GeneratedImage } from '../components/Gallery';
import { v4 as uuidv4 } from 'uuid';
import { PinnedIdeasList } from '../components/PinnedIdeasList';
import type { PinnedIdea, Idea, SavedCampaign, SavedImage } from '../lib/types';
import { ref, onValue, push, remove } from 'firebase/database';
import { database } from '../lib/utils';
import { elaborateOnIdea } from '../ai/flows/elaborate-on-idea';
import { generateImage } from '../ai/flows/generate-image-flow';
import { useToast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Loader2, Copy, Info, FileDown, Mail } from 'lucide-react';
import { getIconForCategory } from '../components/icons';
import Image from 'next/image';
import { SavedCampaignsList } from '../components/SavedCampaignsList';
import { SavedImagesList } from '../components/SavedImagesList';
import { InfoCard } from '../components/InfoCard';


export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [pinnedIdeas, setPinnedIdeas] = useState<PinnedIdea[]>([]);
  
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isElaborating, setIsElaborating] = useState(false);
  const [elaboratedIdea, setElaboratedIdea] = useState<string | null>(null);
  const [loadedCampaign, setLoadedCampaign] = useState<SavedCampaign | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GeneratedImage | SavedImage | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const pinnedIdeasRef = ref(database, 'pinnedIdeas');
    const pinnedIdeasUnsubscribe = onValue(pinnedIdeasRef, (snapshot) => {
        const data = snapshot.val();
        const loadedIdeas: PinnedIdea[] = [];
        if (data) {
            for (const id in data) {
                loadedIdeas.push({ id, ...data[id] });
            }
        }
        setPinnedIdeas(loadedIdeas);
    });

    const savedImagesRef = ref(database, 'savedImages');
    const savedImagesUnsubscribe = onValue(savedImagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedImages: SavedImage[] = [];
      if (data) {
        for (const id in data) {
          loadedImages.push({ id, ...data[id] });
        }
      }
       setSavedImages(loadedImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });


    return () => {
      pinnedIdeasUnsubscribe();
      savedImagesUnsubscribe();
    }
  }, []);

  const handleInitialImageGenerated = (imageUrl: string | null, imageId?: string, prompt?: string) => {
    // If an imageId is provided, we're either updating a placeholder or creating a new one.
    if (imageId) {
        // If imageUrl is provided, update the existing placeholder.
        if (imageUrl) {
            setGeneratedImages(prev => prev.map(img => img.id === imageId ? { ...img, url: imageUrl, prompt: prompt || img.prompt } : img));
        } else {
            // If no imageUrl, it's a new placeholder.
            setGeneratedImages(prev => [...prev, { id: imageId, url: null, prompt: prompt || 'Generating...' }]);
        }
    } else if (imageUrl) {
        // Fallback for cases where an image is generated without a pre-existing placeholder.
        setGeneratedImages(prev => [...prev, { id: uuidv4(), url: imageUrl, prompt: prompt || 'Initial Topic Image' }]);
    }
  };
  
  const handleResetSearch = () => {
    setGeneratedImages([]);
    setLoadedCampaign(null);
  };

  const handleCampaignLoad = (campaign: SavedCampaign) => {
    setLoadedCampaign(campaign);
    // Clear any previous images when loading a new campaign
    setGeneratedImages([]);
    toast({
      title: 'Campaign Loaded',
      description: `The "${campaign.name}" campaign has been loaded.`,
    });
  };

  const addImageToList = (image: GeneratedImage) => {
    // Check if an image with the same URL already exists to avoid duplicates from loading saved images
    if (generatedImages.some(img => img.url === image.url)) {
      toast({
        variant: 'destructive',
        title: 'Image already in Gallery',
        description: 'This image has already been loaded into the current session.',
      });
      return;
    }
    setGeneratedImages(prev => [...prev, image]);
  };
  
  const updateImageInList = (id: string, url: string) => {
    setGeneratedImages(prev => prev.map(img => img.id === id ? { ...img, url } : img));
  };

  const removeImageFromList = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSaveImage = async (image: GeneratedImage) => {
    if (!image.url) {
      toast({
        variant: 'destructive',
        title: 'Cannot save a loading image.',
        description: 'Please wait for the image to finish generating.',
      });
      return;
    }

    try {
      const savedImagesRef = ref(database, 'savedImages');
      const imageToSave = {
        prompt: image.prompt,
        url: image.url,
        createdAt: new Date().toISOString(),
      };
      await push(savedImagesRef, imageToSave);
      toast({
        title: 'Image Saved!',
        description: 'The image has been saved to your collection.',
      });
    } catch (error) {
      console.error("Error saving image:", error);
      toast({
        variant: 'destructive',
        title: 'Saving Failed',
        description: 'There was a problem saving your image. Please try again.',
      });
    }
  };

  const handleDownloadImage = (image: GeneratedImage) => {
    if (!image.url) return;
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.prompt.substring(0, 30).replace(/\s+/g, '_') || 'generated-image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleCopyImage = async (image: GeneratedImage | SavedImage) => {
    if (!image.url) {
      toast({
        title: 'Cannot copy a loading image.',
        description: 'Please wait for the image to finish generating.',
        variant: 'destructive'
      });
      return;
    }
    try {
        const response = await fetch(image.url);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob,
            }),
        ]);
        toast({
            title: 'Image Copied!',
            description: 'The image has been copied to your clipboard.',
        });
    } catch (error) {
        console.error('Failed to copy image:', error);
        // Fallback for older browsers or if the API fails
        navigator.clipboard.writeText(image.url);
        toast({
            title: 'Image URL Copied!',
            description: 'Could not copy image directly, so the URL was copied instead.',
        });
    }
  };

  const handleRefineImage = async (image: GeneratedImage, refinementPrompt: string) => {
    const newImageId = uuidv4();
    addImageToList({ id: newImageId, url: null, prompt: refinementPrompt });

    try {
      const result = await generateImage({
        prompt: refinementPrompt,
        imageDataUri: image.url!,
      });
      if (result && result.imageDataUri) {
        updateImageInList(newImageId, result.imageDataUri);
      } else {
        throw new Error("Image refinement failed.");
      }
    } catch (error) {
      console.error("Error refining image:", error);
      toast({
        variant: 'destructive',
        title: 'Refinement Failed',
        description: 'There was a problem generating the refined image.',
      });
      removeImageFromList(newImageId);
    }
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
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-5 -mt-16">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <PromotionGenerator 
            onImageGenerated={handleInitialImageGenerated} 
            onIdeaSelect={handleIdeaSelect}
            onReset={handleResetSearch}
            campaignToLoad={loadedCampaign}
          />
          <SavedCampaignsList onCampaignLoad={handleCampaignLoad} />
          <PinnedIdeasList pinnedIdeas={pinnedIdeas} onIdeaSelect={handleIdeaSelect} />
          <SavedImagesList 
              savedImages={savedImages}
              onImageLoad={(image) => addImageToList({ id: uuidv4(), url: image.url, prompt: image.prompt })}
              onImageClick={setLightboxImage}
              onCopyImage={handleCopyImage}
          />
          <ImageGenerator 
            onAddImage={addImageToList}
            onUpdateImage={updateImageInList}
            onRemoveImage={removeImageFromList}
            onImageClick={setLightboxImage}
          />
        </div>
      </div>
      
      <Gallery
        images={generatedImages}
        onSaveImage={handleSaveImage}
        onRemoveImage={removeImageFromList}
        onImageClick={setLightboxImage}
        onDownloadImage={handleDownloadImage}
        onCopyImage={handleCopyImage}
        onRefineImage={handleRefineImage}
      />
      <footer className="text-center py-6 text-primary-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
          <p className="font-sans font-bold text-white mt-2">Powered by <span className="italic">P</span>aper<span className="italic">L</span>ab</p>
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
              <DialogFooter className="gap-2">
                <Button
                  onClick={() => toast({ title: "Coming Soon!", description: "PDF export will be available in a future update."})}
                  disabled={isElaborating || !elaboratedIdea}
                  variant="outline"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export to PDF
                </Button>
                <Button
                  onClick={() => toast({ title: "Coming Soon!", description: "Email export will be available in a future update."})}
                  disabled={isElaborating || !elaboratedIdea}
                  variant="outline"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Plan
                </Button>
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

      <Dialog open={!!lightboxImage} onOpenChange={(isOpen) => { if (!isOpen) setLightboxImage(null); }}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            {lightboxImage && (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>{lightboxImage.prompt}</DialogTitle>
                  <DialogDescription>A larger view of the generated image.</DialogDescription>
                </DialogHeader>
                <div className="relative w-full h-full">
                  <Image 
                      src={lightboxImage.url!}
                      alt={lightboxImage.prompt}
                      fill
                      className="object-contain"
                      unoptimized
                  />
                </div>
              </>
            )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
