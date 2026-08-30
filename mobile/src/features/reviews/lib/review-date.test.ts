import { getRelativeReviewTime } from "./review-date";

describe("review date presentation", () => {
  it("uses the supplied date for relative time", () => {
    const now = new Date("2026-08-30T12:00:00Z");

    expect(getRelativeReviewTime("2026-08-30T10:00:00Z", now)).toBe(
      "2h ago",
    );
  });
});
