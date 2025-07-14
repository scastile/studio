
'use client';

import { useState } from 'react';
import { Pin, Trash2, ChevronUp, ChevronDown, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { getIconForCategory } from "./icons";
import type { PinnedIdea, Idea } from "@/lib/types";
import { Button } from "./ui/button";
import { ref, remove } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/utils";
import { cn } from '@/lib/utils';

interface PinnedIdeasBarProps {
    pinnedIdeas: PinnedIdea[];
    onIdeaSelect: (idea: Idea) => void;
}

export function PinnedIdeasBar({ pinnedIdeas, onIdeaSelect }: PinnedIdeasBarProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(true);

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
            <div className="container mx-auto">
                <div 
                    className="flex justify-center items-center py-2 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    role="button"
                    aria-expanded={isOpen}
                    aria-controls="pinned-ideas-content"
                >
                     <h2 className="font-headline text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Pin className="w-6 h-6 text-primary" />
                        Saved Ideas ({pinnedIdeas.length})
                    </h2>
                    {isOpen ? <ChevronDown className="w-6 h-6 ml-2" /> : <ChevronUp className="w-6 h-6 ml-2" />}
                </div>

                <div
                    id="pinned-ideas-content"
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                    )}
                >
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex w-max space-x-4 pt-2">
                            {pinnedIdeas.map(idea => {
                                const Icon = getIconForCategory(idea.category);
                                return (
                                    <Card key={idea.id} className="w-[300px] shrink-0 flex flex-col justify-between">
                                        <CardHeader className="pb-2">
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
                                        <CardFooter className="flex flex-col items-start gap-2">
                                            <div className="h-10 overflow-hidden">
                                                <p className="text-sm text-muted-foreground line-clamp-2 whitespace-normal">
                                                    {idea.description}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => onIdeaSelect(idea)}
                                                >
                                                <Info className="mr-2 h-4 w-4" />
                                                More Info
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
        </section>
    )
}
