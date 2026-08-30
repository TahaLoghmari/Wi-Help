import { render } from "@testing-library/react-native";
import type { SessionRole } from "@/entities/session";
import {
  PatientProfileComposition,
  ProfessionalProfileComposition,
} from "./profile-reviews";

const mockUseCurrentUser = jest.fn();
const mockUseGetCurrentPatient = jest.fn();
const mockUseGetCurrentProfessional = jest.fn();

jest.mock("@/entities/session", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

jest.mock("@/entities/patient", () => ({
  useGetCurrentPatient: (options: unknown) =>
    mockUseGetCurrentPatient(options),
}));

jest.mock("@/entities/professional", () => ({
  useGetCurrentProfessional: (options: unknown) =>
    mockUseGetCurrentProfessional(options),
}));

jest.mock("@/features/patients", () => ({
  PatientProfileScreen: ({
    renderReviews,
  }: {
    renderReviews: (patientId: string) => React.ReactNode;
  }) => renderReviews("patient-1"),
}));

jest.mock("@/features/professionals", () => ({
  ProfessionalProfileScreen: ({
    renderReviews,
  }: {
    renderReviews: (professionalId: string) => React.ReactNode;
  }) => renderReviews("professional-1"),
}));

jest.mock("@/features/reviews", () => ({
  ReviewsSection: () => null,
}));

describe("profile review composition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetCurrentPatient.mockReturnValue({ data: undefined });
    mockUseGetCurrentProfessional.mockReturnValue({ data: undefined });
  });

  it.each<{
    role: SessionRole;
    patientEnabled: boolean;
    professionalEnabled: boolean;
  }>([
    { role: "Patient", patientEnabled: true, professionalEnabled: false },
    { role: "Professional", patientEnabled: false, professionalEnabled: true },
    { role: "Admin", patientEnabled: false, professionalEnabled: false },
    { role: "Unknown", patientEnabled: false, professionalEnabled: false },
  ])(
    "only enables the $role viewer's profile query",
    async ({ role, patientEnabled, professionalEnabled }) => {
      mockUseCurrentUser.mockReturnValue({ data: { id: "user-1", role } });

      await render(<PatientProfileComposition />);
      await render(
        <ProfessionalProfileComposition professionalId="professional-1" />,
      );

      expect(mockUseGetCurrentPatient).toHaveBeenCalledWith({
        enabled: patientEnabled,
      });
      expect(mockUseGetCurrentProfessional).toHaveBeenCalledWith({
        enabled: professionalEnabled,
      });
    },
  );
});
