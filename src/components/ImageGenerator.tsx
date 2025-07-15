
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Camera } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { generateImage } from '@/ai/flows/generate-image-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SavedImagesSheet } from './SavedImagesSheet';
import type { SavedImage } from '@/lib/types';

const imageFormSchema = z.object({
  prompt: z.string().min(3, {
    message: 'Prompt must be at least 3 characters long.',
  }),
  aspectRatio: z.string(),
});

interface ImageGeneratorProps {
  onAddImage: (image: { id: string, url: string | null, prompt: string }) => void;
  onUpdateImage: (id: string, url: string) => void;
  onRemoveImage: (id: string) => void;
  savedImages: SavedImage[];
  onLoadSavedImage: (image: SavedImage) => void;
  onImageClick: (image: SavedImage) => void;
}

export function ImageGenerator({ onAddImage, onUpdateImage, onRemoveImage, savedImages, onLoadSavedImage, onImageClick }: ImageGeneratorProps) {
  const [isGeneratingNewImage, setIsGeneratingNewImage] = useState(false);
  const { toast } = useToast();

  const imageForm = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: '',
      aspectRatio: '1:1',
    },
  });

  async function onImageSubmit(values: z.infer<typeof imageFormSchema>) {
    setIsGeneratingNewImage(true);
    const newImageId = uuidv4();
    onAddImage({ id: newImageId, url: null, prompt: values.prompt });
    imageForm.reset({ prompt: '', aspectRatio: '1:1' });

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

  return (
    <section id="image-generator" className="py-12 sm:py-16">
      <div className="max-w-xl mx-auto space-y-8">
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
    </section>
  );
}
