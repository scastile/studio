
'use client';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface InfoCardProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
}

export function InfoCard({ title, description, buttonText, onButtonClick }: InfoCardProps) {
    return (
        <Card className="bg-card">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {description}
                </p>
                <Button 
                    variant="default" 
                    className="w-full mt-auto bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                    onClick={onButtonClick}
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    )
}
