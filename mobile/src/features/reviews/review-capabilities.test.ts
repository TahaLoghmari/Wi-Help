import { getReviewCapabilities } from "./index";

describe("getReviewCapabilities", () => {
  it("allows a professional author to review and manage their patient review", () => {
    expect(
      getReviewCapabilities({
        subject: { id: "patient-1", kind: "patient" },
        viewer: {
          userId: "user-1",
          profileId: "professional-1",
          role: "Professional",
        },
        reviewAuthorId: "professional-1",
        replyOwnerUserId: "user-2",
      }),
    ).toEqual({
      canSubmitReview: true,
      canLikeReview: true,
      canReplyToReview: true,
      canManageReview: true,
      canManageReply: false,
    });
  });

  it("does not give an unrelated professional patient-subject permissions", () => {
    expect(
      getReviewCapabilities({
        subject: { id: "patient-1", kind: "patient" },
        viewer: {
          userId: "user-1",
          profileId: "professional-1",
          role: "Professional",
        },
        reviewAuthorId: "professional-2",
        replyOwnerUserId: "user-2",
      }),
    ).toEqual({
      canSubmitReview: true,
      canLikeReview: false,
      canReplyToReview: false,
      canManageReview: false,
      canManageReply: false,
    });
  });

  it("allows only the review author or reviewed subject to reply", () => {
    const subject = { id: "professional-1", kind: "professional" } as const;

    expect(
      getReviewCapabilities({
        subject,
        viewer: {
          userId: "patient-user",
          profileId: "patient-2",
          role: "Patient",
        },
        reviewAuthorId: "patient-2",
        replyOwnerUserId: "other-user",
      }),
    ).toEqual({
      canSubmitReview: true,
      canLikeReview: true,
      canReplyToReview: true,
      canManageReview: true,
      canManageReply: false,
    });

    expect(
      getReviewCapabilities({
        subject,
        viewer: {
          userId: "professional-user",
          profileId: "professional-1",
          role: "Professional",
        },
        reviewAuthorId: "patient-2",
        replyOwnerUserId: "other-user",
      }),
    ).toEqual({
      canSubmitReview: false,
      canLikeReview: true,
      canReplyToReview: true,
      canManageReview: false,
      canManageReply: false,
    });

    expect(
      getReviewCapabilities({
        subject,
        viewer: {
          userId: "unrelated-professional-user",
          profileId: "professional-2",
          role: "Professional",
        },
        reviewAuthorId: "patient-2",
        replyOwnerUserId: "other-user",
      }),
    ).toMatchObject({
      canReplyToReview: false,
      canManageReply: false,
    });

    expect(
      getReviewCapabilities({
        subject,
        viewer: {
          userId: "unrelated-patient-user",
          profileId: "patient-3",
          role: "Patient",
        },
        reviewAuthorId: "patient-2",
        replyOwnerUserId: "other-user",
      }).canReplyToReview,
    ).toBe(false);
  });

  it("allows reply owners and admins to manage replies without managing reviews", () => {
    const subject = { id: "patient-1", kind: "patient" } as const;

    expect(
      getReviewCapabilities({
        subject,
        viewer: { userId: "reply-owner", role: "Patient" },
        reviewAuthorId: "professional-1",
        replyOwnerUserId: "reply-owner",
      }).canManageReply,
    ).toBe(true);

    expect(
      getReviewCapabilities({
        subject,
        viewer: { userId: "admin-1", role: "Admin" },
        reviewAuthorId: "professional-1",
        replyOwnerUserId: "reply-owner",
      }),
    ).toMatchObject({
      canLikeReview: true,
      canReplyToReview: false,
      canManageReview: false,
      canManageReply: true,
    });
  });
});
