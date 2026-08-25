import { decodeNotificationReceived } from "./notification-events";

describe("decodeNotificationReceived", () => {
  it("decodes a valid notification payload", () => {
    expect(
      decodeNotificationReceived({
        id: "notification-1",
        title: "New appointment",
        message: "An appointment was created",
        type: "newAppointment",
        role: "Professional",
        isRead: false,
        createdAt: "2026-08-25T10:00:00.000Z",
      }),
    ).toEqual({
      id: "notification-1",
      title: "New appointment",
      message: "An appointment was created",
      type: "newAppointment",
      role: "Professional",
      isRead: false,
      createdAt: "2026-08-25T10:00:00.000Z",
    });
  });

  it("rejects malformed notification payloads", () => {
    expect(
      decodeNotificationReceived({
        id: "notification-1",
        title: "New appointment",
        message: 42,
        type: "newAppointment",
        role: "Professional",
        isRead: false,
        createdAt: "2026-08-25T10:00:00.000Z",
      }),
    ).toBeNull();
  });
});
