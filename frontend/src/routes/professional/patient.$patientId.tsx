import { ContentLoading } from "@/components";
import { PatientProfile, usePatient } from "@/features/patient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/professional/patient/$patientId")({
  component: PatientProfileRoute,
  pendingComponent: ContentLoading,
});

function PatientProfileRoute() {
  const { patientId } = Route.useParams();
  const { data: patient, isLoading, isError } = usePatient(patientId);

  if (isLoading) {
    return <ContentLoading />;
  }

  if (isError || !patient) {
    return <div>Patient not found or error loading patient.</div>;
  }

  return <PatientProfile patient={patient} showBackButton />;
}
