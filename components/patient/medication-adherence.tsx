import type { MedicationDay } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatShortDate } from "@/lib/formatters";

interface MedicationAdherenceProps {
  days: MedicationDay[];
}

export function MedicationAdherence({ days }: MedicationAdherenceProps) {
  // Show last 12 weeks (84 days) in a calendar grid
  const recentDays = days.slice(-84);
  const weeks: MedicationDay[][] = [];
  for (let i = 0; i < recentDays.length; i += 7) {
    weeks.push(recentDays.slice(i, i + 7));
  }

  const takenCount = recentDays.filter((d) => d.taken).length;
  const adherenceRate = recentDays.length > 0
    ? Math.round((takenCount / recentDays.length) * 100)
    : 0;

  const medicationName = recentDays[0]?.medication || "Unknown";

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal" />
            Medication Adherence
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {medicationName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Adherence rate */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className={cn(
            "text-2xl font-bold",
            adherenceRate >= 80 ? "text-risk-low" : adherenceRate >= 60 ? "text-risk-moderate" : "text-risk-critical"
          )}>
            {adherenceRate}%
          </span>
          <span className="text-xs text-muted-foreground">
            adherence (past 12 weeks)
          </span>
        </div>

        {/* Calendar heatmap */}
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <Tooltip key={di}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "h-3 w-3 rounded-sm transition-colors",
                        day.taken
                          ? "bg-risk-low/70 hover:bg-risk-low"
                          : "bg-risk-critical/30 hover:bg-risk-critical/50"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {formatShortDate(day.date)} — {day.taken ? "Taken" : "Missed"}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-risk-low/70" />
            Taken
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-risk-critical/30" />
            Missed
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
