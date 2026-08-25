import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { useCurrentUser } from "@/entities/session";
import { ROUTE_PATHS } from "@/config/routes";
import { AuthGuard } from "./auth-guard";
import { GuestGuard } from "./guest-guard";

const mockRedirect = jest.fn((_props: { href: string }) => null);

jest.mock("expo-router", () => ({
  Redirect: (props: { href: string }) => mockRedirect(props),
}));

jest.mock("@/entities/session", () => ({
  useCurrentUser: jest.fn(),
}));

const user = {
  id: "user-1",
  firstName: "Ada",
  lastName: "Lovelace",
  dateOfBirth: "10/12/1815",
  gender: "Female",
  phoneNumber: "+15551234567",
  email: "ada@example.com",
  address: {
    street: "1 Example Street",
    city: "London",
    postalCode: "SW1A 1AA",
    countryId: "gb",
    stateId: "london",
  },
  profilePictureUrl: "",
  role: "Patient" as const,
  isOnboardingCompleted: true,
};

function mockCurrentUser(data: typeof user | null) {
  jest.mocked(useCurrentUser).mockReturnValue({
    data,
    isPending: false,
  } as unknown as ReturnType<typeof useCurrentUser>);
}

function mockCurrentUserError(refetch: jest.Mock) {
  jest.mocked(useCurrentUser).mockReturnValue({
    data: undefined,
    isPending: false,
    isError: true,
    refetch,
  } as unknown as ReturnType<typeof useCurrentUser>);
}

describe("AuthGuard", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
  });

  it("shows a retry state without redirecting or rendering protected content when the session query fails", async () => {
    const refetch = jest.fn();
    mockCurrentUserError(refetch);

    await render(
      <AuthGuard>
        <Text>Protected content</Text>
      </AuthGuard>,
    );

    expect(screen.queryByText("Protected content")).not.toBeOnTheScreen();
    expect(mockRedirect).not.toHaveBeenCalled();

    fireEvent.press(screen.getByRole("button", { name: "Try Again" }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("does not grant a patient access to a professional route", async () => {
    mockCurrentUser(user);

    await render(
      <AuthGuard role="Professional">
        <Text>Protected content</Text>
      </AuthGuard>,
    );

    expect(screen.queryByText("Protected content")).not.toBeOnTheScreen();
    expect(mockRedirect).toHaveBeenCalledWith({
      href: ROUTE_PATHS.AUTH.LOGIN,
    });
  });

  it("does not grant an unknown role access to an authenticated route", async () => {
    mockCurrentUser({ ...user, role: "Unknown" } as unknown as typeof user);

    await render(
      <AuthGuard>
        <Text>Protected content</Text>
      </AuthGuard>,
    );

    expect(screen.queryByText("Protected content")).not.toBeOnTheScreen();
    expect(mockRedirect).toHaveBeenCalledWith({
      href: ROUTE_PATHS.AUTH.LOGIN,
    });
  });
});

describe("GuestGuard", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
  });

  it("shows a retry state without redirecting or rendering guest content when the session query fails", async () => {
    const refetch = jest.fn();
    mockCurrentUserError(refetch);

    await render(
      <GuestGuard>
        <Text>Guest content</Text>
      </GuestGuard>,
    );

    expect(screen.queryByText("Guest content")).not.toBeOnTheScreen();
    expect(mockRedirect).not.toHaveBeenCalled();

    fireEvent.press(screen.getByRole("button", { name: "Try Again" }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("does not route a user with no recognized role into a role app", async () => {
    mockCurrentUser({ ...user, role: "Unknown" } as unknown as typeof user);

    await render(
      <GuestGuard>
        <Text>Guest content</Text>
      </GuestGuard>,
    );

    expect(screen.getByText("Guest content")).toBeOnTheScreen();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
