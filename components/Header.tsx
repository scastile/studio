
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
    <header className={cn(
      "pt-16 pb-24 text-center relative",
      isSimple ? "py-12 sm:py-16 sm:pb-8" : "sm:pt-16 sm:pb-24"
    )}>
      <div className="container mx-auto px-5">
        <div className={cn(
          "bg-card rounded-2xl shadow-lg max-w-[1200px] mx-auto p-8 sm:p-12 relative",
          isSimple && "p-6 sm:p-8"
        )}>
          {isSimple && (
            <Link href="/" passHref>
              <Button variant="outline" size="icon" className="absolute top-4 left-4">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
          )}
          <a href="/" className="inline-block no-underline">
            <div className="flex justify-center items-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] p-2 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-accent-foreground" />
                </div>
                <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                    <span className="title-gradient">Library Launchpad</span>
                </h1>
            </div>
          </a>
          {!isSimple && (
            <>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
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
    </header>
  );
}
