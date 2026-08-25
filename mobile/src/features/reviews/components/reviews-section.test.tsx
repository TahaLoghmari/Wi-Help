import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import type { ReactNode } from "react";
import { api } from "@/lib/api-client";
import { ReviewsSection } from "./reviews-section";

jest.mock("@/lib/api-client", () => ({
  api: {
    delete: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: { show: jest.fn() },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: 0, retry: false },
      mutations: { gcTime: 0, retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("ReviewsSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(api.get).mockImplementation(async (url) => {
      if (url.startsWith("/reviews/stats")) {
        return { averageRating: 0, totalCount: 0 };
      }
      return {
        items: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    });
    jest.mocked(api.delete).mockResolvedValue({});
    jest.mocked(api.post).mockResolvedValue({});
  });

  it("submits the subject id with the review entered by an eligible viewer", async () => {
    await render(
      <ReviewsSection
        subject={{ id: "professional-1", kind: "professional" }}
        viewer={{
          userId: "user-1",
          profileId: "patient-1",
          role: "Patient",
        }}
      />,
      { wrapper: createWrapper() },
    );

    const user = userEvent.setup();
    await user.press(
      await screen.findByRole("button", { name: "Rate 4 stars" }),
    );
    await user.type(
      screen.getByLabelText("Review comment input"),
      "  Excellent care  ",
    );
    await user.press(
      screen.getByRole("button", {
        name: "patientProfile.reviews.submitReview",
      }),
    );

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/reviews", {
        subjectId: "professional-1",
        comment: "Excellent care",
        rating: 4,
      }),
    );
  });

  it("wires a review reply to the matching review endpoint", async () => {
    jest.mocked(api.get).mockImplementation(async (url) => {
      if (url.startsWith("/reviews/stats")) {
        return { averageRating: 5, totalCount: 1 };
      }
      return {
        items: [
          {
            id: "review-1",
            comment: "Thoughtful clinician",
            rating: 5,
            type: 1,
            createdAt: "2026-08-25T10:00:00.000Z",
            updatedAt: "2026-08-25T10:00:00.000Z",
            author: {
              id: "patient-2",
              firstName: "Grace",
              lastName: "Hopper",
            },
            likesCount: 0,
            repliesCount: 0,
            isLiked: false,
            replies: [],
          },
        ],
        page: 1,
        pageSize: 10,
        totalCount: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    });

    await render(
      <ReviewsSection
        subject={{ id: "professional-1", kind: "professional" }}
        viewer={{
          userId: "user-1",
          profileId: "patient-1",
          role: "Patient",
        }}
      />,
      { wrapper: createWrapper() },
    );

    const user = userEvent.setup();
    await user.press(
      await screen.findByRole("button", {
        name: "patientProfile.reviews.reply",
      }),
    );
    await user.type(screen.getByLabelText("Reply text input"), "  Thank you  ");
    await user.press(
      screen.getByRole("button", {
        name: "patientProfile.reviews.sendReply",
      }),
    );

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/reviews/review-1/replies", {
        comment: "Thank you",
      }),
    );
  });

});
