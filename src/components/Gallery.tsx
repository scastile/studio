
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Save, Trash2, Download, Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import type { SavedImage } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from './ui/input';
import { FormEvent } from 'react';

export type GeneratedImage = {
  id: string;
  url: string | null; // null while loading
  prompt: string;
}

interface GalleryProps {
  images: GeneratedImage[];
  onSaveImage: (image: GeneratedImage) => void;
  onRemoveImage: (id: string) => void;
  onImageClick: (image: GeneratedImage) => void;
  onDownloadImage: (image: GeneratedImage) => void;
  onRefineImage: (image: GeneratedImage, refinementPrompt: string) => void;
}

export function Gallery({ images, onSaveImage, onRemoveImage, onImageClick, onDownloadImage, onRefineImage }: GalleryProps) {

  if (images.length === 0) {
    return null;
  }

  const handleRefineSubmit = (e: FormEvent<HTMLFormElement>, image: GeneratedImage) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const refinementPrompt = formData.get('refine-prompt') as string;
    if (refinementPrompt && image.url) {
        onRefineImage(image, refinementPrompt);
        (e.target as HTMLFormElement).reset();
    }
  };


  return (
    <section id="gallery" className="py-12 sm:py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group flex flex-col">
                <CardContent className="p-0 relative aspect-video cursor-pointer" onClick={() => image.url && onImageClick(image)}>
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      fill
                      className="object-contain"
                      unoptimized // Required for base64 data URIs
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Skeleton className="w-full h-full" />
                      <Loader2 className="absolute h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
                <div className="p-3 bg-card/80 backdrop-blur-sm">
                   <p className="text-sm text-muted-foreground truncate" title={image.prompt}>
                    {image.prompt}
                  </p>
                </div>
                <CardFooter className="p-3 bg-card/80 backdrop-blur-sm mt-auto flex-col items-start gap-3">
                    <form onSubmit={(e) => handleRefineSubmit(e, image)} className="w-full flex items-center gap-2">
                        <Input 
                            name="refine-prompt"
                            placeholder="e.g., make it a watercolor painting" 
                            className="h-9"
                            disabled={!image.url}
                        />
                        <Button type="submit" size="sm" variant="outline" disabled={!image.url}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Refine
                        </Button>
                    </form>
                  <div className="flex items-center gap-1 self-end">
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="icon" onClick={() => onDownloadImage(image)} disabled={!image.url}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download Image</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download Image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="outline" size="icon" onClick={() => onSaveImage(image)} disabled={!image.url}>
                              <Save className="h-4 w-4" />
                              <span className="sr-only">Save to Collection</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save to Collection</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="destructive" size="icon" onClick={() => onRemoveImage(image.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Image</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove from Session</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
      </div>
    </section>
  );
}
