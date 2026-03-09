import type { TimelineEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/formatters";
import {
  ClipboardList, AlertTriangle, FileText,
  Pill, Calendar, Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENT_CONFIG: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  assessment: { icon: ClipboardList, color: "text-blue-400", bgColor: "bg-blue-400/10" },
  alert: { icon: AlertTriangle, color: "text-risk-elevated", bgColor: "bg-risk-elevated/10" },
  note: { icon: FileText, color: "text-teal", bgColor: "bg-teal/10" },
  medication: { icon: Pill, color: "text-purple-400", bgColor: "bg-purple-400/10" },
  appointment: { icon: Calendar, color: "text-green-400", bgColor: "bg-green-400/10" },
  milestone: { icon: Award, color: "text-yellow-400", bgColor: "bg-yellow-400/10" },
};

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />

          {events.slice(0, 15).map((event) => {
            const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.note;
            const Icon = config.icon;

            return (
              <div key={event.id} className="relative flex gap-4 py-3">
                {/* Icon dot */}
                <div className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  config.bgColor
                )}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
