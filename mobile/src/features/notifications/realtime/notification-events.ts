import { z } from "zod";

const notificationPayloadSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  role: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export type NotificationReceived = z.infer<typeof notificationPayloadSchema>;

export function decodeNotificationReceived(
  payload: unknown,
): NotificationReceived | null {
  const result = notificationPayloadSchema.safeParse(payload);
  return result.success ? result.data : null;
}
