import { render, screen, userEvent } from "@testing-library/react-native";
import type { ConversationDto } from "@/features/messaging/api";
import { ConversationScreen } from "./conversation-screen";

const mockUseGetConversations = jest.fn();
const mockUseGetMessages = jest.fn();
const mockMutate = jest.fn();

jest.mock("react-native-reanimated", () => {
  const { View } = jest.requireActual("react-native");
  return {
    __esModule: true,
    default: { View },
    useAnimatedKeyboard: () => ({ height: { value: 0 } }),
    useAnimatedStyle: (factory: () => object) => factory(),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = jest.requireActual("react-native");
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock("@/features/auth/session", () => ({
  useCurrentUser: () => ({ data: { id: "professional-1" } }),
}));

jest.mock("@/features/messaging/api", () => ({
  useGetConversations: () => mockUseGetConversations(),
  useGetMessages: () => mockUseGetMessages(),
  useMarkMessagesAsDelivered: () => ({ mutate: mockMutate }),
  useMarkMessagesAsRead: () => ({ mutate: mockMutate }),
  useSendMessage: () => ({ mutate: mockMutate, isPending: false }),
}));

jest.mock("@/shared/hooks/use-handle-api-error", () => ({
  useHandleApiError: () => jest.fn(),
}));

jest.mock("@/features/messaging/hooks/use-chat-hub", () => ({
  useOnlineUsers: () => new Set(["patient-1"]),
  useConversationHub: () => ({
    typingUserIds: new Set(),
    startTyping: jest.fn(),
    stopTyping: jest.fn(),
  }),
}));

const conversation = {
  id: "conversation-1",
  otherParticipantId: "patient-1",
  otherParticipantFirstName: "Ada",
  otherParticipantLastName: "Lovelace",
  otherParticipantProfilePictureUrl: null,
  lastMessage: null,
  unreadCount: 0,
  lastActivityAt: "2026-08-25T10:00:00.000Z",
} satisfies ConversationDto;

describe("ConversationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetConversations.mockReturnValue({
      data: [conversation],
      isLoading: false,
    });
    mockUseGetMessages.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isError: false,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
  });

  it("derives participant metadata from the canonical conversation and delegates back", async () => {
    const onBack = jest.fn();

    await render(
      <ConversationScreen
        conversationId="conversation-1"
        onBack={onBack}
      />,
    );

    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
    expect(screen.getByText("Online")).toBeTruthy();
    expect(screen.getByText("No messages yet")).toBeTruthy();

    await userEvent.setup().press(
      screen.getByRole("button", { name: "Go back" }),
    );
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("keeps the conversation usable when list metadata is unavailable", async () => {
    mockUseGetConversations.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    await render(
      <ConversationScreen
        conversationId="conversation-1"
        onBack={jest.fn()}
      />,
    );

    expect(screen.getByText("Conversation")).toBeTruthy();
    expect(screen.getByText("No messages yet")).toBeTruthy();
    expect(screen.getByLabelText("Message input")).toBeTruthy();
  });

  it("does not render an interactive conversation when messages are unavailable", async () => {
    mockUseGetConversations.mockReturnValue({ data: [], isLoading: false });
    mockUseGetMessages.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });

    await render(
      <ConversationScreen conversationId="missing" onBack={jest.fn()} />,
    );

    expect(screen.getByText("Conversation unavailable")).toBeTruthy();
    expect(screen.queryByLabelText("Message input")).toBeNull();
  });
});
