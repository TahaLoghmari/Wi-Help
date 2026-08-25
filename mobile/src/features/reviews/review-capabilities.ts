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
  const hasElevatedReplyAccess =
    viewer.role === "Admin" ||
    (subject.kind === "professional" && viewer.role === "Professional");
  const canInteract =
    ownsReview || viewer.role === "Patient" || hasElevatedReplyAccess;

  return {
    canSubmitReview:
      subject.kind === "patient"
        ? viewer.role === "Professional" && viewer.profileId != null
        : viewer.role === "Patient",
    canLikeReview: canInteract,
    canReplyToReview: canInteract,
    canManageReview: ownsReview,
    canManageReply:
      hasElevatedReplyAccess ||
      (viewer.userId != null && viewer.userId === replyOwnerUserId),
  };
}
