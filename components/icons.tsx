import type { LucideProps } from 'lucide-react';
import { Presentation, Tag, Share2, Video, Puzzle } from 'lucide-react';

export const Icons = {
  display: Presentation,
  signage: Tag,
  social: Share2,
  video: Video,
  escapeRoom: Puzzle,
};

export const getIconForCategory = (category: string): React.FC<LucideProps> => {
  const normalizedCategory = category.toLowerCase();
  if (normalizedCategory.includes('display')) return Icons.display;
  if (normalizedCategory.includes('signage')) return Icons.signage;
  if (normalizedCategory.includes('social')) return Icons.social;
  if (normalizedCategory.includes('video')) return Icons.video;
  if (normalizedCategory.includes('escape room')) return Icons.escapeRoom;
  return Puzzle; // default icon
};
