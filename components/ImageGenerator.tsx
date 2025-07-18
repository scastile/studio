
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Camera, ImageIcon, Paperclip, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { generateImage } from '@/ai/flows/generate-image-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SavedImage, GeneratedImage } from '@/lib/types';
import { InfoCard } from './InfoCard';
import Image from 'next/image';

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
  onImageClick: (image: GeneratedImage | SavedImage) => void;
}

export function ImageGenerator({ onAddImage, onUpdateImage, onRemoveImage, onImageClick }: ImageGeneratorProps) {
  const [isGeneratingNewImage, setIsGeneratingNewImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const imageForm = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: '',
      aspectRatio: '1:1',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function onImageSubmit(values: z.infer<typeof imageFormSchema>) {
    setIsGeneratingNewImage(true);
    const newImageId = uuidv4();
    onAddImage({ id: newImageId, url: null, prompt: values.prompt });
    

    try {
      let promptWithRatio = values.prompt;
      if (values.aspectRatio === '1:1') {
        promptWithRatio += ' --square aspect ratio 1:1';
      } else if (values.aspectRatio === '16:9') {
        promptWithRatio += ' --wide-aspect ratio 16:9';
      } else if (values.aspectRatio === '9:16') {
        promptWithRatio += ' --portrait-aspect-ratio-tall';
      }
      
      const result = await generateImage({ 
        prompt: promptWithRatio,
        imageDataUri: uploadedImage || undefined,
      });

      if (result && result.imageDataUri) {
        onUpdateImage(newImageId, result.imageDataUri);
        imageForm.reset({ prompt: '', aspectRatio: '1:1' });
        handleRemoveImage();
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-start items-center gap-3">
                    <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] p-2 rounded-lg">
                      <ImageIcon className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <h2 className="font-sans text-2xl sm:text-3xl font-bold">
                        <span className="title-gradient">Image Generation</span>
                    </h2>
                </div>
                <p className="mt-2 text-md text-muted-foreground">
                  Generate unique AI images for your promotional campaigns.
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
                            <div className="relative">
                                <Input 
                                  placeholder="Enter a prompt for a new image..." 
                                  {...field}
                                  disabled={isGeneratingNewImage}
                                  className="pr-10 text-base"
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isGeneratingNewImage}
                                >
                                  <Paperclip className="h-5 w-5" />
                                </Button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  className="hidden"
                                  accept="image/*"
                                />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                  />

                  {uploadedImage && (
                    <div className="relative w-24 h-24 border rounded-md">
                      <Image src={uploadedImage} alt="Uploaded preview" layout="fill" objectFit="cover" className="rounded-md" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

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
                  <Button type="submit" disabled={isGeneratingNewImage} className="w-full font-bold bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white py-6 px-7 rounded-xl text-lg shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0" size="lg">
                    {isGeneratingNewImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" strokeWidth={2.5} />
                        Generate New Image
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      <div className="flex flex-col">
        <InfoCard 
          title="Image Tips"
          description="For strong results, use descriptive prompts. Mention style, colors, and composition. Use clear, detailed prompts with style cues (e.g., photorealistic, anime), Add analogies or references for better results."
          buttonText="Learn More"
          href="/image-tips"
        />
      </div>
    </div>
  );
}
