"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoodEntry } from "@/lib/types";
import { CHART_COLORS, MOOD_COLORS } from "@/lib/constants";
import { formatShortDate } from "@/lib/formatters";

interface MoodTrackerProps {
  entries: MoodEntry[];
}

export function MoodTracker({ entries }: MoodTrackerProps) {
  // Show last 30 entries
  const chartData = entries.slice(-30);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => formatShortDate(d)}
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 10, fill: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_COLORS.tooltipBg,
                  border: `1px solid ${CHART_COLORS.tooltipBorder}`,
                  borderRadius: 6,
                  fontSize: 12,
                }}
                labelFormatter={(d) => formatShortDate(String(d))}
                formatter={(value) => [value, "Mood"]}
              />
              <Bar dataKey="rating" radius={[3, 3, 0, 0]} maxBarSize={12}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={MOOD_COLORS[entry.rating] || MOOD_COLORS[3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
