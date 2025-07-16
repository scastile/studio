
import { Lightbulb } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-primary to-[#5C6BC0] py-16 sm:py-24 text-center relative">
      <div className="container mx-auto px-4 sm:px-0">
        <div className="bg-card rounded-2xl shadow-lg max-w-4xl mx-auto p-8 sm:p-12">
          <div className="flex justify-center items-center gap-4 mb-4">
              <div className="bg-accent p-2 rounded-lg">
                <Lightbulb className="h-6 w-6 text-accent-foreground" />
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                  Library Launchpad
              </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your library's engagement with AI-powered promotional campaigns. Generate innovative cross-promotion ideas for books, movies, games, and events that spark creativity and build community.
          </p>
          <div className="mt-10 flex justify-center items-center gap-8 sm:gap-16">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">2,500+</p>
              <p className="text-sm text-muted-foreground">Ideas Generated</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">450+</p>
              <p className="text-sm text-muted-foreground">Libraries Using</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
