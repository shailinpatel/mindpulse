import Link from "next/link";
import type { Patient } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/shared/risk-badge";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { Sparkline } from "@/components/shared/sparkline";
import { formatPHQ9, formatGAD7 } from "@/lib/formatters";
import { RISK_COLORS } from "@/lib/constants";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const borderColor = RISK_COLORS[patient.riskScore.level];

  return (
    <Link href={`/patients/${patient.id}`}>
      <Card
        className="card-hover cursor-pointer border-l-[3px] border-border/50 bg-card"
        style={{ borderLeftColor: borderColor }}
      >
        <CardContent className="p-4">
          {/* Top row: Name + Risk Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {patient.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {patient.age}y &middot;{" "}
                {patient.condition === "both"
                  ? "Depression & Anxiety"
                  : patient.condition.charAt(0).toUpperCase() + patient.condition.slice(1)}
              </p>
            </div>
            <RiskBadge level={patient.riskScore.level} showDot />
          </div>

          {/* Middle: Scores + Sparkline */}
          <div className="mt-3 flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    PHQ-9
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {formatPHQ9(patient.latestPHQ9)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    GAD-7
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {formatGAD7(patient.latestGAD7)}
                  </p>
                </div>
              </div>
            </div>
            {patient.phq9Trend.length > 1 && (
              <Sparkline
                data={patient.phq9Trend}
                color={RISK_COLORS[patient.riskScore.level]}
              />
            )}
          </div>

          {/* Bottom: Trend + Alerts */}
          <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2.5">
            <TrendIndicator trend={patient.riskScore.trend} />
            {patient.activeAlerts > 0 && (
              <span className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                patient.activeAlerts >= 2 ? "text-risk-critical" : "text-risk-moderate"
              )}>
                <Bell className="h-3 w-3" />
                {patient.activeAlerts} alert{patient.activeAlerts !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
