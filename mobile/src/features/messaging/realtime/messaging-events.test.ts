import { decodeMessagingEvent } from "./messaging-events";

describe("decodeMessagingEvent", () => {
  it("decodes valid presence, typing, and conversation events", () => {
    expect(decodeMessagingEvent("OnlineUsers", [["user-1", "user-2"]])).toEqual(
      {
        type: "online-users",
        userIds: ["user-1", "user-2"],
      },
    );
    expect(
      decodeMessagingEvent("UserTyping", ["conversation-1", "user-1"]),
    ).toEqual({
      type: "user-typing",
      conversationId: "conversation-1",
      userId: "user-1",
    });
    expect(
      decodeMessagingEvent("MessageReceived", [
        { conversationId: "conversation-1", content: "Hello" },
      ]),
    ).toEqual({
      type: "message-received",
      conversationId: "conversation-1",
    });
  });

  it("rejects malformed event arguments", () => {
    expect(decodeMessagingEvent("OnlineUsers", [["user-1", 2]])).toBeNull();
    expect(
      decodeMessagingEvent("UserTyping", ["conversation-1"]),
    ).toBeNull();
    expect(decodeMessagingEvent("MessagesRead", [{}])).toBeNull();
  });
});
