import type {
  ConversationDto,
  MessageDto,
  MessagesResponseDto,
} from "@/entities/messaging";
import {
  projectConversations,
  projectMessagePages,
} from "./projection";

function message(
  id: string,
  senderId: string,
  createdAt: string,
): MessageDto {
  return {
    id,
    senderId,
    content: id,
    status: "Sent",
    createdAt,
    deliveredAt: null,
    readAt: null,
  };
}

function page(
  messages: MessageDto[],
  pageNumber: number,
): MessagesResponseDto {
  return {
    messages,
    pageNumber,
    pageSize: messages.length,
    totalCount: messages.length,
    totalPages: 2,
  };
}

function conversation(
  id: string,
  firstName: string,
  lastActivityAt: string,
): ConversationDto {
  return {
    id,
    otherParticipantId: `participant-${id}`,
    otherParticipantFirstName: firstName,
    otherParticipantLastName: "Person",
    otherParticipantProfilePictureUrl: null,
    lastMessage: null,
    unreadCount: 0,
    lastActivityAt,
  };
}

describe("projectMessagePages", () => {
  it("flattens newest-first pages into chronological message order", () => {
    const newerPage = page(
      [
        message("newer-1", "contact", "2026-01-02T09:00:00"),
        message("newer-2", "me", "2026-01-02T10:00:00"),
      ],
      1,
    );
    const olderPage = page(
      [
        message("older-1", "contact", "2026-01-01T09:00:00"),
        message("older-2", "me", "2026-01-01T10:00:00"),
      ],
      2,
    );
    const pages = [newerPage, olderPage];

    const projection = projectMessagePages({
      pages,
      currentUserId: "me",
      isContactTyping: false,
      now: new Date("2026-01-02T12:00:00"),
    });

    expect(projection.messages.map(({ id }) => id)).toEqual([
      "older-1",
      "older-2",
      "newer-1",
      "newer-2",
    ]);
    expect(pages).toEqual([newerPage, olderPage]);
  });

  it("projects date separators, sender groups, avatar ownership, and typing", () => {
    const messages = [
      message("contact-1", "contact", "2026-01-01T09:00:00"),
      message("contact-2", "contact", "2026-01-01T09:01:00"),
      message("own-1", "me", "2026-01-01T09:02:00"),
      message("own-2", "me", "2026-01-02T09:00:00"),
      message("contact-3", "contact", "2026-01-02T09:01:00"),
    ];

    const projection = projectMessagePages({
      pages: [page(messages, 1)],
      currentUserId: "me",
      isContactTyping: true,
      now: new Date("2026-01-02T12:00:00"),
    });

    expect(
      projection.items.map((item) => {
        if (item.type === "date") return [item.type, item.label];
        if (item.type === "typing") return [item.type, item.key];
        return [
          item.type,
          item.message.id,
          item.isOwn,
          item.showAvatar,
          item.isLastInGroup,
        ];
      }),
    ).toEqual([
      ["date", "Yesterday"],
      ["message", "contact-1", false, true, false],
      ["message", "contact-2", false, false, true],
      ["message", "own-1", true, false, true],
      ["date", "Today"],
      ["message", "own-2", true, false, true],
      ["message", "contact-3", false, true, true],
      ["typing", "typing-indicator"],
    ]);
  });
});

describe("projectConversations", () => {
  it("sorts and filters conversations without mutating the input", () => {
    const conversations = [
      conversation("alice", "Alice", "2026-01-01T09:00:00"),
      conversation("bob", "Bob", "2026-01-03T09:00:00"),
      conversation("carol", "Carol", "2026-01-02T09:00:00"),
    ];
    const originalOrder = conversations.map(({ id }) => id);

    expect(
      projectConversations(conversations, "").map(({ id }) => id),
    ).toEqual(["bob", "carol", "alice"]);
    expect(
      projectConversations(conversations, "a").map(({ id }) => id),
    ).toEqual(["carol", "alice"]);
    expect(conversations.map(({ id }) => id)).toEqual(originalOrder);
  });
});
