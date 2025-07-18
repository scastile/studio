
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconForCategory } from '@/components/icons';
import { Button } from './ui/button';
import { Info, Pin, Dice5 } from 'lucide-react';
import type { Idea } from '@/lib/types';
import { cn } from '@/lib/utils';

interface IdeaCardProps {
  idea: Idea;
  onSelect: (idea: Idea) => void;
  onPin: (idea: Idea) => void;
  onRegenerate: (idea: Idea) => void;
  isRegenerating: boolean;
}

export function IdeaCard({ idea, onSelect, onPin, onRegenerate, isRegenerating }: IdeaCardProps) {
  const Icon = getIconForCategory(idea.category);

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-accent" />
            <span>{idea.category}</span>
          </div>
          <div className="flex items-center">
            <Button type="button" variant="ghost" size="icon" onClick={() => onRegenerate(idea)} title="Regenerate this idea" disabled={isRegenerating} className="hover:bg-transparent">
              <Dice5 className={cn("w-5 h-5 text-muted-foreground hover:text-primary", isRegenerating && "animate-spin")} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => onPin(idea)} 
              title="Pin this idea" 
              disabled={isRegenerating}
              className="transition-transform active:translate-y-px hover:bg-transparent"
            >
              <Pin className="w-5 h-5 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-muted-foreground flex-grow">{idea.description}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          onClick={() => onSelect(idea)}
          disabled={isRegenerating}
        >
          <Info className="mr-2 h-4 w-4" />
          More Info
        </Button>
      </CardContent>
    </Card>
  );
}
