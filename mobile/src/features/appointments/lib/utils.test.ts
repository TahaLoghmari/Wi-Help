import {
  calculateAge,
  formatDate,
  getGreetingKey,
} from "./utils";

describe("appointment date presentation", () => {
  const now = new Date(2026, 7, 30, 18, 0, 0);

  it("uses the supplied date for age and greeting boundaries", () => {
    expect(calculateAge("2000-09-01", now)).toBe(25);
    expect(getGreetingKey(now)).toBe("evening");
  });

  it("uses the supplied date to identify today's appointments", () => {
    const appointment = new Date(2026, 7, 30, 9, 5, 0).toISOString();

    expect(formatDate(appointment, "Today", now)).toBe("Today, 09:05");
  });
});
