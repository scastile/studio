
'use client';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Link from 'next/link';

interface InfoCardProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick?: () => void;
    href?: string;
}

export function InfoCard({ title, description, buttonText, onButtonClick, href }: InfoCardProps) {
    
    return (
        <Card className="flex-grow">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="font-semibold text-foreground text-[19px]">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {description}
                </p>
                {href ? (
                    <Link href={href} passHref className="w-full mt-auto no-underline">
                        <Button 
                            variant="default" 
                            className="w-full mt-auto bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                        >
                            {buttonText}
                        </Button>
                    </Link>
                ) : (
                    <Button 
                        variant="default" 
                        className="w-full mt-auto bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                        onClick={onButtonClick}
                    >
                        {buttonText}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
