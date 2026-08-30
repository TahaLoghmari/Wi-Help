import { render } from "@testing-library/react-native";
import { PatientProfileScreen } from "./patient-profile-screen";

const mockUseGetCurrentPatient = jest.fn();
const mockUseGetPatientById = jest.fn();

jest.mock("@/entities/patient", () => ({
  useGetCurrentPatient: (options: unknown) =>
    mockUseGetCurrentPatient(options),
  useGetPatientById: (patientId: string | undefined) =>
    mockUseGetPatientById(patientId),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("./patient-profile-overview", () => ({
  PatientProfileOverview: () => null,
}));

describe("PatientProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetCurrentPatient.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    });
    mockUseGetPatientById.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    });
  });

  it.each([
    [undefined, true],
    ["patient-1", false],
  ])("gates the current-patient query for patientId %s", async (patientId, enabled) => {
    await render(
      <PatientProfileScreen
        patientId={patientId}
        renderReviews={() => null}
      />,
    );

    expect(mockUseGetCurrentPatient).toHaveBeenCalledWith({ enabled });
  });
});
