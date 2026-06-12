"use client";

import { cn } from "@/lib/utils";

type Series = {
  key: string;
  label: string;
  color: string;
};

type AreaChartProps = {
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  height?: number;
  className?: string;
};

export function SimpleAreaChart({ data, xKey, series, height = 190, className }: AreaChartProps) {
  if (data.length === 0) {
    return <div className={cn("text-xs text-zinc-500 text-center py-8", className)}>Sem dados</div>;
  }

  const numericKeys = series.map((item) => item.key);
  const maxValue = Math.max(
    1,
    ...data.flatMap((row) => numericKeys.map((key) => Number(row[key] ?? 0))),
  );
  const width = 100;
  const step = data.length > 1 ? width / (data.length - 1) : width;

  const toPoints = (key: string) =>
    data
      .map((row, index) => {
        const x = data.length === 1 ? width / 2 : index * step;
        const y = height - (Number(row[key] ?? 0) / maxValue) * (height - 12);
        return `${x},${y}`;
      })
      .join(" ");

  const toArea = (key: string) => {
    const points = data.map((row, index) => {
      const x = data.length === 1 ? width / 2 : index * step;
      const y = height - (Number(row[key] ?? 0) / maxValue) * (height - 12);
      return `${x},${y}`;
    });
    const firstX = data.length === 1 ? width / 2 : 0;
    const lastX = data.length === 1 ? width / 2 : (data.length - 1) * step;
    return `M ${firstX},${height} L ${points.join(" L ")} L ${lastX},${height} Z`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        {series.map((item) => (
          <g key={item.key}>
            <path d={toArea(item.key)} fill={item.color} fillOpacity={0.18} />
            <polyline
              fill="none"
              stroke={item.color}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              points={toPoints(item.key)}
            />
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-3 text-[11px] text-zinc-500">
        {series.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-zinc-600">
        <span>{String(data[0]?.[xKey] ?? "")}</span>
        <span>{String(data[data.length - 1]?.[xKey] ?? "")}</span>
      </div>
    </div>
  );
}

type BarChartProps = {
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  height?: number;
  className?: string;
};

export function SimpleBarChart({ data, xKey, series, height = 220, className }: BarChartProps) {
  if (data.length === 0) {
    return <div className={cn("text-xs text-zinc-500 text-center py-8", className)}>Sem dados</div>;
  }

  const maxValue = Math.max(
    1,
    ...data.flatMap((row) => series.map((item) => Number(row[item.key] ?? 0))),
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((row, index) => (
          <div key={`${row[xKey]}-${index}`} className="flex flex-1 items-end justify-center gap-1">
            {series.map((item) => {
              const value = Number(row[item.key] ?? 0);
              return (
                <div
                  key={item.key}
                  className="w-full rounded-t-md"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    minHeight: value > 0 ? "4px" : "0",
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: ${value}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((row, index) => (
          <span key={`${row[xKey]}-label-${index}`} className="truncate text-center text-[10px] text-zinc-600">
            {String(row[xKey])}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-zinc-500">
        {series.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

type DistributionItem = {
  label: string;
  value: number;
  color: string;
};

export function SimpleDistribution({ items, className }: { items: DistributionItem[]; className?: string }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <div className={cn("text-xs text-zinc-500 text-center py-8", className)}>Sem dados</div>;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-zinc-400">{item.label}</span>
            <span className="font-medium text-zinc-300">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type MetricItem = {
  label: string;
  value: number;
};

export function SimpleMetricBars({ items, className }: { items: MetricItem[]; className?: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-zinc-400">{item.label}</span>
            <span className="font-medium text-zinc-300">{item.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
