
'use client';

import { useState } from 'react';
import { ref, remove } from 'firebase/database';
import { database } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Image as ImageIcon, Trash2, Download } from 'lucide-react';
import type { SavedImage } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedImagesSheetProps {
  savedImages: SavedImage[];
  onImageLoad: (image: SavedImage) => void;
  onImageClick: (image: SavedImage) => void;
}

export function SavedImagesSheet({ savedImages, onImageLoad, onImageClick }: SavedImagesSheetProps) {
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<SavedImage | null>(null);


  const handleDelete = async (id: string) => {
    try {
      const imageRef = ref(database, `savedImages/${id}`);
      await remove(imageRef);
      toast({
        title: 'Image Deleted',
        description: 'The image has been removed from your collection.',
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not delete the image. Please try again.',
      });
    } finally {
        setImageToDelete(null);
    }
  };

  const handleLoadImage = (image: SavedImage) => {
    onImageLoad(image);
    setIsSheetOpen(false); // Close the sheet after loading
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <ImageIcon className="mr-2 h-4 w-4" />
            Saved Images ({savedImages.length})
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xl w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl font-headline flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" />
              Saved Images
            </SheetTitle>
            <SheetDescription>
              Here are your saved images. You can load them into the current gallery or delete them.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-150px)] mt-4 pr-4">
            <div className="space-y-4 pb-8">
              {savedImages.length > 0 ? (
                savedImages.map((image) => (
                  <Card key={image.id}>
                    <CardHeader>
                      <CardTitle className="text-base truncate">{image.prompt}</CardTitle>
                      <CardDescription>
                        Saved {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <div className="relative w-full h-48 cursor-pointer" onClick={() => onImageClick(image)}>
                           <Image 
                              src={image.url} 
                              alt={image.prompt} 
                              fill
                              className="object-contain rounded-md" 
                              unoptimized
                          />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-start gap-2">
                      <Button onClick={() => handleLoadImage(image)}>
                        <Download className="mr-2 h-4 w-4" />
                        Load to Gallery
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => setImageToDelete(image)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <p>You haven't saved any images yet.</p>
                  <p className="text-sm">Generate some images and click the save icon to get started.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <AlertDialog open={!!imageToDelete} onOpenChange={(isOpen) => !isOpen && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this image from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => imageToDelete && handleDelete(imageToDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
