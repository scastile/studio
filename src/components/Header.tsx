
import { Lightbulb, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { SavedCampaignsSheet } from './SavedCampaignsSheet';
import { SavedCampaign } from '@/lib/types';

interface HeaderProps {
  onCampaignLoad: (campaign: SavedCampaign) => void;
}

export function Header({ onCampaignLoad }: HeaderProps) {
  return (
    <header className="bg-background py-8 sm:py-12 text-center relative">
      <div className="container mx-auto">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Lightbulb className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100">
            Library Launchpad
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Spark creativity and engage your community. Generate innovative cross-promotion ideas for books, movies, games, and more in your library.
        </p>
      </div>
      <div className="absolute top-4 right-4">
        <SavedCampaignsSheet onCampaignLoad={onCampaignLoad} />
      </div>
    </header>
  );
}
