import { render } from "@testing-library/react-native";
import type { SessionRole } from "@/features/auth/session";
import {
  PatientProfileComposition,
  ProfessionalProfileComposition,
} from "./profile-reviews";

const mockUseCurrentUser = jest.fn();
const mockUseGetCurrentPatient = jest.fn();
const mockUseGetCurrentProfessional = jest.fn();
const mockReviewsSection = jest.fn((_props: unknown) => null);

jest.mock("@/features/auth/session", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

jest.mock("@/features/patients/api", () => ({
  useGetCurrentPatient: (options: unknown) =>
    mockUseGetCurrentPatient(options),
}));

jest.mock("@/features/professionals/api", () => ({
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
  ReviewsSection: (props: unknown) => mockReviewsSection(props),
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

  it("passes the viewer profile identity needed for subject authorization", async () => {
    mockUseCurrentUser.mockReturnValue({
      data: { id: "professional-user", role: "Professional" },
    });
    mockUseGetCurrentProfessional.mockReturnValue({
      data: { id: "professional-1" },
    });

    await render(
      <ProfessionalProfileComposition professionalId="professional-1" />,
    );

    expect(mockReviewsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: { id: "professional-1", kind: "professional" },
        viewer: {
          userId: "professional-user",
          profileId: "professional-1",
          role: "Professional",
        },
      }),
    );
  });
});
