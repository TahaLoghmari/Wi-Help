import { z } from "zod";

const userIdsArgsSchema = z.tuple([z.array(z.string())]);
const userIdArgsSchema = z.tuple([z.string()]);
const typingArgsSchema = z.tuple([z.string(), z.string()]);
const conversationArgsSchema = z.tuple([
  z.object({ conversationId: z.string() }),
]);
const noArgsSchema = z.tuple([]);

export type MessagingEvent =
  | { type: "online-users"; userIds: string[] }
  | { type: "user-online"; userId: string }
  | { type: "user-offline"; userId: string }
  | { type: "user-typing"; conversationId: string; userId: string }
  | { type: "user-stopped-typing"; conversationId: string; userId: string }
  | { type: "message-received"; conversationId: string }
  | { type: "new-message-notification" }
  | { type: "messages-read"; conversationId: string }
  | { type: "messages-delivered"; conversationId: string }
  | { type: "message-deleted"; conversationId: string };

export type MessagingHubEventName =
  | "OnlineUsers"
  | "UserOnline"
  | "UserOffline"
  | "UserTyping"
  | "UserStoppedTyping"
  | "MessageReceived"
  | "NewMessageNotification"
  | "MessagesRead"
  | "MessagesDelivered"
  | "MessageDeleted";

export function decodeMessagingEvent(
  name: MessagingHubEventName,
  args: unknown[],
): MessagingEvent | null {
  if (name === "OnlineUsers") {
    const result = userIdsArgsSchema.safeParse(args);
    return result.success
      ? { type: "online-users", userIds: result.data[0] }
      : null;
  }

  if (name === "UserOnline" || name === "UserOffline") {
    const result = userIdArgsSchema.safeParse(args);
    if (!result.success) return null;
    return {
      type: name === "UserOnline" ? "user-online" : "user-offline",
      userId: result.data[0],
    };
  }

  if (name === "UserTyping" || name === "UserStoppedTyping") {
    const result = typingArgsSchema.safeParse(args);
    if (!result.success) return null;
    return {
      type: name === "UserTyping" ? "user-typing" : "user-stopped-typing",
      conversationId: result.data[0],
      userId: result.data[1],
    };
  }

  if (name === "NewMessageNotification") {
    return noArgsSchema.safeParse(args).success
      ? { type: "new-message-notification" }
      : null;
  }

  const result = conversationArgsSchema.safeParse(args);
  if (!result.success) return null;

  const typeByName = {
    MessageReceived: "message-received",
    MessagesRead: "messages-read",
    MessagesDelivered: "messages-delivered",
    MessageDeleted: "message-deleted",
  } as const;

  return {
    type: typeByName[name],
    conversationId: result.data[0].conversationId,
  };
}
