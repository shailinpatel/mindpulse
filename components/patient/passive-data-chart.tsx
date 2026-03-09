"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";
import type { PassiveMetric } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { formatShortDate, formatUnit } from "@/lib/formatters";

interface PassiveDataChartProps {
  metric: PassiveMetric;
}

export function PassiveDataChart({ metric }: PassiveDataChartProps) {
  // Show last 30 days for compact display
  const data = metric.data.slice(-30);

  return (
    <div className="rounded-lg border border-border/50 bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground">{metric.label}</p>
          <p className="text-lg font-bold text-foreground">
            {formatUnit(metric.currentValue, metric.unit)}
          </p>
        </div>
        <TrendIndicator trend={metric.trend} showLabel={false} />
      </div>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -30 }}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.teal} stopOpacity={0.3} />
                <stop offset="100%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            {/* Normal range band */}
            <ReferenceArea
              y1={metric.normalRange.min}
              y2={metric.normalRange.max}
              fill="rgba(74, 222, 128, 0.05)"
              fillOpacity={1}
            />
            <XAxis
              dataKey="date"
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: CHART_COLORS.axis }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_COLORS.tooltipBg,
                border: `1px solid ${CHART_COLORS.tooltipBorder}`,
                borderRadius: 6,
                fontSize: 11,
              }}
              labelFormatter={(d) => formatShortDate(String(d))}
              formatter={(value) => [formatUnit(Number(value), metric.unit), metric.label]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.teal}
              strokeWidth={1.5}
              fill={`url(#gradient-${metric.id})`}
              dot={false}
              activeDot={{ r: 3, fill: CHART_COLORS.teal }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
