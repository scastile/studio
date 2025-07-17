
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Pencil, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function ImageTipsPage() {
  return (
    <main className="min-h-screen">
      <Header isSimple={true} />

      <div className="container mx-auto px-5">
        <div className="max-w-[1200px] mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl sm:text-4xl font-sans font-bold text-gray-800 dark:text-gray-100 flex items-center gap-4">
                        <span className="title-gradient">Gemini Flash 2.0: A Quick Guide to Image Prompting</span> <ImageIcon className="w-10 h-10 text-primary" />
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
                        <div className="p-4 bg-background rounded-lg border">
                            <h3 className="font-semibold text-lg text-foreground">Subject</h3>
                            <p className="text-muted-foreground">What is the main focus? Be descriptive. Instead of <span className="text-foreground font-medium">&quot;a dog,&quot;</span> try <span className="text-foreground font-medium">&quot;A happy golden retriever puppy with floppy ears.&quot;</span></p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border">
                            <h3 className="font-semibold text-lg text-foreground">Style</h3>
                            <p className="text-muted-foreground">What should it look like? Examples: <span className="text-foreground font-medium">photorealistic, oil painting, 3D render, watercolor sketch, anime style, cinematic</span>.</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border">
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
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-foreground">Good Prompt:</h4>
                                <p className="p-3 bg-muted rounded-md mt-1 font-mono text-sm">A knight in shining armor holding a sword, fantasy art.</p>
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-foreground">Excellent, Detailed Prompt:</h4>
                                <p className="p-3 bg-muted rounded-md mt-1 font-mono text-sm">
                                    <strong>Photorealistic, cinematic close-up shot</strong> of a <strong>female knight</strong> with a determined expression. She wears <strong>ornate, battle-worn steel armor</strong> reflecting the <strong>dramatic lighting</strong> of a fiery sunset. <strong>Sparks from a nearby forge</strong> float in the air. <strong>Low-angle view</strong>, making her look heroic. <strong>In the style of a high-fantasy movie poster</strong>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </div>
      <footer className="text-center py-6 text-primary-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} LibraryLaunchpad. All rights reserved.</p>
          <p className="font-sans font-bold text-white mt-2">Powered by <span className="italic">P</span>aperLab</p>
        </div>
      </footer>
    </main>
  );
}
