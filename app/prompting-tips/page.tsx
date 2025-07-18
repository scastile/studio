
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Target, Scaling, Sparkles, Paperclip, Dice5, Save } from 'lucide-react';

export default function PromptingTipsPage() {

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="container mx-auto max-w-[1200px] flex-grow space-y-8 pt-8">
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
                            <Dice5 className="w-7 h-7 text-primary" />
                            Never Settle: Roll the Dice
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">Don't love a particular suggestion? Click the dice icon on any idea card to instantly generate a new, fresh idea for that same category. It's perfect for quick brainstorming and finding the perfect fit for your library.</p>
                        <p className="text-sm text-foreground font-semibold">Pro Tip:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Use the regeneration feature to explore different angles for the same promotion type.</li>
                            <li>The AI will avoid giving you the same idea twice, so you'll always get something new.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Save className="w-7 h-7 text-primary" />
                            Build & Save Your Campaign
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">Once you're happy with your generated ideas, save them as a campaign! This bundles your topic, ideas, dates, and media connections together so you can come back to them anytime.</p>
                        <p className="text-sm text-foreground font-semibold">How to use campaigns:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Pin your favorite ideas from one or more searches.</li>
                            <li>When ready, click "Save Idea Set" and give your campaign a memorable name.</li>
                            <li>Load saved campaigns later to review your plans or share them with your team.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
       <footer className="text-center py-6 text-primary-foreground mt-8">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
          <div className="font-sans font-bold text-white mt-2 flex justify-center items-center gap-2">
            <Paperclip className="inline-block h-4 w-4" />
            <p>Powered by <i className="italic">P</i>aper<i className="italic">L</i>ab</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
