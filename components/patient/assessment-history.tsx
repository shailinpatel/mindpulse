"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssessmentEntry } from "@/lib/types";
import { CHART_COLORS, SEVERITY_BAND_COLORS, PHQ9_BANDS, GAD7_BANDS } from "@/lib/constants";
import { formatShortDate } from "@/lib/formatters";

interface AssessmentHistoryProps {
  assessments: AssessmentEntry[];
}

export function AssessmentHistory({ assessments }: AssessmentHistoryProps) {
  // Merge PHQ-9 and GAD-7 entries by date
  const dateMap = new Map<string, { date: string; phq9?: number; gad7?: number }>();
  assessments.forEach((a) => {
    const existing = dateMap.get(a.date) || { date: a.date };
    if (a.type === "phq9") existing.phq9 = a.score;
    else existing.gad7 = a.score;
    dateMap.set(a.date, existing);
  });

  const chartData = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />

              {/* PHQ-9 severity bands */}
              {PHQ9_BANDS.map((band) => (
                <ReferenceArea
                  key={`phq9-${band.severity}`}
                  y1={band.min}
                  y2={band.max}
                  fill={SEVERITY_BAND_COLORS[band.severity]}
                  fillOpacity={1}
                  ifOverflow="hidden"
                />
              ))}

              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => formatShortDate(d)}
                stroke={CHART_COLORS.axis}
                tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                axisLine={{ stroke: CHART_COLORS.grid }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 27]}
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
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="phq9"
                name="PHQ-9"
                stroke={CHART_COLORS.phq9}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS.phq9 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="gad7"
                name="GAD-7"
                stroke={CHART_COLORS.gad7}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS.gad7 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* Severity band legend */}
        <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
          {PHQ9_BANDS.map((band) => (
            <span key={band.severity} className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{ backgroundColor: SEVERITY_BAND_COLORS[band.severity].replace("0.08", "0.5") }}
              />
              {band.label} ({band.min}-{band.max})
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
