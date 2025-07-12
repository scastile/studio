import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

const galleryItems = [
  { src: 'https://placehold.co/600x400.png', hint: 'library display', alt: 'A creative book display in a library.' },
  { src: 'https://placehold.co/600x400.png', hint: 'book promotion', alt: 'Promotional materials for a new book release.' },
  { src: 'https://placehold.co/600x400.png', hint: 'event signage', alt: 'Signage for a library event.' },
  { src: 'https://placehold.co/600x400.png', hint: 'social media', alt: 'A social media post promoting a library service.' },
  { src: 'https://placehold.co/600x400.png', hint: 'library event', alt: 'People participating in a library workshop.' },
  { src: 'https://placehold.co/600x400.png', hint: 'reading corner', alt: 'A cozy reading corner in a library.' },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            <Camera className="w-8 h-8 text-primary" />
            Inspiration Gallery
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how other libraries are successfully promoting their materials.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Card key={index} className="overflow-hidden group">
              <CardContent className="p-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={400}
                  data-ai-hint={item.hint}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
