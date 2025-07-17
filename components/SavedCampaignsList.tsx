
'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

import { Button } from "@/components/ui/button";
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { Bookmark, Trash2, Download } from 'lucide-react';
import type { SavedCampaign } from '@/lib/types';
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

interface SavedCampaignsListProps {
  onCampaignLoad: (campaign: SavedCampaign) => void;
}

export function SavedCampaignsList({ onCampaignLoad }: SavedCampaignsListProps) {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const { toast } = useToast();
  const [campaignToDelete, setCampaignToDelete] = useState<SavedCampaign | null>(null);

  useEffect(() => {
    const campaignsRef = ref(database, 'savedCampaigns');
    const unsubscribe = onValue(campaignsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedCampaigns: SavedCampaign[] = [];
      if (data) {
        for (const id in data) {
          loadedCampaigns.push({ id, ...data[id] });
        }
      }
      // Sort by most recent first
      setCampaigns(loadedCampaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const campaignRef = ref(database, `savedCampaigns/${id}`);
      await remove(campaignRef);
      toast({
        title: 'Campaign Deleted',
        description: 'The campaign has been removed.',
      });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not delete the campaign. Please try again.',
      });
    } finally {
        setCampaignToDelete(null);
    }
  };

  const handleLoadCampaign = (campaign: SavedCampaign) => {
    onCampaignLoad(campaign);
  }

  return (
    <>
      <CollapsibleCard
        title="Saved Campaigns"
        count={campaigns.length}
        description={campaigns.length > 0 ? "Here are your saved idea sets. You can load or delete them." : "You haven't saved any campaigns yet. Generate some ideas and click \"Save Idea Set\" to get started."}
        Icon={Bookmark}
      >
        <ScrollArea className="h-[250px] w-full pr-4">
            <div className="space-y-4 pb-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 flex justify-between items-center group">
                  <div>
                    <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                     <p className="text-xs text-muted-foreground mt-1">
                        Saved {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" onClick={() => handleLoadCampaign(campaign)} title="Load Campaign">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setCampaignToDelete(campaign)} title="Delete Campaign">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
              </Card>
            ))}
            </div>
        </ScrollArea>
      </CollapsibleCard>

      <AlertDialog open={!!campaignToDelete} onOpenChange={(isOpen) => !isOpen && setCampaignToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-bold"> {campaignToDelete?.name} </span>
                campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => campaignToDelete && handleDelete(campaignToDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
