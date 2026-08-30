import { getDayLabel, getRelativeTime } from "./utils";

describe("notification date presentation", () => {
  const now = new Date(2026, 7, 30, 12, 0, 0);

  it("uses the supplied date for day labels", () => {
    expect(getDayLabel("2026-08-30", now)).toBe("Today");
    expect(getDayLabel("2026-08-29", now)).toBe("Yesterday");
  });

  it("uses the supplied date for relative time", () => {
    expect(getRelativeTime("2026-08-30T11:45:00", now)).toBe("15m ago");
  });
});
