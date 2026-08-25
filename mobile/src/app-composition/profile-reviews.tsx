import { useGetCurrentPatient } from "@/entities/patient";
import { useGetCurrentProfessional } from "@/entities/professional";
import { useCurrentUser } from "@/entities/session";
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
  const { data: currentProfessional } = useGetCurrentProfessional();
  const role = getViewerRole(currentUser?.role);

  return (
    <PatientProfileScreen
      {...props}
      renderReviews={(patientId) => (
        <ReviewsSection
          subject={{ id: patientId, kind: "patient" }}
          viewer={{
            userId: currentUser?.id,
            profileId:
              role === "Professional" ? currentProfessional?.id : undefined,
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
  const { data: currentPatient } = useGetCurrentPatient();
  const role = getViewerRole(currentUser?.role);

  return (
    <ProfessionalProfileScreen
      {...props}
      renderReviews={(professionalId) => (
        <ReviewsSection
          subject={{ id: professionalId, kind: "professional" }}
          viewer={{
            userId: currentUser?.id,
            profileId: role === "Patient" ? currentPatient?.id : undefined,
            role,
          }}
        />
      )}
    />
  );
}
