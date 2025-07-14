'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type StatusChartProps = {
  data: { status: string; count: number }[];
};

const COLORS: Record<string, string> = {
  'En Stock': 'hsl(var(--chart-2))',
  'Stock Bajo': 'hsl(var(--chart-4))',
  'Agotado': 'hsl(var(--chart-1))',
};

export function StatusChart({ data }: StatusChartProps) {
  const isMobile = useIsMobile();
  return (
    <div className={cn("w-full", isMobile ? "h-[250px]" : "h-[300px]")}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip 
             cursor={{ fill: 'transparent' }}
             contentStyle={{ 
                background: 'hsl(var(--popover))', 
                color: 'hsl(var(--popover-foreground))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconSize={10}
            formatter={(value) => <span className="text-muted-foreground">{value}</span>}
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 40 : 60}
            outerRadius={isMobile ? 80 : 100}
            paddingAngle={2}
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
            }}
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.status}`} fill={COLORS[entry.status]} className="stroke-background hover:opacity-80" />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
