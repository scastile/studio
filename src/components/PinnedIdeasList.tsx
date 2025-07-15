
'use client';

import { useState } from 'react';
import { ref, remove } from 'firebase/database';
import { database } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { Pin, Trash2, Info } from 'lucide-react';
import type { PinnedIdea, Idea } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CollapsibleCard } from './CollapsibleCard';

interface PinnedIdeasListProps {
  pinnedIdeas: PinnedIdea[];
  onIdeaSelect: (idea: Idea) => void;
}

export function PinnedIdeasList({ pinnedIdeas, onIdeaSelect }: PinnedIdeasListProps) {
  const { toast } = useToast();
  const [ideaToDelete, setIdeaToDelete] = useState<PinnedIdea | null>(null);

  const handleUnpin = async (id: string) => {
    try {
      const ideaRef = ref(database, `pinnedIdeas/${id}`);
      await remove(ideaRef);
      toast({
        title: 'Idea Unpinned',
        description: 'The idea has been removed from your saved list.',
      });
    } catch (error) {
      console.error("Error unpinning idea:", error);
      toast({
        variant: 'destructive',
        title: 'Unpinning Failed',
        description: 'Could not remove the idea. Please try again.',
      });
    } finally {
        setIdeaToDelete(null);
    }
  };

  const handleSelectIdea = (idea: PinnedIdea) => {
    onIdeaSelect(idea);
  }

  return (
    <>
      <CollapsibleCard
        title="Pinned Ideas"
        count={pinnedIdeas.length}
        description={pinnedIdeas.length > 0 ? "Here are your saved ideas. You can view more info or unpin them." : "You haven't pinned any ideas yet. Click the pin icon on an idea card to save it here."}
        Icon={Pin}
      >
        <ScrollArea className="h-[250px] w-full pr-4">
            <div className="space-y-4 pb-4">
            {pinnedIdeas.map((idea) => (
              <Card key={idea.id} className="p-4 flex justify-between items-center group">
                  <div>
                    <h3 className="font-semibold text-foreground">{idea.category}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1" title={idea.description}>
                        {idea.description}
                    </p>
                     <p className="text-xs text-muted-foreground mt-1">
                        Topic: {idea.topic}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" onClick={() => handleSelectIdea(idea)} title="More Info">
                        <Info className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setIdeaToDelete(idea)} title="Unpin Idea">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
              </Card>
            ))}
            </div>
        </ScrollArea>
      </CollapsibleCard>

      <AlertDialog open={!!ideaToDelete} onOpenChange={(isOpen) => !isOpen && setIdeaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently unpin the idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => ideaToDelete && handleUnpin(ideaToDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
