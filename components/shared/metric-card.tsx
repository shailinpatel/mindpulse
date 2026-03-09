import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconColor?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  iconColor,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("border-border/50 bg-card", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-risk-low",
                changeType === "negative" && "text-risk-critical",
                changeType === "neutral" && "text-muted-foreground",
              )}>
                {change}
              </p>
            )}
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconColor ? `color-mix(in oklch, ${iconColor} 15%, transparent)` : undefined }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: iconColor }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
