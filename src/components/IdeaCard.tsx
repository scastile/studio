import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconForCategory } from '@/components/icons';
import { Button } from './ui/button';
import { Info } from 'lucide-react';

type Idea = {
  category: string;
  description: string;
};

interface IdeaCardProps {
  idea: Idea;
  onSelect: (idea: Idea) => void;
}

export function IdeaCard({ idea, onSelect }: IdeaCardProps) {
  const Icon = getIconForCategory(idea.category);

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg font-headline">
          <Icon className="w-6 h-6 text-accent" />
          <span>{idea.category}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-muted-foreground flex-grow">{idea.description}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full"
          onClick={() => onSelect(idea)}
        >
          <Info className="mr-2 h-4 w-4" />
          More Info
        </Button>
      </CardContent>
    </Card>
  );
}
