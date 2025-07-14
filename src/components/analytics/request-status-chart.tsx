'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type RequestStatusChartProps = {
  data: { status: string; count: number }[];
};

const COLORS: Record<string, string> = {
  'Pendiente': 'hsl(var(--chart-4))', // yellow
  'Aprobado': 'hsl(var(--chart-2))',  // green
  'Rechazado': 'hsl(var(--chart-1))', // red
};

export function RequestStatusChart({ data }: RequestStatusChartProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn("w-full h-[300px]")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="status"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: isMobile ? 10 : 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fontSize: isMobile ? 10 : 12, fill: 'hsl(var(--muted-foreground))' }}
            allowDecimals={false}
          />
          <Tooltip 
             cursor={{ fill: 'hsl(var(--accent))' }}
             contentStyle={{ 
                background: 'hsl(var(--popover))', 
                color: 'hsl(var(--popover-foreground))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
