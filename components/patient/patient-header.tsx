import type { PatientDetail } from "@/lib/types";
import { RiskBadge } from "@/components/shared/risk-badge";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { RiskScoreGauge } from "./risk-score-gauge";
import { formatDate, formatPHQ9, formatGAD7 } from "@/lib/formatters";
import { Calendar, User } from "lucide-react";

interface PatientHeaderProps {
  patient: PatientDetail;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const conditionLabel = patient.condition === "both"
    ? "Depression & Anxiety"
    : patient.condition.charAt(0).toUpperCase() + patient.condition.slice(1);

  return (
    <div className="flex items-start gap-6">
      {/* Avatar + Info */}
      <div className="flex flex-1 items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
          {patient.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {patient.name}
            </h1>
            <RiskBadge level={patient.riskScore.level} showDot />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {patient.age}y &middot; {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
            </span>
            <span>&middot;</span>
            <span>{conditionLabel}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Enrolled {formatDate(patient.enrolledDate)}
            </span>
          </div>
          {/* Score summary row */}
          <div className="flex items-center gap-6 pt-2">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                PHQ-9
              </span>
              <p className="text-lg font-bold text-foreground">
                {formatPHQ9(patient.latestPHQ9)}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                GAD-7
              </span>
              <p className="text-lg font-bold text-foreground">
                {formatGAD7(patient.latestGAD7)}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Trend
              </span>
              <div className="mt-0.5">
                <TrendIndicator trend={patient.riskScore.trend} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Gauge */}
      <RiskScoreGauge
        value={patient.riskScore.value}
        level={patient.riskScore.level}
      />
    </div>
  );
}
