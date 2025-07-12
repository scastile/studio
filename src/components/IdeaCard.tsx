import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIconForCategory } from '@/components/icons';

type Idea = {
  category: string;
  description: string;
};

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const Icon = getIconForCategory(idea.category);

  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg font-headline">
          <Icon className="w-6 h-6 text-accent" />
          <span>{idea.category}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{idea.description}</p>
      </CardContent>
    </Card>
  );
}
