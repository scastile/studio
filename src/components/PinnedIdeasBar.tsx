'use client';

import { Pin, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { getIconForCategory } from "./icons";
import type { PinnedIdea } from "@/lib/types";
import { Button } from "./ui/button";
import { ref, remove, onValue } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/utils";
import { useState, useEffect } from "react";

export function PinnedIdeasBar() {
    const { toast } = useToast();
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


    if (pinnedIdeas.length === 0) {
        return null;
    }

    const handleUnpin = async (id: string) => {
        try {
            const ideaRef = ref(database, `pinnedIdeas/${id}`);
            await remove(ideaRef);
            toast({
                title: 'Idea Unpinned',
                description: 'The idea has been removed from your saved list.',
            });
        } catch (error) {
            console.error("Error unpinning idea:", error);
            toast({
                variant: 'destructive',
                title: 'Unpinning Failed',
                description: 'Could not remove the idea. Please try again.',
            });
        }
    };

    return (
        <section className="sticky bottom-0 z-50 w-full bg-background/95 backdrop-blur-sm border-t">
            <div className="container mx-auto py-4">
                 <h2 className="font-headline text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 mb-4">
                    <Pin className="w-6 h-6 text-primary" />
                    Saved Ideas
                </h2>
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-4 pb-4">
                        {pinnedIdeas.map(idea => {
                            const Icon = getIconForCategory(idea.category);
                            return (
                                <Card key={idea.id} className="w-[300px] shrink-0">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between text-base font-headline">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-5 h-5 text-accent" />
                                                <span>{idea.category}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleUnpin(idea.id)} title="Unpin this idea">
                                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-3">{idea.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    )
}
