import { Header } from '@/components/Header';
import { PromotionGenerator } from '@/components/PromotionGenerator';
import { Gallery } from '@/components/Gallery';
import { VideoResources } from '@/components/VideoResources';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PromotionGenerator />
      <Gallery />
      <VideoResources />
      <footer className="text-center py-6 bg-background text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
