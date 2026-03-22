"use client";

import { useId, useState } from "react";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { GrowthDataPoint } from "@/lib/queries/analytics";

interface CollectionGrowthChartProps {
  data: GrowthDataPoint[];
}

type GrowthView = "cumulative" | "monthly";

const cumulativeConfig: ChartConfig = {
  cumulative: { label: "Total Sets", color: "hsl(var(--chart-2))" },
};

const monthlyConfig: ChartConfig = {
  added: { label: "Sets Added", color: "hsl(var(--chart-3))" },
};

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(m, 10) - 1] ?? "?";
  return `${monthName} '${year.slice(2)}`;
}

export function CollectionGrowthChart({ data }: CollectionGrowthChartProps) {
  const [view, setView] = useState<GrowthView>("cumulative");
  const gradientId = `growthGradient-${useId().replace(/:/g, "")}`;

  if (data.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            Collection Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Add sets to your collection to see growth over time.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Collection Growth
        </CardTitle>
        <div className="flex items-center bg-muted rounded-lg p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("cumulative")}
            className={`h-7 px-3 text-xs rounded-md ${
              view === "cumulative"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cumulative
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("monthly")}
            className={`h-7 px-3 text-xs rounded-md ${
              view === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === "cumulative" ? (
          <ChartContainer config={cumulativeConfig} className="h-[250px] w-full">
            <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis tickLine={false} axisLine={false} width={30} tick={{ fontSize: 11 }} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} total set${Number(value) !== 1 ? "s" : ""}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="var(--color-cumulative)"
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={monthlyConfig} className="h-[250px] w-full">
            <BarChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis tickLine={false} axisLine={false} width={30} tick={{ fontSize: 11 }} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `${value} set${Number(value) !== 1 ? "s" : ""} added`}
                  />
                }
              />
              <Bar dataKey="added" fill="var(--color-added)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
