import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Trend } from "@/lib/types";
import { cn } from "@/lib/utils";

const TREND_CONFIG: Record<Trend, { icon: typeof TrendingUp; label: string; className: string }> = {
  improving: { icon: TrendingUp, label: "Improving", className: "text-risk-low" },
  stable: { icon: Minus, label: "Stable", className: "text-muted-foreground" },
  declining: { icon: TrendingDown, label: "Declining", className: "text-risk-critical" },
};

interface TrendIndicatorProps {
  trend: Trend;
  showLabel?: boolean;
  className?: string;
}

export function TrendIndicator({ trend, showLabel = true, className }: TrendIndicatorProps) {
  const config = TREND_CONFIG[trend];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1", config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && (
        <span className="text-xs font-medium">{config.label}</span>
      )}
    </span>
  );
}
