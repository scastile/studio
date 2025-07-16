
'use client';

import { useState } from 'react';
import { ref, remove } from 'firebase/database';
import { database } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { ImageIcon, Trash2, Download } from 'lucide-react';
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
import { CollapsibleCard } from './CollapsibleCard';

interface SavedImagesListProps {
  savedImages: SavedImage[];
  onImageLoad: (image: SavedImage) => void;
  onImageClick: (image: SavedImage) => void;
}

export function SavedImagesList({ savedImages, onImageLoad, onImageClick }: SavedImagesListProps) {
  const { toast } = useToast();
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
  };

  return (
    <>
      <CollapsibleCard
        title="Saved Images"
        count={savedImages.length}
        description={savedImages.length > 0 ? "Here are your saved images. You can load them into the current gallery or delete them." : "You haven't saved any images yet. Generate some images and click the save icon to get started."}
        Icon={ImageIcon}
      >
        <ScrollArea className="h-[250px] w-full pr-4">
            <div className="space-y-4 pb-4">
            {savedImages.map((image) => (
              <Card key={image.id} className="p-4 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 cursor-pointer" onClick={() => onImageClick(image)}>
                        <Image 
                            src={image.url} 
                            alt={image.prompt} 
                            fill
                            className="object-contain rounded-md" 
                            unoptimized
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground line-clamp-2" title={image.prompt}>{image.prompt}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Saved {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" onClick={() => handleLoadImage(image)} title="Load to Gallery">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setImageToDelete(image)} title="Delete Image">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
              </Card>
            ))}
            </div>
        </ScrollArea>
      </CollapsibleCard>

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
