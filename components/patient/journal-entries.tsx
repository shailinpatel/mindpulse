import type { JournalEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/formatters";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const SENTIMENT_CLASSES: Record<string, string> = {
  positive: "bg-risk-low/15 text-risk-low border-risk-low/25",
  neutral: "bg-risk-moderate/15 text-risk-moderate border-risk-moderate/25",
  negative: "bg-risk-critical/15 text-risk-critical border-risk-critical/25",
};

interface JournalEntriesProps {
  entries: JournalEntry[];
}

export function JournalEntries({ entries }: JournalEntriesProps) {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Journal Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.slice(0, 8).map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-border/30 bg-secondary/30 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(entry.date)}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 px-1.5 text-[10px] font-medium capitalize",
                    SENTIMENT_CLASSES[entry.sentiment]
                  )}
                >
                  {entry.sentiment}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
