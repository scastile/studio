import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';


export type GeneratedImage = {
  id: string;
  url: string | null; // null while loading
  prompt: string;
}

interface GalleryProps {
  images: GeneratedImage[];
  onAddImage: (image: GeneratedImage) => void;
  onUpdateImage: (id: string, url: string) => void;
  onRemoveImage: (id: string) => void;
}

const formSchema = z.object({
  prompt: z.string().min(3, {
    message: 'Prompt must be at least 3 characters long.',
  }),
});

export function Gallery({ images, onAddImage, onUpdateImage, onRemoveImage }: GalleryProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    const newImageId = uuidv4();
    onAddImage({ id: newImageId, url: null, prompt: values.prompt });
    form.reset();

    try {
      const result = await generateImage({ prompt: values.prompt });
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
      setIsGenerating(false);
    }
  }


  return (
    <section id="gallery" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            <Camera className="w-8 h-8 text-primary" />
            Image Generation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Generate and manage unique AI images for your promotional campaigns.
          </p>
        </div>
        
        <div className="max-w-xl mx-auto mb-12">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Input 
                  placeholder="Enter a prompt for a new image..." 
                  {...form.register('prompt')}
                  disabled={isGenerating}
                />
                 <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : 'Generate New Image'}
                 </Button>
              </form>
            </CardContent>
          </Card>
        </div>


        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group flex flex-col">
                <CardContent className="p-0 relative aspect-square">
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      fill
                      className="object-cover"
                      unoptimized // Required for base64 data URIs
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Skeleton className="w-full h-full" />
                      <Loader2 className="absolute h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-3 bg-card/80 backdrop-blur-sm mt-auto flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate" title={image.prompt}>
                    {image.prompt}
                  </p>
                  <Button variant="destructive" size="icon" onClick={() => onRemoveImage(image.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Image</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
