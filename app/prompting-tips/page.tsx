
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Target, Scaling, Sparkles, Paperclip } from 'lucide-react';

export default function PromptingTipsPage() {

  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto max-w-[1200px] flex-grow space-y-8">
        <Header isSimple={true} />

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl sm:text-4xl font-sans font-bold text-gray-800 dark:text-gray-100 flex items-center gap-4">
                        <span className="title-gradient">Prompting Best Practices</span> <Sparkles className="w-8 h-8 text-primary" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground">
                        The quality of your promotional ideas depends heavily on the quality of your initial topic. Here are some tips to help you craft the perfect prompt and get the most out of Library Launchpad.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Target className="w-7 h-7 text-primary" />
                            Be Specific and Clear
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">The more specific your topic, the more tailored the suggestions will be. Instead of a broad topic, try to include the media type.</p>
                        <p className="text-sm text-foreground font-semibold">Examples:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Instead of "Dune", try "Dune book series" or "the movie Dune (2021)".</li>
                            <li>Instead of "Stranger Things", try "the Netflix series Stranger Things".</li>
                            <li>For a game, specify the full title, like "The Legend of Zelda: Tears of the Kingdom".</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Lightbulb className="w-7 h-7 text-primary" />
                            Understand the Output
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">The AI generates several types of content to help you build a full campaign. Use them together for the best results.</p>
                         <p className="text-sm text-foreground font-semibold">What you get:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li><span className="font-bold">Promotion Ideas:</span> Concrete, categorized ideas for library activities and marketing.</li>
                            <li><span className="font-bold">Relevant Dates:</span> Key dates like anniversaries or in-universe holidays to anchor your events.</li>
                            <li><span className="font-bold">Media Connections:</span> A list of related books, films, or games to create comprehensive displays.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Scaling className="w-7 h-7 text-primary" />
                            Image Aspect Ratios
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">When generating an image with your topic, choosing the right aspect ratio is key for its intended use.</p>
                        <p className="text-sm text-foreground font-semibold">Choose your ratio:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li><span className="font-bold">Square (1:1):</span> Perfect for Instagram posts, profile pictures, or book cover mockups.</li>
                            <li><span className="font-bold">Wide (16:9):</span> Ideal for website banners, digital signage, flyers, or video thumbnails.</li>
                            <li><span className="font-bold">Tall (9:16):</span> Best for social media stories (Instagram, Facebook, TikTok) or posters.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Scaling className="w-7 h-7 text-primary" />
                            Iterate and Combine
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">Don't stop at one search. The best campaigns come from combining ideas from multiple related topics.</p>
                        <p className="text-sm text-foreground font-semibold">How to refine:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Run a search for a book, then another for its movie adaptation.</li>
                            <li>Pin the best ideas from each search.</li>
                            <li>Use the "More Info" button to elaborate on your favorite ideas and build a detailed plan.</li>
                            <li>Save your final collection as a named campaign.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
       <footer className="text-center py-6 text-primary-foreground mt-8">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
          <p className="font-sans font-bold text-white mt-2 flex justify-center items-center gap-2">Powered by <Paperclip className="inline-block h-4 w-4" /><span className="italic">P</span>aper<span className="italic">L</span>ab</p>
        </div>
      </footer>
    </main>
  );
}
