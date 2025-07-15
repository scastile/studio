'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SavedCampaignsSheetProps {
  onCampaignLoad: (campaign: SavedCampaign) => void;
}

export function SavedCampaignsSheet({ onCampaignLoad }: SavedCampaignsSheetProps) {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const { toast } = useToast();

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
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Bookmark className="mr-2 h-4 w-4" />
          Saved Campaigns ({campaigns.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl font-headline flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-primary" />
            Saved Campaigns
          </SheetTitle>
          <SheetDescription>
            Here are your saved idea sets. You can load them back into the generator or delete them.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] mt-4 pr-4">
          <div className="space-y-4 pb-8">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>
                      Topic: <span className="font-semibold text-foreground">{campaign.topic}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {campaign.ideas?.length || 0} ideas saved{' '}
                      {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <SheetClose asChild>
                      <Button onClick={() => onCampaignLoad(campaign)}>
                        <Download className="mr-2 h-4 w-4" />
                        Load
                      </Button>
                    </SheetClose>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            <span className="font-bold"> {campaign.name} </span>
                             campaign.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(campaign.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>You haven't saved any campaigns yet.</p>
                <p className="text-sm">Generate some ideas and click "Save Idea Set" to get started.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
