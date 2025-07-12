import { Video } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const videoResources = [
  { id: 'g_s94j92_4o', title: 'Marketing a Book' },
  { id: '1q69A1sZ5sE', title: 'Creative Promotion Ideas' },
  { id: 'u3k1tqk3G2M', title: 'Social Media for Libraries' },
];

export function VideoResources() {
  return (
    <section id="videos" className="py-12 sm:py-16 bg-white dark:bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
            <Video className="w-8 h-8 text-primary" />
            Video Resources
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Helpful videos to guide your promotional efforts.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoResources.map((video) => (
            <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={`YouTube video player for ${video.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{video.title}</CardTitle>
                </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
