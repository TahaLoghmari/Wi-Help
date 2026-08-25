import { reviewKeys } from ".";

describe("reviewKeys", () => {
  it("keys review lists by subject", () => {
    expect(reviewKeys.bySubject("subject-1")).toEqual([
      "reviews",
      "subject",
      "subject-1",
    ]);
  });

  it("keys review stats by subject", () => {
    expect(reviewKeys.statsBySubject("subject-1")).toEqual([
      "review-stats",
      "subject",
      "subject-1",
    ]);
  });
});
