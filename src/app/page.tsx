
'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PromotionGenerator } from '@/components/PromotionGenerator';
import { Gallery, type GeneratedImage } from '@/components/Gallery';
import { v4 as uuidv4 } from 'uuid';
import { PinnedIdeasBar } from '@/components/PinnedIdeasBar';
import type { PinnedIdea } from '@/lib/types';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/utils';

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [pinnedIdeas, setPinnedIdeas] = useState<PinnedIdea[]>([]);

  useEffect(() => {
    const pinnedIdeasRef = ref(database, 'pinnedIdeas');
    const unsubscribe = onValue(pinnedIdeasRef, (snapshot) => {
        const data = snapshot.val();
        const loadedIdeas: PinnedIdea[] = [];
        if (data) {
            for (const id in data) {
                loadedIdeas.push({ id, ...data[id] });
            }
        }
        setPinnedIdeas(loadedIdeas);
    });

    return () => unsubscribe();
  }, []);

  const handleInitialImageGenerated = (imageUrl: string | null) => {
    if (imageUrl) {
      setGeneratedImages(prev => [...prev, { id: uuidv4(), url: imageUrl, prompt: 'Initial Topic Image' }]);
    }
  };

  const addImageToList = (image: GeneratedImage) => {
    setGeneratedImages(prev => [...prev, image]);
  };
  
  const updateImageInList = (id: string, url: string) => {
    setGeneratedImages(prev => prev.map(img => img.id === id ? { ...img, url } : img));
  };

  const removeImageFromList = (id: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <main className="min-h-screen bg-background px-4 sm:px-0">
      <Header />
      <PromotionGenerator onImageGenerated={handleInitialImageGenerated} />
      <Gallery
        images={generatedImages}
        onAddImage={addImageToList}
        onUpdateImage={updateImageInList}
        onRemoveImage={removeImageFromList}
      />
      <PinnedIdeasBar pinnedIdeas={pinnedIdeas} />
      <footer className="text-center py-6 bg-background text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
