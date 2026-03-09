import type { Patient } from "@/lib/types";
import { PatientCard } from "./patient-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";

interface PatientListProps {
  patients: Patient[];
}

export function PatientList({ patients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No patients found"
        description="Try adjusting your filters or search query to find patients."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
}
