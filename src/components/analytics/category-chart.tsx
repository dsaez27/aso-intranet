'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type CategoryChartProps = {
  data: { category: string; value: number }[];
};

export function CategoryChart({ data }: CategoryChartProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn("w-full h-[300px]")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: isMobile ? 10 : 12, fill: 'hsl(var(--muted-foreground))' }}
            width={isMobile ? 60 : 80}
          />
          <XAxis dataKey="value" type="number" hide />
          <Tooltip 
             cursor={{ fill: 'hsl(var(--accent))' }}
             contentStyle={{ 
                background: 'hsl(var(--popover))', 
                color: 'hsl(var(--popover-foreground))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
            }}
          />
          <Bar dataKey="value" layout="vertical" fill="hsl(var(--chart-1))" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
