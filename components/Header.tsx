
'use client';
import { Lightbulb, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface HeaderProps {
  isSimple?: boolean;
}

export function Header({ isSimple = false }: HeaderProps) {
  return (
    <div className={cn("relative")}>
       <div className="w-full">
         <div className={cn(
            "bg-card rounded-2xl shadow-lg relative",
            isSimple ? "p-6 sm:p-8" : "p-8 sm:p-12"
          )}>
            {isSimple && (
              <div className="w-full flex justify-center absolute top-0 left-0 p-6 sm:p-8 pointer-events-none">
                <div className="w-full max-w-[1200px] relative">
                  {/* Home button was here */}
                </div>
              </div>
            )}
             <div className="w-full flex justify-center">
                  <a href="/" className="inline-block no-underline">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] p-2 rounded-lg">
                          <Lightbulb className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                            <span className="title-gradient">Library Launchpad</span>
                        </h1>
                    </div>
                  </a>
              </div>
              {!isSimple && (
                <>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-center">
                    Transform your library's engagement with AI-powered promotional campaigns.<br className="sm:hidden" /> Generate innovative cross-promotion ideas for books, movies, games, and events that spark creativity and build community.
                  </p>
                  <div className="mt-10 flex justify-center items-center gap-8 sm:gap-12 md:gap-16">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">12,500+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Ideas Generated</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">1+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Libraries Using</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">99%</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Satisfaction Rate</p>
                    </div>
                  </div>
                </>
              )}
            </div>
       </div>
    </div>
  );
}
