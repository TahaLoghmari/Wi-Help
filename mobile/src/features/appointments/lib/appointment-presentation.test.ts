import {
  filterAppointmentsByStatus,
  getAppointmentActionPolicy,
  getAppointmentStats,
  projectAppointmentTimeline,
} from "./appointment-presentation";
import {
  AppointmentStatus,
  AppointmentUrgency,
  type AppointmentDto,
} from "@/entities/appointment";

const baseAppointment: AppointmentDto = {
  id: "appointment-1",
  patientId: "patient-1",
  professionalId: "professional-1",
  startDate: "2026-08-25T09:00:00.000Z",
  endDate: "2026-08-25T09:30:00.000Z",
  urgency: AppointmentUrgency.Low,
  status: AppointmentStatus.Offered,
  price: 50,
  createdAt: "2026-08-20T09:00:00.000Z",
  updatedAt: "2026-08-20T09:00:00.000Z",
  patient: {
    id: "patient-1",
    userId: "user-1",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    phoneNumber: "+15551234567",
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    gender: "female",
  },
};

function appointment(
  id: string,
  status: AppointmentDto["status"],
  startDate: string,
  overrides: Partial<AppointmentDto> = {},
): AppointmentDto {
  return { ...baseAppointment, ...overrides, id, status, startDate };
}

describe("appointment presentation and policy", () => {
  it("calculates today and total stats relative to the supplied time", () => {
    const now = new Date(2030, 0, 15, 12, 0, 0);
    const todayMorning = new Date(2030, 0, 15, 9, 0, 0).toISOString();
    const todayEvening = new Date(2030, 0, 15, 18, 0, 0).toISOString();
    const yesterday = new Date(2030, 0, 14, 23, 0, 0).toISOString();
    const appointments = [
      appointment("offered-today", AppointmentStatus.Offered, todayMorning),
      appointment("completed-today", AppointmentStatus.Completed, todayEvening),
      appointment("confirmed-yesterday", AppointmentStatus.Confirmed, yesterday),
      appointment("cancelled-yesterday", AppointmentStatus.Cancelled, yesterday),
    ];

    expect(getAppointmentStats(appointments, now)).toEqual({
      todayConfirmed: 0,
      todayOffered: 1,
      todayCompleted: 1,
      todayCancelled: 0,
      totalConfirmed: 1,
      totalOffered: 1,
      totalCompleted: 1,
      totalCancelled: 1,
    });
  });

  it("filters appointments by status without changing their order", () => {
    const appointments = [
      appointment("offered-1", AppointmentStatus.Offered, baseAppointment.startDate),
      appointment(
        "confirmed-1",
        AppointmentStatus.Confirmed,
        baseAppointment.startDate,
      ),
      appointment("offered-2", AppointmentStatus.Offered, baseAppointment.startDate),
    ];

    expect(
      filterAppointmentsByStatus(appointments, AppointmentStatus.Offered).map(
        ({ id }) => id,
      ),
    ).toEqual(["offered-1", "offered-2"]);
  });

  it.each([
    [AppointmentStatus.Offered, [true, true, false, false, true]],
    [AppointmentStatus.Confirmed, [false, false, true, true, true]],
    [AppointmentStatus.Completed, [false, false, false, false, false]],
    [AppointmentStatus.Cancelled, [false, false, false, false, false]],
  ] as const)("projects the action policy for %s appointments", (status, values) => {
    expect(getAppointmentActionPolicy(status)).toEqual({
      canAccept: values[0],
      canDecline: values[1],
      canComplete: values[2],
      canCancel: values[3],
      showActions: values[4],
    });
  });

  it("projects present lifecycle timestamps in display order", () => {
    const offeredAt = "2026-08-20T09:00:00.000Z";
    const completedAt = "2026-08-25T09:30:00.000Z";
    const cancelledAt = "2026-08-25T10:00:00.000Z";
    const completed = appointment(
      "completed",
      AppointmentStatus.Completed,
      baseAppointment.startDate,
      { offeredAt, completedAt, cancelledAt },
    );

    expect(projectAppointmentTimeline(completed)).toEqual([
      { key: "offeredAt", occurredAt: offeredAt },
      { key: "completedAt", occurredAt: completedAt },
      { key: "cancelledAt", occurredAt: cancelledAt },
    ]);
  });
});
