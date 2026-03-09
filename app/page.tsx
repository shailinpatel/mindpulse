"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { SummaryMetrics } from "@/components/dashboard/summary-metrics";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { PatientList } from "@/components/dashboard/patient-list";
import { getPatientSummaries, getDashboardSummary } from "@/lib/mock-data";
import type { Patient, RiskLevel, Condition } from "@/lib/types";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const allPatients = useMemo(() => getPatientSummaries(), []);
  const summary = useMemo(() => getDashboardSummary(), []);

  const filteredPatients = useMemo(() => {
    return allPatients.filter((p: Patient) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (riskFilter !== "all" && p.riskScore.level !== (riskFilter as RiskLevel)) return false;
      if (conditionFilter !== "all" && p.condition !== (conditionFilter as Condition)) return false;
      return true;
    });
  }, [allPatients, searchQuery, riskFilter, conditionFilter]);

  return (
    <>
      <TopBar
        title="Patient Dashboard"
        subtitle={`${summary.totalPatients} patients under monitoring`}
        alertCount={summary.activeAlerts}
      />
      <div className="space-y-6 p-6">
        <SummaryMetrics summary={summary} />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Patients
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredPatients.length})
              </span>
            </h2>
          </div>
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            riskFilter={riskFilter}
            onRiskFilterChange={setRiskFilter}
            conditionFilter={conditionFilter}
            onConditionFilterChange={setConditionFilter}
          />
          <PatientList patients={filteredPatients} />
        </div>
      </div>
    </>
  );
}
