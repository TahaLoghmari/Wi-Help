import { createFileRoute } from "@tanstack/react-router";
import { GetPatient, PatientProfile } from "@/features/patient";
import { Spinner } from "@/components/ui";

export const Route = createFileRoute("/admin/patients/$patientId")({
  component: AdminPatientProfilePage,
});

function AdminPatientProfilePage() {
  const { patientId } = Route.useParams();
  const { data: patient, isLoading, isError } = GetPatient({ patientId });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading patient profile.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50/50">
      <PatientProfile patient={patient} showBackButton={true} />
    </div>
  );
}
