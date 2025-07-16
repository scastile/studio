
'use client';
import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface InfoCardProps {
    Icon: LucideIcon;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
}

export function InfoCard({ Icon, title, description, buttonText, onButtonClick }: InfoCardProps) {
    return (
        <Card className="bg-muted/50">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    {description}
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    )
}
