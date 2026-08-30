import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import type { ReactNode } from "react";
import Toast from "react-native-toast-message";
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

  it("dismisses the delete dialog and shows the existing error toast when review deletion fails", async () => {
    jest.mocked(api.get).mockImplementation(async (url) => {
      if (url.startsWith("/reviews/stats")) {
        return { averageRating: 5, totalCount: 1 };
      }
      return {
        items: [
          {
            id: "review-1",
            comment: "My review",
            rating: 5,
            type: 1,
            createdAt: "2026-08-25T10:00:00.000Z",
            updatedAt: "2026-08-25T10:00:00.000Z",
            author: {
              id: "patient-1",
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
    jest.mocked(api.delete).mockRejectedValue(new Error("failed"));

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
        name: "patientProfile.reviews.deleteReview",
      }),
    );
    const deleteLabels = screen.getAllByText(
      "professionalProfile.reviews.deleteReview",
    );
    await user.press(deleteLabels[deleteLabels.length - 1]);

    await waitFor(() =>
      expect(api.delete).toHaveBeenCalledWith("/reviews/review-1"),
    );
    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith({
        type: "error",
        text1: "errors.unexpected",
      }),
    );
    expect(
      screen.queryByText("professionalProfile.reviews.confirmDelete"),
    ).not.toBeOnTheScreen();
  });

  it("deletes the selected reply from its review and dismisses the dialog", async () => {
    jest.mocked(api.get).mockImplementation(async (url) => {
      if (url.startsWith("/reviews/stats")) {
        return { averageRating: 5, totalCount: 1 };
      }
      return {
        items: [
          {
            id: "review-1",
            comment: "Helpful visit",
            rating: 5,
            type: 1,
            createdAt: "2026-08-25T10:00:00.000Z",
            updatedAt: "2026-08-25T10:00:00.000Z",
            author: {
              id: "patient-2",
              firstName: "Ada",
              lastName: "Lovelace",
            },
            likesCount: 0,
            repliesCount: 1,
            isLiked: false,
            replies: [
              {
                id: "reply-1",
                reviewId: "review-1",
                userId: "user-1",
                comment: "Thank you",
                createdAt: "2026-08-25T11:00:00.000Z",
                updatedAt: "2026-08-25T11:00:00.000Z",
                firstName: "Grace",
                lastName: "Hopper",
              },
            ],
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
      await screen.findByText("1 patientProfile.reviews.replies"),
    );
    await user.press(
      screen.getByRole("button", {
        name: "patientProfile.reviews.deleteReview",
      }),
    );
    const deleteLabels = screen.getAllByText(
      "professionalProfile.reviews.deleteReview",
    );
    await user.press(deleteLabels[deleteLabels.length - 1]);

    await waitFor(() =>
      expect(api.delete).toHaveBeenCalledWith(
        "/reviews/review-1/replies/reply-1",
      ),
    );
    expect(
      screen.queryByText("professionalProfile.reviews.confirmDelete"),
    ).not.toBeOnTheScreen();
  });
});
