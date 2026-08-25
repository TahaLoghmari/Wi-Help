export const reviewKeys = {
  all: ["reviews"] as const,
  allStats: ["review-stats"] as const,
  bySubject: (subjectId: string) =>
    ["reviews", "subject", subjectId] as const,
  statsBySubject: (subjectId: string) =>
    ["review-stats", "subject", subjectId] as const,
};
