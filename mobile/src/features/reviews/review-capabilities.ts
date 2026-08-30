export interface ReviewSubject {
  id: string;
  kind: "patient" | "professional";
}

export interface ReviewViewer {
  userId?: string;
  profileId?: string;
  role: "Patient" | "Professional" | "Admin";
}

interface ReviewCapabilityInput {
  subject: ReviewSubject;
  viewer: ReviewViewer;
  reviewAuthorId?: string;
  replyOwnerUserId?: string;
}

export function getReviewCapabilities({
  subject,
  viewer,
  reviewAuthorId,
  replyOwnerUserId,
}: ReviewCapabilityInput) {
  const ownsReview =
    viewer.profileId != null && viewer.profileId === reviewAuthorId;
  const ownsSubject =
    viewer.profileId != null &&
    viewer.profileId === subject.id &&
    ((subject.kind === "patient" && viewer.role === "Patient") ||
      (subject.kind === "professional" && viewer.role === "Professional"));
  const canLikeReview =
    ownsReview ||
    ownsSubject ||
    viewer.role === "Patient" ||
    viewer.role === "Admin" ||
    (subject.kind === "professional" && viewer.role === "Professional");

  return {
    canSubmitReview:
      subject.kind === "patient"
        ? viewer.role === "Professional" && viewer.profileId != null
        : viewer.role === "Patient",
    canLikeReview,
    canReplyToReview: ownsReview || ownsSubject,
    canManageReview: ownsReview,
    canManageReply:
      viewer.role === "Admin" ||
      (viewer.userId != null && viewer.userId === replyOwnerUserId),
  };
}
