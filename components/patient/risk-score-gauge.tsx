"use client";

import { RISK_COLORS } from "@/lib/constants";
import type { RiskLevel } from "@/lib/types";

interface RiskScoreGaugeProps {
  value: number;
  level: RiskLevel;
  size?: number;
}

export function RiskScoreGauge({ value, level, size = 120 }: RiskScoreGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Show arc from 0 to value%
  const progress = value / 100;
  const offset = circumference * (1 - progress);
  const color = RISK_COLORS[level];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-gauge"
          style={{
            "--gauge-circumference": `${circumference}`,
            "--gauge-offset": `${offset}`,
          } as React.CSSProperties}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {Math.round(value)}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Risk
        </span>
      </div>
    </div>
  );
}
