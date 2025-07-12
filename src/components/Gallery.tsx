import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface GalleryProps {
  generatedImageUrl: string | null;
}

export function Gallery({ generatedImageUrl }: GalleryProps) {
  return (
    <section id="gallery" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            <Camera className="w-8 h-8 text-primary" />
            Inspiration Gallery
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See a unique AI-generated image for your topic below.
          </p>
        </div>
        
        {generatedImageUrl && (
          <div className="w-full max-w-2xl mx-auto">
            <Card className="overflow-hidden group">
              <CardContent className="p-0">
                <Image
                  src={generatedImageUrl}
                  alt="AI generated promotional image"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                  unoptimized // Required for base64 data URIs
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
