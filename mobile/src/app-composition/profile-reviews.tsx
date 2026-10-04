import { useGetCurrentPatient } from "@/features/patients/api";
import { useGetCurrentProfessional } from "@/features/professionals/api";
import { useCurrentUser } from "@/features/auth/session";
import {
  PatientProfileScreen,
  type PatientProfileScreenProps,
} from "@/features/patients";
import {
  ProfessionalProfileScreen,
  type ProfessionalProfileScreenProps,
} from "@/features/professionals";
import { ReviewsSection, type ReviewViewer } from "@/features/reviews";

type PatientProfileCompositionProps = Omit<
  PatientProfileScreenProps,
  "renderReviews"
>;

type ProfessionalProfileCompositionProps = Omit<
  ProfessionalProfileScreenProps,
  "renderReviews"
>;

function getViewerRole(role: string | undefined): ReviewViewer["role"] {
  if (role === "Professional" || role === "Admin") return role;
  return "Patient";
}

export function PatientProfileComposition(
  props: PatientProfileCompositionProps,
) {
  const { data: currentUser } = useCurrentUser();
  const { data: currentPatient } = useGetCurrentPatient({
    enabled: currentUser?.role === "Patient",
  });
  const { data: currentProfessional } = useGetCurrentProfessional({
    enabled: currentUser?.role === "Professional",
  });
  const role = getViewerRole(currentUser?.role);
  const profileId =
    role === "Patient" ? currentPatient?.id : currentProfessional?.id;

  return (
    <PatientProfileScreen
      {...props}
      renderReviews={(patientId) => (
        <ReviewsSection
          subject={{ id: patientId, kind: "patient" }}
          viewer={{
            userId: currentUser?.id,
            profileId,
            role,
          }}
        />
      )}
    />
  );
}

export function ProfessionalProfileComposition(
  props: ProfessionalProfileCompositionProps,
) {
  const { data: currentUser } = useCurrentUser();
  const { data: currentPatient } = useGetCurrentPatient({
    enabled: currentUser?.role === "Patient",
  });
  const { data: currentProfessional } = useGetCurrentProfessional({
    enabled: currentUser?.role === "Professional",
  });
  const role = getViewerRole(currentUser?.role);
  const profileId =
    role === "Patient" ? currentPatient?.id : currentProfessional?.id;

  return (
    <ProfessionalProfileScreen
      {...props}
      renderReviews={(professionalId) => (
        <ReviewsSection
          subject={{ id: professionalId, kind: "professional" }}
          viewer={{
            userId: currentUser?.id,
            profileId,
            role,
          }}
        />
      )}
    />
  );
}
