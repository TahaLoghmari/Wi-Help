import { ContentLoading } from "@/components";
import { PatientProfile, usePatient } from "@/features/patient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/professional/patient/$patientId")({
  component: PatientProfileRoute,
  pendingComponent: ContentLoading,
});

function PatientProfileRoute() {
  const { patientId } = Route.useParams();
  const { data: patient, isLoading } = usePatient(patientId);

  if (isLoading) {
    return <ContentLoading />;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return <PatientProfile patient={patient} />;
}
