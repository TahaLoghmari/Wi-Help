export const REVIEW_ENDPOINTS = {
  SUBMIT_REVIEW: "/reviews",
  GET_REVIEWS: "/reviews",
  GET_REVIEW_STATS: "/reviews/stats",
  LIKE_REVIEW: (reviewId: string) => `/reviews/${reviewId}/like`,
  UNLIKE_REVIEW: (reviewId: string) => `/reviews/${reviewId}/like`,
  REPLY_TO_REVIEW: (reviewId: string) => `/reviews/${reviewId}/replies`,
  EDIT_REPLY: (reviewId: string, replyId: string) =>
    `/reviews/${reviewId}/replies/${replyId}`,
  DELETE_REPLY: (reviewId: string, replyId: string) =>
    `/reviews/${reviewId}/replies/${replyId}`,
  UPDATE_REVIEW: (reviewId: string) => `/reviews/${reviewId}`,
  DELETE_REVIEW: (reviewId: string) => `/reviews/${reviewId}`,
  GET_ALL_AS_ADMIN: "/reviews/admin",
  DELETE_AS_ADMIN: (reviewId: string) => `/reviews/${reviewId}`,
} as const;
