
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Pencil, Sparkles, Image as ImageIcon, Wand2, Save } from 'lucide-react';
import { Paperclip } from 'lucide-react';
import Image from 'next/image';

export default function ImageTipsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="container mx-auto max-w-screen-xl flex-grow space-y-8 pt-8 px-4 sm:px-8">
        <Header isSimple={true} />

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl sm:text-4xl font-sans font-bold text-gray-800 dark:text-gray-100 flex items-center gap-4">
                        <span className="title-gradient">Gemini Flash 2.0: A Quick Guide to Image Prompting</span> <ImageIcon className="w-8 h-8 text-primary" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground">
                        The key to getting great images from Gemini is to be specific, descriptive, and clear. Think of yourself as a director telling an artist exactly what to create, from the main subject to the finest details of lighting and style.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-sans text-2xl flex items-center gap-3">
                        <CheckCircle2 className="w-7 h-7 text-primary" />
                        The Core Formula: Subject + Style + Context
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">For a solid start, structure your prompt around three key elements. You don't need to follow this order rigidly, but ensure these components are present for best results.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-muted rounded-lg border">
                            <h3 className="font-semibold text-lg text-foreground">Subject</h3>
                            <p className="text-muted-foreground">What is the main focus? Be descriptive. Instead of <span className="text-foreground font-medium">&quot;a dog,&quot;</span> try <span className="text-foreground font-medium">&quot;A happy golden retriever puppy with floppy ears.&quot;</span></p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg border">
                            <h3 className="font-semibold text-lg text-foreground">Style</h3>
                            <p className="text-muted-foreground">What should it look like? Examples: <span className="text-foreground font-medium">photorealistic, oil painting, 3D render, watercolor sketch, anime style, cinematic</span>.</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg border">
                            <h3 className="font-semibold text-lg text-foreground">Context</h3>
                            <p className="text-muted-foreground">What is the setting? Examples: <span className="text-foreground font-medium">on a sunny beach, in a futuristic neon-lit city, in a cozy library, at golden hour</span>.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-sans text-2xl flex items-center gap-3">
                                <Pencil className="w-7 h-7 text-primary" />
                                Be Specific & Descriptive
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground">Details matter. The more information you provide, the closer the result will be to your vision. Add layers of detail to your core prompt.</p>
                            <p><strong className="text-foreground">Action & Pose:</strong> What is the subject doing? <span className="text-muted-foreground">running, sleeping peacefully, looking thoughtfully at the camera.</span></p>
                            <p><strong className="text-foreground">Emotions & Mood:</strong> How should the scene feel? <span className="text-muted-foreground">a joyful scene, a mysterious mood, a vibrant atmosphere.</span></p>
                            <p><strong className="text-foreground">Lighting:</strong> Dramatically changes the mood. Use terms like <span className="text-muted-foreground">soft morning light, dramatic studio lighting, backlit, moonlit.</span></p>
                            <p><strong className="text-foreground">Color Palette:</strong> You can guide the colors. <span className="text-muted-foreground">a warm color palette of oranges and yellows, monochromatic blue.</span></p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-sans text-2xl flex items-center gap-3">
                                <Sparkles className="w-7 h-7 text-primary" />
                                Master the Style
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground">Specifying the artistic style is one of the most powerful tools you have. Mix and match to create unique looks.</p>
                            <p><strong className="text-foreground">Artistic Mediums:</strong> <span className="text-muted-foreground">oil painting, charcoal drawing, watercolor, digital illustration, vector art.</span></p>
                            <p><strong className="text-foreground">Photographic Terms:</strong> <span className="text-muted-foreground">macro shot, wide-angle shot, long exposure, cinematic, black and white.</span></p>
                            <p><strong className="text-foreground">Art Movements:</strong> <span className="text-muted-foreground">surrealism, impressionism, pop art, cyberpunk.</span></p>
                             <p><strong className="text-foreground">Artist Inspiration:</strong> Reference the style of famous artists, e.g., <span className="text-muted-foreground">in the style of Van Gogh.</span></p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-sans text-2xl flex items-center gap-3">
                                <Wand2 className="w-7 h-7 text-primary" />
                                Iterate, Refine, and Save
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">Your first generation is just the starting point. Use the tools provided to perfect your image.</p>
                            <div>
                                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2"><Wand2 className="w-5 h-5"/>Refine Your Image</h3>
                                <p className="text-muted-foreground mt-1">Don't be afraid to guide the AI. Use the 'Refine' input below each image to make changes. Treat it like a conversation. Try prompts like "Change the background to a snowy forest," "make the art style a watercolor painting," or "add a cat sitting on the chair."</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-foreground flex items-center gap-2"><Save className="w-5 h-5"/>Save Your Favorites</h3>
                                <p className="text-muted-foreground mt-1">Once you've generated an image you love, click the save icon. This will add it to your "Saved Images" collection, so you can easily access and use it in your campaigns later without having to regenerate it.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-sans text-2xl flex items-center gap-3">
                                <ImageIcon className="w-7 h-7 text-primary" />
                                Control the Composition
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <p className="text-muted-foreground">Direct the &quot;camera&quot; to get the exact framing you want.</p>
                            <p><strong className="text-foreground">Shot Type:</strong> <span className="text-muted-foreground">close-up shot, medium shot, full-body shot, extreme wide shot.</span></p>
                            <p><strong className="text-foreground">Angle:</strong> <span className="text-muted-foreground">low-angle view, bird&apos;s-eye view, eye-level shot, Dutch angle.</span></p>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle className="font-sans text-2xl flex items-center gap-3">
                                <CheckCircle2 className="w-7 h-7 text-primary" />
                                Putting It All Together: Examples
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-lg font-semibold text-foreground">Simple Prompt:</h4>
                                <p className="p-3 bg-muted rounded-md mt-1 font-mono text-sm">a knight</p>
                                <div className="mt-2 relative aspect-square w-full rounded-lg overflow-hidden border">
                                    <Image src="https://storage.googleapis.com/project-1-428616.appspot.com/a-knight-simple.png" alt="A knight in armor in a field" fill className="object-cover" data-ai-hint="knight field" />
                                </div>
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-foreground">Good Prompt:</h4>
                                <p className="p-3 bg-muted rounded-md mt-1 font-mono text-sm">A knight in shining armor holding a sword, fantasy art.</p>
                                 <div className="mt-2 relative aspect-square w-full rounded-lg overflow-hidden border">
                                    <Image src="https://storage.googleapis.com/project-1-428616.appspot.com/a-knight-good.png" alt="A fantasy art style knight in shining armor" fill className="object-cover" data-ai-hint="knight fantasy" />
                                </div>
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-foreground">Excellent, Detailed Prompt:</h4>
                                <p className="p-3 bg-muted rounded-md mt-1 font-mono text-sm">
                                    <strong>Photorealistic, cinematic close-up shot</strong> of a <strong>female knight</strong> with a determined expression. She wears <strong>ornate, battle-worn steel armor</strong> reflecting the <strong>dramatic lighting</strong> of a fiery sunset. <strong>Sparks from a nearby forge</strong> float in the air. <strong>Low-angle view</strong>, making her look heroic. <strong>In the style of a high-fantasy movie poster</strong>.
                                </p>
                                <div className="mt-2 relative aspect-square w-full rounded-lg overflow-hidden border">
                                    <Image src="https://storage.googleapis.com/project-1-428616.appspot.com/a-knight-excellent.png" alt="A photorealistic female knight in ornate armor at sunset" fill className="object-cover" data-ai-hint="female knight" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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

    