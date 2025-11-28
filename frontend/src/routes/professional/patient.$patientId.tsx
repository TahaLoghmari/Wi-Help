import { ContentLoading } from "@/components";
import { PatientProfile, GetPatient } from "@/features/patient";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/professional/patient/$patientId")({
  component: PatientProfileRoute,
  pendingComponent: ContentLoading,
});

function PatientProfileRoute() {
  const { patientId } = useParams({ strict: false });
  console.log(patientId);
  const {
    data: patient,
    isLoading,
    isError,
  } = GetPatient({ patientId: patientId! });

  if (isLoading) {
    return <ContentLoading />;
  }

  if (isError) {
    return <div>Patient not found or error loading patient.</div>;
  }

  return <PatientProfile patient={patient} showBackButton />;
}
