
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

interface CollapsibleCardProps {
  title: string;
  count: number;
  description: string;
  Icon: LucideIcon;
  children: React.ReactNode;
}

export function CollapsibleCard({ title, count, description, Icon, children }: CollapsibleCardProps) {

  if (count === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-sans flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" />
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <Card>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex flex-col text-left">
                        <CardTitle className="text-2xl font-sans flex items-center gap-3">
                          <Icon className="w-6 h-6 text-primary" />
                          {title} ({count})
                        </CardTitle>
                         <CardDescription className="pt-1">
                          {description}
                        </CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent>
                      {children}
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  )
}
