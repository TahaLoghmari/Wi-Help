export const reviewKeys = {
  all: ["reviews"] as const,
  allStats: ["review-stats"] as const,
  patientReviews: (subjectId: string) => ["reviews", subjectId] as const,
  patientReviewStats: (subjectId: string) =>
    ["review-stats", subjectId] as const,
};
