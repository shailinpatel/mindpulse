"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopBar } from "@/components/layout/top-bar";
import { PatientHeader } from "@/components/patient/patient-header";
import { AssessmentHistory } from "@/components/patient/assessment-history";
import { MoodTracker } from "@/components/patient/mood-tracker";
import { PassiveDataGrid } from "@/components/patient/passive-data-grid";
import { Timeline } from "@/components/patient/timeline";
import { ClinicianNotes } from "@/components/patient/clinician-notes";
import { JournalEntries } from "@/components/patient/journal-entries";
import { MedicationAdherence } from "@/components/patient/medication-adherence";
import { getPatientById } from "@/lib/mock-data";

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const patient = getPatientById(id);

  if (!patient) {
    notFound();
  }

  return (
    <>
      <TopBar
        title={patient.name}
        subtitle="Patient Detail"
        alertCount={patient.activeAlerts}
      />
      <div className="space-y-6 p-6">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Patient Header with Risk Gauge */}
        <PatientHeader patient={patient} />

        {/* Tabbed content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="passive">Passive Data</TabsTrigger>
            <TabsTrigger value="notes">Notes & Journal</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <AssessmentHistory assessments={patient.assessments} />
              <MoodTracker entries={patient.moodEntries} />
            </div>
            <MedicationAdherence days={patient.medicationAdherence} />
          </TabsContent>

          {/* Passive Data Tab */}
          <TabsContent value="passive">
            <PassiveDataGrid metrics={patient.passiveMetrics} />
          </TabsContent>

          {/* Notes & Journal Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ClinicianNotes notes={patient.clinicianNotes} />
              <JournalEntries entries={patient.journalEntries} />
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Timeline events={patient.timeline} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
