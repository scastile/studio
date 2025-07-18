
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface SaveSetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaignName: string) => void;
  topic: string;
}

export function SaveSetDialog({ isOpen, onClose, onSave, topic }: SaveSetDialogProps) {
  const [campaignName, setCampaignName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCampaignName(topic);
    }
  }, [isOpen, topic]);

  const handleSave = () => {
    if (campaignName.trim()) {
      onSave(campaignName.trim());
      setCampaignName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Save className="w-6 h-6 text-primary" />
            Save Idea Set
          </DialogTitle>
          <DialogDescription>
            Give this set of ideas a name to save it as a campaign. This will save the topic, all generated ideas, dates, and media connections.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">
              Topic
            </Label>
            <Input
              id="topic"
              value={topic}
              disabled
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Campaign Name
            </Label>
            <Input
              id="name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'Summer Reading 2024'"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!campaignName.trim()}>
            <Save className="mr-2 h-4 w-4" />
            Save Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
