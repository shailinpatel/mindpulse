import type { RiskLevel } from "@/lib/types";
import { formatRiskLevel } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const BADGE_CLASSES: Record<RiskLevel, string> = {
  low: "bg-risk-low/15 text-risk-low border-risk-low/25",
  moderate: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/25",
  elevated: "bg-risk-elevated/15 text-risk-elevated border-risk-elevated/25",
  critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/25",
};

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
}

export function RiskBadge({ level, className, showDot = false }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        BADGE_CLASSES[level],
        className
      )}
    >
      {showDot && (
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          level === "low" && "bg-risk-low",
          level === "moderate" && "bg-risk-moderate",
          level === "elevated" && "bg-risk-elevated",
          level === "critical" && "bg-risk-critical animate-pulse",
        )} />
      )}
      {formatRiskLevel(level)}
    </span>
  );
}
