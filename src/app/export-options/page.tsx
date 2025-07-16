
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FileDown, Mail, Copy, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ExportOptionsPage() {
    const { toast } = useToast();

  return (
    <main className="min-h-screen">
      <Header isSimple={true} />

      <div className="container mx-auto px-5">
        <div className="max-w-[1200px] mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl sm:text-4xl font-sans font-bold text-gray-800 dark:text-gray-100 flex items-center gap-4">
                        <span>Export & Share Your Campaigns</span> <Rocket className="w-8 h-8 text-primary" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-muted-foreground">
                        Library Launchpad makes it easy to take your generated ideas and put them into action. Below are the different ways you can export, save, and share your promotional plans.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <FileDown className="w-7 h-7 text-primary" />
                            Export to PDF
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">Generate a professional, print-ready PDF document of your selected promotion plan. This is perfect for sharing with colleagues, presenting at meetings, or keeping a physical record of your campaign.</p>
                        <p className="text-sm text-foreground font-semibold">Includes:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Elaborated idea details</li>
                            <li>Relevant dates and media connections</li>
                            <li>A clean, branded layout</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={() => toast({ title: "Coming Soon!", description: "PDF export will be available in a future update."})}>
                            Try It Out
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Mail className="w-7 h-7 text-primary" />
                            Email Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">Quickly send the elaborated idea and plan directly to your own email address or to a team member. The email will contain the full text of the plan, ready to be forwarded or archived.</p>
                         <p className="text-sm text-foreground font-semibold">Features:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Formatted for easy reading in email clients</li>
                            <li>Instant delivery</li>
                            <li>Great for on-the-go planning</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" onClick={() => toast({ title: "Coming Soon!", description: "Email export will be available in a future update."})}>
                            Try It Out
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-sans text-2xl flex items-center gap-3">
                            <Copy className="w-7 h-7 text-primary" />
                            Copy Text
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-muted-foreground">Copy the entire elaborated plan to your clipboard as plain text. This is the most flexible option, allowing you to paste the content into any document, task manager, or communication tool you use.</p>
                        <p className="text-sm text-foreground font-semibold">Best For:</p>
                        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                            <li>Pasting into Google Docs or Word</li>
                            <li>Creating tasks in Asana, Trello, etc.</li>
                            <li>Sharing snippets in Slack or Teams</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => toast({ title: "Now Available!", description: "You can copy text from the 'More Info' dialog."})}>
                           Available Now
                        </Button>
                    </CardFooter>
                </Card>
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
