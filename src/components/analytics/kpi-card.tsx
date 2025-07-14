'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

type KpiCardProps = {
    title: string;
    value: string;
    icon: ReactNode;
    description?: string;
    animationDelay?: number;
};

export function KpiCard({ title, value, icon, description, animationDelay = 0 }: KpiCardProps) {
    return (
        <Card 
            className="hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="text-xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );
}
