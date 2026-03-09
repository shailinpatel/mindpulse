import { Users, AlertTriangle, ClipboardList, Bell } from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";
import type { DashboardSummary } from "@/lib/types";

interface SummaryMetricsProps {
  summary: DashboardSummary;
}

export function SummaryMetrics({ summary }: SummaryMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        label="Total Patients"
        value={summary.totalPatients}
        icon={Users}
        iconColor="var(--teal)"
        change="Active monitoring"
        changeType="neutral"
      />
      <MetricCard
        label="High Risk"
        value={summary.highRiskCount}
        icon={AlertTriangle}
        iconColor="var(--risk-critical)"
        change="Elevated + Critical"
        changeType={summary.highRiskCount > 0 ? "negative" : "neutral"}
      />
      <MetricCard
        label="Pending Assessments"
        value={summary.pendingAssessments}
        icon={ClipboardList}
        iconColor="var(--risk-moderate)"
        change="Overdue > 7 days"
        changeType={summary.pendingAssessments > 3 ? "negative" : "neutral"}
      />
      <MetricCard
        label="Active Alerts"
        value={summary.activeAlerts}
        icon={Bell}
        iconColor="var(--risk-elevated)"
        change="Unacknowledged"
        changeType={summary.activeAlerts > 5 ? "negative" : "neutral"}
      />
    </div>
  );
}
