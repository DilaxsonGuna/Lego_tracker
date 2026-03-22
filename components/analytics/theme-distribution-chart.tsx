"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ThemeDataPoint } from "@/lib/queries/analytics";

interface ThemeDistributionChartProps {
  data: ThemeDataPoint[];
}

const INITIAL_SHOW = 8;

const CHART_COLORS = [
  "var(--color-t0)",
  "var(--color-t1)",
  "var(--color-t2)",
  "var(--color-t3)",
  "var(--color-t4)",
];

export function ThemeDistributionChart({ data }: ThemeDistributionChartProps) {
  const [showAll, setShowAll] = useState(false);

  if (data.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            Theme Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Add sets to your collection to see theme distribution.
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayData = showAll ? data : data.slice(0, INITIAL_SHOW);

  const chartConfig: ChartConfig = Object.fromEntries(
    displayData.map((d, i) => [
      `t${i}`,
      { label: d.theme, color: `hsl(var(--chart-${(i % 5) + 1}))` },
    ])
  );

  // Transform data for recharts — each row needs a unique key
  const chartData = displayData.map((d, i) => ({
    theme: d.theme.length > 18 ? d.theme.slice(0, 16) + "…" : d.theme,
    fullTheme: d.theme,
    count: d.count,
    fill: CHART_COLORS[i % 5],
  }));

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Theme Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height: displayData.length * 36 + 20 }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
          >
            <YAxis
              dataKey="theme"
              type="category"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fontSize: 12 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, props) => (
                    <span>
                      <span className="font-medium">{props.payload.fullTheme}</span>: {value} set
                      {Number(value) !== 1 ? "s" : ""}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>

        {data.length > INITIAL_SHOW && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs"
            >
              {showAll ? "Show less" : `Show all ${data.length} themes`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
