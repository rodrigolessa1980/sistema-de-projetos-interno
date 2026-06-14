"use client";

import { type ReactNode, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { RadarChart } from "@mui/x-charts/RadarChart";
import { chartsTooltipClasses } from "@mui/x-charts/ChartsTooltip";
import { cn } from "@/lib/utils";

const TOOLTIP_BG = "#18181b";

const chartTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: TOOLTIP_BG,
      default: "transparent",
    },
    text: {
      primary: "#a1a1aa",
      secondary: "#71717a",
    },
  },
});

const TOOLTIP_SX = {
  [`& .${chartsTooltipClasses.paper}`]: {
    backgroundColor: `${TOOLTIP_BG} !important`,
    border: "1px solid #3f3f46",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.65)",
  },
  [`& .${chartsTooltipClasses.labelCell}`]: { color: "#d4d4d8" },
  [`& .${chartsTooltipClasses.valueCell}`]: { color: "#f4f4f5" },
  [`& .${chartsTooltipClasses.axisValueCell}`]: { color: "#f4f4f5", fontWeight: 600 },
};

const CHART_SX = {
  "& .MuiChartsAxis-line": { stroke: "#3f3f46" },
  "& .MuiChartsAxis-tick": { stroke: "#3f3f46" },
  "& .MuiChartsGrid-line": { stroke: "#27272a", strokeDasharray: "4 4" },
  "& .MuiChartsLegend-label": { fill: "#a1a1aa !important" },
  "& .MuiChartsAxis-tickLabel": { fill: "#71717a !important" },
  ...TOOLTIP_SX,
};

const CHART_TOOLTIP_SLOT_PROPS = {
  tooltip: { sx: TOOLTIP_SX },
};

const AXIS_TICK_STYLE = { fill: "#71717a", fontSize: 11 };

type ChartSeries = {
  key: string;
  label: string;
  color: string;
};

function MuiChartWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ThemeProvider theme={chartTheme}>
      <div className={cn("w-full", className)}>{children}</div>
    </ThemeProvider>
  );
}

function ChartEmptyState({ className }: { className?: string }) {
  return <div className={cn("text-xs text-zinc-500 text-center py-8", className)}>Sem dados</div>;
}

type BarChartProps = {
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
  height?: number;
  className?: string;
};

export function MetricsBarChart({ data, xKey, series, height = 220, className }: BarChartProps) {
  const xLabels = useMemo(() => data.map((row) => String(row[xKey])), [data, xKey]);

  if (data.length === 0) {
    return <ChartEmptyState className={className} />;
  }

  return (
    <MuiChartWrapper className={className}>
      <BarChart
        height={height}
        borderRadius={6}
        margin={{ left: 48, right: 16, top: 16, bottom: 40 }}
        grid={{ horizontal: true, vertical: false }}
        xAxis={[{ scaleType: "band", data: xLabels, tickLabelStyle: AXIS_TICK_STYLE }]}
        yAxis={[{ tickLabelStyle: AXIS_TICK_STYLE }]}
        series={series.map((item) => ({
          data: data.map((row) => Number(row[item.key] ?? 0)),
          label: item.label,
          color: item.color,
        }))}
        sx={CHART_SX}
        slotProps={{
          ...CHART_TOOLTIP_SLOT_PROPS,
          legend: {
            direction: "horizontal",
            position: { vertical: "bottom", horizontal: "center" },
          },
        }}
      />
    </MuiChartWrapper>
  );
}

type AreaChartProps = {
  data: Record<string, string | number>[];
  xKey: string;
  series: ChartSeries[];
  height?: number;
  className?: string;
};

export function MetricsAreaChart({ data, xKey, series, height = 220, className }: AreaChartProps) {
  const xLabels = useMemo(() => data.map((row) => String(row[xKey])), [data, xKey]);

  if (data.length === 0) {
    return <ChartEmptyState className={className} />;
  }

  return (
    <MuiChartWrapper className={className}>
      <LineChart
        height={height}
        margin={{ left: 48, right: 16, top: 16, bottom: 40 }}
        grid={{ horizontal: true, vertical: false }}
        xAxis={[{ scaleType: "point", data: xLabels, tickLabelStyle: AXIS_TICK_STYLE }]}
        yAxis={[{ tickLabelStyle: AXIS_TICK_STYLE }]}
        series={series.map((item) => ({
          data: data.map((row) => Number(row[item.key] ?? 0)),
          label: item.label,
          color: item.color,
          area: true,
          curve: "natural",
          showMark: true,
        }))}
        sx={CHART_SX}
        slotProps={{
          ...CHART_TOOLTIP_SLOT_PROPS,
          legend: {
            direction: "horizontal",
            position: { vertical: "bottom", horizontal: "center" },
          },
        }}
      />
    </MuiChartWrapper>
  );
}

type DistributionItem = {
  label: string;
  value: number;
  color: string;
};

export function MetricsPieChart({ items, height = 220, className }: { items: DistributionItem[]; height?: number; className?: string }) {
  const total = useMemo(() => items.reduce((sum, item) => sum + item.value, 0), [items]);

  const pieData = useMemo(
    () =>
      items.map((item, index) => ({
        id: index,
        value: item.value,
        label: item.label,
        color: item.color,
      })),
    [items],
  );

  if (total === 0) {
    return <ChartEmptyState className={className} />;
  }

  return (
    <MuiChartWrapper className={className}>
      <PieChart
        height={height}
        margin={{ top: 8, bottom: 8, left: 8, right: 120 }}
        series={[
          {
            data: pieData,
            innerRadius: 48,
            outerRadius: 88,
            paddingAngle: 3,
            cornerRadius: 4,
            highlightScope: { fade: "global", highlight: "item" },
          },
        ]}
        sx={CHART_SX}
        slotProps={{
          ...CHART_TOOLTIP_SLOT_PROPS,
          legend: {
            direction: "vertical",
            position: { vertical: "middle", horizontal: "end" },
          },
        }}
      />
    </MuiChartWrapper>
  );
}

type RadarItem = {
  label: string;
  value: number;
};

export function PerformanceRadarChart({ items, height = 240, className }: { items: RadarItem[]; height?: number; className?: string }) {
  const metrics = useMemo(
    () => items.map((item) => ({ name: item.label, max: 100 })),
    [items],
  );

  const data = useMemo(() => items.map((item) => Math.round(item.value)), [items]);

  if (items.length === 0) {
    return <ChartEmptyState className={className} />;
  }

  return (
    <MuiChartWrapper className={className}>
      <RadarChart
        height={height}
        series={[
          {
            label: "Performance",
            data,
            fillArea: true,
            color: "#8b5cf6",
          },
        ]}
        radar={{
          max: 100,
          metrics,
        }}
        shape="circular"
        divisions={5}
        hideLegend
        sx={CHART_SX}
        slotProps={CHART_TOOLTIP_SLOT_PROPS}
      />
    </MuiChartWrapper>
  );
}
